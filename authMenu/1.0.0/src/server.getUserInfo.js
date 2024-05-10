/** getUserInfo: authClientからの要求を受け、ユーザ情報と状態を返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {number} userId=null - ユーザID
 * @param {Object} arg={}
 * @param {string} arg.email=null - e-mail。新規ユーザ登録時のみ使用の想定
 * @param {string} arg.CPkey=null - 要求があったユーザの公開鍵
 * @param {string} arg.updated=null - CPkey生成・更新日時文字列
 * @param {boolean} arg.createIfNotExist=false - true:メアドが未登録なら作成
 * @param {boolean} arg.updateCPkey=false - true:渡されたCPkeyがシートと異なる場合は更新
 * @param {boolean} arg.returnTrialStatus=true - true:現在のログイン試行の状態を返す
 * @returns {object} 以下のメンバを持つオブジェクト
 * - data=null {Object} シート上のユーザ情報オブジェクト(除、trial欄)
 * - trial={} {Object} オブジェクト化したtrial欄(JSON)
 * - isExist=0 {number} - 既存メアドなら0、新規登録したなら新規採番したユーザID
 * - status {number}
 *   - 0 : 問題なし
 *   - 1〜4 : 要ログイン
 *     - 1 : ①パスコード生成からログインまでの猶予時間を過ぎている
 *     - 2 : ②クライアント側ログイン(CPkey)有効期限切れ
 *     - 4 : ③引数のCPkeyがシート上のCPkeyと不一致
 *   - 8 : ④凍結中
 * - numberOfLoginAttempts {number} 試行可能回数
 * - loginGraceTime=900,000(15分) {number}<br>
 *   パスコード生成からログインまでの猶予時間(ミリ秒)
 * - remainRetryInterval=0 {number} 再挑戦可能になるまでの時間(ミリ秒)
 * - passcodeDigits=6 {number} : パスコードの桁数
 */
