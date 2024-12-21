/** createTable: 新規にシートを作成
 * @param {sdbTable} arg
 * @param {string} arg.name - テーブル名
 * @param {sdbColumn[]} arg.cols - 項目定義オブジェクトの配列
 * @param {Object[]|any[][]} arg.values - 行オブジェクトの配列、またはシートイメージ
 * @returns {sdbLog}
 */
function createTable(arg){
  const v = {whois:`${pv.whois}.createTable`,step:0,rv:[]};
  console.log(`${v.whois} start. arg.name=${arg.name}`);
  try {

    v.step = 1; // 一件分のログオブジェクトを作成
    v.log = genLog({
      table: arg.name,
      command: 'create',
      arg: arg.cols,
      result: true,
      message: `created ${Object.hasOwn(arg,'values') ? arg.values.length : 0} rows.`,
      // before, after, diffは空欄
    });
    if( v.log instanceof Error ) throw v.log;

    // ----------------------------------------------
    // テーブル管理情報が未作成の場合、作成
    // ----------------------------------------------
    if( Object.hasOwn(pv.table,arg.name) ) v.table = pv.table[arg.name]; else {

      v.step = 2; // sdbTableのプロトタイプ作成
      v.table = {
        name: arg.name, // {string} テーブル名(範囲名)
        account: pv.opt.user ? pv.opt.user.id : null, // {string} 更新者のアカウント
        sheet: pv.spread.getSheetByName(arg.name), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
        schema: null, // {sdbSchema} シートの項目定義
        values: [], // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
        header: [], // {string[]} 項目名一覧(ヘッダ行)
        notes: [], // {string[]} ヘッダ行のメモ
        colnum: 0, // {number} データ領域の列数
        rownum: 0, // {number} データ領域の行数
      };

      if( arg.cols ){ v.step = 3; // 項目定義情報が存在する場合

        v.table.header = arg.cols.map(x => x.name);
        v.table.colnum = v.table.header.length;

        if( arg.values ){ v.step = 3.1; // 項目定義と初期データの両方存在

          // 項目の並びを指定してconvertRow
          v.convertRow = convertRow(arg.values,v.table.header);
          if( v.convertRow instanceof Error ) throw v.convertRow;
          v.table.values = v.convertRow.obj;
          v.table.rownum = v.convertRow.raw.length;

        } else {  v.step = 3.2; // 項目定義のみ存在

          // values, rownumは取得不能なので既定値のまま
          v.convertRow = null;

        }

      } else { v.step = 4; // 項目定義情報が存在しない場合

        if( arg.values ){ v.step = 4.1; // 項目定義不在で初期データのみ存在

          v.convertRow = convertRow(arg.values);
          if( v.convertRow instanceof Error ) throw v.convertRow;
          v.table.values = v.convertRow.obj;
          v.table.header = v.convertRow.header;
          v.table.colnum = v.table.header.length;
          v.table.rownum = v.convertRow.raw.length;

        } else {  v.step = 4.2; // シートも項目定義も初期データも無い
          throw new Error(`シートも項目定義も初期データも存在しません`);
        }
      }

      v.step = 5; // スキーマをインスタンス化
      v.r = genSchema({
        cols: arg.cols || null,
        header: v.table.header,
        notes: v.table.notes,
        values: v.table.values,
      });
      if( v.r instanceof Error ) throw v.r;
      v.table.schema = v.r.schema;
      v.table.notes = v.r.notes;
    }

    // ----------------------------------------------
    v.step = 6; // シートが存在しない場合、新規追加
    // ----------------------------------------------
    v.table.sheet = pv.spread.getSheetByName(v.table.name);
    if( v.table.sheet === null ){
      v.step = 6.1; // シートの追加
      v.table.sheet = pv.spread.insertSheet();
      v.table.sheet.setName(arg.name);

      v.step = 6.2; // シートイメージのセット
      v.data = v.convertRow === null ? [v.table.header] : v.convertRow.raw;
      v.table.sheet.getRange(1,1,v.data.length,v.table.colnum).setValues(v.data);
      v.table.sheet.autoResizeColumns(1,v.table.colnum);  // 各列の幅を項目名の幅に調整

      v.step = 6.3; // 項目定義メモの追加
      v.table.sheet.getRange(1,1,1,v.table.colnum).setNotes([v.table.notes]);
    }

    v.step = 9; // 終了処理
    pv.table[v.table.name] = v.table;
    v.rv = [v.log];
    console.log(`${v.whois}: create "${arg.name}" normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}