process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', () => {
  console.log(workflowy(lines));
});

/** workflowy: Markdown形式でエクスポートされた内容を修正 */
function workflowy(arg){
  const convert = require('xml-js');
  const v = {whois:'workflowy',step:0,rv:[]};
  try {

    v.step = 1; // opmlをJSON化し、文書のルート要素以下に絞り込み
    v.json = JSON.stringify(JSON.parse(convert.xml2json(arg.join('\n'))).elements[0].elements[1].elements[0])
    // リンク先をworkflowyからmarkdown文書内リンクに置換
    .replaceAll(/<a href=\\"https:\/\/workflowy\.com\/#\/([a-z0-9]{12})\\">(.+?)<\/a>/g,"[$2](#$1)");

    v.func = (o,r=0,d=0) => {

      v.step = 2.1; // Backlinkは無視
      if( o.attributes.text.match(/\d+ Backlink/) ) return;

      v.step = 2.2; // アンカー付きの項目は'#'を付ける
      v.m = o.attributes.text.match(/^(.+)\(([a-z0-9]{12})\)$/);
      if( v.m ){
        o.attributes.text = `\n${'#'.repeat(d+1)} <a name="${v.m[2]}">${v.m[1]}</a>\n`;
        r = d;
      } else {
        o.attributes.text = `${'  '.repeat(d-r)}- ${o.attributes.text}`;
      }
      v.rv.push(o.attributes.text);

      if( Object.hasOwn(o.attributes,'_note') ) v.rv.push(o.attributes._note);

      if( Object.hasOwn(o,'elements') ) o.elements.forEach(x => v.func(x,r,d+1));
    }

    v.func(JSON.parse(v.json));

    v.step = 9; // 終了処理
    v.rv = v.rv.join('\n');
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v,null,2)}`);
    return e;
  }
}