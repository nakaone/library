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
    extract: (filename,selector) => {
      v.refText = fs.readFileSync(filename,'utf-8').trim();
      // HTMLでなければbodyタグを付加
      v.isHTML = v.refText.toLowerCase()
      .match(/^<!doctype html.*?>|^<html.*?>[\s\S]+<\/html>/);
      if( !v.isHTML ){
        v.refText = '<!DOCTYPE html><html xml:lang="ja" lang="ja"><body>'
          + v.refText + '</body></html>';
      }
      v.refDoc = new JSDOM(v.refText).window.document;
      v.extracted = '';
      // 複数ある場合があるので、querySelectorAllで順次追加
      v.refDoc.querySelectorAll(selector).forEach(element => {
        v.extracted += element.innerHTML;
      });
      return v.extracted;
    },
  };

  console.log('embedComponent start.');

  // data-embed属性を持つ要素をリスト化、順次処理
  doc.querySelectorAll('[data-embed]').forEach(element => {
    v.embed = JSON.parse(element.getAttribute('data-embed'));
    v.content = v.extract(v.embed.from.filename,v.embed.from.selector);

    // 置換ルールに従って処理
    switch( v.embed.to ){
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
    }
    // テンプレートのembed属性は削除
    element.removeAttribute('data-embed');
  });

  console.log('embedComponent end.');
  return doc;
}

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