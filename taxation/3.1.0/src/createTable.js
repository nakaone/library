/** createTable : オブジェクトの配列からHTMLテーブルを生成
 * @param {tableDef} table - テーブル構造定義オブジェクト。tableDefについてはSpreadDB.js の typedef "schemaDef" 参照
 * @param {Object} opt - オプション
 * @param {HTMLElement|string} [opt.parent=null] - 本関数で親要素へ追加する場合に指定。文字列ならCSSセレクタと解釈
 * @returns {HTMLElement|Error}
 */
function createTable(table,opt={}) {
  const v = { whois: 'createTable', rv: null};
  dev.start(v.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1);  // 事前準備
    // -------------------------------------------------------------
    dev.step(1.1); // オプション既定値設定
    opt = Object.assign({
      parent: null,
    },opt);
    dev.dump(opt);
    
    dev.step(1.2); // 項目未定義ならオブジェクトのメンバ名で代用
    if( !table.cols ){
      table.cols = [...new Set(table.data.flatMap(Object.keys))]
      .map(x => {return {'name':x,'type':'string'}});
    }
    dev.dump(table.cols);

    // -------------------------------------------------------------
    dev.step(2); // thead部の作成
    // -------------------------------------------------------------
    v.thead = [];
    table.cols.forEach(col => {
      v.thead.push({
        tag: 'th',
        text: col.label || col.name,
      });
    });
    v.thead = [{tag:'tr', children:v.thead}];

    // -------------------------------------------------------------
    dev.step(3); // tbody部の作成
    // -------------------------------------------------------------
    v.tbody = [];
    table.data.forEach(row => {
      v.tr = [];
      table.cols.forEach(col => {
        v.o = {
          tag: 'td',
          html: row[col.name] === undefined ? ''
          : (col.hasOwnProperty('func')
          ? col.printf(row)
          : String(row[col.name])),
        };
        if( col.type === "number" ){
          v.o.style = {"text-align": col.align };
        }
        v.tr.push(v.o);
      });
      v.tbody.push({tag:'tr',children:v.tr});
    });
    
    dev.end(); // 終了処理
    return createElement({
      tag:'table', children: [
        {tag:'thead', children:v.thead},
        {tag:'tbody', children:v.tbody},
      ],
    },(opt.parent || null));

  } catch (e) { dev.error(e); return e; }
}