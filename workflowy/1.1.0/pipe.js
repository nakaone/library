process.stdin.resume();
process.stdin.setEncoding('utf8');
const convert = require('xml-js');  // XMLをJSONに変換
//const marked = require('marked'); // MarkdownをHTMLに変換

var lines = [];; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', () => {
  const opt = {values:[]};
  for( let i=2 ; i<process.argv.length ; i++ ){
    const m = process.argv[i].match(/^(\-+)(\w+):(.*)$/);
    if( m && m[1].length > 0 ) opt[m[2]] = m[3];
    else opt.values.push(process.argv[i]);

  }
  console.log(workflowy(lines.join('\n'),opt));
});

/** workflowy: Markdown形式でエクスポートされた内容を修正
 * @param opml {string} - opmlテキスト
 * @param opt {Object} - オプション
 * @param opt.root {string} - 出力するルート要素のID。必須
 * @param opt.lv {number} - body直下を第1レベルとし、MarkDown化の際どのレベルまでheader化するかの指定
 * @returns {string} opmlから変換されたMarkdownテキスト
 */
function workflowy(opml,opt={}) {
  const pv = {whois: 'workflowy',
    opml: opml, // {string} 入力されたOPMLテキスト
    root: opt.root,  // ルート要素のID
    lv: Number(opt.lv) || 3,  // {number} オプションで渡されたlv。既定値3
    xml: JSON.parse(convert.xml2json(opml)),  // {Object} opml(XML)をxml2jsonでJSON化、オブジェクト化
    id: 1,  // {number} 自動採番する際の次回番号
    outlines: new Map(),  // {Map} 入力ファイルに存在する全てのoutlineタグオブジェクト
    docs: new Set(), // {Set} ルート要素以下の、文書化対象要素のid文字列
    anchors: new Set(),  // {Set} 文書化対象要素が持つanchor文字列(a name)
    links: new Set(), // {Set} 文書化対象要素から参照している要素のid文字列
    anchorRex: /^(.+)\s*\(([a-z0-9]{12})\)\s*$/,  // {RegExp} outline.textの文言とアンカーを取得する正規表現
    linkRex: /<a href="https:\/\/workflowy\.com\/#\/([a-z0-9]{12})">(.+)<\/a>/g,  // {RegExp} 設定されているローカルリンクを取得する正規表現
  };
  const util = {
    getId: () => {return 'A' + ('00000' + (pv.id++)).slice(-6)},  // 自動採番したIDを取得
    reduct: x => {return x.replaceAll(/&lt;/g, '<').replaceAll(/&gt;/g, '>')},  // HTML文字列を有効にするよう還元
  }

  // ----------------------------------------------
  // 主処理
  // ----------------------------------------------
  // opmlをパースしたオブジェクトを分析、outlineオブジェクトを作成
  objectifyXML({obj:pv.xml});

  // text文字列内のリンク設定について、子要素の追加・a.hrefへの変換を行う
  pv.outlines.forEach(outline => expandLink(outline));

  // 文書化対象要素について、Markdown文書化
  const scoped = scopedDocument(pv.outlines.get(pv.root)).join('\n');

  // ルート要素から外れた非文書化対象要素の内、文書化対象要素からのリンクが存在する要素のMarkdown文書化
  const appendix = outOfScope();

  // 処理結果の確認
  /*
  const rv = pv.outlines.get(pv.root);
  delete rv.opml; delete rv.xml;
  return rv;
  */
  return scoped;

  /** objectifyXML: opmlをパースしたオブジェクトを分析、outlineオブジェクトを作成
   * @param {Object} arg
   * @param {Object} arg.obj - opmlをxml2jsonでパースしたオブジェクト
   * @param {number} arg.depth - opml文書内の階層
   * @param {string[]} arg.ancestor - outlineタグのルート要素から親要素までのIDの配列
   */
  function objectifyXML(arg){

    // 引数に既定値を適用
    arg = Object.assign({
      depth: 0,
      ancestor: [],
    },arg);

    // opml > bodyタグ発見時、depthをリセット
    if (arg.obj.name === 'body') depth = 0;

    // outlineタグの場合、markdown化
    const outline = { id: null, children: [] };
    if (arg.obj.name === 'outline' && arg.obj.attributes) {
      
      // Backlinksは処理対象外、子要素の再帰も無し。なお"Backlink"は1なら単数形、2以上は複数形
      if (arg.obj.attributes.text.match(/^\d+ Backlinks?$/)) return null;

      // outlineオブジェクトのプロトタイプ作成、pv.outlinesに登録
      m = arg.obj.attributes.text.match(pv.anchorRex);
      Object.assign(outline,{
        id: m ? m[2] : util.getId(),
        text: util.reduct(m ? m[1] : arg.obj.attributes.text).trim(),
        anchor: m ? m[2] : null,  // アンカーだった場合ID文字列
        link: [...arg.obj.attributes.text.matchAll(pv.linkRex)],  // textに含まれたリンク
        note: arg.obj.attributes._note  // ローカルリンクをMD形式に変換
        ? util.reduct(arg.obj.attributes._note.replaceAll(pv.linkRex, "[$2](#$1)")).trim() : '',
        ancestor: arg.ancestor,
      });
      pv.outlines.set(outline.id, outline);  // outline一覧に追加
    }

    // elements(子要素)が有った場合、再帰呼出
    if (Array.isArray(arg.obj.elements)) {
      arg.obj.elements.forEach(o => {
        const r = objectifyXML({
          obj:o,
          depth: arg.depth + 1,
          ancestor: outline.id === null ? [] : [...outline.ancestor,outline.id],
        });
        // Backlinks以外の場合は子要素として追加
        if (r !== null) outline.children.push(r);
      });
    }
    return outline;
  }

  /** expandLink: text文字列内のリンク設定について、子要素の追加・a.hrefへの変換を行う
   * @param {Object} outline - objectifyXMLで作成したoutlineオブジェクト
   * @returns {void}
   */
  function expandLink(outline){
    // copyChildren: リンク先子要素をコピーする内部関数
    function copyChildren(id){
      const cc = o => {
        o.id = util.getId(); // idは新規採番
        //pv.doc.add(o.id); // 文書化要素一覧に追加
        o.text = o.text.replaceAll(/<a name="[a-z0-9]{12}">(.+?)<\/a>/g,"$1");  // a nameタグは削除
        o.children.forEach(x => cc(x)); // 子孫を再帰呼出
      }
      // 子孫を含めてまるごとコピー
      const rv = JSON.parse(JSON.stringify(pv.outlines.get(id).children));
      rv.forEach(o => cc(o));
      return rv;
    }

    if (outline.link.length > 0) {
      outline.link.forEach(link => {
        const parent = pv.outlines.get(outline.ancestor[outline.ancestor.length-1]);
        const idx = parent.children.findIndex(x => x.id === outline.id);
        if (link[2].match(/^\[▽\]/)) {
          // ▽ : リンク元要素の弟要素としてリンク先子要素を追加
          // ⇒ parent.childrenのリンク元要素の次に、リンク先子要素を挿入
          parent.children.splice(idx + 1, 0, ...copyChildren(link[1]));
          // ローカルリンクは削除
          outline.text = outline.text.replaceAll(pv.linkRex, "$2");
        } else if (link[2].match(/^\[▼\]/)) {
          // ▼ : リンク元要素を削除し、リンク先子要素をリンク元要素と同じレベルで追加
          // ⇒ parent.childrenのリンク元要素を削除、その位置にリンク先子要素のIDを挿入
          parent.children.splice(idx, 1, ...copyChildren(link[1]));
          // ローカルリンクは削除
          outline.text = outline.text.replaceAll(pv.linkRex, "$2");
        } else {
          // 無印 : hrefに置換。リンク先要素への置換・リンク先子要素の追加はしない
          // hrefにリンク先要素のIDを追加
          //outline.href = [...outline.href, [...outline.text.matchAll(linkRex)].map(x => x[1])];
          // ローカルリンクをa.hrefに変換
          outline.text = outline.text.replaceAll(pv.linkRex, "<a href=\"#$1\">$2</a>");
        }
      });
    }

  }

  /** scopedDocument: 指定ルート要素配下のoutlineオブジェクトをMarkdown文書に変換
   * @param {Object} outline - outlineオブジェクト
   * @param {number} depth - 指定ルート要素を1とした階層
   */
  function scopedDocument(outline,depth=1){
    let rv = [];
    if (depth > pv.lv) {
      // ヘッダ化指定階層より深い場合 ⇒ liタグで階層化
      rv.push(`${'\t'.repeat(depth - pv.lv - 1)}- ${outline.text}`);
      outline.note.split('\n').forEach(l => rv.push('\t'.repeat(depth - pv.lv) + l));
    } else {
      // ヘッダ化指定階層より浅い場合 ⇒ '#'で階層化
      rv.push(`${'#'.repeat(depth)} ${outline.text}`);
      outline.note.split('\n').forEach(l => rv.push(l));
    }
    if (outline.children.length > 0) outline.children.forEach(c => {
      rv = [...rv,...scopedDocument(c, depth + 1)];
    });
    return rv;
  }

  function outOfScope(){
    // 文書化対象要素から参照される非文書化対象要素をリストアップ
    // リストアップされた非文書化対象要素から参照される要素を再帰的に検索、リストに追加
    // opml内の出現順にリストに存在する要素を文書化
  }
}