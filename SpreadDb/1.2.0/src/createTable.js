/** createTable: 新規にシートを作成
 * @param {sdbTable} arg
 * @param {string} arg.table - テーブル名
 * @param {sdbColumn[]} arg.cols - 項目定義オブジェクトの配列
 * @param {Object[]|any[][]} arg.values - 行オブジェクトの配列、またはシートイメージ
 * @returns {sdbLog}
 */
function createTable(query){
  const v = {whois:`${pv.whois+('000'+(pv.jobId++)).slice(-6)}.createTable`,step:0,rv:[],convertRow:null};
  try {
    v.fId = `: table=${query.table}, set=${Object.hasOwn(query,'set')?(query.set.length+'rows'):'undefined'}`;
    console.log(`${v.whois} start${v.fId}`);

    v.table = pv.table[query.table];
    if( v.table.sheet !== null ) throw new Error('Already Exist');

    v.step = 1.3; // query.colsをセット
    if( v.table.schema.cols.length === 0 && query.set.length === 0 )// && v.table.values.length === 0 )
      // シートも項目定義も初期データも無い
      throw new Error('No Cols and Data');

    v.step = 2; // 主キーが存在しない場合は追加
    if( !v.table.schema.cols.find(x => x.primaryKey === true) ){
      v.unique = v.table.schema.cols.find(x => x.unique === true);
      if( v.unique ){
        // ユニーク項目が存在している場合、主キーに昇格
        v.unique.primaryKey = true;
        v.table.schema.primaryKey = v.unique.name;
      } else {
        // ユニーク項目が不存在の場合は追加
        // schema.colsにopt.additionalPrimaryKeyを追加
        v.table.schema.cols.unshift(pv.opt.additionalPrimaryKey);
        // schema.primaryKeyに主キー項目名を設定
        v.table.schema.primaryKey = pv.opt.additionalPrimaryKey.name;
        // schema.uniqueに主キー項目名の空配列を設定
        v.table.schema.unique[pv.opt.additionalPrimaryKey.name] = [];
        // schema.defaultRowに主キー項目を追加
        v.table.schema.defaultRow[pv.opt.additionalPrimaryKey.name] = pv.opt.additionalPrimaryKey.default;
        // table.header先頭に主キー項目名を追加
        v.table.header.unshift(pv.opt.additionalPrimaryKey.name);
        // table.notes先頭に設定内容を追加
        v.r = genColumn(pv.opt.additionalPrimaryKey);
        if( v.r instanceof Error ) throw v.r;
        v.table.notes.unshift(v.r.note);
        // table.colnumを+1
        v.table.colnum++;
      }
    }

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
    if( query.set.length > 0 ){
      v.rv = appendRow({table:v.table.name,record:query.set});
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