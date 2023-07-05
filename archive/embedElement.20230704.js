/* 2023/07/05 開発中断
  HTMLベースで他ファイルから要素を挿入しようとしたが、
  - 完成したhtmlをテキストで出力できない(<html>.innerHTMLは可能だがdoctypeやhtml自身がでない)
  - 何をどこに挿入するかの指定が別ファイルとなり管理が煩雑(ex.xxx.sh)
*/

const { whichType } = require("../lib/jsLib");

/**
 * @typedef {Object} EmbedElementSelector - embedElementの位置指定オブジェクト
 * @prop {string} from - 挿入元要素のCSSセレクタ。挿入元は複数箇所でも可
 * @prop {Function} cmd - 追加する要素の属性変更を行う関数
 * @prop {string} to - 挿入先箇所のCSSセレクタ。挿入先は一意になるよう指定
 * @prop {boolean} prepend=false - trueなら挿入先要素の長子に、falseなら末子に追加
 * 
 * @example
 * ```
 * {
 *   from   : "script.core",      // 挿入元要素のCSSセレクタ
 *   cmd    : (o)=>{              // 追加要素のclassに'hoge'を追加
 *     o.classList.add('hoge');
 *   },
 *   to     : "html",             // 挿入先箇所のCSSセレクタ
 *   prepend: false               // </html>の直前に挿入
 * }
 * ```
 */

/**
 * @desc HTMLの指定CSSセレクタの内容を抽出
 * @param {HTMLElement} dest -  挿入先(HTML)の全ソース
 * @param {HTMLElement} src - 挿入元の要素が含まれているテキスト(HTML)
 * @param {EmbedElementSelector[]} selectors - 挿入作業の情報
 * @returns {string} 挿入先に挿入元の要素を挿入した結果の全ソース
 */

function embedElement(dest,src,selectors){
  console.log('===== embedElement start.');
  //console.log(dest,src,selectors);
  const v = {rv:dest.cloneNode(true)};
  try {

    for( v.s of selectors ){  // セレクタ毎に順次処理
      console.log(v.s);
      src.querySelectorAll(v.s.from).forEach(element => {  // 挿入する要素を抽出
        v.element = element.cloneNode(true);
        console.log('l.41',JSON.stringify(v.element.classList))
        v.element = v.s.cmd(v.element); // 属性情報を変更
        console.log('l.43',JSON.stringify(v.element.classList))
        v.to = v.rv.querySelector(v.s.to);
        console.log('l.45',v.to)
        if( v.s.prepend ){  // 要素を追加
          v.to.prependChild(v.element);
        } else {
          v.to.appendChild(v.element);
        }
      });
    }

    console.log('l.54',v.rv.querySelector('html').innerHTML); // OK
    //NG console.log('l.54',v.rv.body.innerHTML);
    //undefined console.log('l.54',v.rv.innerHTML);
    //NG console.log('l.54',v.rv.querySelector('html').parentElement.innerHTML);
    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== embedElement end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack);
    console.error(e.stack);
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}

/**
 * @desc コンソール(Node.js)でembedElementを実行
 * 
 * 以下はnodeの起動時オプションで指定するパラメータ。
 * @param {string} [d='prototype.html'] - 入力ファイルのパス＋ファイル名
 * @param {string} s - 挿入する要素のソースが存在するファイルのパス＋ファイル名
 * @param {string} [o=Null] - 出力ファイル名。Nullの場合はコンソール出力
 * @param {EmbedElementSelector[]} (スイッチ無し) - 挿入する要素を特定するCSSセレクタ(JSON)
 * @returns {void}
 * 
 * - 引数無しのパラメータはJSON文字列なので、コマンドライン上はシングルクォーテーションで囲む
 * - JSON文字列は長くなりがちなので、スイッチのないパラメータは全て結合した上で解釈する
 * 
 * @example
 * ```
 * node embedElement.js \
 *    -d:./prototype.html \
 *    -s:../lib/webScanner.html \
 *    -o:../JavaScript/webScanner.html '[' \
 *    '{from:"script.core",cmd:(o)=>o.classList.add("hoge"),to:"html",prepend:false},' \
 *    ']'
 * ```
 * 
 * - [JSDOMを利用し、HTML + JavaScriptのプログラムをNode.jsで動作させる](https://symfoware.blog.fc2.com/blog-entry-2685.html)
 */

function onNode(){
  const v = {
    fs: require('fs'),  // ファイル操作
    lib:require('../lib/jsLib'),  // 自作ライブラリ
  };
  const { JSDOM } = require("jsdom");

  // 事前処理：引数チェック、既定値の設定
  if('stack' in (v.argv = v.lib.analyzeArg())) throw v.argv;
  if( !('d' in v.argv.opt) ) v.argv.opt.d = 'prototype.html';
  if( !('o' in v.argv.opt) ) v.argv.opt.o = null;
  //console.log(v.argv);

  // 挿入先・挿入元・入力ファイルの読み込み、embedElementの呼び出し
  v.dest = new JSDOM(v.fs.readFileSync(v.argv.opt.d,'utf-8')).window.document;  // 挿入先のファイル
  console.log('l.111',whichType(v.dest),v.dest)
  v.src = new JSDOM(v.fs.readFileSync(v.argv.opt.s,'utf-8')).window.document;  // 挿入元の要素を持つファイル
  v.selectors = JSON.parse(v.argv.val.join(''));
  //console.log('v.selectors='+whichType(v.selectors),v.selectors);
  console.log('l.114',v.dest,'\n',JSON.stringify(v.dest.querySelector('html').attributes));
  v.selectors.forEach(o => {
    o.cmd = eval(o.cmd);  // cmdを関数化
    o.prepend = o.prepend || false; // 既定値false
  });
  v.rv = embedElement(v.dest,v.src,v.selectors);
  console.log('l.115',v.rv.innerHTML);

  /*
node embedElement.js -s:../JavaScript/webScanner.html \
'[{"from":"style.webApp",' \
'"cmd":"o=>{console.log(o.classList.value);o.classList.add(\"hoge\");console.log(o.classList.value);return o;}",' \
'"to":"head"}]'

node embedElement.js -s:../JavaScript/webScanner.html \
'[{"from":"style.webApp",' \
'"cmd":"(o)=>{return o.classList.add(\"hoge\");}",' \
'"to":"head"}]'
*/
/*
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
  */
}

onNode();

/* requireTest -----------------------------
(()=>{
  const v = {}
  v.lib = require('../lib/jsLib');
  console.log('requireTest',whichType(v));
})()
*/