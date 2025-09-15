/** schemaDef: DB構造定義オブジェクト
 * @typedef {Object} schemaDef - DB構造定義オブジェクト(引数用)
 * @param {string} [dbName] - データベース名(IndexedDB上ではストア名)
 * @param {string} [note] - 備考
 * @param {Object.<string,tableDef>} tableDef - テーブル構造定義名をメンバ名とするテーブル構造定義
 * @param {Object} tables - 実テーブル名をメンバ名とする実テーブルの定義
 * @param {string} [tables.def] - 使用するテーブル定義名。実テーブル名と定義名が一致する場合は省略可。
 * @param {string|Object[]} [tables.data] - テーブルに格納される初期データ
 *   string -> CSV/TSV形式。先頭行は項目名(header)。
 *     項目名はnameではなくlabelで...にするか？nameとlabelが重複しないならどっちでもいいが。
 *   Object[] -> 行オブジェクトの配列
 * @param {Object.<string,string>} [custom] - AlaSQLのカスタム関数。{関数名:toString()で文字列化した関数}
 */
/** schemaDefEx: Schemaの戻り値となる、拡張済DB構造定義オブジェクト
 * @typedef {Object} schemaDefEx - DB構造定義オブジェクト。引数用のschemaDefに以下の項目を追加・変更したもの
 * @param {string} original - インスタンス化前の引数(schemaDef)
 *   schemaDefExは一部文字列を関数化しており、他APIに授受可能なJSONとして扱うため、プリミティブ変数のみの形で保存
 * @param {string} [created] - 作成日時。export時に使用
 * @param {Function} expand - expandSchemaメソッド(公開API)。schemaDefExを再作成
 */
// =====================================================================
/** tableDef: テーブル構造定義オブジェクト
 * @typedef {Object} tableDef - テーブル構造定義オブジェクト(引数用)
 * @param {string} [note] - テーブルに関する備考
 * @param {string|string[]} [primaryKey] - 主キーとなる項目名。複合キーの場合配列で指定
 * @param {columnDef[]} colDef - 項目定義
 *   項目はテーブルと異なり順序も要考慮のため、オブジェクトではなく配列で定義
 * @param {number} top=1 - シート・CSVイメージ上のヘッダ行番号
 * @param {number} left=1 - シート・CSVイメージ上の開始列番号
 *   top,leftは外部提供CSVをインポートするような場合を想定
 *   なお「1テーブル1シート」の想定で、途中でフォーマットが変わる複数年度の仕訳日記帳のように
 *   1テーブル複数シート(複数フォーマット)は考慮しない。
 * @param {number} [startingRowNumber=2] - dataの当該テーブルが存在し、かつ行番号が不在の場合は
 *   RowNumberを追加する。この開始行番号。<0ならRowNumberは追加しない。
 *   RowNumber {number} シート上の行番号。原則としてヘッダ行は1、データ行は2以降
 */

/** tableDefEx: Schemaの戻り値となる、拡張済テーブル構造定義オブジェクト
 * @typedef {Object} tableDefEx - テーブル構造定義オブジェクト。引数用のtableDefに以下の項目を追加・変更したもの
 * @param {string} name - 実テーブル名
 * @param {string[]} header - columnDef.labelの配列
 * @param {Object.<string,columnObj>} col - {columnDef.name:columnObj}
 */
// =====================================================================
/** columnDef: 項目定義オブジェクト
 * @typedef {Object} columnDef - 項目定義オブジェクト(引数用)
 * @param {string} name - 項目名。原則英数字で構成(システム用)
 * @param {string} [note] - 備考
 * @param {string} [label] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @param {string} type='string' - データ型。string/number/boolean
 * @param {string[]} [alias] - 複数タイプのCSVを統一フォーマットで読み込むとき、項目名の揺れを列挙
 * @param {any} [default=null] - 既定値。関数の場合、引数を行オブジェクトとするtoString()で作成された文字列
 * @param {string} [printf=null] - 表示時点で行う文字列の整形用関数
 *   引数を行オブジェクトとするtoString()で作成された文字列
 */
/** columnDefEx: Schemaの戻り値となる、拡張済項目定義オブジェクト
 * @typedef {Object} columnDefEx - 項目定義オブジェクト。引数用のcolumnDefに以下の項目を追加・変更したもの
 * @param {number} seq - 左端を0とする列番号
 */
// =====================================================================

/** Schema: シート・RDB・IndexedDB・CSV/TSVで扱うデータベース構造定義のユーティリティ集
 * - schema変更時には変更点のみexpandに渡す運用を想定(都度全体を渡さない)、クロージャ関数とする
 * @param {schemaDef} schema - DB構造定義オブジェクト(引数用)
 * @returns {schemaDefEx} DB構造定義オブジェクト(戻り値用)
 */
