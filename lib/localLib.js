/* ここに一元管理対象HTML+CSS+JavaScriptの【JavaScript】部を記述 */

/**
 * @typedef {object} analyzeArg - コマンドライン引数の分析結果
 * @prop {Object.<string, number>} opt - スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト
 * @prop {string[]} val - スイッチを持たない引数の配列
 */
/** analyzeArg: コマンドライン引数を分析
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
/* ここに一元管理対象HTML+CSS+JavaScriptの【JavaScript】部を記述 */

/** executable: コンポーネント(HTML)から必要な部分を抽出、Node.jsで実行可能なJSファイルを作成
 * @param {string} content - コンポーネント(HTML)の全ソース
 * @returns {string} JSファイルの中身(テキスト)
 */
function executable(content){
  console.log('===== executable start.');
  const v = {rv:'',
    section: ['script.source','script.onNode','script.main'],
    extract: (document,selector) => {
      console.log('----- extract start.');
      let rv = '';
      v.elements = document.querySelectorAll(selector);
      v.elements.forEach(element => rv+=String(element.innerHTML).trim()+'\n');
      //console.log('rv='+rv);
      console.log('----- extract end.');
      return rv;
    }
  }
  try {

    // 読み込んだ内容をDOM化
    // [Node.jsのサーバサイドでDOMを使う](https://moewe-net.com/nodejs/jsdom)
    if( typeof window === 'undefined' ){
      const { JSDOM } = require("jsdom");
      const { document } = new JSDOM(content).window;
      v.section.forEach(x => {
        v.r = v.extract(document,x);
        if( v.r.hasOwnProperty('stack') ) throw v.r;
        v.rv += v.r;
      });
    } else {
      v.source = document.createElement('div');
      v.source.innerHTML = content;
      v.section.forEach(x => {
        v.r = v.extract(v.source,x);
        if( v.r.hasOwnProperty('stack') ) throw v.r;
        v.rv += v.r;
      });
    }

    console.log('v.rv='+v.rv);
    console.log('===== executable end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
/** textContent: 指定CSSセレクタ内のテキストを抽出
 * @param {string} content - エレメント(HTML)の全ソース
 * @param {string[]} selectors - 抽出対象となるCSSセレクタ
 * @returns {string} 抽出された指定CSSセレクタ内のテキスト
 * 
 * @desc 補足説明
 * 
 * | lv01   | lv02  | lv03  | value | note |
 * | :--    | :--   | :--   | :--   | :-- |
 * | public |       |       |       | |
 * |       | inter |       | 30000 | 定期配信の間隔 |
 * |       |       | inter | 30000 | NGのサンプル |
 * 
 * なお上の最下行のように階層が飛ぶことはNG(lv01:あり/lv02:なし/lv03:ありはNG)。
 * 
 * - [Google](https://www.google.com/)
 * 
 * @example
 * 
 * objectize(arr,1,3) ⇒ {public:{inter:{value:30000,note:'定期配信の間隔'}}}
 * objectize(arr,'lv01','lv03','value') ⇒ {public:{inter:30000}}}
 * objectize(arr,'lv01','lv03','rowNumber20230302')
 * ⇒ {public:{inter:{value:30000,note:'定期配信の間隔',rowNumber20230302:2}}}}
 * 
 * ```
 * objectize(arr,1,3) ⇒ {public:{inter:{value:30000,note:'定期配信の間隔'}}}
 * objectize(arr,'lv01','lv03','value') ⇒ {public:{inter:30000}}}
 * objectize(arr,'lv01','lv03','rowNumber20230302')
 * ⇒ {public:{inter:{value:30000,note:'定期配信の間隔',rowNumber20230302:2}}}}
 * ```
 * 
 */

function textContent(content,sections){
  console.log('===== textContent start.');
  const v = {rv:'',
    sections: [],
    extract: (document,selector) => {
      console.log('----- extract start.');
      let rv = '';
      v.elements = document.querySelectorAll(selector);
      v.elements.forEach(element => rv+=String(element.innerHTML).trim()+'\n');
      //console.log('rv='+rv);
      console.log('----- extract end.');
      return rv;
    }
  };
  try {

    // 指定CSSセレクタが単一なら配列化
    v.sections = typeof sections === 'string' ? [sections] : sections;

    if( typeof window === 'undefined' ){
      const { JSDOM } = require("jsdom");
      const { document } = new JSDOM(content).window;
      v.sections.forEach(x => {
        v.r = v.extract(document,x);
        if( v.r.hasOwnProperty('stack') ) throw v.r;
        v.rv += v.r;
      });
    } else {
      v.source = document.createElement('div');
      v.source.innerHTML = content;
      v.sections.forEach(x => {
        v.r = v.extract(v.source,x);
        if( v.r.hasOwnProperty('stack') ) throw v.r;
        v.rv += v.r;
      });
    }

    console.log('v.rv='+v.rv);
    console.log('===== textContent end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack);
    console.error(e.stack);
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
