const fs = require('fs'); // ファイル操作
const { JSDOM } = require("jsdom");
const lib = require('./CommonJS'); // 自作ライブラリ

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
 *   to: {string} [innerHTML|innerText|xxx|child],
 *     innerHTML : data-embedが記載された要素のinnerHTMLとする
 *     innerText : data-embedが記載された要素のinnerTextとする
 *     xxx : 属性名xxxの値とする
 *     replace : data-embedを持つ要素を置換する
 *   type: {string} [html,pu,md,mmd,text]
 *     html : テンプレート(HTML)同様、HTMLとして出力(既定値)
 *     pu : PlantUMLとして子要素を生成して追加
 *     md : MarkDownとして子要素を生成して追加
 *     mmd : Mermaidとして子要素を生成して追加
 *     text : bodyの中のみを、テキストとして出力
 * }"
 * 
 * 例：
 * <div data-embed='{"from":{"filename":"../../component/analyzeArg.html","selector":"script.core"},"to":"replace"}'></div>
 * ```
 * 
 */



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
  v.argv = lib.analyzeArg();
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