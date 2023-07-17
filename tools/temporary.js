/* コアスクリプト */
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
 * ```
 * // SVG：embed指定要素の子要素としてSVG追加
 * <div name="案内図"><div class="img" data-embed="map2023.svg"></div></div>
 * -> <div name="案内図"><div class="img"><svg id="exportSVG"〜
 * 
 * // PlantUML：指定要素の子要素として、隠蔽された要素を追加。兄弟にIMG要素が必要
 * <div name="日程表"><div class="PlantUML"  data-embed="schedule.pu"><img /></div></div>
 * -> <div name="日程表"><div class="PlantUML"><img><div style="display:none">@startgantt〜
 * 
 * // PNG：自要素(IMG)のsrc属性の値としてbase64文字列を追加
 * <div name="校内探検"><img width="600px" data-embed='{"from":{"filename":"expedition.txt"},"to":"png"}' /></div>
 * -> <div name="校内探検"><img width="600px" src="data:image/png;base64,iVBORw0KG〜
 * 
 * // MarkDown：自要素のinnerTextとして追加
 * <div class="markdown" name="6/10定例会" data-embed="20230610.md"></div>
 * -> <div class="markdown" name="6/10定例会">1. 日程：9/23〜24 or **9/30〜10/01**(第一候補)
 * 
 * // 自作ライブラリ(通常関数)
 * <script type="text/javascript" data-embed='{"from":{"filename":"../../component/mergeDeeply.html","selector":"script.core"},"to":"js"}'><／script>
 * 
 * // 既存クラスの拡張
 * <script type="text/javascript" data-embed='{"from":{"filename":"../../component/Array.tabulize.html","selector":"script.core"},"to":"js"}'><／script>
 * 
 * // CSS指定付きのクラス(style,script両方を指定)
 * <style type="text/css" data-embed='{"from":{"filename":"../../component/TimeTable.html","selector":"style.core"},"to":"css"}'></style>
 * <script type="text/javascript" data-embed='{"from":{"filename":"../../component/TimeTable.html","selector":"script.core"},"to":"js"}'><／script>
 * ```
 * 
 * **data-embedに指定する文字列**
 * 
 * ```
 * data-embed="ファイル名"  // 文字列だった場合はfrom.filename(ファイル全文)と解釈。拡張子でtoを指定
 * or
 * data-embed='{  // JSON形式だった場合、囲み記号はシングルクォーテーション
 *   "from": {    // メンバ名・値ともダブルクォーテーションで囲む
 *     "filename": "{string}" - 参照先のファイル名
 *     "selector": "{string}" - CSSセレクタ文字列。省略時はファイル全文と解釈
 *   },
 *   "to": "{string}" - 出力先に対する指定
 *      replace:自要素を中身で代替(embed要素は削除)
 *      svg: SVG画像(embed要素の子要素として追加)
 *      js: JavaScript(同上)
 *      css: CSS(同上)
 *      md: MarkDown(同上)
 *      mmd: Mermaid(同上)
 *      txt: その他形式のテキスト(同上)
 *      pu: PlantUMLのソースとしてIMGタグのsrc属性の値として設定
 *      その他: embed要素のその他属性の値として設定
 * }'
 * ```
 */

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
          // MDN position
          // https://developer.mozilla.org/ja/docs/Web/CSS/position
        case 'js': // JavaScript
        case 'css': // CSS
        case 'md': // MarkDown
        case 'mmd': // Mermaid
        case 'txt': // [既定値]その他形式のテキスト
          // v.contentを自要素のinnerHTMLにセット(自要素保持)
          element.innerHTML = v.content;
          break;

        case 'png':
          element.setAttribute('src','data:image/png;base64,'+v.content);
          break;
        case 'pu': // PlantUML -> 隠蔽されたdiv.PlantUMLを子要素に追加(自要素保持)
          element.innerHTML += '<div style="display:none">' + v.content + '</div>';
          break;
        default:  // 上記以外は設定すべき自要素の属性名
          // 属性の値として設定
          element.setAttribute(v.embed.to,v.content);
      }
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
