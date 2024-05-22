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
  //::$src/server.verifyPasscode.js::

  console.log(`${w.whois} start.`);
  try {

    w.step = 1; // 前処理
    w.func.preProcess();

    if( w.arg.func === 'changeScreen' ){
      w.rv = w.func.getUserInfo(w.userId,w.arg);
      if( w.rv instanceof Error ) throw w.rv;
      if( (w.arg.allow & w.rv.data.auth) > 0 ){
        if( w.rv.status === 0 ){
          // 権限ありでstatusも問題なし ⇒ 該当ユーザ情報
          w.rv.data.SPkey = w.prop.SPkey;
        } else if( (w.rv.status & 8) > 0 ){
          // 権限ありだが凍結中 ⇒ 再挑戦可能になるまでの時間(ミリ秒)
          w.rv = w.rv.remainRetryInterval;
        } else {
          // 権限ありだが要ログイン
          //w.rv = w.func.sendPasscode();
        }
      } else {
        // 権限なし ⇒ シート上のauth
        w.rv = w.rv.data.auth;
      }
    }

    /*
    w.step = 2; // userId未設定 ⇒ 新規ユーザ登録
    if( w.userId === null ){
      w.rv = w.func.getUserInfo(null,Object.assign({
        createIfNotExist: true, // メアドが未登録なら作成
      },w.arg));
      if( w.rv instanceof Error ) throw w.rv;
    }

    w.step = 3; // arg未設定 ⇒ 応募情報(自情報)取得
    if( w.userId !== null && (w.argType === 'null' || w.argType === 'JSON') ){
      w.rv = w.func.getUserInfo(w.userId,w.arg);
      if( w.rv instanceof Error ) throw w.rv;
    }

    w.step = 4; // パスコード検証
    if( w.userId !== null && w.argType === 'encrypted' ){
      w.rv = w.func.verifyPasscode(w.userId,w.arg);
      if( w.rv instanceof Error ) throw w.rv;
    }
    */

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
