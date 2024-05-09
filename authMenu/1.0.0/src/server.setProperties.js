/** setProperties: authServerの適用値を設定
 * 
 * - プロジェクト横断で使用する設定値をDocumentPropertiesに保存。
 * - 設定値はauthServerソースに埋め込むのは不適切なため、プロジェクト初期化時に一回だけ実行後、ソースから削除する
 * - 設定値はプロジェクトにより異なるため、プロジェクト毎に適宜ソースを修正して使用すること。
 * - 参考：[Class Properties](https://developers.google.com/apps-script/reference/properties/properties?hl=ja)
 * 
 * @param {void}
 * @returns {void}
 */
function setProperties(){
  const v = {whois:'setProperties',rv:0,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1.1; // 項目・値を定義
    v.prop = {
      propertyName : 'authServer', // {string} プロパティサービスのキー名
      passcodeDigits : 6, // {number} パスコードの桁数
      loginRetryInterval : 3600000,// {number} 前回ログイン失敗(凍結)から再挑戦可能になるまでの時間(ミリ秒)
      numberOfLoginAttempts : 3, // {number} ログイン失敗になるまでの試行回数
      loginGraceTime : 900000, // {number} パスコード生成からログインまでの猶予時間(ミリ秒)
      userLoginLifeTime : 86400000, // {number} クライアント側ログイン(CPkey)有効期間
      defaultAuth : 2, // {number} 新規登録者に設定する権限
      masterSheet : 'master', // {string} 参加者マスタのシート名
      primatyKeyColumn : 'userId', // {string} 主キーとなる項目名。主キー項目の値は数値で設定
      emailColumn : 'email', // {string} e-mailを格納するシート上の項目名
      RSA : { // {Object} サーバ側RSAキー関連情報
        passPhraseLength : 16, // {number} authServerのパスフレーズの長さ
        bits: 1024,  // {number} RSAキーのビット長
      },
      userIdStartNumber : 1, // {number} ユーザID(数値)の開始値
      notificatePasscodeMail: { // {Object} パスコード連絡メールのテンプレート
        subject: '[連絡] パスコード',
        body: 'パスコードは以下の通りです。\n\n::passcode::',
        options: {},
      },
      allow: {}, // {Object.<string,number>} authServerのメソッド実行に必要な権限
    };

    v.step = 1.2; // 導出項目の値を設定
    v.prop.RSA.passPhrase = createPassword(v.prop.RSA.passPhraseLength),
    v.prop.RSA.SSkey = cryptico.generateRSAKey(v.prop.RSA.passPhrase,v.prop.RSA.bits);
    v.prop.RSA.SPkey = cryptico.publicKeyString(v.prop.RSA.SSkey);

    v.step = 2; // プロパティサービスを更新
    PropertiesService.getDocumentProperties().setProperties(v.prop);

    v.step = 3; // 設定内容の確認、終了
    console.log(`${v.whois} normal end.\n`,
    PropertiesService.getDocumentProperties().getProperties());

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
