/** authServer: 必要に応じて引数を復号・署名検証した上で、サーバ側の処理を分岐させる
 * 
 * 最初にシート上の全ユーザ情報を取得(w.master)した上で、引数の型・内容に基づき
 * 以下のデシジョンテーブルによって処理を分岐させる。
 * 
 * | userId | arg | 分岐先関数 | 処理 |
 * | :-- | :-- | :-- | :-- |
 * | null   | JSON(平文)         | getUserInfo    | 新規ユーザ登録 |
 * | number | JSON(平文) or null | getUserInfo    | 応募情報(自情報)取得 |
 * | number | JSON(SP/--)       | verifyPasscode | パスコード検証 |
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
 * 
 * **オブジェクト'w'にセットする内容**
 * 
 * - prop {Object} PropertiesServiceに格納された値。内容はsetProperties参照
 * - master {SingleTable} シートの情報
 * - userId {number|null} ユーザID
 * - arg {Object} JSON形式のauthServerの引数argをオブジェクト化
 * - argType {string} authServerの引数argのデータ型。null/JSON/encrypted
 * - decrypt {Object} argが暗号化されていた場合、復号化したオブジェクト
 *   - status {string} "success"
 *   - plaintext {string} 復号した文字列
 *   - signature {string} verified, forged, unsigned
 *   - publicKeyString {string} 送信側公開鍵
 */