w.func.getUserInfo = function(userId=null,arg={}){
  const v = {whois:w.whois+'.getUserInfo',step:0,
    rv:{data:null,trial:null,isExist:0}};
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    // ---------------------------------------------
    v.step = 1; // 事前準備
    // ---------------------------------------------
    v.step = 1.1; // 引数の既定値を設定
    v.arg = Object.assign({
      userId: userId === null ? null : Number(userId),
      email: null,
      CPkey: null,
      updated: null,
      createIfNotExist: false,
      updateCPkey: false,
      returnTrialStatus: true,
    },arg);

    v.step = 1.3; // 対象ユーザ情報の取得
    v.r = w.master.select({
      where: x => x[w.prop.primatyKeyColumn] === arg.userId
      || x[w.prop.emailColumn] === arg.email
    });
    if( v.r instanceof Error ) throw v.r;


    // ---------------------------------------------
    v.step = 2; // ユーザ情報の保存
    // ---------------------------------------------
    if( v.r.length > 1 ){              // 複数件該当 ⇒ エラー
      throw new Error('Multiple target users exist on the sheet.');
    } else if( v.r.length === 1 ){     // 1件該当 ⇒ 既存ユーザ
      v.step = 2.1;
      v.rv.data = v.r[0];
      if( arg.updateCPkey
        && v.rv.data.CPkey !== arg.CPkey
        && typeof arg.CPkey === 'string'
      ){
        v.step = 2.2; // 渡されたCPkeyとシートとが異なり、更新指示が有った場合は更新
        v.rv.data.CPkey = arg.CPkey;
        v.rv.data.updated = arg.updated;
        v.r = w.master.update({CPkey:arg.CPkey,updated:arg.updated},
          {where:x => x[w.prop.primatyKeyColumn] === arg.userId});
        if( v.r instanceof Error ) throw v.r;
      }
    } else if( arg.createIfNotExist ){ // 該当無しand作成指示 ⇒ 新規ユーザ
      v.step = 2.2; // emailアドレスの妥当性検証
      if( checkFormat(arg.email,'email' ) === false ){
        throw new Error(`Invalid e-mail address.`);
      }

      v.step = 2.3; // userIdの最大値を取得
      if( w.master.data.length === 0 ){
        // 登録済が0件(シート作成直後)の場合
        v.max = w.prop.userIdStartNumber - 1;
      } else {
        v.map = w.master.data.map(x =>
          isNaN(x[w.prop.primatyKeyColumn])
          ? 0 : Number(x[w.prop.primatyKeyColumn]));
        v.max = Math.max(...v.map);
      }

      v.step = 2.4; // シートに初期値を登録
      v.rv.data = {
        userId  : v.max + 1,
        created : toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn'),
        email   : arg.email,
        auth    : w.prop.defaultAuth,
        CPkey   : arg.CPkey,
        updated : null,
        trial   : '{log:[]}',
      };
      v.rv.data.updated = v.rv.data.created;
      v.r = w.master.insert([v.rv.data]);
      if( v.r instanceof Error ) throw v.r;

      v.step = 4.3; // 存否フラグを更新
      v.rv.isExist = v.rv.data.userId;
    }

    // ---------------------------------------------
    v.step = 3; // 現在のログイン試行の状態
    //【シート上のtrial欄(JSON)オブジェクト定義】
    // - passcode {number} パスコード(原則数値6桁)
    // - created {number} パスコード生成日時(UNIX時刻)
    // - log {object[]} 試行の記録。unshiftで先頭を最新にする
    //   - timestamp {number} 試行日時(UNIX時刻)
    //   - entered {number} 入力されたパスコード
    //   - status {number} 失敗した原因(v.rv.trial.statusの値)
    //   - result {number} 0:成功、1〜n:連続n回目の失敗
    // trialオブジェクトはunshiftで常に先頭(添字=0)が最新になるようにする。
    // ---------------------------------------------
    v.step = 3.1; // ログイン試行関係情報をv.trialに格納
    if( v.rv.data.hasOwnProperty('trial') ){
      // パスコードが含まれるtrialはdata配下からrv直下に移動
      v.rv.trial = JSON.parse(v.rv.data.trial);
      delete v.rv.data.trial;
    } else {
      // シート上に不存在かつ新規ユーザ登録をしない場合
      v.rv.trial = {log:[]};
    }

    // ログイン試行の状態に関する項目を戻り値オブジェクトに追加
    v.step = 3.2; // 既定値の作成
    v.rv = Object.assign(v.rv,{
      status: 0,
      numberOfLoginAttempts: w.prop.numberOfLoginAttempts,
      loginGraceTime: w.prop.loginGraceTime,
      remainRetryInterval: 0,
      passcodeDigits: w.prop.passcodeDigits,    
    });

    v.step = 3.3; // ①パスコード生成からログインまでの猶予時間を過ぎている
    if( ( v.rv.trial.hasOwnProperty('created')
      && w.prop.loginGraceTime + v.rv.trial.created) > Date.now() ){
      v.rv.status += 1;
    }

    v.step = 3.4; // ②クライアント側ログイン(CPkey)有効期限切れ
    if( (new Date(v.user.updated).getTime() + w.prop.userLoginLifeTime) < Date.now() ){
      v.rv.status += 2;
    }

    v.step = 3.5; // ③引数のCPkeyがシート上のCPkeyと不一致
    if( arg.CPkey !== v.rv.data.CPkey ){
      v.rv.status += 4;
    }

    if( v.rv.trial.log.length > 0 ){
      v.log = v.rv.trial.log[0];

      v.step = 3.6; // 試行Objがlogに存在するなら残りの試行可能回数を計算
      v.rv.numberOfLoginAttempts = w.prop.numberOfLoginAttempts - v.log.result;

      v.step = 3.7; // ④凍結中(前回ログイン失敗から一定時間経過していない)
      if( v.log.hasOwnProperty('result')
        && v.log.result === w.prop.numberOfLoginAttempts
        && v.log.hasOwnProperty('timestamp')
        && (v.log.timestamp + w.prop.loginRetryInterval) > Date.now()
      ){
        v.rv.status += 8;
        // 再挑戦可能になるまでの時間を計算(ミリ秒)
        v.rv.remainRetryInterval = v.log.timestamp
          + w.prop.loginRetryInterval - Date.now();  
      }
    }


    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.getUserInfo(arg);
if( w.rv instanceof Error ) throw w.rv;