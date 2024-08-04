/** querySelector: HTML文書から指定されたCSSセレクタ要素のinnerHTMLを抽出
 * @param {string} content - htmlソース
 * @param {Object} opt
 * @param {string} opt.key - 抽出対象のCSSセレクタ
 * @param {any} opt.a - 存在する場合、全件を検索して配列化してJSONで返す
 * @returns {string|string[]} 抽出対象のinnerHTML
 */
function querySelector(content,opt){
  const v = {whois:'querySelector',step:0,rv:null};
  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  try {

    v.step = 1; // DOM化
    v.dom = new JSDOM(content).window.document;

    if( !opt.hasOwnProperty('a') ){
      v.step = 2; // 単一要素指定の場合
      v.rv = v.dom.querySelector(opt.key).innerHTML;
    } else {
      v.step = 3; // 複数要素指定の場合
      v.rv = [];
      v.dom.querySelectorAll(opt.key).forEach(x => v.rv.push(x.innerHTML));
      v.rv = JSON.stringify(v.rv);
    }
    
    v.step = 9; // 終了処理
    console.log(v.rv);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}