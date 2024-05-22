/** preProcess: 事前準備。シートからユーザ情報全権取得、引数のオブジェクト化
 * @param {void}
 * @returns {void}
 * 
 * **オブジェクト'w'にセットする内容**
 * 
 * - prop {Object} PropertiesServiceに格納された値。内容はsetProperties参照
 * - master {SingleTable} シートの情報
 * - userId {number|null} ユーザID
 * - arg {Object} JSON形式のauthServerの引数argをオブジェクト化
 * - argType {string} authServerの引数argのデータ型。null/JSON/encrypted
 * - decrypt {Object} argが暗号化されていた場合、復号化したオブジェクト
 *   - status {string} "success"
 *   - plaintext {string} 復号した文字列
 *   - signature {string} verified, forged, unsigned
 *   - publicKeyString {string} 送信側公開鍵
 */
w.func.preProcess = function(){
  const v = {whois:w.whois+'.preProcess',step:0,rv:null};
  console.log(`${v.whois} start.`);
    
  w.step = 1.1; // PropertiesServiceに格納された値をw.propに読み込み
  w.prop = PropertiesService.getDocumentProperties().getProperties();
  if( !w.prop ) throw new Error('Property service not configured.');

  w.step = 1.2; // シートから全ユーザ情報の取得
  w.master = new SingleTable(w.prop.masterSheet);
  if( w.master instanceof Error ) throw w.master;

  w.step = 1.3; // 引数userIdの前処理
  if( isNaN(userId) ) throw new Error('Invalid userId');
  w.userId = (userId === null ? null : Number(userId));

  w.step = 1.4; // 引数argの前処理
  if( arg === null ){
    w.step = 1.41;
    w.argType = 'null';
    w.arg = null;
  } else {
    if( typeof arg === 'string' ){
      if( w.isJSON(arg) ){
        w.step = 1.42;
        w.argType = 'JSON';
        w.arg = JSON.parse(arg);
      } else {
        w.step = 1.43;
        w.prop.SSkey = cryptico.generateRSAKey(w.prop.passPhrase,w.prop.bits);
        w.decrypt = cryptico.decrypt(arg,w.prop.SSkey);
        if( w.decrypt.status === 'success' ){
          w.step = 1.431;
          w.argType = 'encrypted';
          w.arg = JSON.parse(w.decrypt.plaintext);
        } else {
          w.step = 1.432;
          throw new Error('Decrypt failed');
        }
      }
    } else {
      throw new Error('Invalid arg');
    }
  }

  console.log(`${v.whois} normal end.`
    + `\nw.userId=${w.userId}`
    + `\nw.argType=${w.argType}`
    + `\nw.arg=${stringify(w.arg)}`
  );
}