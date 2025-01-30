process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', () => {
  // `node pipe.js markdown n`形式ならnはopt.mdHeaderと看做す
  const option = process.argv[3] && !Number.isNaN(process.argv[3])
  ? {mdHeader:Number(process.argv[3])} : {};
  const wf = workflowy(option);
  const text = lines.join('\n');
  switch( process.argv[2] ){
    case 'sample':
      console.log(wf.sample(text));
      break;
    case 'markdown':
    default:
      console.log(wf.markdown(text));
  }
});

/** workflowy: Markdown形式でエクスポートされた内容を修正 */
function workflowy(option={}){
  const convert = require('xml-js');
  const pv = { whois: 'workflowy' };
  pv.opt = Object.assign({
    mdHeader: 3,  // body直下を第1レベルとし、MarkDown化の際どのレベルまでheader化するかの指定
  },option);
  return {markdown:markdown,sample:sample};

  function markdown(obj,depth=0){
    let rv = []; let m;
    const anchorRex = /^(.+)\s*\(([a-z0-9]{12})\)\s*$/;
    const linkRex = /<a href="https:\/\/workflowy\.com\/#\/([a-z0-9]{12})">(.+)<\/a>/g;
    if( typeof obj === 'string' ){
      // 再帰呼出前、最初に呼ばれた時の処理

      // hrefから呼び出されるリンク先リストを作成。リンク切れチェックの準備
      let hrefs = new Set([...obj.matchAll(/workflowy\.com\/#\/([a-z0-9]{12})/g)].map(a => a[1]));

      // 主処理
      obj = JSON.parse(convert.xml2json(obj));
      rv = markdown(obj);
      rv = rv.join('\n').replaceAll(/\n\n+/g,'\n\n').trim(); // 連続する空白行は一つにまとめる

      // リンク切れチェック
      // a nameで定義されたアンカーのリストを作成
      let names = new Set([...rv.matchAll(/<a name="([a-z0-9]{12})"/g)].map(a => a[1]))
      let hrefsOnly = new Set([...hrefs].filter(e => (!names.has(e)))); // リンク有るのにアンカー無し
      let namesOnly = new Set([...names].filter(e => (!hrefs.has(e)))); // アンカー有るのにリンク無し
      let msg = [];
      if( hrefsOnly.size > 0 ){
        msg.push('===== [fatal] hrefs only: リンク有るのにアンカー未定義の項目');
        [...hrefsOnly].forEach(x => {
          m = rv.match(new RegExp(`\\[(.+)\\]\\(#${x}\\)`));
          msg.push(`${x}: ${m?m[1]:''}`);
        })
      }
      if( namesOnly.size > 0 ){
        msg.push('===== [warning] names only: アンカー有るのにリンクは存在しない項目');
        [...namesOnly].forEach(x => {
          m = rv.match(new RegExp(`<a name="${x}">(.+)</a>`));
          msg.push(`${x}: ${m?m[1]:''}`);
        })

      }

      // リンク切れチェック結果を先頭に付けて処理結果を出力
      return (msg.length > 0 ? msg.join('\n') + '\n\n' : '') + rv;

    } else {
      // opml > bodyタグ発見時、depthをリセット
      if( obj.name === 'body' ) depth = 0;

      // outlineタグの場合、markdown化
      if( obj.name === 'outline' && obj.attributes ){

        // Backlinksは処理対象外、子要素の再帰も無し。なお"Backlink"は1なら単数形、2以上は複数形
        if( obj.attributes.text.match(/^\d+ Backlinks?$/) ) return [];

        // ヘッダ部の作成
        // アンカー文字列を削除してa.nameで囲む
        m = obj.attributes.text.match(anchorRex);
        if( m ) obj.attributes.text = `<a name="${m[2]}">${m[1]}</a>`;
        // ローカルリンクをa.hrefに変換
        obj.attributes.text = obj.attributes.text.replaceAll(linkRex,"[$2](#$1)");

        // ヘッダに'#'または'-'を付加
        obj.attributes.text = depth <= pv.opt.mdHeader
        ? `\n${'#'.repeat(depth)} ${obj.attributes.text}\n` // 指定階層以内の場合は'#'
        : `${'\t'.repeat(depth-pv.opt.mdHeader-1)}- ${obj.attributes.text}${obj.attributes._note?'<br>':''}`; // 指定階層超の場合は'-'
        rv.push(obj.attributes.text);

        // ボディ部の作成
        if( Object.hasOwn(obj.attributes,'_note') ){
          // ローカルリンクをa.hrefに変換
          obj.attributes._note = (obj.attributes._note.replaceAll(linkRex,"[$2](#$1)")).trim();
          // 文中サニタイズされたhtml特殊文字は還元
          obj.attributes._note = obj.attributes._note.replaceAll(/&lt;/g,'<').replaceAll(/&gt;/g,'>');
          obj.attributes._note.split('\n').forEach(l => {
            l = (depth < pv.opt.mdHeader ? '' : '\t'.repeat(depth-pv.opt.mdHeader)) + l;
            rv.push(l);
          })
        }
      }

      // elements(子要素)が有った場合、再帰呼出
      if( Array.isArray(obj.elements) ){
        obj.elements.forEach(o => {
          rv = [...rv,...markdown(o,depth+1)];
        });
      }
      return rv;
    }
  }

  /** sample: [開発用]xml2json(npm)動作確認用に、opml->jsonに変換
   * @param {string} arg - opml文書
   * @returns {string} 変換結果のJSON文字列
   */
  function sample(arg){
    return JSON.stringify(JSON.parse(convert.xml2json(arg)),null,2);
  }
}