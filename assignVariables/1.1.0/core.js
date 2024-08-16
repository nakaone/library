/** assignVariables: 位置指定属性を持つHTML要素に変数を代入する
 * 
 * @example
 * 
 * ```
 * <a data-assing="href:refURL,innerText:title"></a>
 * <img data-assing="src:refQR" />
 * 
 * let r = assignVariables({
 *   attribute: 'data-assign',
 *   data: {
 *     refURL : 'https://〜',
 *     title  : '参考資料',
 *     refQR  : 'https://api.qrserver.com/〜?data=' + 'https://〜',
 *   },
 * });
 * 
 * <a href="https://〜">参考資料</a>
 * <img src="https://api.qrserver.com/〜?data=https://〜" />
 * ```
 * 
 * @param {Object} arg
 * @param {string} [arg.parent='body'] - 対象範囲となる包摂要素のCSSセレクタ
 * @param {string} [arg.attribute="data-assign"] - 位置指定属性の名称
 * @param {Object.<string, string>} arg.data - {属性名：値}となるオブジェクト
 */
function assignVariables(arg){
  const v = {whois:'assignVariables',step:0,rv:null};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    v.step = 1;
    v.arg = Object.assign({parent:'body',attribute:'data-assign'},arg);
    v.parent = document.querySelector(v.arg.parent);
    v.elements = v.parent.querySelectorAll('['+v.arg.attribute+']');

    v.elements.forEach(element => {
      v.attributes = element.getAttribute(v.arg.attribute).split(',');
      v.attributes.forEach(attribute => {
        v.m = attribute.match(/(\w+)\s*:\s*(\w+)/);
        if( v.m[1].match(/inner/) ){
          // innerText, innerHTML指定の場合
          element[v.m[1]] = v.arg.data[v.m[2]];
        } else {
          // innerText, innerHTML以外の、属性指定の場合
          element.setAttribute(v.m[1],v.arg.data[v.m[2]]);
        }
      });
    });

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}