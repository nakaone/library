/** textContent: 指定CSSセレクタ内のテキストを抽出
 * @param {string} content - エレメント(HTML)の全ソース
 * @param {string[]} selectors - 抽出対象となるCSSセレクタ
 * @returns {string} 抽出された指定CSSセレクタ内のテキスト
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
/* Node.js上で単体実行する場合の処理 */
function onNode(){  // changed
  console.log('===== onNode start.');
  const v = {};

  // 事前処理：引数チェック、既定値の設定
  v.argv = analyzeArg();
  if(v.argv.hasOwnProperty('stack')) throw v.argv;

  // ファイルの読み込み、textContentの呼び出し
  v.fs = require('fs');
  v.content = v.fs.readFileSync(v.argv.opt.i,'utf-8');
  v.rv = textContent(v.content,v.argv.val);
  if( v.rv.hasOwnProperty('stack') ) throw v.rv;  // debug

  // 結果の書き出し
  v.content = v.fs.writeFileSync(v.argv.opt.o,v.rv,'utf-8');  

  console.log('v.rv='+v.rv);
  console.log('===== onNode end.');
}

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
  const v = {rv:{opt:{},val:[]}}; // changed
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

    console.log('v.rv='+JSON.stringify(v.rv));  // changed
    console.log('===== analyzeArg end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
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
    //textContentTest();

    // 画面モードに従って初期画面表示
    changeMode();
  });
}