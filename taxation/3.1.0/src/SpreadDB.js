/**
 * @typedef {Object} schemaDef - DB構造定義オブジェクト
 * @param {string} dbName - データベース名
 * @param {tableDef[]} tables - DB内の個々のテーブルの定義
 * @param {Object.<string,Function>} [custom] - AlaSQLのカスタム関数
 * 
 * @typedef {Object} tableDef - テーブル構造定義オブジェクト
 * @param {string} name - テーブル名。シート名も一致させる
 * @param {string|string[]} [primaryKey] - 主キーとなる項目名。複合キーの場合配列で指定
 * @param {columnDef[]} cols - 項目定義
 * @param {Function} [initial] - 初期設定用関数(テーブルに初期データ登録＋シート作成)
 * @param {Object[]} data - テーブルの行オブジェクトの配列。import/export時のみ設定
 * 
 * @typedef {Object} columnDef - 項目定義オブジェクト
 * @param {string} name - 項目名
 * @param {string} [label] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @param {string} type - データ型。string/number/boolean
 * @param {any} [default] - 既定値。関数の場合、引数は行オブジェクト
 * @param {Function} [printf] - 表示時点で行う文字列の整形用関数
 * @param {string} [note] - 備考
 */

/** SpreadDB: シートをテーブルとして扱うGAS内部のRDB
 * - ヘッダ行は1行目に固定、左端から隙間無く項目を並べる(空白セル不可)
 * @param {Object} arg
 * @param {schemaDef} arg.schema - DB構造定義オブジェクト
 * @returns {Object} 使用可能なメソッドのオブジェクト
 */
