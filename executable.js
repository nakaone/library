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
    const { JSDOM } = require("jsdom");
    const { document } = new JSDOM(content).window;

    v.section.forEach(x => {
      v.r = v.extract(document,x);
      if( v.r.hasOwnProperty('stack') ) throw v.r;
      console.log('x='+x+'\nr='+v.r);
      v.rv += v.r;
    });

    //console.log('v.rv='+v.rv);
    console.log('===== executable end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
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
  const v = {rv:{opt:{},val:[]}};
  console.log('===== analyzeArg start.');
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

    //console.log('rv='+JSON.stringify(v.rv));
    console.log('===== analyzeArg end.');
    return v.rv;
  } catch(e){
    if( typeof window !== 'undefined' ) alert(e.stack); // ブラウザで実行する場合はアラート表示
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
/*
</script>

<!--================================================
  Node.js上で単体実行する場合の処理
================================================-->
<script type="text/javascript" class="onNode">
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

  // 結果の書き出し
  v.content = v.fs.writeFileSync(v.argv.opt.o,v.rv,'utf-8');  

  console.log('v.rv='+v.rv);
  console.log('===== onNode end.');
}

onNode();