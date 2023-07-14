const fs = require('fs');  // ファイル操作
const lib = require('./jsLib');  // 自作ライブラリ
const { JSDOM } = require("jsdom");

/**
 * 編集対象となるHTMLに含まれる'data-embed'属性に基づき、他文書から該当箇所を挿入する
 * @param {Document} doc - 編集対象となるDocumentオブジェクト
 * @returns {HTMLElement} 挿入済みのHTML文書(但、doctype,htmlタグは含まない)
 */
function embedElement(doc){
  console.log('===== embedElement start.');
  const v = {rv:doc.querySelector('html'),base:''};
  try {

    v.rv.querySelectorAll('[data-embed]').forEach(o => {
      v.tagName = o.tagName.toLowerCase();
      v.embed = o.getAttribute('data-embed');
      //console.log(lib.whichType(v.embed)+'->'+v.embed);
      if( v.tagName === 'meta' ){
        v.base = v.embed;
      } else {
        v.embed = JSON.parse(v.embed);
        v.content = fs.readFileSync(v.base+v.embed.src,'utf-8');
        v.doc = new JSDOM(v.content).window.document;
        v.node = v.doc.querySelector(v.embed.sel);
        //console.log('l.21',v.node.innerHTML);
        if( v.tagName === 'style' || v.tagName === 'script' ){
          o.innerHTML = v.node.innerHTML;
        } else {
          o.appendChild(v.node);
        }
        o.removeAttribute('data-embed');
      }
      //console.log('l.10',v.tagName,v.embed);
    });

    console.log('===== embedElement end.');
    return v.rv;
  } catch(e){
    console.error('===== embedElement abnormal end.\n',e);
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}

/**
 * @desc コンソール(Node.js)でembedElementを実行
 * 
 * 以下はnodeの起動時オプションで指定するパラメータ。
 * @param {string} [d='prototype.html'] - 入力ファイルのパス＋ファイル名
 * @param {string} i - 挿入先となるベースファイルのパス＋ファイル名
 * @param {string} o - 挿入後の結果を出力するファイルのパス＋ファイル名
 * @returns {void}
 * 
 * - 引数無しのパラメータはJSON文字列なので、コマンドライン上はシングルクォーテーションで囲む
 * - JSON文字列は長くなりがちなので、スイッチのないパラメータは全て結合した上で解釈する
 * 
 * @example
 * 
 * **起動コマンド**
 * 
 * ```
 * node embedElement.js -i:base.html -o:webScanner.html
 * ```
 * 
 * **挿入先となるベースファイル**
 * 
 * ```
 * <!DOCTYPE html><html xml:lang="ja" lang="ja">
 * <head>
 *   <title>webScanner</title>
 *   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 *   <!-- 外部参照はbaseに直接転記 -->
 *   <link rel="stylesheet" href="/Users/ena.kaon/Desktop/GitHub/library/CSS/szDefault.css" />
 *   <meta data-embed='/Users/ena.kaon/Desktop/GitHub/library/JavaScript/'>
 *   <style data-embed='{"src":"webScanner.html","sel":".webApp"}'></style>
 * </head>
 * <body>
 *   <div data-embed='{"src":"webScanner.html","sel":".webScanner"}'></div>
 * 
 *   <!-- 外部参照はbaseに直接転記 -->
 *   <script src="jsLib.js"></script>
 *   <!-- QRコード検出 -->
 *   <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
 *   <script data-embed='{"src":"webScanner.html","sel":".core"}'></script>
 * </body></html>
 * ```
 * 
 * - data-embedの属性値はJSON化するため、メンバ名・値は`"`で・全体を`'`で囲む
 * - `<meta data-embed='〜'>`は以降のdata-embed内でのファイル指定の基点となるパスを指定
 * - metaタグ以外のdata-embedは`{src:参照先ファイル名,sel:挿入元要素のCSSセレクタ}`で指定
 * 
 * **挿入後の出力ファイル**
 * 
 * ```
 * <!DOCTYPE html><html xml:lang="ja" lang="ja"><head>
 *   <title>webScanner</title>
 *   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 *   <!-- 外部参照はbaseに直接転記 -->
 *   <link rel="stylesheet" href="/Users/ena.kaon/Desktop/GitHub/library/CSS/szDefault.css">
 *   <!-- meta data-embed: 以降のdata-embed内でのファイル指定の基点となるパス -->
 *   <meta data-embed="/Users/ena.kaon/Desktop/GitHub/library/JavaScript/">
 *   <style>  // 挿入された部分
 *     .webScanner div {
 *     (中略)
 *   </style>
 * </head>
 * <body>
 *   <div><div class="webApp webScanner">　  // 挿入された部分
 *     <h1>class webScanner test</h1>
 *     <p>実運用時には script src の読み込み先を修正する</p>
 *     <div class="scanner"></div>
 *     <img src="" style="border:solid 5px red">
 *   </div></div>
 * 
 *   <!-- 外部参照はbaseに直接転記 -->
 *   <script src="jsLib.js"></script>
 *   <!-- QRコード検出 -->
 *   <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
 *   <script>  // 挿入された部分
 * /&#042;&#042;
 *  &#042; @classdesc 指定セレクタ以下にcanvas他の必要な要素を作成し、QRコードや文書をスキャン
 *  &#042;/
 * 
 * class webScanner {
 *   (中略)
 * }
 * </script>
 * </body></html>
 * ``` 
 * 
 * - [JSDOMを利用し、HTML + JavaScriptのプログラムをNode.jsで動作させる](https://symfoware.blog.fc2.com/blog-entry-2685.html)
 */

function onNode(){
  const v = {};

  // 事前処理：引数チェック、既定値の設定
  if('stack' in (v.argv = lib.analyzeArg())) throw v.argv;

  // ベース(挿入先)ファイルの読み込み
  v.text = fs.readFileSync(v.argv.opt.i,'utf-8');
  v.m = v.text.match(/(^.*<html.*?>)([\s\S]*)(<\/html.+)$/);
  v.header = v.m[1] || '<!DOCTYPE html><html xml:lang="ja" lang="ja">';
  v.footer = v.m[3] || '</html>';

  v.rv = v.header + embedElement(new JSDOM(v.text).window.document).innerHTML + v.footer;
  console.log(v.rv);
  fs.writeFileSync(v.argv.opt.o,v.rv,'utf-8');  

}

onNode();