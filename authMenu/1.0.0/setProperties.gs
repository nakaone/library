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

    v.step = 1.1; // 現在の登録内容をクリア
    PropertiesService.getDocumentProperties().deleteAllProperties();

    v.step = 1.2; // 項目・値を定義
    v.prop = {

      // ログイン認証関係
      passcodeDigits : 6, // {number} パスコードの桁数
      loginRetryInterval : 3600000,// {number} 前回ログイン失敗(凍結)から再挑戦可能になるまでの時間(ミリ秒)
      numberOfLoginAttempts : 3, // {number} ログイン失敗になるまでの試行回数
      loginGraceTime : 900000, // {number} パスコード生成からログインまでの猶予時間(ミリ秒)
      notificatePasscodeMail: { // {Object} パスコード連絡メールのテンプレート
        subject: '[連絡] パスコード',
        body: 'パスコードは以下の通りです。\n\n::passcode::',
        options: {},
      },

      // ユーザ情報関係
      userLoginLifeTime : 86400000, // {number} クライアント側ログイン(CPkey)有効期間
      defaultAuth : 2, // {number} 新規登録者に設定する権限
      userIdStartNumber : 1, // {number} ユーザID(数値)の開始値

      // シート定義関係
      masterSheet : 'master', // {string} 参加者マスタのシート名
      primatyKeyColumn : 'userId', // {string} 主キーとなる項目名。主キー項目の値は数値で設定
      emailColumn : 'email', // {string} e-mailを格納するシート上の項目名

      // サーバ側RSAキー関連情報
      passPhrase : null, // {string} パスフレーズ
      passPhraseLength : 16, // {number} authServerのパスフレーズの長さ
      bits: 1024,  // {number} RSAキーのビット長
      SPkey: null, // {string} サーバ側公開鍵

      // authServerメソッド関係
      allow: {}, // {Object.<string,number>} authServerのメソッド実行に必要な権限

    };

    v.step = 1.3; // 導出項目の値を設定
    v.prop.passPhrase = createPassword(v.prop.passPhraseLength),
    v.prop.SSkey = cryptico.generateRSAKey(v.prop.passPhrase,v.prop.bits);
    v.prop.SPkey = cryptico.publicKeyString(v.prop.SSkey);
    delete v.prop.SSkey; // 秘密鍵は文字列としてできないので削除

    v.step = 2.1; // プロパティサービスを更新
    PropertiesService.getDocumentProperties().setProperties(v.prop);

    v.step = 2.2; // 設定内容の確認
    v.r = PropertiesService.getDocumentProperties().getProperties();
    console.log(`DocumentProperties=${JSON.stringify(v.r)}`);

    v.step = 2.3; // RSAキー動作の確認 -> "signature":"verified"
    v.SSkey = cryptico.generateRSAKey(v.r.passPhrase,v.r.bits);
    v.str = `This is test string.`;
    v.enc = cryptico.encrypt(v.str,v.prop.SPkey,v.SSkey);
    console.log(`v.enc=${stringify(v.enc)}`);
    v.dec = cryptico.decrypt(v.enc.cipher,v.SSkey);
    console.log(`v.dec=${stringify(v.dec)}`);
    v.dec = cryptico.decrypt('abcde',v.SSkey);
    console.log(`v.dec=${stringify(v.dec)}`);

    /*
    v.step = 2.4; // RSAテスト -> "signature":"verified"
    v.S = createPassword(v.prop.passPhraseLength);
    v.SS = cryptico.generateRSAKey(v.S,v.prop.bits);
    v.SP = cryptico.publicKeyString(v.SS);
    v.R = createPassword(v.prop.passPhraseLength);
    v.RS = cryptico.generateRSAKey(v.R,v.prop.bits);
    v.RP = cryptico.publicKeyString(v.RS);

    v.enc = cryptico.encrypt(v.str,v.RP,v.SS);
    console.log(`v.enc=${stringify(v.enc)}`);
    v.dec = cryptico.decrypt(v.enc.cipher,v.RS);
    console.log(`v.dec=${stringify(v.dec)}`); -> "signature":"verified"
    */

    v.step = 3; // 終了処理
    console.log(`${v.whois} normal end.`);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
