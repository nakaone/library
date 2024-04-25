/** authServerの適用値を設定
 * 
 * これら設定値はプロジェクトにより異なるため、
 * プロジェクト毎に適宜ソースを修正して使用すること。
 * 
 * @param {number|null} userId 
 * @returns {null}
 * 
 * 1. propertyName='authServer' {string}<br>
 *    プロパティサービスのキー名
 * 1. loginRetryInterval=3,600,000(60分) {number}<br>
 *    前回ログイン失敗(3回連続失敗)から再挑戦可能になるまでの時間(ミリ秒)
 * 1. numberOfLoginAttempts=3 {number}<br>
 *    ログイン失敗になるまでの試行回数
 * 1. loginGraceTime=900,000(15分) {number}<br>
 *    パスコード生成からログインまでの猶予時間(ミリ秒)
 * 1. userLoginLifeTime=86,400,000(24時間) {number}<br>
 *    クライアント側ログイン(CPkey)有効期間
 * 1. defaultAuth=2 {number}<br>
 *    新規登録者に設定する権限
 * 1. masterSheet='master' {string}<br>
 *    参加者マスタのシート名
 * 1. primatyKeyColumn='userId' {string}<br>
 *    主キーとなる項目名。主キーは数値で設定
 * 1. emailColumn='email' {string}<br>
 *    e-mailを格納するシート上の項目名
 * 1. passPhrase {string} : authServerのパスフレーズ
 * 1. SSkey {Object} : authServerの秘密鍵
 * 1. SPkey {string} : authServerの公開鍵
 * 1. userIdStartNumber=1 : ユーザID(数値)の開始
 * 
 * - [Class Properties](https://developers.google.com/apps-script/reference/properties/properties?hl=ja)
 */
w.func.setProperties = function(){
  const v = {whois:w.whois+'.setProperties',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 適用値をセット
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
        passPhrase : createPassword(16),
        userIdStartNumber : 1,
      };
      w.prop.SSkey = cryptico.generateRSAKey(w.prop.passPhrase,1024);
      w.prop.SPkey = cryptico.publicKeyString(w.prop.SSkey);
      // プロパティサービスを更新
      PropertiesService.getDocumentProperties().setProperties(w.prop);
    }
    console.log(`${v.whois} normal end.\n`,w.prop);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.setProperties(arg);
if( w.rv instanceof Error ) throw w.rv;