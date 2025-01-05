/** createTable: 新規にシートを作成
 * @param {sdbTable} arg
 * @param {string} arg.table - テーブル名
 * @param {sdbColumn[]} arg.cols - 項目定義オブジェクトの配列
 * @param {Object[]|any[][]} arg.values - 行オブジェクトの配列、またはシートイメージ
 * @returns {sdbLog}
 */
function createTable(arg){
  const v = {whois:`${pv.whois}.createTable`,step:0,rv:[],convertRow:null};
  console.log(`${v.whois} start. arg.table=${arg.table}`);
  try {

    // ----------------------------------------------
    v.step = 1; // 事前準備
    // ----------------------------------------------
    v.step = 1.1; // 一件分のログオブジェクトを作成
    v.log = genLog({
      table: arg.table,
      command: 'create',
      arg: arg.cols,
      isErr: false,
      message: `created ${Object.hasOwn(arg,'values') ? arg.values.length : 0} rows.`,
      // before, after, diffは空欄
    });
    if( v.log instanceof Error ) throw v.log;

    v.step = 1.2; // sdbTableのプロトタイプ作成
    v.table = {
      name: arg.table, // {string} テーブル名(範囲名)
      account: pv.opt.userId, // {string} 更新者のアカウント
      sheet: pv.spread.getSheetByName(arg.table), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
      schema: null, // {sdbSchema} シートの項目定義
      values: [], // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
      header: [], // {string[]} 項目名一覧(ヘッダ行)
      notes: [], // {string[]} ヘッダ行のメモ
      colnum: 0, // {number} データ領域の列数
      rownum: 0, // {number} データ領域の行数
    };

    // ----------------------------------------------
    v.step = 2; // テーブル管理情報の作成
    // ----------------------------------------------
    if( arg.cols ){

      v.step = 2.1; // 項目定義情報が存在する場合
      v.table.header = arg.cols.map(x => x.name);
      v.table.colnum = v.table.header.length;

    } else { // 項目定義情報が存在しない場合

      if( arg.values ){

        v.step = 2.2; // 項目定義不在で初期データのみ存在
        v.convertRow = convertRow(arg.values);
        if( v.convertRow instanceof Error ) throw v.convertRow;
        v.table.header = v.convertRow.header;
        v.table.colnum = v.table.header.length;

      } else {

        v.step = 2.3; // シートも項目定義も初期データも無い
        throw new Error(`シートも項目定義も初期データも存在しません`);

      }
    }

    v.step = 2.4; // スキーマをインスタンス化
    v.r = genSchema({
      cols: arg.cols || null,
      header: v.table.header,
      notes: v.table.notes,
      values: v.table.values,
    });
    if( v.r instanceof Error ) throw v.r;
    v.table.schema = v.r.schema;
    v.table.notes = v.r.notes;

    // ----------------------------------------------
    v.step = 3; // シートが存在しない場合、新規追加
    // ----------------------------------------------
    if( v.table.sheet === null ){
      v.step = 3.1; // シートの追加
      v.table.sheet = pv.spread.insertSheet();
      v.table.sheet.setName(arg.table);

      v.step = 3.2; // ヘッダ行・メモのセット
      v.headerRange = v.table.sheet.getRange(1,1,1,v.table.colnum);
      v.headerRange.setValues([v.table.header]);  // 項目名のセット
      v.headerRange.setNotes([v.table.notes]);  // メモのセット
      v.table.sheet.autoResizeColumns(1,v.table.colnum);  // 各列の幅を項目名の幅に調整
      v.table.sheet.setFrozenRows(1); // 先頭1行を固定

      v.step = 3.3; // 初期データの追加
      if( (arg.values||[]).length > 0 ){
        if( v.convertRow === null ){
          v.convertRow = convertRow(arg.values,v.table.header);
          if( v.convertRow instanceof Error ) throw v.convertRow;
        }
        v.r = appendRow({table:v.table,record:v.convertRow.obj});
        if( v.r instanceof Error ) throw v.r;
      }
    } else {
      v.log.message = `"${v.table.name}" is already exist.`;
    }

    v.step = 9; // 終了処理
    pv.table[v.table.name] = v.table;
    v.rv = [v.log];
    console.log(`${v.whois}: create "${arg.table}" normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}