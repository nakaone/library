/** authServer: 必要に応じて引数を復号・署名検証した上で、サーバ側の処理を分岐させる
 * 
 * 最初にシート上の全ユーザ情報を取得(w.master)した上で、引数の型・内容に基づき
 * 以下のデシジョンテーブルによって処理を分岐させる。
 * 
 * | userId | arg | 分岐先関数 | 処理 |
 * | :-- | :-- | :-- | :-- |
 * | null | {string} JSON(平文) | getUserInfo | 新規ユーザ登録 |
 * | number | null | getUserInfo | 応募情報(自情報)取得 |
 * | number | {string} JSON(SP/--) | verifyPasscode | パスコード検証 |
 * 
 * @param {number} userId 
 * @param {null|string} arg - 分岐先処理名、分岐先処理に渡す引数オブジェクト
 * @returns {Object} 分岐先処理での処理結果
 */
function authServer(userId=null,arg=null) {
  // 内部関数で'v'を使用するため、ここでは'w'で定義
  const w = {whois:'authServer',rv:null,step:0,
    prop:{}, // setPropertiesで設定されるauthServerのconfig
    isJSON:str=>{try{JSON.parse(str)}catch(e){return false} return true},
  };
  //::$src/server.getUserInfo.js::
  //::$src/server.verifyPasscode.js::
  console.log(`${w.whois} start.`);
  try {

    w.step = 1; // PropertiesServiceに格納された値をw.propに読み込み
    w.prop = PropertiesService.getDocumentProperties().getProperties();
    if( !w.prop ) throw new Error('Property service not configured.');

    w.step = 2; // シートから全ユーザ情報の取得
    w.master = new SingleTable(w.prop.masterSheet);
    if( w.master instanceof Error ) throw w.master;

    w.step = 3; // 処理の分岐
    if( userId === null && typeof arg === 'string' ){

      // ------------------------------------------------
      w.step = 3.1; // userId未設定 ⇒ 新規ユーザ登録
      // ------------------------------------------------
      if( w.isJSON(arg) ){
        w.user = w.func.getUserInfo(null,Object.assign({
          createIfNotExist: true, // メアドが未登録なら作成
        },JSON.parse(arg)));
        if( w.user instanceof Error ) throw w.user;
      }

    } else {
      w.userId = Number(userId);
      if( isNaN(w.userId) ) throw new Error('userId is not a number.');

      if( arg === null ){

        // ------------------------------------------------
        w.step = 3.2; // arg未設定 ⇒ 応募情報(自情報)取得
        // ------------------------------------------------
        w.user = w.func.getUserInfo(w.userId,null);
        if( w.user instanceof Error ) throw w.user;

      } else {

        // argを復号
        w.decrypt = cryptico.decrypt(arg,w.prop.RSA.SSkey);
        if( w.decrypt.status === 'success' ){
          w.arg = JSON.parse(w.decrypt.plaintext);

          // ------------------------------------------------
          w.step = 3.3; // パスコード検証
          // 
          // ------------------------------------------------
          w.rv = w.func.verifyPasscode(w.userId,w.arg);
          if( w.rv instanceof Error ) throw w.rv;
    
          if( w.decrypt.publicKeyString === w.user.CPkey ){
            // 【備忘】argの署名検証まで必要な処理をここに記述
          }
        }
      }
    }

    w.step = 6; // 終了処理
    console.log(`${w.whois} normal end.\nw.rv=${stringify(w.rv)}`);
    // 該当処理なしの場合、何も返さない
    if( w.rv !== null ) return w.rv;

  } catch(e) {
    e.message = `${w.whois} abnormal end at step.${w.step}`
    + `\n${e.message}\nuserId=${userId}\nfunc=${func}`;
    console.error(`${e.message}\nw=${stringify(w)}`);
    return e;
  }
}
