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


const v = {
  analyzeArg: () => { // querySelectorを単体で実行可能とするため定義
    console.log('----- analyzeArg start.');
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
      console.log('----- analyzeArg end.');
      return v.rv;
    } catch(e){
      // ブラウザで実行する場合はアラート表示
      if( typeof window !== 'undefined' ) alert(e.stack); 
      //throw e; //以降の処理を全て停止
      v.rv.stack = e.stack; return v.rv; // 処理継続
    }
  }  
};
if( typeof window === 'undefined' ){
  // コンソール(Node.js)で実行する場合の処理
  // node querySelector.js -i:(入力ファイル名) -o:(出力ファイル名) -t:(タグ出力) aaa bbb ...
  //   -f: 'text'(タグ出力無し、内部テキストのみ出力。既定値)
  //       'html'(タグ出力有り。innerHTMLとして使用可)
  //       'json'(JSONとして出力)

  // 事前処理：引数チェック、既定値の設定
  v.argv = v.analyzeArg();
  if('stack' in v.argv) throw v.argv;
  if( !('i' in v.argv.opt) ) throw new Error('入力ファイル指定がありません');
  if( v.argv.val.length === 0 ) throw new Error('セレクタ指定がありません');
  if( !('f' in v.argv) ) v.argv.f = 'text';

  // ファイルの読み込み、querySelectorの呼び出し
  v.fs = require('fs');
  v.content = v.fs.readFileSync(v.argv.opt.i,'utf-8');
  v.rv = querySelector(v.content,v.argv.val);
  if('stack' in v.rv) throw v.rv;

  // 結果の書き出し
  if( v.argv.opt.f === 'j' ){
    v.result = JSON.stringify(v.rv);
  } else {
    v.result = '';
    for( v.i=0 ; v.i<v.rv.length ; v.i++ ){
      v.r = v.rv[v.i];
      if( v.argv.opt.f === 'html' ){
        v.result += '<' + v.r.tag;
        if( v.r.attr ){
          for( v.j in v.r.attr ){
            v.result += ' ' + v.j + '="' + v.r.attr[v.j] + '"';
          }
        }
        v.result += '>\n';
      }
      v.result += v.r.inner + '\n';
      if( v.argv.opt.f === 'html' ){
        v.result += '</' + v.r.tag + '>\n'
      }
    }
  }
  if( 'o' in v.argv.opt ){
    v.content = v.fs.writeFileSync(v.argv.opt.o,v.result,'utf-8');  
  } else {  // 出力ファイル指定が無ければコンソールに出力
    console.log(v.result);
  }

} else {
  // Webアプリとして動作する場合の処理

  window.addEventListener('DOMContentLoaded',() => {

    // HTML欄に入力されたテキストからMarkdownを作成
    v.selector = String(document.querySelector('input[name="selector"]').value).trim();
    v.html = String(document.querySelector('textarea[name="html"]').value).trim();
    if( v.selector.length > 0 && v.html.length > 0 ){
      v.md = querySelector(v.html,v.selector);
      if( v.md.hasOwnProperty('stack') ) throw v.md;
      document.querySelector('textarea[name="result"]').value = JSON.stringify(v.md);
    }

    //querySelectorTest();

  });
}