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

  //::$src/server.preProcess.js::
  //::$src/server.getUserInfo.js::
  //::$src/server.sendPasscode.js::
  //::$src/server.verifyPasscode.js::

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
