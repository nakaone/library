/** サーバ側の認証処理を分岐させる
 * 
 * 最初に`setProperties()`で設定情報(w.prop)および
 * シート・ユーザ情報(w.master,w.user)を設定した上で、
 * 以下のデシジョンテーブルに基づき処理を分岐させる。
 * 
 * | userId | arg | 処理 |
 * | :-- | :-- | :-- |
 * | null | string(e-mail) | registNewEmail:新規ユーザ登録 |
 * | number | null | 応募情報(自情報)取得 |
 * | number | string(encrypted JSON) | ユーザ情報編集 |
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
  console.log(`${w.whois} start.`);
  try {

    w.step = 1; { // メソッドの登録(括弧はVSCode他のグルーピング用)
      //::authServerの適用値を設定::$src/server.setProperties.js::
      //::シートからユーザ情報を取得、メニュー表示権限を持つか判断::$src/server.checkAuthority.js::
      //::::$src/server..js::
      //::::$src/server..js::
      //::::$src/server..js::
      //::::$src/server..js::
    }

    w.step = 2; // 既定値をwに登録
    w.rv = w.func.setProperties(arg);
    if( w.rv instanceof Error ) throw w.rv;
  
    if( userId === null ){
      w.step = 2; // userId未設定 ⇒ 新規ユーザ登録
      w.r = w.func.registNewEmail(arg);
      if( w.r instanceof Error ) throw w.r;
    } else if( typeof userId === 'number' ){
      if( arg === null ){
        w.step = 3; // userIdはあるがarg未設定 ⇒ 応募情報(自情報)取得
        w.r = w.func.getUserInfo(userId);
        if( w.r instanceof Error ) throw w.r;
      } else if( w.isJSON(arg) ){
        w.step = 4; // argが平文 ⇒ 掲示板他、秘匿性が必要ない処理
      } else {
        w.step = 5; // argが暗号 ⇒ ユーザ情報編集
        // argを復号、署名検証
        w.decrypt = cryptico.decrypt(arg,w.prop.RSA.SSkey);
        if( w.decrypt.status === 'success' && w.decrypt.publicKeyString === w.user.CPkey ){
          w.arg = JSON.parse(w.decrypt.plaintext);

          // 以下に分岐処理を記述
          // checkAuthority : シートからユーザ情報を取得、メニュー表示権限を持つか判断
          w.rv = w.func.checkAuthority(arg);
          if( w.rv instanceof Error ) throw w.rv;          
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
