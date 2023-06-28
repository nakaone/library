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
/* Node.js上で単体実行する場合の処理 */
function onNode(){
  console.log('===== onNode start.');
  const v = {};

  // 事前処理：引数チェック、既定値の設定
  v.argv = analyzeArg();
  if(v.argv.hasOwnProperty('stack')) throw v.argv;

  // ファイルの読み込み、executableの呼び出し
  v.fs = require('fs');
  v.content = v.fs.readFileSync(v.argv.opt.i,'utf-8');
  v.rv = executable(v.content);
  if( v.rv.hasOwnProperty('stack') ) throw v.rv;  // debug

  // 結果の書き出し
  v.content = v.fs.writeFileSync(v.argv.opt.o,v.rv,'utf-8');  

  console.log('v.rv='+v.rv);
  console.log('===== onNode end.');
}
if( typeof window === 'undefined' ){
  // コンソール(Node.js)で実行する場合の処理
  onNode();
} else {
  // ブラウザ上で実行する場合の処理
  window.addEventListener('DOMContentLoaded',() => {
    const v = {mode:{num:1,value:'doc'},text:''};

    // MarkDownで記述された部分をHTML化して表示
    v.doc = document.createElement('div');
    v.doc.classList.add('sz');
    ['style.jsdoc','style.doc'].forEach(selector => {
      v.inner = document.querySelector(selector).textContent.trim();
      v.m = v.inner.match(/^\/\*([\s\S]+)\*\//);
      v.text += v.m ? v.m[1] : v.inner;
    });
    v.md = marked(v.text);
    v.doc.innerHTML = v.md;
    document.querySelector('body div.doc').prepend(v.doc);

    // テスト実行
    //executableTest();

    // 画面モードに従って初期画面表示
    changeMode();
  });
}
