/**
 * 
 * @param {number} userId 
 * @param {string} arg - 暗号化結果の文字列
 * @returns {Object}
 * 
 * @example
 * 
 * **プロパティサービス：authServer**
 * 
 * - 
 */
function authServer(userId=null,func=null,arg=null) {
  // 内部関数で'v'を使用するため、ここでは'w'で定義
  const w = {whois:'authServer',rv:null,step:0,
    func:{},  // 使用する関数を集めたオブジェクト
    validityPeriod: 2 * 24 * 3600 * 1000, // クライアント側ログインの有効期間(2日)
    masterSheet: 'master', // 参加者マスタのシート名
    primatyKeyColumn: 'userId', // 主キーとなる項目名。主キーは数値で設定
    emailColumn: 'email', // e-mailを格納する項目名
  };
  console.log(`${w.whois} start.`);
  PropertiesService.getDocumentProperties().deleteProperty(w.whois);
  try {

    if( userId === null ){
      w.step = 1;
      // userId未定でも可能な処理
      // ⇒ 一般公開用メニュー
      if( ['registMail'].find(x => x === func) ){
        
        //::$src/server.registMail.js::
        w.r = w.func.verifySignature(arg);
        if( w.r instanceof Error ) throw w.r;

      } else {
        w.step = 2; // 該当処理なし
        w.rv = null;
      }
    } else {
      if( ['login1S'].find(x => x === func) ){
        w.step = 3;
        // userIdは必要だが、ログインは不要な処理
        // ⇒ 参加者用メニュー(応募情報(自分の個人情報)修正を除く)

        //:x:$src/server.login1S.js::

      } else if( ['login2S','operation'].find(x => x === func) ){
        // ログインしないと操作不可の処理
        // ⇒ 応募情報修正、スタッフ用メニュー

        w.step = 4; // クライアント側の署名検証＋引数のオブジェクト化
        //::$src/server.verifySignature.js::
        w.r = w.func.verifySignature(userId,arg);
        if( w.r instanceof Error ) throw w.r;

        switch( func ){
          case 'login2S': w.step = 4 + ':login2S';
            //:x:$src/server.login2S.js::
            break;
          // 後略
          //:x:$src/server.listAuth.js::
          //:x:$src/server.changeAuth.js::
          //:x:$src/server.operation.js::
        }
      } else {
        w.step = 5; // 該当処理なし
        w.rv = null;
      }
    }

    w.step = 6; // 終了処理
    console.log(`${w.whois} normal end.`);
    // 該当処理なしの場合、何も返さない
    if( w.rv !== null ) return w.rv;

  } catch(e) {
    e.message = `${w.whois} abnormal end at step.${w.step}`
    + `\n${e.message}\nuserId=${userId}\nfunc=${func}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}