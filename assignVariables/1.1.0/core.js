/** assignVariables: 位置指定属性を持つHTML要素に変数を代入する
 * 
 * @example
 * 
 * ```
 * <a data-assing="href:public.refURL,innerText:title"></a>
 * <img data-assing="src:public.refQR" />
 * 
 * let r = assignVariables({
 *   attribute: 'data-assign',
 *   data: {
 *     title  : '参考資料',
 *     public: {
 *       refURL : 'https://〜',
 *       refQR  : 'https://api.qrserver.com/〜?data=' + 'https://〜',
 *     }
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
 * 
 * - 1.1.0 2024/08/16 : 階層化オブジェクトに対応
 */
function assignVariables(arg){
  const v = {whois:'assignVariables',step:0,rv:null};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    v.step = 1; // 事前準備
    v.arg = Object.assign({parent:'body',attribute:'data-assign'},arg);
    v.arg.data = JSON.stringify(arg.data);  // 壊れないよう文字列化
    v.parent = document.querySelector(v.arg.parent);
    v.elements = v.parent.querySelectorAll('['+v.arg.attribute+']');

    v.step = 2; // 対象要素毎に属性置換
    v.elements.forEach(element => {

      v.step = 2.1; // data-assign文字列をカンマで切り分け
      v.attributes = element.getAttribute(v.arg.attribute).split(',');
      v.attributes.forEach(attribute => {

        v.step = 2.2; // m[1]=属性名、m[2]=arg.dataのメンバ名に切り分け
        v.m = attribute.match(/(\w+)\s*:\s*([\w\.]+)/);

        v.step = 2.3; // '.'で階層毎に切り分け、arg.dataの該当メンバの値をv.dataにセット
        v.data = JSON.parse(v.arg.data);
        v.m[2].split('.').forEach(x => v.data = v.data[x]);

        v.step = 2.4; // HTML要素に適用
        if( v.m[1].match(/inner/) ){
          // innerText, innerHTML指定の場合
          element[v.m[1]] = v.data;
        } else {
          // innerText, innerHTML以外の、属性指定の場合
          element.setAttribute(v.m[1],v.data);
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