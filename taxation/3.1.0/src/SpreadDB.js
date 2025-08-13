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

  /** loadSheet: シートからRDBへデータを保存する
   * @param {Object|string} arg - 文字列の場合arg.sheetNameと看做す
   * @param {string|string[]} arg.sheetName - シート名。複数シートの場合配列で指定
   * @param {Object[]} arg.initialData=[] - シートが存在しない場合に使用する行オブジェクトの配列
   * @returns {void}
   */
  function loadSheet(arg) {
    const v = { whois: `${pv.whois}.loadSheet`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // 事前準備：引数の整形
      // -------------------------------------------------------------
      v.arg = Object.assign({},(typeof arg === 'string' ? {sheetName:arg} : arg));
      if( !Array.isArray(v.arg.sheetName) )v.arg.sheetName = [v.arg.sheetName];

      // -------------------------------------------------------------
      dev.step(2);  // シート毎にRDBに保存
      // -------------------------------------------------------------
      v.arg.sheetName.forEach(sheetName => {
        v.sheet = pv.spread.getSheetByName(sheetName);
        if(v.sheet) {
          dev.step(2.1);  // シートが存在する場合、内容をv.rObjに読み込み
          v.rObj = [];  // 対象シートの行オブジェクト配列
          v.raw = v.sheet.getDataRange().getDisplayValues();
          for (v.r = 1; v.r < v.raw.length; v.r++) {  // ヘッダ行(0行目)は飛ばす
            v.o = {};
            for (v.c = 0, v.validCellNum = 0; v.c < v.cols.length; v.c++) {
              if( v.raw[v.r][v.c] ){
                // セルの値が有効
                v.o[v.raw[0][v.c]] = v.raw[v.r][v.c];
                v.validCellNum++;
              } else {
                // セルが空欄または無効な値の場合、欄のデータ型に沿って値を設定
                switch( pv.tableDef[sheetName].cols[v.c].type ){
                  case 'number' : v.o[v.raw[0][v.c]] = 0; break;
                  case 'boolean' : v.o[v.raw[0][v.c]] = false; break;
                  default: v.o[v.raw[0][v.c]] = '';
                }
              }
            }
            // 有効な値を持つセルが存在すれば有効行と看做す
            if( v.validCellNum > 0 ) v.rObj.push(v.o);
          }
        } else {
          dev.step(2.2);  // 対象シートが不在の場合、有効データは無し
          v.rObj = [];
        }
        dev.step(2.3);  // テーブルの作成
        v.sql = `drop table if exists \`${sheetName}\`;`
        + `create table \`${sheetName}\`;`
        + `insert into \`${sheetName}\` select * from ?`;
        v.r = execSQL(v.sql,[v.rObj]);
        if( v.r instanceof Error ) throw v.r;
      });

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** saveRDB: RDBからシートへデータを保存する
   * @param {string|string[]} arg=[] - 保存対象テーブル名
   */
  function saveRDB(arg=[]) {
    const v = { whois: `${pv.whois}.saveRDB`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      (Array.isArray(arg) ? arg : [arg]).forEach(tableName => {
        v.cols = pv.tableDef[tableName].cols;

        // 対象テーブル全件取得、行オブジェクト -> 二次元配列への変換
        v.r = execSQL(`select * from \`${tableName}\`;`);
        if( v.r instanceof Error ) throw v.r;
        v.arr = [];
        v.r.forEach(o => {
          for( v.i=0,v.l=[] ; v.i<v.cols.length ; v.i++ ){
            v.l[v.i] = v.r[v.cols[v.i].name] || '';
          }
          v.arr.push(v.l);
        });

        // シートを取得。メイン処理で初期化済なので不存在は考慮不要
        v.sheet = pv.spread.getSheetByName(tableName);

        // 現状クリア：行固定解除、ヘッダを残し全データ行・列削除
        v.sheet.setFrozenRows(0);
        v.lastRow = v.sheet.getMaxRows();
        v.lastCol = v.sheet.getMaxColumns();
        if( v.lastRow > 1)
          v.sheet.deleteRows(2,v.lastRow-1);
        if( v.lastCol > v.cols.length )
          v.sheet.deleteColumns(v.cols.length+1, v.lastCol-v.cols.length);

        // シートに出力
        v.sheet.getRange(2,1,v.arr.length,v.cols.length).setValues(v.arr);

        // シートの整形：1行目のみ固定化
        v.sheet.setFrozenRows(1);

      });

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** execSQL: alasqlでSQLを実行
   * @param {string} sql
   * @param {Array[]} arg - alasqlの第二引数
   * @returns {Object[]}
   */
  function execSQL(sql,arg=null) {
    return arg === null ? pv.db.exec(sql) : pv.db.exec(sql,arg);
  }

  // SpreadDBメイン処理
  dev.start(pv.whois, [...arguments]);
  try {

    dev.step(1); // pv.tableDefの作成
    // arg.schemaを基に{テーブル名:テーブル構造定義}に変換したObj
    arg.schema.tables.forEach(table => pv.tableDef[table.name] = table);

    dev.step(2);  // schema.tablesを基にテーブル・シートを初期化
    pv.schema.tables.forEach(table => {
      dev.step(2.1);  // RDBのテーブルは初期化
      v.sql = `drop table if exists \`${table.name}\`;`
      + `create table \`${tableName}\`;`;
      v.r = execSQL(v.sql);
      if( v.r instanceof Error ) throw v.r;

      dev.step(2.2);  // シートは存否確認のみ
      v.sheet = pv.spread.getSheetByName(table.name);
      if( !v.sheet ){
        dev.step(2.3);  // 対象シートが不在の場合、ヘッダ行のみで新規作成
        v.sheet = pv.spread.insertSheet(table.name);
        v.cols = pv.tableDef[table.name].cols;
        v.range = v.sheet.getRange(1, 1, 1, v.cols.length);
        // 項目名のセット
        v.range.setValues([v.cols.map(x => x.name)]);
        // メモのセット
        v.range.setNotes([v.cols.map(x => (x.note||''))]);
      }

    });

    dev.end(); // 終了処理
    return {do:execSQL,load:loadSheet,save:saveRDB};

  } catch (e) { dev.error(e); return e; }
}
