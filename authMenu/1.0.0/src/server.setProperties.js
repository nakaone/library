/** authServerの適用値を設定
 * 
 * これら設定値はプロジェクトにより異なるため、
 * プロジェクト毎に適宜ソースを修正して使用すること。
 * 
 * @param {object} arg
 * @param {number} arg.userId=null - ユーザID
 * @param {string} arg.email=null - メールアドレス
 * @returns {number}
 * - -1 : ユーザID・メールアドレスとも引数に無し 
 * - 0 : ユーザIDまたはメールアドレスに該当無し
 * - 1 : ユーザIDまたはメールアドレスが1件該当
 * - 2 : ユーザIDまたはメールアドレスが複数件該当(エラー)
 * - 4 : 引数で渡されたユーザIDが不正
 * - 8 : 引数で渡されたメールアドレスが不正
 * 
 * **propの既定値、prop以外に設定される値**
 * 
 * - w.prop : 恒常的な設定値を保持
 *   1. propertyName='authServer' {string}<br>
 *      プロパティサービスのキー名
 *   1. passcodeDigits=6 {number} : パスコードの桁数
 *   1. loginRetryInterval=3,600,000(60分) {number}<br>
 *      前回ログイン失敗(3回連続失敗)から再挑戦可能になるまでの時間(ミリ秒)
 *   1. numberOfLoginAttempts=3 {number}<br>
 *      ログイン失敗になるまでの試行回数
 *   1. loginGraceTime=900,000(15分) {number}<br>
 *      パスコード生成からログインまでの猶予時間(ミリ秒)
 *   1. userLoginLifeTime=86,400,000(24時間) {number}<br>
 *      クライアント側ログイン(CPkey)有効期間
 *   1. defaultAuth=2 {number}<br>
 *      新規登録者に設定する権限
 *   1. masterSheet='master' {string}<br>
 *      参加者マスタのシート名
 *   1. primatyKeyColumn='userId' {string}<br>
 *      主キーとなる項目名。主キーは数値で設定
 *   1. emailColumn='email' {string}<br>
 *      e-mailを格納するシート上の項目名
 *   1. RSA {Object} : サーバ側RSAキー関連情報
 *      1. passPhraseLength=16 {number} : authServerのパスフレーズの長さ
 *      1. passPhrase {string} : authServerのパスフレーズ(自動生成)
 *      1. bits=1024 {number} : RSAキーのビット長
 *      1. SSkey {Object} : authServerの秘密鍵
 *      1. SPkey {string} : authServerの公開鍵
 *   1. userIdStartNumber=1 : ユーザID(数値)の開始
 * - w.master {SingleTable} : authServerが呼ばれた時点のマスタシート
 * 
 * - [Class Properties](https://developers.google.com/apps-script/reference/properties/properties?hl=ja)
 */
w.func.setProperties = function(arg={}){
  const v = {whois:w.whois+'.setProperties',rv:0,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 引数の既定値を設定
    v.arg = Object.assign({userId:null,email:null},arg);

    v.step = 2; // 適用値をセット
    w.prop = PropertiesService.getDocumentProperties().getProperties();
    if( Object.keys(w.prop).length === 0 ){
      w.prop = {
        propertyName : 'authServer',
        loginRetryInterval : 3600000,
        numberOfLoginAttempts : 3,
        loginGraceTime : 900000,
        userLoginLifeTime : 86400000,
        defaultAuth : 2,
        masterSheet : 'master',
        primatyKeyColumn : 'userId',
        emailColumn : 'email',
        RSA : {
          passPhraseLength : 16,
          bits: 1024,  
        },
        userIdStartNumber : 1,
        notificatePasscodeMail: {
          subject: '[連絡] パスコード',
          body: 'パスコードは以下の通りです。\n\n::passcode::',
          options: {},
        },
      };
      w.prop.RSA.passPhrase = createPassword(w.prop.RSA.passPhraseLength),
      w.prop.RSA.SSkey = cryptico.generateRSAKey(w.prop.RSA.passPhrase,w.prop.RSA.bits);
      w.prop.RSA.SPkey = cryptico.publicKeyString(w.prop.RSA.SSkey);
      // プロパティサービスを更新
      PropertiesService.getDocumentProperties().setProperties(w.prop);
    }

    v.step = 3; // シートから全ユーザ情報の取得
    w.master = new SingleTable(w.prop.masterSheet);
    if( w.master instanceof Error ) throw w.master;

    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end.\n`,w.prop);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