w.func.preProcess = function(){
  const v = {whois:w.whois+'.preProcess',step:0,rv:null};
  console.log(`${v.whois} start.`);
    
  w.step = 1.1; // PropertiesServiceに格納された値をw.propに読み込み
  w.prop = PropertiesService.getDocumentProperties().getProperties();
  if( !w.prop ) throw new Error('Property service not configured.');
  // JSONで定義されている項目をオブジェクト化
  w.prop.notificatePasscodeMail = JSON.parse(w.prop.notificatePasscodeMail);

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

  console.log(`${v.whois} normal end.`
    + `\nw.userId=${w.userId}`
    + `\nw.argType=${w.argType}`
    + `\nw.arg=${stringify(w.arg)}`
  );
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
 * @param {number} arg.allow - 開示範囲フラグ
 * @param {boolean} arg.createIfNotExist=false - true:メアドが未登録なら作成
 * @param {boolean} arg.updateCPkey=false - true:渡されたCPkeyがシートと異なる場合は更新
 * @param {boolean} arg.returnTrialStatus=true - true:現在のログイン試行の状態を返す
 * @returns {object} 以下のメンバを持つオブジェクト
 * - response {string} 処理結果
 *   - 'hasAuth'  : 権限あり
 *   - 'noAuth'   : 権限なし
 *   - 'freezing' : 凍結中
 *   - 'passcode' : パスコードの入力が必要
 * - data=null {Object} シート上のユーザ情報オブジェクト(除、trial欄)
 * - trial={} {Object} オブジェクト化したtrial欄(JSON)
 * - isExist=0 {number} - 既存メアドなら0、新規登録したなら新規採番したユーザID
 * - status {number}
 *   - 0 : 問題なし
 *   - 1〜4 : 要ログイン
 *     - 1 : ①パスコード生成からログインまでの猶予時間を過ぎている
 *     - 2 : ②クライアント側ログイン(CPkey)有効期限切れ
 *             ※シート上のupdatedが空欄ならノーチェック
 *     - 4 : ③引数のCPkeyがシート上のCPkeyと不一致
 *             ※引数にCPkeyが含まれない場合はノーチェック
 *   - 8 : ④凍結中
 * - numberOfLoginAttempts {number} 試行可能回数
 * - loginGraceTime=900,000(15分) {number}<br>
 *   パスコード生成からログインまでの猶予時間(ミリ秒)
 * - remainRetryInterval=0 {number} 再挑戦可能になるまでの時間(ミリ秒)
 * - passcodeDigits=6 {number} : パスコードの桁数
 */
w.func.getUserInfo = function(userId=null,arg={}){
  const v = {whois:w.whois+'.getUserInfo',step:0,
    rv:{response:null,data:null,isExist:0}};
  console.log(`${v.whois} start.\narg(${typeof arg})=${stringify(arg)}`);
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
    ? w.master.select({where: x => x[w.prop.emailColumn] === v.arg.email})
    : w.master.select({where: x => x[w.prop.primatyKeyColumn] === v.arg.userId});
    if( v.r instanceof Error ) throw v.r;


    // ---------------------------------------------
    v.step = 2; // ユーザ情報の保存
    // ---------------------------------------------
    if( v.r.length > 1 ){              // 複数件該当 ⇒ エラー
      throw new Error('Multiple target users exist on the sheet.');
    } else if( v.r.length === 1 ){     // 1件該当 ⇒ 既存ユーザ
      v.step = 2.1;
      v.rv.data = v.r[0];
      if( v.arg.updateCPkey // CPkeyの更新
        && v.rv.data.CPkey !== v.arg.CPkey
        && typeof v.arg.CPkey === 'string'
      ){
        v.step = 2.2; // 渡されたCPkeyとシートとが異なり、更新指示が有った場合は更新
        v.r = w.master.update({CPkey:v.arg.CPkey,updated:v.arg.updated},
          {where:x => x[w.prop.primatyKeyColumn] === v.arg.userId});
        if( v.r instanceof Error ) throw v.r;
      }
    } else if( v.arg.createIfNotExist ){ // 該当無しand作成指示 ⇒ 新規ユーザ
      v.step = 2.2; // emailアドレスの妥当性検証
      if( checkFormat(v.arg.email,'email' ) === false ){
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
        email   : v.arg.email,
        auth    : w.prop.defaultAuth,
        CPkey   : v.arg.CPkey,
        updated : null,
        trial   : '{"log":[]}',
      };
      v.rv.data.updated = v.rv.data.created;
      v.r = w.master.insert([v.rv.data]);
      if( v.r instanceof Error ) throw v.r;

      v.step = 2.5; // 存否フラグを更新
      v.rv.isExist = v.rv.data.userId;
    } else {  // 該当無しand作成指示無し
      //return v.rv;
      throw new Error('No matching user found');
    }

    // ---------------------------------------------
    v.step = 3; // 現在のログイン試行の状態
    //【シート上のtrial欄(JSON)オブジェクト定義】
    // - passcode {number} パスコード(原則数値6桁)
    // - created {number} パスコード生成日時(UNIX時刻)
    // - log {object[]} 試行の記録。unshiftで先頭を最新にする
    //   - timestamp {number} 試行日時(UNIX時刻)
    //   - entered {number} 入力されたパスコード
    //   - status {number} 失敗した原因(v.trial.statusの値)
    //   - result {number} 0:成功、1〜n:連続n回目の失敗
    // trialオブジェクトはunshiftで常に先頭(添字=0)が最新になるようにする。
    // ---------------------------------------------
    v.step = 3.1; // ログイン試行関係情報をv.trialに格納
    if( v.rv.data.hasOwnProperty('trial') ){
      // パスコードが含まれるtrialはdata配下からrv直下に移動
      v.trial = JSON.parse(v.rv.data.trial);
      delete v.rv.data.trial;
    } else {
      // シート上に不存在かつ新規ユーザ登録をしない場合
      v.trial = {log:[]};
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
    if( ( v.trial.hasOwnProperty('created')
      && w.prop.loginGraceTime + v.trial.created) > Date.now() ){
      v.rv.status += 1;
      v.rv.response = 'passcode';
    }

    v.step = 3.4; // ②クライアント側ログイン(CPkey)有効期限切れ
    if( String(v.rv.data.updated).length > 0
      && (new Date(v.rv.data.updated).getTime() + w.prop.userLoginLifeTime) < Date.now() ){
      v.rv.status += 2;
      v.rv.response = 'passcode';
    }

    v.step = 3.5; // ③引数のCPkeyがシート上のCPkeyと不一致
    if( v.arg.CPkey && v.arg.CPkey !== v.rv.data.CPkey ){
      v.rv.status += 4;
      v.rv.response = 'passcode';
    }

    v.step = 3.6; // 新規登録されたユーザはパスコード入力
    if( v.rv.isExist > 0 ) v.rv.response = 'passcode';

    if( v.trial.log.length > 0 ){
      v.log = v.trial.log[0];

      v.step = 3.7; // 試行Objがlogに存在するなら残りの試行可能回数を計算
      v.rv.numberOfLoginAttempts = w.prop.numberOfLoginAttempts - v.log.result;

      v.step = 3.8; // ④凍結中(前回ログイン失敗から一定時間経過していない)
      if( v.log.hasOwnProperty('result')
        && v.log.result === w.prop.numberOfLoginAttempts
        && v.log.hasOwnProperty('timestamp')
        && (v.log.timestamp + w.prop.loginRetryInterval) > Date.now()
      ){
        v.rv.status += 8;
        v.rv.response = 'freezing';
        // 再挑戦可能になるまでの時間を計算(ミリ秒)
        v.rv.remainRetryInterval = v.log.timestamp
          + w.prop.loginRetryInterval - Date.now();  
      }
    }

    v.step = 3.9; // 上記に引っかからず、auth&allow>0なら権限あり
    if( v.rv.response === null ){
      v.rv.response = (v.arg.allow & v.rv.data.auth) > 0
      ? 'hasAuth' : 'noAuth';
    }

    // ---------------------------------------------
    v.step = 4; // 終了処理
    // ---------------------------------------------
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
/** sendPasscode: 指定ユーザにパスコード連絡メールを発信する
 * 
 * @param {number} userId=null - ユーザID
 * @returns {null|Error}
 */
w.func.sendPasscode = function(userId=null){
  const v = {whois:w.whois+'.sendPasscode',step:0,rv:null};
  console.log(`${v.whois} start. userId(${typeof userId})=${userId}`);
  try {

    v.step = 1; // パスコード生成、trialを更新
    v.passcode = ('0'.repeat(w.prop.passcodeDigits)
      + Math.floor(Math.random() * (10 ** w.prop.passcodeDigits))).slice(-w.prop.passcodeDigits);
    v.r = w.master.update({trial:JSON.stringify({
      passcode: v.passcode,
      created: Date.now(),
      log: [],
    })},{where:x => x[w.prop.primatyKeyColumn] === userId});

    
    v.step = 2; // マスタ(SingleTable)からユーザ情報を特定
    v.user = w.master.select({where: x => x[w.prop.primatyKeyColumn] === userId})[0];
    if( v.user instanceof Error ) throw v.user;
    if( !v.user ) throw new Error('userId nomatch');


    v.step = 3; // パスコード連絡メールを発信
    v.rv = sendmail(
      v.user.email,
      w.prop.notificatePasscodeMail.subject,
      w.prop.notificatePasscodeMail.body.replace('::passcode::',v.passcode),
      w.prop.notificatePasscodeMail.options,
    );
    if( v.rv instanceof Error ) throw v.rv;


    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
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

    w.step = 2; // 画面切替
    if( w.arg.func === 'changeScreen' ){
      w.step = 2.1; // ユーザ情報を取得
      w.r = w.func.getUserInfo(w.userId,w.arg);
      if( w.r instanceof Error ) throw w.r;
      console.log('l.467 w.r='+stringify(w.r))

      w.step = 2.2; // 戻り値の設定
      switch(w.r.response){
        case 'hasAuth':
          w.rv = {
            response: w.r.response,
            data: w.r.data,
            SPkey: w.prop.SPkey,
          };
          break;
        case 'noAuth':
          w.rv = {
            response: w.r.response,
            data: {auth:w.r.data.auth},
          };
          break;
        case 'freezing':
          w.rv = {
            response: w.r.response,
            status: w.r.status,
            numberOfLoginAttempts: w.r.numberOfLoginAttempts,
            loginGraceTime: w.r.loginGraceTime,
            remainRetryInterval: w.r.remainRetryInterval,
            passcodeDigits: w.r.passcodeDigits,
          };
          break;
        case 'passcode':
          w.rv = {response:w.r.response};
          w.r = w.func.sendPasscode(w.r.data.userId);
          if( w.r instanceof Error ) throw w.r;
          break;
        default: w.rv = null;
      }
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
