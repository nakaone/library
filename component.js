/*
  注意：v.listでquerySelectorAll用のCSSセレクタを指定しているが、入れ子にならないように指定する。
  ```
  <div class="source">
    fuga
    <div class="source"> <!-- ←親要素と入れ子 -->
      hoge
    </div>
  </div>

  ■ 結果：親要素と子要素、二重に出力される
  {"tag":"DIV","attrs":[{"name":"class","value":"source"}],"text":"fuga\n    <div class=\"source\"> <!-- ←親要素と入れ子 -->\n      hoge\n    </div>"},
  {"tag":"DIV","attrs":[{"name":"class","value":"source"}],"text":"<!-- ←親要素と入れ子 -->\n      hoge"}
  ```
*/

function component(){
  const v = {rv:null,
    component:process.argv[2],  // {string} 引数。コンポーネント(パス付)ファイル名
    fs: null, // {File} ファイル読み込み時のオブジェクト
    content: '', // {string} ファイルの中身(未加工)
    output: { // {string} 出力ファイルの拡張子
      css:'css',extStyle:'ext.css',extScript:'ext.js',html:'html',js:'js',md:'md'},
    sections: {
      extStyle: {  // 11.外部スタイルシート
        selector: 'link[href]', output: ['extStyle']},
      style: {  // 12.独自定義スタイル
        selector: 'style.source', output: ['css']},
      jsdoc: {  // 21.ソース内JSDoc
        selector: 'style.jsdoc[type="text/markdown"]', output: ['node']},
      doc: {  // 22.JSDoc以外のMarkdown
        selector: 'style.doc[type="text/markdown"]', output: ['node']},
      testDoc: {  // 23.テスト仕様書
        selector: 'style.testDoc[type="text/markdown"]', output: []},
      HTML: {  // 24.コンポーネントのHTML
        selector: 'div.source', output: ['html']},
      extScript: {  // 31.外部スクリプト
        selector: 'script[src]', output: ['ext','node']},
      sourceScript: {  // 32.コンポーネントのスクリプト部
        selector: 'script.source', output: ['src','node']},
      testScript: {  // 33.テストでのみ使用するスクリプト
        selector: 'script.test', output: []},
      appScript: {  // 34.オンラインツールモードでのみ使用するスクリプト
        selector: 'script.app', output: []},
    },
  };
  //console.log('component start. argv="'+v.component+'"');
  try {

    if( process.argv.length < 3 ){
      console.log('Error: bad argument.\nuseage: `node component.js (component filename with path)`');
    }
    v.filename = analyzePath(v.component);
    ['css','ext','html','js','md'].forEach(x => v.output[x] = {
      path: v.filename.path+'/parts/'
    });
    console.log(v.filename);

    // ファイルの読み込み
    v.fs = require('fs');
    //v.content = v.fs.readFileSync(v.component,'utf-8');

    /*
    // 読み込んだ内容をDOM化
    // [Node.jsのサーバサイドでDOMを使う](https://moewe-net.com/nodejs/jsdom)
    const { JSDOM } = require("jsdom");
    const { document } = new JSDOM(v.content).window;
    for( v.l in v.list ){
      v.elements = document.querySelectorAll(v.list[v.l]);
      v.elements.forEach(element => {
        v.tag = {
          tag:element.tagName,
          attrs:[],
          //text:element.textContent.trim() // NG:div内部のdiv等、入れ子になっているとテキストのみ抽出
          text: String(element.innerHTML).trim()
        };
        v.attrs = element.attributes;
        for( v.i=0 ; v.i<v.attrs.length ; v.i++ ){
          v.tag.attrs.push({name:v.attrs[v.i].name,value:v.attrs[v.i].value});
        }
        console.log('\n===== '+v.l+': '+JSON.stringify(v.tag));
      });
    }
    */

  } catch(e){
    if( typeof window !== 'undefined' ) alert(e.stack); // ブラウザで実行する場合はアラート表示
    throw e; //以降の処理を全て停止
    //v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}

function analyzePath(arg){  // 将来的にはライブラリから引用
  const v = {rv:{}};
  console.log('analyzePath start. arg="'+arg+'"');
  try {

    v.m1 = arg.match(/^(.*)\/([^\/]+)$/);
    if( v.m1 ){
      v.rv.path = v.m1[1] + '/';
      v.rv.file = v.m1[2];
    } else {
      v.rv.path = '';
      v.rv.file = arg;
    }
    v.m2 = v.rv.file.match(/^(.+)\.([^\.]+?)$/);
    if( v.m2 ){
      v.rv.base = v.m2[1];
      v.rv.suffix = v.m2[2];
    } else {
      v.rv.base = v.rv.file;
      v.rv.suffix = '';
    }

    console.log('analyzePath end. rv='+JSON.stringify(v.rv));
    return v.rv;

  } catch(e){
    if( typeof window !== 'undefined' ) alert(e.stack); // ブラウザで実行する場合はアラート表示
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}

component();