function Schema(schema) {
  const pv = { whois: 'Schema', schema: {},
    schemaDef: { // schemaDefEx形式の既定値。但しoriginal,created,expandはメソッド内で追加
      dbName: '',
      note: '',
      tableDef: {},
      tables: {},
      custom: {},
    },
    tableDef: { // tableDefEx形式の既定値
      def: '',
      data: [],
      note: '',
      primaryKey: [],
      colDef: [],
      top: 1,
      left: 1,
      startingRowNumber: 2,
      name: '',
      header: [],
      col: {},
    },
    columnDef: {
      name: '',
      seq: 0,
      note: '',
      label: '',
      type: 'string',
      alias: [],
      default: null,
      printf: null,
    }
  };

  /**
   * - pv.schemaを変更前、引数schemaを修正点、v.schemaを作業用とし、最後にpv.schema=v.schemaとする
   * @param {schemaDef} schema 
   * @returns 
   */
  function expand(schema) {
    const v = { whois: `${pv.whois}.expand`, rv: null, schema:{}};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // schema全体の処理
      // -------------------------------------------------------------

      dev.step(1.1);  // 「引数 > pv.schema > 既定値」の優先順位で値を設定
      v.schema = mergeDeeply(schema,mergeDeeply(pv.schema,pv.schemaDef));
      if( v.schema instanceof Error ) throw v.schema;

      dev.step(1.2);  // 過去のoriginalが存在していればマージして再設定
      v.schema.original = JSON.stringify(typeof pv.schema.original !== 'undefined'
      ? mergeDeeply(JSON.parse(pv.schema.original),schema) : schema);

      dev.step(1.3);  // 引数にもpv.schemaにも依存しない項目の設定
      v.schema.created = toLocale(new Date());
      v.schema.expand = expand;

      dev.step(1.4);  // customを関数化
      // 既に関数化されていた場合(再作成の場合)、何もしない
      for( v.fn in v.schema.custom ){
        if( typeof v.schema.custom[v.fn] !== 'function' )
          v.schema.custom[v.fn] = new Function('return '+v.schema.custom[v.fn])();
      }

      // -------------------------------------------------------------
      dev.step(2); // table毎の処理
      // -------------------------------------------------------------
      for( [v.name,v.table] of Object.entries(v.schema.tables) ){

        // テーブル構造定義名・テーブル名が省略されていた場合は設定
        if( !v.table.def ) v.table.def = v.name;
        if( !v.table.name ) v.table.name = v.name;

        // 「引数 > pv.schema > 既定値」の優先順位で値を設定
        v.table = mergeDeeply(v.table,mergeDeeply(v.schema.tableDef[v.table.def],pv.tableDef));

        // 初期データの行オブジェクト化
        if( typeof v.table.data === 'string' && v.table.data !== '' ){
          // CSV/TSVを行オブジェクトに変換
          v.table.data = parseCSVorTSV(v.table.data);
          // データ型に従って値変換
          v.table.data.forEach(x => {
            for( v.i=0 ; v.i<v.table.colDef.length ; v.i++ ){
              switch( v.table.colDef[v.i].type ){
                case 'number':
                  x[v.table.colDef[v.i].name] = Number(x[v.table.colDef[v.i].name]);
                  break;
                case 'boolean':
                  x[v.table.colDef[v.i].name] = x[v.table.colDef[v.i].name] === '' ? ''
                  : (String(x[v.table.colDef[v.i].name]).toLowerCase() === 'true' ? true : false);
                  break;
                default:
                  break;
              }
            }
          });
          // RowNumber不在ならRowNumberを追加
          if( v.table.startingRowNumber > 0 && typeof v.table.data[0].RowNumber === 'undefined' ){
            for( v.i=0 ; v.i<v.table.data.length ; v.i++ ){
              v.table.data[v.i].RowNumber = v.i + v.table.startingRowNumber;
            }
          }
        }
        v.schema.tables[v.name] = v.table;
      }
      
      dev.end(); // 終了処理
      pv.schema = v.schema;
      return pv.schema;

    } catch (e) { dev.error(e); return e; }
  }

  /**
   * CSV/TSV 文字列をオブジェクトの配列に変換する
   * - 区切り文字を自動判定（カンマ or タブ）
   * - ダブルクォートあり/なし両対応
   * - RFC4180 準拠（"" は "）
   *
   * @param {string} text - CSV/TSV 文字列
   * @param {object} [options]
   * @param {boolean} [options.headers=true] 1行目をヘッダ行として使うか
   * @param {boolean} [options.trim=true] フィールドの前後空白を削除するか
   * @returns {Object[] | string[][]}
   */
  function parseCSVorTSV(text, options = {}) {
    const { headers = true, trim = true } = options;

    if (typeof text !== "string") throw new TypeError("text must be a string");
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // BOM 除去

    // --- 区切り文字を自動判定 ---
    const firstLine = text.split(/\r?\n/)[0];
    const commaCount = (firstLine.match(/,/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const delimiter = tabCount > commaCount ? "\t" : ",";

    const rows = [];
    let cur = "";
    let row = [];
    let inQuotes = false;
    let i = 0;

    while (i < text.length) {
      const ch = text[i];

      if (ch === '"') {
        if (!inQuotes) {
          inQuotes = true;
          i++;
          continue;
        } else {
          if (i + 1 < text.length && text[i + 1] === '"') {
            cur += '"'; // エスケープされた "
            i += 2;
            continue;
          } else {
            inQuotes = false;
            i++;
            continue;
          }
        }
      }

      if (!inQuotes && ch === delimiter) {
        row.push(trim ? cur.trim() : cur);
        cur = "";
        i++;
        continue;
      }

      if (!inQuotes && (ch === "\n" || ch === "\r")) {
        row.push(trim ? cur.trim() : cur);
        rows.push(row);
        row = [];
        cur = "";

        if (ch === "\r" && text[i + 1] === "\n") i++;
        i++;
        continue;
      }

      cur += ch;
      i++;
    }

    row.push(trim ? cur.trim() : cur);
    rows.push(row);

    if (!headers) return rows;

    const headerRow = rows.shift() || [];
    return rows.map(r => {
      const obj = {};
      for (let j = 0; j < headerRow.length; j++) {
        const key = headerRow[j] || `col${j}`;
        obj[key] = r[j] !== undefined ? r[j] : "";
      }
      return obj;
    });
  }

  // -------------------------------------------------------------
  // メイン処理
  // -------------------------------------------------------------
  dev.start(pv.whois, [...arguments]);
  try {

    dev.step(1);
    pv.rv = expand(schema);
    if( pv.rv instanceof Error ) throw pv.rv;

    dev.end(); // 終了処理
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}