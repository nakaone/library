/**
 * @typedef {Object} colDef - 項目定義オブジェクト
 * @param {string} name - 行オブジェクト内のメンバ名
 * @param {string} [label] - テーブルに表示する項目名。省略時はnameを流用
 * @param {string} [align]="left" - セル内の表示位置
 */

/** createTable : オブジェクトの配列からHTMLテーブルを生成
 * @param {Object[]} data - 行オブジェクトの配列
 * @param {Object} opt - オプション
 * @param {colDef[]} opt.cols - 項目定義オブジェクトの配列
 * @param {HTMLElement|string} [opt.parent=null] - 本関数内部で親要素への追加まで行う場合に指定
 * @returns {HTMLElement|Error}
 */
function createTable(data,opt) {
  const v = { whois: 'createTable', rv: null};
  dev.start(v.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // thead部の作成
    // -------------------------------------------------------------
    v.thead = [];
    opt.cols.forEach(col => {
      v.thead.push({
        tag: 'th',
        text: col.label || col.name,
      });
    });
    v.thead = [{tag:'tr', children:v.thead}];

    // -------------------------------------------------------------
    dev.step(2); // tbody部の作成
    // -------------------------------------------------------------
    v.tbody = [];
    data.forEach(row => {
      v.tr = [];
      opt.cols.forEach(col => {
        v.o = {
          tag: 'td',
          html: row[col.name] === undefined ? '' : String(row[col.name]),
        };
        if( col.align && col.align !== "left" ){
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
