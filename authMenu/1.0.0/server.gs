/** authServer: 必要に応じて引数を復号・署名検証した上で、サーバ側の処理を分岐させる
 * 
 * 最初にシート上の全ユーザ情報を取得(w.master)した上で、引数の型・内容に基づき
 * 以下のデシジョンテーブルによって処理を分岐させる。
 * 
 * | userId | arg | 分岐先関数 | 処理 |
 * | :-- | :-- | :-- | :-- |
 * | null   | {string} JSON(平文)   | getUserInfo    | 新規ユーザ登録 |
 * | number | null                 | getUserInfo    | 応募情報(自情報)取得 |
 * | number | {string} JSON(SP/--) | verifyPasscode | パスコード検証 |
 * 
 * @param {number} userId 
 * @param {null|string} arg - 分岐先処理名、分岐先処理に渡す引数オブジェクトのJSON
 * @returns {Object} 分岐先処理での処理結果
 */
function authServer(userId=null,arg=null) {
  // 内部関数で'v'を使用するため、ここでは'w'で定義
  const w = {whois:'authServer',rv:null,step:0,func:{},
    type: 'null', // argの種類。null, JSON, encrypt
    prop:{}, // setPropertiesで設定されるauthServerのconfig
    isJSON:str=>{try{JSON.parse(str)}catch(e){return false} return true},
  };

/** preProcess: 事前準備。シートからユーザ情報全権取得、引数のオブジェクト化
 * @param {void}
 * @returns {void}
 */
w.func.preProcess = function(){
  w.step = 1.1; // PropertiesServiceに格納された値をw.propに読み込み
  w.prop = PropertiesService.getDocumentProperties().getProperties();
  if( !w.prop ) throw new Error('Property service not configured.');

  w.step = 1.2; // シートから全ユーザ情報の取得
  w.master = new SingleTable(w.prop.masterSheet);
  if( w.master instanceof Error ) throw w.master;

  w.step = 1.3; // 引数userIdの前処理
  if( isNaN(userId) ) throw new Error('Invalid userId');
  w.userId = (userId === null ? null : Number(userId));

  w.step = 1.4; // 引数argの前処理
  if( arg === null ){
    w.step = 1.41;
    w.argType = 'null';
    w.arg = null;
  } else {
    if( typeof arg === 'string' ){
      if( w.isJSON(arg) ){
        w.step = 1.42;
        w.argType = 'JSON';
        w.arg = JSON.parse(arg);
      } else {
        w.step = 1.43;
        w.prop.SSkey = cryptico.generateRSAKey(w.prop.passPhrase,w.prop.bits);
        w.decrypt = cryptico.decrypt(arg,w.prop.SSkey);
        if( w.decrypt.status === 'success' ){
          w.step = 1.431;
          w.argType = 'encrypted';
          w.arg = JSON.parse(w.decrypt.plaintext);
        } else {
          w.step = 1.432;
          throw new Error('Decrypt failed');
        }
      }
    } else {
      throw new Error('Invalid arg');
    }
  }
}
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

    v.step = 1.2; // 対象ユーザ情報の取得
    v.r = v.arg.userId === null
    ? w.master.select({where: x => x[w.prop.emailColumn] === arg.email})
    : w.master.select({where: x => x[w.prop.primatyKeyColumn] === arg.userId});
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
        trial   : '{"log":[]}',
      };
      v.rv.data.updated = v.rv.data.created;
      v.r = w.master.insert([v.rv.data]);
      if( v.r instanceof Error ) throw v.r;

      v.step = 2.5; // 存否フラグを更新
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
    if( (new Date(v.rv.data.updated).getTime() + w.prop.userLoginLifeTime) < Date.now() ){
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
/** verifyPasscode: 入力されたパスコードの検証
 * 
 * - 権限有無判断(auth&allow)は授受するデータを減らすため、クライアント側で行う
 * 
 * @param {Object} arg
 * @param {number} arg.userId=null - ユーザID
 * @param {string} arg.CPkey=null - 要求があったユーザの公開鍵
 * @param {string} arg.updated=null - CPkey生成・更新日時文字列
 * @param {number} arg.passcode=-1 - 入力されたパスコード
 * @returns {object} 以下のメンバを持つオブジェクト(getUserInfoの戻り値)
 * - data=null {Object} シート上のユーザ情報オブジェクト(除、trial)
 * - status
 *   - 0 : OK(パスコード一致、CPkey他も問題なし) ⇒ OK
 *   - 1〜4 : 要ログイン
 *     - 1 : ①パスコード生成からログインまでの猶予時間を過ぎている ⇒ NG
 *     - 2 : ②クライアント側ログイン(CPkey)有効期限切れ ⇒ (書き換えるから)OK
 *     - 4 : ③引数のCPkeyがシート上のCPkeyと不一致 ⇒ (書き換えるから)OK
 *   - 8 : NG(権限はあるが)凍結中 ⇒ NG
 *   - 16 : パスコード不一致
 */
w.func.verifyPasscode = function(arg){
  const v = {whois:w.whois+'.verifyPasscode',step:0,rv:null};
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    // ---------------------------------------------
    v.step = 1; // パスコード検証
    // ---------------------------------------------
    v.step = 1.1; // 引数の既定値の設定
    v.arg = Object.assign({
      userId: null,
      CPkey: null,
      updated: null,
      passcode: -1,
    },arg);

    v.step = 1.1; // 対象ユーザ情報の取得
    v.rv = this.getUserInfo(v.arg);
    if( v.rv instanceof Error ) throw v.rv;
    v.trial = v.rv.trial;
    delete v.rv.trial;  // trialは戻り値に含めない

    v.step = 1.2; // パスコード不一致 ⇒ statusのフラグを立てる
    if( Number(v.arg.passcode) !== Number(v.trial.passcode) ){
      v.rv.status += 16;
    }

    // ---------------------------------------------
    v.step = 2; // trial更新(検証結果)
    //【trialオブジェクト定義】
    // - passcode {number} パスコード(原則数値6桁)
    // - created {number} パスコード生成日時(UNIX時刻)
    // - log {object[]} 試行の記録。unshiftで先頭を最新にする
    //   - timestamp {number} 試行日時(UNIX時刻)
    //   - entered {number} 入力されたパスコード
    //   - status {number} v.rv.statusの値
    //   - result {number} 0:成功、1〜n:連続n回目の失敗
    // trialオブジェクトはunshiftで常に先頭(添字=0)が最新になるようにする。
    // ---------------------------------------------
    v.step = 2.1; // ログObjを作成、log配列先頭に追加
    v.trial.log.unshift({
      timestamp: Date.now(),
      entered: v.arg.passcode,
      status: v.rv.status,
      result: v.rv.status === 0 ? 0 : (v.trial.log[0].result + 1),
    });

    v.step = 2.2; // シートのtrial欄を更新
    v.obj = {trial:JSON.stringify(v.trial)};
    // パスコードが一致していたらCPkey,updatedも更新
    // 以下の条件を全て満たす場合、CPkey,updatedも更新
    // 1. getUserInfoのstatusが②有効期限切れまたは③不一致
    // 2. 有効なCPkey,updatedが両方引数で渡されている
    if( (v.rv.status & (2+4)) > 0 && arg.CPkey !== null && arg.updated !== null ){
      v.obj.CPkey = v.rv.data.CPkey = arg.CPkey;
      v.obj.updated = v.rv.data.updated = arg.updated;
      // ユーザ情報およびtrial欄に記録するstatusの値が2or4なら0に書き換え
      // 25 = 1 + 8 + 16 (2と4以外のフラグの合計値。2と4は強制的に0にする)
      v.rv.status = v.rv.status & 25;
      v.trial.log[0].status = v.trial.log[0].status & 25;
      v.obj.trial = JSON.stringify(v.trial);
    }
    v.r = v.master.update(v.obj,
      {where: x => x[w.prop.primatyKeyColumn] === arg.userId});
    if( v.r instanceof Error ) throw v.r;

    // ---------------------------------------------
    v.step = 3; // 終了処理
    // ---------------------------------------------
    // OK以外はユーザ情報を戻り値から削除
    if( v.rv.status !== 0 ) delete v.rv.data;
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

  console.log(`${w.whois} start.`);
  try {

    w.step = 1; // 前処理
    w.func.preProcess();
    console.log(`w.userId=${w.userId}\nw.argType=${w.argType}\nw.arg=${stringify(w.arg)}`);

    w.step = 2; // userId未設定 ⇒ 新規ユーザ登録
    if( w.userId === null ){
      w.rv = w.func.getUserInfo(null,Object.assign({
        createIfNotExist: true, // メアドが未登録なら作成
      },w.arg));
      if( w.rv instanceof Error ) throw w.rv;
    }

    w.step = 3; // arg未設定 ⇒ 応募情報(自情報)取得
    if( w.userId !== null && w.argType === 'null' ){
      w.rv = w.func.getUserInfo(w.userId,null);
      if( w.rv instanceof Error ) throw w.rv;
    }

    w.step = 4; // パスコード検証
    if( w.userId !== null && w.argType === 'encrypted' ){
      w.rv = w.func.verifyPasscode(w.userId,w.arg);
      if( w.rv instanceof Error ) throw w.rv;
    }

    w.step = 5; // 終了処理
    console.log(`${w.whois} normal end.\nw.rv=${stringify(w.rv)}`);
    // 該当処理なしの場合、何も返さない
    if( w.rv !== null ) return w.rv;

  } catch(e) {
    e.message = `${w.whois} abnormal end at step.${w.step}`
    + `\n${e.message}\nuserId=${userId}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nw=${stringify(w)}`);
    return e;
  }
}
