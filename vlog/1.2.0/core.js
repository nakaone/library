/** vlog: デバッグ用コンソール出力
 * @param {Object} o - 出力対象Object
 * @param {string|string[]} m - メンバ名
 * @param {number|Object} l=null - 数値なら行番号、Objectならwhois,stepをメンバに持つ変数('v'を想定)
 * @returns {void}
 * 
 * - ver.1.1.0 2024/09/12
 *   - v以外の変数(ex.this)でもstep表示を可能に(lにObjectを追加)
 *   - 階層化オブジェクトメンバの指定を可能に(v.convの追加)
 */
const vlog = (o,m,l=null) => {
  // return; // デバッグ用。本番時はコメントを外す
  const v = {
    lType: whichType(l),  // 引数lのデータ型
    conv: (o,s) => {s.split('.').forEach(x => o = o[x]);return o},
  };

  switch( v.lType ){
    case 'Object': v.whois = l.whois; v.step = l.step; v.line = null; break;
    case 'Null'  : // Numberと同じ
    case 'Number': v.whois = o.whois; v.step = o.step; v.line = l; break;
  }
  v.msg = new Date().toLocaleTimeString()
    + (v.whois ? ` ${v.whois}` : '')
    + (v.step ? ` step.${v.step}` : '')
    + (v.line ? ` l.${v.line}` : '');

  if( whichType(m,'string') ) m = [m];
  m.forEach(str => {
    v.val = v.conv(o,str);
    v.msg += `\n${str}(${whichType(v.val)})=${stringify(v.val)}`
  });

  console.log(v.msg);
}