/** vlog: デバッグ用コンソール出力
 * @param {Object} v - 出力対象Object
 * @param {string} m - メンバ名
 * @param {number} l=null - 行番号
 * @returns {void}
 */
const vlog = (v,m,l=null) => {
  // return; // デバッグ用。本番時はコメントを外す

  let h = new Date().toLocaleTimeString() + ' ';
  h += l !== null ? `l.${l} ` : '';
  h += v.whois ? v.whois + ' ' : '';
  h += v.step ? `step ${v.step} ` : '';
  h += h.length > 0 ? ': ' : '';
  if( whichType(m,'String') ) m = [m];
  const msg = [];
  m.forEach(x => msg.push(`${x}(${whichType(v[x])})=${stringify(v[x])}`));
  console.log(h+msg.join('\n'));
}
