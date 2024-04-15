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
v.setRSAkeys = function(){
  const w = {whois:'authServer.setRSAkeys',rv:{},step:0};
  console.log(`${w.whois} start.`);
  try {

    w.r = PropertiesService.getDocumentProperties().getProperty(v.whois);
    console.log(`l.25 [${typeof w.r}] ${stringify(w.r)}`)

    if( w.r === null ){
      w.bits = 1024;  // ビット長
      w.step = 2.1; // 16桁のパスワードを自動生成
      w.rv.passPhrase = createPassword(16);
      w.step = 2.2; // 秘密鍵の生成
      w.rv.privateKey = cryptico.generateRSAKey(w.rv.passPhrase, w.bits);
      v.step = 2.3; // 公開鍵の生成
      w.rv.publicKey = cryptico.publicKeyString(w.rv.privateKey);
      PropertiesService.getDocumentProperties().setProperty(v.whois,w.rv);
    } else {
      w.rv = w.r;
    }

    v.step = 9; // 終了処理
    console.log(`${w.whois} normal end.`);
    console.log(`type = ${typeof w.rv}\npassPhrase="${w.rv.passPhrase}\npublicKey="${w.rv.publicKey}"`);
    return w.rv;

  } catch(e) {
    e.message = `${w.whois} abnormal end at step.${w.step}\n${e.message}`;
    return e;
  }
}