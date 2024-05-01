/** サーバ側の認証処理を分岐させる
 * 
 * 1. ユーザID未定でも可能な処理(一般公開部分)
 * 1. ユーザIDは必要だが、ログイン(RSA)は不要な処理
 * 1. RSAキーが必要な処理
 * 
 * @param {number} userId 
 * @param {string} func - 分岐先処理名
 * @param {string} arg - 分岐先処理に渡す引数オブジェクト
 * @returns {Object} 分岐先処理での処理結果
 */
function authServer(userId=null,func=null,arg=null) {
  // 内部関数で'v'を使用するため、ここでは'w'で定義
  const w = {whois:'authServer',rv:null,step:0,func:{},prop:{}};
  console.log(`${w.whois} start.`);
  try {

    w.step = 1; // 既定値をwに登録
    //::$src/server.setProperties.js::

    if( userId === null ){ // userIdが不要な処理
      if( ['registMail','getUserInfo'].find(x => x === func) ){
        w.step = 1; // userId未定でも可能な処理 ⇒ 一般公開用
        //:x:メールアドレスの登録::$src/server.registMail.js::
        //::ユーザ情報・状態の取得::$src/server.getUserInfo.js::
      } else {
        w.step = 2; // 該当処理なし
        w.rv = null;
      }
    } else {  // userIdが必要な処理
      if( ['sendPasscode'].find(x => x === func) ){
        w.step = 3; // ログインは不要な処理
        // ⇒ 参加者用メニュー(応募情報(自分の個人情報)修正を除く)
        switch( func ){
          case 'sendPasscode': w.step += ':sendPasscode';
            //::$src/server.sendPasscode.js::
            break;
        }

      } else if( ['verifyPasscode','operation'].find(x => x === func) ){
        // ログインしないと操作不可の処理
        // ⇒ 応募情報修正、スタッフ用メニュー

        w.step = 4; // クライアント側の署名検証＋引数のオブジェクト化
        //::$src/server.verifySignature.js::
        // verifySignatureの戻り値はw.rで受けるので、後続処理に引数として渡す

        switch( func ){
          case 'verifyPasscode': w.step += ':verifyPasscode';
            //::$src/server.verifyPasscode.js::
            break;
          case 'operation': w.step += ':operation';
            //::$src/server.operation.js::
            break;
          // 後略
        }
      } else {
        w.step = 5; // 該当処理なし
        w.rv = null;
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