function SpreadDB(arg) {
  const pv = { whois: 'SpreadDB', rv: null,
    spread: SpreadsheetApp.getActiveSpreadsheet(),
    schema: arg.schema,
    tableDef: {}, // arg.schemaを基に{テーブル名:テーブル構造定義}に変換したObj
    db: new alasql.Database(),
  };

  /** execSQL: alasqlでSQLを実行
   * @param {string} sql
   * @param {Array[]} arg - alasqlの第二引数
   * @returns {Object[]}
   */
  function execSQL(sql,arg=null) {
    return arg === null ? pv.db.exec(sql) : pv.db.exec(sql,arg);
  }

  /** loadSheet: シートからRDBへデータをロードする
   * @param {string|string[]} arg=[] - ロード対象テーブル名
   * @returns {void}
   */
  function loadSheet(arg) {
    const v = { whois: `${pv.whois}.loadSheet`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 対象テーブルリストを作成
      v.tables = Array.isArray(arg) ? arg : ( typeof arg === 'string' ? [arg] : []);
      if( v.tables.length === 0 ) throw new Error('テーブル指定が不適切です');

      dev.step(2);  // 対象テーブルを順次ロード
      for( v.i=0 ; v.i<v.tables.length ; v.i++ ){

        dev.step(2.1);  // 項目定義をv.colsに格納
        if( pv.tableDef.hasOwnProperty(v.tables[v.i]) ){
          v.cols = pv.tableDef[v.tables[v.i]].cols;
        } else {
          throw new Error(`テーブル「${v.tables[v.i]}」は定義されてません`);
        }
        dev.dump(v.cols);

        dev.step(2.2);  // シートを取得。メイン処理で作成済なので不存在は考慮不要
        v.sheet = pv.spread.getSheetByName(v.tables[v.i]);
        v.raw = v.sheet.getDataRange().getDisplayValues();
        v.rObj = [];  // 対象シートの行オブジェクト配列

        dev.step(2.3);  // シートが存在する場合、内容をv.rObjに読み込み
        for (v.r = 1; v.r < v.raw.length; v.r++) {  // ヘッダ行(0行目)は飛ばす
          v.o = {}; // メンバ名はlabelではなくnameを使用
          for (v.c = 0, v.validCellNum = 0; v.c < v.cols.length; v.c++) {
            if( v.raw[v.r][v.c] ){
              // セルの値が有効
              v.o[v.cols[v.c].name] = v.raw[v.r][v.c];
              v.validCellNum++;
            } else {
              // セルが空欄または無効な値の場合、欄のデータ型に沿って値を設定
              switch( pv.tableDef[v.tables[v.i]].cols[v.c].type ){
                case 'number' : v.o[v.cols[v.c].name] = 0; break;
                case 'boolean' : v.o[v.cols[v.c].name] = false; break;
                default: v.o[v.cols[v.c].name] = '';
              }
            }
          }
          // 有効な値を持つセルが存在すれば有効行と看做す
          if( v.validCellNum > 0 ) v.rObj.push(v.o);
        }

        dev.step(2.4);  // テーブルに追加
        v.sql = `delete from \`${v.tables[v.i]}\`;` // 全件削除
        + `insert into \`${v.tables[v.i]}\` select * from ?`;
        v.r = execSQL(v.sql,[v.rObj]);
        if( v.r instanceof Error ) throw v.r;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** saveRDB: RDBからシートへデータを保存する
   * @param {string|string[]} arg=[] - 保存対象テーブル名
   * @returns {void}
   */
  function saveRDB(arg=[]) {
    const v = { whois: `${pv.whois}.saveRDB`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 対象テーブルリストを作成
      v.tables = Array.isArray(arg) ? arg : ( typeof arg === 'string' ? [arg] : []);
      if( v.tables.length === 0 ) throw new Error('テーブル指定が不適切です');

      dev.step(2);  // 対象テーブルを順次格納
      for( v.i=0 ; v.i<v.tables.length ; v.i++ ){

        dev.step(2.1);  // 項目定義をv.colsに格納
        if( pv.tableDef.hasOwnProperty(v.tables[v.i]) ){
          v.cols = pv.tableDef[v.tables[v.i]].cols;
        } else {
          throw new Error(`テーブル「${v.tables[v.i]}」は定義されてません`);
        }
        dev.dump(v.cols);

        dev.step(2.2);  // シートを取得。メイン処理で作成済なので不存在は考慮不要
        v.sheet = pv.spread.getSheetByName(v.tables[v.i]);

        dev.step(2.3);  // 現状クリア：行固定解除、ヘッダを残し全データ行・列削除
        v.sheet.setFrozenRows(0);
        v.maxRows = v.sheet.getMaxRows();
        v.maxCols = v.sheet.getMaxColumns();
        if( v.maxRows > 1)
          v.sheet.deleteRows(2,v.maxRows-1);
        if( v.maxCols > v.cols.length )
          v.sheet.deleteColumns(v.cols.length+1, v.maxCols-v.cols.length);

        dev.step(2.4);  // 対象テーブル全件取得
        v.r = execSQL(`select * from \`${v.tables[v.i]}\`;`);
        if( v.r instanceof Error ) throw v.r;
        if( v.r.length === 0 ) continue;  // レコード数0なら保存対象外

        dev.step(2.5);  // 行オブジェクト -> 二次元配列への変換
        v.arr = [];
        v.r.forEach(o => {
          for( v.i=0,v.l=[] ; v.i<v.cols.length ; v.i++ ){
            v.l[v.i] = o[v.cols[v.i].name] || '';
          }
          v.arr.push(v.l);
        });

        // シートに出力
        v.sheet.getRange(2,1,v.arr.length,v.cols.length).setValues(v.arr);

        // シートの整形：1行目のみ固定化
        v.sheet.setFrozenRows(1);
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** importJSON: JSONからテーブル・シートへデータを格納する
   * @param {string|string[]} arg=[] - ロード対象テーブル名
   * @returns {void}
   */
  function importJSON(arg) {
    const v = { whois: `${pv.whois}.importJSON`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      /*
      dev.step(1);  // 汎用画面にインポート用画面を作成
      cf.gpScr.innerHTML = '';
      v.r = createElement([
        {tag:'h1',text:'インポート'},
        {tag:'input',attr:{type:'file'},event:{change:e=>ldb.import(e)}},
        {tag:'textarea',attr:{cols:60,rows:15}},
      ],cf.gpScr);


    dev.step(1);  // オプションに既定値設定
      pv.opt = Object.assign(pv.opt,arg);
      dev.dump(pv.opt);

      dev.step(2);
      pv.idb = await openIndexedDB();

      for( v.tableName in cf.tableDef.mappingTable){
        dev.step(3);  // rdbからテーブル名をキーとして検索
        v.existingData = await getIndexedDB(v.tableName);
        
        if (v.existingData) {
          dev.step(4.1);  // 存在すればrowsをJSON.parseしてpv.rdbに格納
          pv.rdb.tables[v.tableName] = JSON.parse(v.existingData.rows);
        } else {
          dev.step(4.2);  // 存在しなければ新規登録
          await setIndexedDB(v.tableName, '[]');
          pv.rdb.exec(`create table \`${v.tableName}\``);
        }
      }
      */

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** exportJSON: 全テーブルの構造及びデータをJSON化、ダウンロード。
   * 但しFunction型は文字列型に変換される。
   * @param {string} fileName - ダウンロードファイル名。必須。
   * @returns {void}
   * - 出力されるJSONの構造はschemaDef参照
   */
  function exportJSON() {
    const v = { whois: `${pv.whois}.exportJSON`, rv: null};
    dev.start(v.whois);
    try {

      dev.step(1);  // ダウンロードする内容の作成
      dev.step(1.1);  // pv.schemaをv.contentにディープコピー
      v.deepCopy = (value) => {
        if (typeof value === 'function') {
          return value.toString();  // 関数型は文字列化
        } else if (Array.isArray(value)) {
          return value.map(item => v.deepCopy(item));
        } else if (value !== null && typeof value === 'object') {
          const copy = {};
          for (let key in value) {
            if (value.hasOwnProperty(key)) {
              copy[key] = v.deepCopy(value[key]);
            }
          }
          return copy;
        } else {
          // プリミティブ型（number, string, boolean, null, undefined）はそのまま返す
          return value;
        }
      };
      v.content = v.deepCopy(pv.schema);

      dev.step(1.2);  // 各テーブルのデータをセット
      for( v.i=0 ; v.i<v.content.tables.length ; v.i++ ){
        v.table = v.content.tables[v.i]
        v.table.data = execSQL(`select * from \`${v.table.name}\`;`);
        if( v.table.data instanceof Error ) throw v.table.data;
      }

      dev.step(1.3);  // 文字列化
      const jsonStr = JSON.stringify(v.content);
      dev.dump(jsonStr);

      dev.step(2);  // HTMLをコード内で定義
      const html = HtmlService.createHtmlOutput(`
        <html>
          <head><base target="_top"></head>
          <body>
            <p>JSONファイルのダウンロードを開始しています...</p>
            <script>
              const data = ${jsonStr};

              // JSONとしてファイルを生成して自動ダウンロード
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'data.json';
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);

              // ダイアログを自動的に閉じる（少し待ってから）
              setTimeout(() => {
                google.script.host.close();
              }, 1000);
            </script>
          </body>
        </html>
      `).setWidth(300).setHeight(100);

      dev.step(3);  // ダイアログの表示
      SpreadsheetApp.getUi().showModalDialog(html, 'JSONをダウンロード中');

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  // SpreadDBメイン処理
  dev.start(pv.whois, [...arguments]);
  try {

    dev.step(1); // pv.tableDefの作成
    // arg.schemaを基に{テーブル名:テーブル構造定義}に変換したObj
    arg.schema.tables.forEach(table => pv.tableDef[table.name] = table);

    dev.step(2);  // schema.tablesを基にテーブル・シートを初期化
    pv.schema.tables.forEach(table => {

      dev.step(2.1);  // RDBのテーブルを初期化
      pv.sql = `drop table if exists \`${table.name}\`;`
      + `create table \`${table.name}\`;`;
      pv.r = execSQL(pv.sql);
      if( pv.r instanceof Error ) throw pv.r;

      pv.sheet = pv.spread.getSheetByName(table.name);
      if( pv.sheet ){
        dev.step(2.2);  // シート作成済の場合、シートからRDBにロード
        pv.r = loadSheet(table.name);
        if( pv.r instanceof Error ) throw pv.r;
      } else {
        dev.step(2.3);  // シート未作成の場合、シートを作成してヘッダ行を登録
        pv.sheet = pv.spread.insertSheet(table.name);
        pv.range = pv.sheet.getRange(1, 1, 1, table.cols.length);
        pv.range.setValues([table.cols.map(x => x.label || x.name)]);
        pv.range.setNotes([table.cols.map(x => (x.note||''))]);

        if( table.hasOwnProperty('initial') ){
          dev.step(2.4);  // 初期データが存在する場合、RDBに追加してシートに反映
          pv.sql = `insert into \`${table.name}\` select * from ?;`;
          pv.r = execSQL(pv.sql,[table.initial()]);
          if( pv.r instanceof Error ) throw pv.r;
          pv.r = saveRDB(table.name);
          if( pv.r instanceof Error ) throw pv.r;
        }
      }
    });

    dev.step(3);  // AlaSQLカスタム関数の用意
    if( pv.schema.hasOwnProperty('custom') ){
      Object.keys(pv.schema.custom).forEach(x => alasql.fn[x] = pv.schema.custom[x]);
    }

    dev.end(); // 終了処理
    return {do:execSQL,load:loadSheet,save:saveRDB,import:importJSON,export:exportJSON};

  } catch (e) { dev.error(e); return e; }
}