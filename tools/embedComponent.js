/* ============================================
  embedComponent独自部分
============================================ */

/**
 * @desc テンプレート(HTML)のタグに含まれる'data-embed'属性に基づき、他文書から該当箇所を挿入する。
 * 
 * JavaScriptのライブラリ等、テンプレートが非HTMLの場合は処理できない。<br>
 * この場合、テンプレートを強引にHTML化して処理後、querySelector.jsで必要な部分を抽出するか、grep等で不要な部分を削除する。
 * 
 * - [JSDOMを利用し、HTML + JavaScriptのプログラムをNode.jsで動作させる](https://symfoware.blog.fc2.com/blog-entry-2685.html)
 * 
 * @param {Document} doc - 編集対象となるDocumentオブジェクト
 * @returns {Document} 挿入済みのDocumentオブジェクト
 * 
 * @example テンプレートのdata-embed書式
 * 
 * 1. JSON.parseするので、メンバ名もダブルクォーテーションで囲む
 * 1. 属性値全体はシングルクォーテーションで囲む
 * 
 * ```
 * data-embed="{
 *   from: {
 *     filename: {string} - 参照先のファイル名
 *     selector: {string} - CSSセレクタ文字列。省略時はファイル全文と解釈
 *   },
 *   to: {string}
 *      replace:自要素を中身で代替(embed要素は削除)
 *      svg: SVG画像(embed要素の子要素として追加)
 *      js: JavaScript(同上)
 *      css: CSS(同上)
 *      md: MarkDown(同上)
 *      mmd: Mermaid(同上)
 *      txt: その他形式のテキスト(同上)
 *      pu: PlantUMLのソースとしてIMGタグのsrc属性の値として設定
 *      その他: embed要素のその他属性の値として設定
 * }"
 * 
 * 例：
 * <div data-embed='{"from":{"filename":"../../component/analyzeArg.html","selector":"script.core"},"to":"replace"}'></div>
 * ```
 * 
 * - 例ではdata-embedはオブジェクトだが、文字列だった場合はfrom.filename(ファイル全文)と解釈
 * - JSON.parseで処理するため、属性名：値ともダブルクォーテーションで囲む
 */

const fs = require('fs'); // ファイル操作
const { JSDOM } = require("jsdom");
function embedComponent(doc){
  const v = {
    /**
     * 内部関数extract: 指定ファイルの指定箇所から文字列を抽出
     * @param {string} filename 
     * @param {string} selector 
     * @returns {string}
     */
    extract: (filename,selector='body') => {
      v.selector = selector;  // 変更の可能性があるので変数化
      v.refText = fs.readFileSync(filename,'utf-8').trim();
      // HTMLでなければbodyタグを付加
      v.isHTML = v.refText.toLowerCase()
      .match(/^<!doctype html.*?>|^<html.*?>[\s\S]+<\/html>/);
      if( !v.isHTML ){
        v.refText = '<!DOCTYPE html><html xml:lang="ja" lang="ja"><body>'
          + v.refText + '</body></html>';
        v.selector = 'body';
      }
      //console.log("v.refText="+v.refText);
      v.refDoc = new JSDOM(v.refText).window.document;
      v.extracted = '';
      // 複数ある場合があるので、querySelectorAllで順次追加
      v.refDoc.querySelectorAll(v.selector).forEach(element => {
        v.extracted += element.innerHTML;
      });
      return v.extracted;
    },
  };

  console.log('embedComponent start.');

  try {
    // data-embed属性を持つ要素をリスト化、順次処理
    doc.querySelectorAll('[data-embed]').forEach(element => {
      //console.log('l.35',element.getAttribute('data-embed'))
      // 既定値の設定
      v.embed = element.getAttribute('data-embed');
      if( v.embed.slice(0,1) === '{' ){
        v.embed = JSON.parse(v.embed);
      } else {
        v.embed = {from:{filename:v.embed}};
      }
      v.content = v.extract(v.embed.from.filename,v.embed.from.selector);

      // 処理タイプの判定
      v.suffix = analyzePath(v.embed.from.filename).suffix.toLowerCase() || 'txt';
      v.type = v.embed.to || v.suffix;

      // タイプ別に処理
      switch( v.type ){
        case 'replace': // 自要素を中身で代替(自要素削除)
          element.replaceWith(doc.createTextNode(v.content));
          break;
        
        case 'svg': // SVG画像
          // svg[position]を削除、imageタグを削除？
        case 'js': // JavaScript
        case 'css': // CSS
        case 'md': // MarkDown
        case 'mmd': // Mermaid
        case 'txt': // [既定値]その他形式のテキスト
          // v.contentを自要素のinnerHTMLにセット(自要素保持)
          element.innerHTML = v.content;
          break;

        case 'pu': // PlantUML -> img srcにセット(自要素保持)
          v.embed.to = 'src';
        default:  // 上記以外は設定すべき自要素の属性名
          // 属性の値として設定
          element.setAttribute(v.embed.to,v.content);
      }
      /*switch( v.embed.to ){
        case 'innerHTML':
          element.innerHTML = v.content; break;
        case 'innerText':
          element.innerText = v.content; break;
        case 'replace':
          element.replaceWith(doc.createTextNode(v.content));
          break;
        default:
          element.setAttribute(v.embed.to,v.content);
          break;
      }*/
      // テンプレートのembed属性は削除
      element.removeAttribute('data-embed');
    });

    console.log('embedComponent end.');
    return doc;

  } catch(e) {
    console.error(e);
    console.error("v="+JSON.stringify(v));
  }

}

/* embedComponentはブラウザ上での動作を想定しない
  window.addEventListener('DOMContentLoaded',() => {
  const v = {};
});*/

/**
 * コンソールで起動された際のパラメータ処理
 * @param {string} i - テンプレートファイル名。カレントフォルダからの相対パスで指定
 * @param {string} o - 出力ファイル名
 * @param {string} [t] - 出力タイプ
 * 
 * | 記号 | 出力タイプ |
 * | :--: | :-- |
 * | html | テンプレート(HTML)同様、HTMLとして出力(既定値) |
 * | text | bodyの中のみを、テキストとして出力 |
 * 
 */

function onNode(){
  console.log('onNode start.');
  const v = {};

  // テンプレートの読み込み、embedComponentの呼び出し
  v.argv = analyzeArg();
  v.argv.opt.t = v.argv.opt.t || 'html';
  v.template = fs.readFileSync(v.argv.opt.i,'utf-8');
  v.doc = new JSDOM(v.template).window.document;
  v.result = embedComponent(v.doc);

  if( v.argv.opt.t === 'html' ){
    v.rv = '<!DOCTYPE html><html xml:lang="ja" lang="ja">'
      + String(v.result.querySelector('html').innerHTML).trim()
        // HTML文字はエスケープされるので戻す
        .replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&')
      + '</html>';
  } else {
    v.rv = String(v.result.querySelector('body').innerHTML).trim()
      // HTML文字はエスケープされるので戻す
      .replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
  }
  fs.writeFileSync(v.argv.opt.o,v.rv,'utf-8');  

  console.log('onNode end.');
}

onNode();

/* ============================================
  既存ライブラリからの引用
============================================ */
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
    console.error('===== analyzeArg abnormal end.\n',e);
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}

function analyzePath(arg){
  console.log('===== analyzePath start.');
  const v = {rv:{}};
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

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== analyzePath end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}