以下のような構造を持つオブジェクトをjavascriptのクラスとして定義したい。

いままでのColumnDef/Ex, TableDef/Exを組み込み、function Schemaをクラス化して欲しい。
```js
/** schemaDef: DB構造定義オブジェクト (引数用)
 * @typedef {Object} schemaDef
 * @property {string} [dbName] - データベース名(IndexedDB上ではストア名)
 * @property {string} [note] - 備考
 * @property {Object.<string, tableDef>} tableDef - テーブル構造定義名をメンバ名とするテーブル構造定義
 * @property {Object.<string, Object>} tableMap - 実テーブル名をメンバ名とする実テーブルの定義
 * @property {string} [tableMap.def] - 使用するテーブル定義名。実テーブル名と定義名が一致する場合は省略可。
 * @property {string|Object[]} [tableMap.data] - テーブルに格納される初期データ
 *   - string: CSV/TSV形式。先頭行は項目名(labelの配列=header)。
 *   - Object[]: 行オブジェクトの配列
 * @property {Object.<string, string>} [custom] - AlaSQLのカスタム関数。{関数名: toString()で文字列化した関数}
 * @example
 * schema: {
 *   dbName: 'camp2025',
 *   tableDef: {
 *     master: {
 *       colDef:[
 *         {name:'タイムスタンプ',type:'string'},
 *         {name:'メールアドレス',type:'string'},
 *         // (中略)
 *       ],
 *     },
 *   },
 *   tableMap: {master:{def:'master'}},
 * },
 */

/** schemaDefEx: Schemaの戻り値となる拡張済DB構造定義オブジェクト
 * 引数用のschemaDefに以下を追加・変更したもの
 * @typedef {Object} schemaDefEx
 * @property {string} original - インスタンス化前の引数(schemaDef)をJSON文字列化したもの  
 *   (一部文字列を関数化しているため、保存時はプリミティブ変数のみ)
 * @property {string} [created] - 作成日時。export時に使用
 * @property {Function} expand - expandSchemaメソッド(公開API)。schemaDefExを再作成
 */

/** Schema: シート・RDB・IndexedDB・CSV/TSVで扱うデータベース構造定義のユーティリティ集
 * - schema変更時には変更点のみexpandに渡す運用を想定(都度全体を渡さない)、クロージャ関数とする
 * @param {schemaDef} schema - DB構造定義オブジェクト(引数用)
 * @returns {schemaDefEx} DB構造定義オブジェクト(戻り値用)
 */
function Schema(schema) {
  const pv = { whois: 'Schema', schema: {},
    schemaDef:  // schemaDefEx形式の既定値。但しoriginal,created,expandはメソッド内で追加
      '{"dbName":"","note":"","tableDef":{},"tableMap":{},"custom":{}}',
    tableDef: // tableDefEx形式の既定値
      '{"def":"","data":[],"note":"","primaryKey":[],"unique":[],"colDef":[],'
      + '"top":1,"left":1,"startingRowNumber":2,"name":"","header":[],"colMap":{}}',
    columnDef:  // columnDefEx形式の既定値
      '{"name":"","seq":0,"note":"","label":"","type":"string","alias":[],"default":null,"printf":null}',
  };

  /**
   * - pv.schemaを変更前、引数schemaを修正点、v.schemaを作業用とし、最後にpv.schema=v.schemaとする
   * @param {schemaDef} schema 
   * @returns {schemaDefEx}
   */
  function expand(schema) {
    const v = { whois: `${pv.whois}.expand`, rv: null, schema:{}};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // schema全体の処理
      // -------------------------------------------------------------

      dev.step(1.1);  // 「引数 > pv.schema > 既定値」の優先順位で値を設定
      v.schema = mergeDeeply(schema,mergeDeeply(pv.schema,JSON.parse(pv.schemaDef)));
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
      for( [v.name,v.table] of Object.entries(v.schema.tableMap) ){

        dev.step(2.1);  // テーブル構造定義名・テーブル名が省略されていた場合は設定
        if( !v.table.def ) v.table.def = v.name;
        if( !v.table.name ) v.table.name = v.name;

        dev.step(2.2);  // 「引数 > pv.schema > 既定値」の優先順位で値を設定
        v.table = mergeDeeply(v.table,mergeDeeply(v.schema.tableDef[v.table.def],JSON.parse(pv.tableDef)));

        dev.step(2.3);  // 初期データの行オブジェクト化
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

        dev.step(2.4);  // primaryKeyが文字列なら配列化
        if( typeof v.table.primaryKey === 'string' ) v.table.primaryKey = [v.table.primaryKey];
        if( typeof v.table.unique === 'string' ) v.table.unique = [v.table.unique];

        // -------------------------------------------------------------
        dev.step(3); // column毎の処理
        // -------------------------------------------------------------
        for( v.c=0 ; v.c<v.table.colDef.length ; v.c++ ){

          dev.step(3.1);  // 未定義項目に既定値設定
          v.colObj = Object.assign({},JSON.parse(pv.columnDef),v.table.colDef[v.c]);

          dev.step(3.2);  // default,printfを関数化
          ['default','printf'].forEach(x => {
            if( v.colObj[x] !== null && typeof v.colObj[x] !== 'function' )
              v.colObj[x] = new Function('return '+v.colObj[x])();
          });

          dev.step(3.3);  // seq,labelの設定、tableMap.headerへの登録
          v.colObj.seq = v.c;
          if( !v.colObj.label ) v.colObj.label = v.colObj.name;
          v.table.header.push(v.colObj.label);

          dev.step(3.4);  // 項目マップに登録
          // キーは①項目名(name)、②ラベル(label)、③別名(alias)、④出現順(数字)
          v.keys = Array.from(new Set([
            v.colObj.name,
            v.colObj.label,
            ...v.colObj.alias,
            v.c
          ]));
          v.keys.forEach(x => v.table.colMap[x] = v.colObj);

        }

        dev.step(2.4);  // table毎の処理：作成したtableをschemaに登録して終了
        v.schema.tableMap[v.name] = v.table;
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
```

- 引数argはオブジェクト
- クラス定義内で同じメンバがあれば引数の値を採用、無ければ無視
- 引数オブジェクトのメンバのデータ型がクラス定義と異なる場合、クラス定義の既定値を採用
- 引数にcolumnDefに定義されていないメンバが有っても無視
- JSDocを付加
- mergeDeeplyは動作確認済のソースがある前提
- 変数devは無視(コメントとして残す)
