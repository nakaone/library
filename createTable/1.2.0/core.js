/** SpreadDb/LocalDb/createTable共通(2025/08/24)
 * @typedef {Object} schemaDef - DB構造定義オブジェクト
 * @param {string} dbName - データベース名(IndexedDB上ではストア名)
 * @param {tableDef[]} tables - DB内の個々のテーブルの定義
 * @param {Object.<string,Function>} [custom] - AlaSQLのカスタム関数
 * @param {string} created - 作成日時。export時に付記
 * 
 * @typedef {Object} tableDef - テーブル構造定義オブジェクト
 * @param {string} name - テーブル名。シート名も一致させる
 * @param {string|string[]} [primaryKey] - 主キーとなる項目名。複合キーの場合配列で指定
 * @param {columnDef[]} cols - 項目定義
 * @param {Function} [initial] - 初期設定用関数(テーブルに初期データ登録＋シート作成)
 * @param {Object[]} data - テーブルの行オブジェクトの配列。import/export時のみ設定
 * @param {Object} [exportDef={}] - export時の設定。exportDef=nullの場合、出力対象外とする
 * @param {string[]} exportDef.select=[] - 出力項目を絞り込む場合の項目名リスト。空配列なら全項目出力
 * @param {string} exportDef.where="" - 出力行を絞り込む場合の条件(SQLのwhere句)
 * 
 * @typedef {Object} columnDef - 項目定義オブジェクト
 * @param {string} name - 項目名
 * @param {string} [label] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @param {string} type - データ型。string/number/boolean
 * @param {any} [default] - 既定値。関数の場合、引数は行オブジェクト
 * @param {Function} [printf] - 表示時点で行う文字列の整形用関数。引数は行オブジェクト
 * @param {string} [note] - 備考
 */
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
          v.o.style = {"text-align": "right" };
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