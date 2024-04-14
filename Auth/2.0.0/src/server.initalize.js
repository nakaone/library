/** GAS側の初期化処理
 * 
 * パスフレーズが存在しない場合は自動生成して鍵ペアを生成してプロパティサービスに保存、
 * 既存の場合はプロパティサービスから取得して返す。
 * 
 * @param {Object} [arg={}] - 内容はv.default参照
 * @returns {Object} - 内容はv.default参照
 * 
 * @example
 * 
 * ** 注意事項 **
 * 
 * 他のauthServerメソッドは`v.func.xxx`として定義するが、
 * 本メソッドはユーザに使用させないシステム的なメソッドのため、
 * funcではなく`v.initialize`として定義する。
 * 
 * **戻り値の形式**
 * 
 * - {Object|Error} rv
 *   - passPhrase {string} パスフレーズ
 *   - privateKey {Object} RSA形式の秘密鍵
 *   - publicKey {string} RSA形式の公開鍵
 * 
 * **参考：パスフレーズ・秘密鍵・公開鍵の一括保存はできない**
 * 
 * `{passPhrase:〜,privateKey:〜,publicKey:〜}`のように一括して保存しようとすると、以下のエラーが発生。
 * 
 * ```
 * You have exceeded the property storage quota.
 * Please remove some properties and try again.
 * ```
 * 
 * 原因は[プロパティ値のサイズ](https://developers.google.com/apps-script/guides/services/quotas?hl=ja)が超過したため。
 * ⇒ max 9KB/値なので、パスフレーズ・公開鍵・秘密鍵は別々のプロパティとして保存が必要
 */
v.initialize = function(arg={}){
  const v = {whois:'authServer.initialize',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // プロパティサービスから値を取得
    v.rv = {
      passPhrase: PropertiesService.getDocumentProperties().getProperty('passPhrase'),
      publicKey: PropertiesService.getDocumentProperties().getProperty('publicKey'),
      privateKey: PropertiesService.getDocumentProperties().getProperty('privateKey'),
    }

    v.step = 2; // 鍵ペア未生成の場合は作成後プロパティサービスに保存
    if( v.rv.passPhrase === null ){
      v.bits = 2048;  // ビット長
      v.step = 2.1; // 16桁のパスワードを自動生成
      v.rv.passPhrase = createPassword(16);
      PropertiesService.getDocumentProperties().setProperty('passPhrase',v.rv.passPhrase);
      v.step = 2.2; // 秘密鍵の生成
      v.rv.privateKey = cryptico.generateRSAKey(v.rv.passPhrase, v.bits);
      PropertiesService.getDocumentProperties().setProperty('privateKey',v.rv.privateKey);
      v.step = 2.3; // 公開鍵の生成
      v.rv.publicKey = cryptico.publicKeyString(v.rv.privateKey);
      PropertiesService.getDocumentProperties().setProperty('publicKey',v.rv.publicKey);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\npublicKey=${v.rv.publicKey}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
