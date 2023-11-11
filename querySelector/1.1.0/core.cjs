/**
 * @typedef {object} QuerySelector
 * @prop {string} tag - タグ名
 * @prop {string} selector - 指定に使用されたCSSセレクタ
 * @prop {Object.<string, string>} attr=Null - 属性名：属性値となるオブジェクト
 * @prop {string} html='' - innerHTMLの値。要素に含まれるすべてのテキスト
 * @prop {string} text='' - innerTextの値。
 * @prop {string} content='' - textContentの値。要素およびその子要素に含まれるすべてのテキスト
 */

/** HTML文書から指定CSSセレクタの情報を抽出
 * 
 * @param {string} content - 処理対象となるテキスト
 * @param {string|string[]} selectors - 抽出条件を指定するCSSセレクタ(複数可)
 * @returns {QuerySelector[]|Error}
 * 
 * - [Node.jsのサーバサイドでDOMを使う](https://moewe-net.com/nodejs/jsdom)
 */

module.exports = function querySelector(content,selectors,opt){
  const v = {whois:'querySelector',rv:[],step:0};
  const { JSDOM } = require("jsdom");
  console.log(v.whois+' start.');
  try {

    v.step = 1; // 前処理
    v.selectors = typeof selectors === 'string' ? [selectors] : selectors;
    v.dom = new JSDOM(content).window.document;

    v.selectors.forEach(selector => {
      v.step = 2; // CSSセレクタ毎に適合する全要素を抽出
      v.elements = v.dom.querySelectorAll(selector);
      v.elements.forEach(element => {
        v.step = 3; // 適用する要素毎にQuerySelectorを作成
        const o = {
          tag: element.tagName.toLowerCase(),
          selector: selector,
          attr: null,
          text: (element.innerText || '').trim(),
          html: (element.innerHTML || '').trim(),
          content: (element.textContent || '').trim(),
        };
        v.step = 4; // 属性情報を追加
        if( element.hasAttributes() ){
          o.attr = {};
          v.attr = element.attributes;
          for( v.i=0 ; v.i<v.attr.length ; v.i++ ){
            o.attr[v.attr[v.i].name] = v.attr[v.i].value;
          }
        }
        v.step = 5; // 戻り値に追加
        v.rv.push(o);
      });
    });
    
    v.step = 6; // 終了処理
    console.log(v.whois+' normal end.');
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}