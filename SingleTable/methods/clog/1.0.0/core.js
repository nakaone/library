/** ログモードを判断してコンソールにログを出力
 * - クラスでの使用が前提。メンバthis.logModeと引数typeの論理積>0ならログ出力
 * 
 * @param {string[]} msg - 出力するメッセージの配列
 * @param {number} [type=3] - メッセージの種類。0:エラーログ、1:終了ログ、2:開始ログ、4:実行時ログ
 * @returns {void}
 */
clog(type=3,...msg){
  //console.log('clog: logMode=%s, type=%s, and=%s, msg=%s',this.logMode,type,(this.logMode & type),JSON.stringify(msg));
  if( !Array.isArray(msg) ) msg = [msg];
  if( (this.logMode & type) > 0 ) console.log(...msg);
}
