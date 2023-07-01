/**
 * @typedef {object} analyzeArg - コマンドライン引数の分析結果
 * @prop {Object.<string, number>} opt - スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト
 * @prop {string[]} val - スイッチを持たない引数の配列
 */
/** analyzeArg: コマンドライン引数を分析
 * @desc コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す。<br>
 * 
 * @example
 * 
 * ```
 * node xxx.js -i:aaa.html bbb -o:ccc.json ddd eee
 * ⇒ {opt:{i:"aaa.html",o:"ccc.json"},val:["bbb","ddd","eee"]}
 * ```
 * 
 * <caution>注意</caution>
 * 
 * - スイッチは`(\-*)([0-9a-zA-Z]+):*(.*)$`形式であること
 * - スイッチに該当しないものは配列`val`にそのまま格納される
 * 
 * @param {void} - なし
 * @returns {analyzeArg} 分析結果のオブジェクト
 */

function analyzeArg(){
  console.log('===== analyzeArg start.');
  const v = {rv:{opt:{},val:[]}};
  try {

    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      // process.argv:コマンドライン引数の配列
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }

    console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== analyzeArg end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
/**
 * @typedef {object} querySelector
 * @prop {string} tag - タグ名
 * @prop {Object.<string, string>} attr=null - 属性名：属性値となるオブジェクト
 * @prop {string} inner='' - 子要素タグも含む、タグ内のテキスト
 */

/** querySelector: HTMLの指定CSSセレクタの内容を抽出
 * @param {string} content - エレメント(HTML)の全ソース
 * @param {string|string[]} selectors - 抽出対象となるCSSセレクタ
 * @returns {querySelector[]} 抽出された指定CSSセレクタ内のテキスト
 */

 function querySelector(content,selectors){
  console.log('===== querySelector start.');
  const v = {rv:[],
    selectors: [],
    extract: (document,selector) => {
      console.log('----- extract start.');
      v.elements = document.querySelectorAll(selector);
      v.elements.forEach(element => {
        const o = {
          tag: element.tagName.toLowerCase(),
          attr: null,
          inner: '',
        };
        if( element.hasAttributes() ){
          o.attr = {};
          v.attr = element.attributes;
          for( v.i=0 ; v.i<v.attr.length ; v.i++ ){
            o.attr[v.attr[v.i].name] = v.attr[v.i].value;
          }
        }
        v.inner = String(element.innerHTML).trim();
        if( v.inner.length > 0 )  o.inner = v.inner;
        v.rv.push(o);
      });
      console.log('----- extract end.');
    }
  };
  try {

    // 指定CSSセレクタが単一なら配列化
    v.selectors = typeof selectors === 'string' ? [selectors] : selectors;

    if( typeof window === 'undefined' ){
      const { JSDOM } = require("jsdom");
      const { document } = new JSDOM(content).window;
      v.selectors.forEach(x => v.extract(document,x));
    } else {
      v.source = document.createElement('div');
      v.source.innerHTML = content;
      v.selectors.forEach(x => {
        v.extract(v.source,x);
      });
    }

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== querySelector end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack);
    console.error(e.stack);
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
