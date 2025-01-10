/** createTable: 新規にシートを作成
 * @param {sdbTable} arg
 * @param {string} arg.table - テーブル名
 * @param {sdbColumn[]} arg.cols - 項目定義オブジェクトの配列
 * @param {Object[]|any[][]} arg.values - 行オブジェクトの配列、またはシートイメージ
 * @returns {sdbLog}
 */
function createTable(query){
  const v = {whois:`${pv.whois}.createTable`,step:0,rv:[],convertRow:null};
  try {
    v.fId = `: table=${query.table}, set=${Object.hasOwn(query,'set')?(query.set.length+'rows'):'undefined'}`;
    console.log(`${v.whois} start${v.fId}`);

    v.table = pv.table[query.table];
    if( v.table.sheet !== null ) throw new Error('Already Exist');

    v.step = 1.3; // query.colsをセット
    if( v.table.schema.cols.length === 0 && v.table.values.length === 0 )
      // シートも項目定義も初期データも無い
      throw new Error('No Cols and Data');

    // ----------------------------------------------
    v.step = 3; // シートが存在しない場合、新規追加
    // ----------------------------------------------
    v.step = 3.1; // シートの追加
    v.table.sheet = pv.spread.insertSheet();
    v.table.sheet.setName(query.table);

    v.step = 3.2; // ヘッダ行・メモのセット
    v.headerRange = v.table.sheet.getRange(1,1,1,v.table.colnum);
    v.headerRange.setValues([v.table.header]);  // 項目名のセット
    v.headerRange.setNotes([v.table.notes]);  // メモのセット
    v.table.sheet.autoResizeColumns(1,v.table.colnum);  // 各列の幅を項目名の幅に調整
    v.table.sheet.setFrozenRows(1); // 先頭1行を固定

    v.step = 3.3; // 初期データの追加
    if( v.table.rownum > 0 ){
      v.rv = appendRow({table:v.table.name,record:v.table.values});
      if( v.rv instanceof Error ) throw v.r;
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end${v.fId}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}