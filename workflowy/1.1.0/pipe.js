process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = [];; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', () => {
  // `node pipe.js markdown xxxxxxxx n`形式ならnはopt.mdHeaderと看做す
  const option = process.argv[4] && !Number.isNaN(process.argv[4])
    ? { mdHeader: Number(process.argv[4]) } : {};
  const wf = workflowy(option);
  const text = lines.join('\n');
  switch (process.argv[2]) {
    case 'sample':
      console.log(wf.sample(text));
      break;
    case 'markdown':
    default:
      console.log(wf.markdown(text, process.argv[3]));
  }
});

/** workflowy: Markdown形式でエクスポートされた内容を修正 */
function workflowy(option = {}) {
  const convert = require('xml-js');
  const pv = { whois: 'workflowy', id: 1, map: new Map(), anchor: new Set(), link: new Set()};
  pv.opt = Object.assign({
    mdHeader: 3,  // body直下を第1レベルとし、MarkDown化の際どのレベルまでheader化するかの指定
  }, option);
  return { markdown: markdown, sample: sample };

  /** markdown: outlineタグをpv.mapに格納
   *
   * @param {*} obj
   * @param {*} parent
   * @param {*} depth
   * @returns
   * ローカルリンクが有った場合、子要素または兄弟要素に追加
   * 無印 : hrefに置換。リンク先要素への置換・リンク先子要素の追加はしない
   * ■ : リンク元要素をリンク先要素に置換。(従来のリンク元子要素は削除)
   * ▽ : リンク元要素の弟要素としてリンク先子要素を追加
   * ▼ : リンク元要素を削除し、リンク先子要素をリンク元要素と同じレベルで追加
   */
  function markdown(obj, parent = null, depth = 0, isClan = false) {
    let rv = []; let m;
    const anchorRex = /^(.+)\s*\(([a-z0-9]{12})\)\s*$/;
    const linkRex = /<a href="https:\/\/workflowy\.com\/#\/([a-z0-9]{12})">(.+)<\/a>/g;
    if (typeof obj === 'string') {
      // 再帰呼出前、最初に呼ばれた時の処理

      // 変換対象のルート要素を保存
      [pv.root, parent] = parent ? [parent, null] : ['X000001', null];

      // outlineタグを再帰的にオブジェクト化
      obj = JSON.parse(convert.xml2json(obj));
      markdown(obj);

      // ローカルリンクを展開
      pv.map.forEach(outline => {
        // textにリンク設定が有った場合、ローカルリンクを展開
        if (outline.link.length > 0) {
          outline.link.forEach(link => {
            const parent = pv.map.get(outline.parent);
            const idx = parent.children.findIndex(x => x === outline.id);
            if (link[2].match(/^\[▽\]/)) {
              // ▽ : リンク元要素の弟要素としてリンク先子要素を追加
              // ⇒ parent.childrenのリンク元要素の次に、リンク先子要素を挿入
              parent.children.splice(idx + 1, 0, ...pv.map.get(link[1]).children);
              // ローカルリンクは削除
              outline.text = outline.text.replaceAll(linkRex, "$2");
            } else if (link[2].match(/^\[▼\]/)) {
              // ▼ : リンク元要素を削除し、リンク先子要素をリンク元要素と同じレベルで追加
              // ⇒ parent.childrenのリンク元要素を削除、その位置にリンク先子要素のIDを挿入
              parent.children.splice(idx, 1, ...pv.map.get(link[1]).children);
              // ローカルリンクは削除
              outline.text = outline.text.replaceAll(linkRex, "$2");
            } else {
              // 無印 : hrefに置換。リンク先要素への置換・リンク先子要素の追加はしない
              // hrefにリンク先要素のIDを追加
              outline.href = [...outline.href, [...outline.text.matchAll(linkRex)].map(x => x[1])];
              // ローカルリンクをa.hrefに変換
              outline.text = outline.text.replaceAll(linkRex, "<a href=\"#$1\">$2</a>");
            }
          });
        }
        // デバッグ用 rv.push(JSON.stringify(outline));
      });

      // リンク切れをチェック
      // Set.differenceは使用不可(TypeError: pv.anchor.difference is not a function)
      const anchors = [...pv.anchor.keys()];
      const links = [...pv.link.keys()];
      rv = ['# [作業用]リンク切れ一覧\n', '## 被参照(anchor)のみ存在\n'];
      anchors.filter(x => !links.includes(x)).forEach(x => rv.push(`1. ${x}`));
      rv.push('\n## 参照(href)のみ存在\n');
      links.filter(x => !anchors.includes(x)).forEach(x => rv.push(`1. ${x}`));
      rv.push('\n');

      // markdown文書化
      function md(outline, depth = 1) {
        if (depth > pv.opt.mdHeader) {
          rv.push(`${'\t'.repeat(depth - pv.opt.mdHeader - 1)}- ${outline.text}`);
          outline.note.split('\n').forEach(l => rv.push('\t'.repeat(depth - pv.opt.mdHeader) + l));
        } else {
          rv.push(`${'#'.repeat(depth)} ${outline.text}`);
          outline.note.split('\n').forEach(l => rv.push(l));
        }
        if (outline.children.length > 0) outline.children.forEach(c => {
          md(pv.map.get(c), depth + 1);
        });
      }
      md(pv.map.get(pv.root));
      return rv.join('\n'); // 備考：使わないようなら、depthの再帰内での設定は削除

    } else {
      // opml > bodyタグ発見時、depthをリセット
      if (obj.name === 'body') depth = 0;

      // outlineタグの場合、markdown化
      const outline = { id: null, children: [] };
      if (obj.name === 'outline' && obj.attributes) {

        // Backlinksは処理対象外、子要素の再帰も無し。なお"Backlink"は1なら単数形、2以上は複数形
        if (obj.attributes.text.match(/^\d+ Backlinks?$/)) return null;

        // outlineオブジェクトのプロトタイプ作成、pv.mapに登録
        m = obj.attributes.text.match(anchorRex);
        Object.assign(outline, {
          id: m ? m[2] : 'X' + ('00000' + (pv.id++)).slice(-6),
          text: // html特殊文字は還元
            (m ? `<a name="${m[2]}">${m[1]}</a>` : obj.attributes.text)
              .replaceAll(/&lt;/g, '<').replaceAll(/&gt;/g, '>').trim(),
          link: [...obj.attributes.text.matchAll(linkRex)],  // textに含まれたリンク
          note: obj.attributes._note ? (
            obj.attributes._note.replaceAll(linkRex, "[$2](#$1)")  // ローカルリンクをa.hrefに変換
              .replaceAll(/&lt;/g, '<').replaceAll(/&gt;/g, '>').trim() // html特殊文字は還元
          ) : '',
          isClan: isClan || ( m && m[2] === pv.root ? true : false),  // ルート要素配下ならtrue
          href: // 参照しているidの配列。この段階ではnote内のリンクのみ(textでのリンクは展開方法決定時に追加)
            obj.attributes._note ? [...obj.attributes._note.matchAll(linkRex)].map(x => x[1]) : [],
          parent: parent,
        });
        pv.map.set(outline.id, outline);  // outline一覧に追加
        if( outline.isClan ){
          if (m) pv.anchor.add(m[2]);  // アンカー一覧に追加
          // ローカルリンクがあればリンク一覧に追加
          if (outline.link.length > 0) outline.link.forEach(m => pv.link.add(m[1]));
        }
      }

      // elements(子要素)が有った場合、再帰呼出
      if (Array.isArray(obj.elements)) {
        obj.elements.forEach(o => {
          // Backlinks以外の場合は子要素として追加
          const r = markdown(o, outline.id, depth + 1, outline.isClan);
          if (r !== null) outline.children.push(r);
        });
      }
      return outline.id;
    }
  }

  /** sample: [開発用]xml2json(npm)動作確認用に、opml->jsonに変換
   * @param {string} arg - opml文書
   * @returns {string} 変換結果のJSON文字列
   */
  function sample(arg) {
    return JSON.stringify(JSON.parse(convert.xml2json(arg)), null, 2);
  }
}