/** preProcess: 事前準備。シートからユーザ情報全権取得、引数のオブジェクト化
 * @param {void}
 * @returns {void}
 */
w.func.preProcess = function(){
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
}
