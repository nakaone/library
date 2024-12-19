/** genTable: sdbTableオブジェクトを生成
 * @param arg {Object}
 * @param arg.name {string} - シート名
 * @param [arg.cols] {sdbColumn[]} - 新規作成シートの項目定義オブジェクトの配列
 * @param [arg.values] {Object[]|Array[]} - 新規作成シートに書き込む初期値
 * @returns {sdbTable|Error}
 */
function genTable(arg){
  const v = {whois:`${pv.whois}.genTable`,step:0,rv:null};
  console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
  try {

    // ----------------------------------------------
    v.step = 1; // メンバの初期化、既定値設定
    // ----------------------------------------------
    v.rv = {
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


    if( v.rv.sheet !== null ){
      // ----------------------------------------------
      v.step = 2; // シートが存在する場合の戻り値作成処理
      // ----------------------------------------------

      v.step = 2.1; // シートイメージから各種情報を取得
      v.getDataRange = v.rv.sheet.getDataRange();
      v.getValues = v.getDataRange.getValues();
      v.rv.header = JSON.parse(JSON.stringify(v.getValues[0]));
      v.r = convertRow(v.getValues);
      if( v.r instanceof Error ) throw v.r;
      v.rv.values = v.r.obj;
      v.rv.notes = v.getDataRange.getNotes()[0];
      v.rv.colnum = v.rv.header.length;
      v.rv.rownum = v.rv.values.length;

      v.step = 2.3; // スキーマをインスタンス化
      v.r = genSchema({
        cols: [], // notesを優先するので空配列を指定
        header: v.rv.header,
        notes: v.rv.notes,
        values: v.rv.values,
      });
      if( v.r instanceof Error ) throw v.r;
      v.rv.schema = v.r.schema;

    } else {
      // ----------------------------------------------
      // シートが存在しない場合の戻り値作成処理
      // ----------------------------------------------

      if( arg.cols ){

        v.step = 3; // 項目定義が存在する場合
        v.rv.header = arg.cols.map(x => x.name);
        v.rv.colnum = v.rv.header.length;
        if( arg.values ){
          // 項目定義と初期データの両方存在 ⇒ 項目の並びを指定してconvertRow
          v.convertRow = convertRow(arg.values,v.rv.header);
          if( v.convertRow instanceof Error ) throw v.convertRow;
          v.rv.values = v.convertRow.obj;
          v.rv.rownum = v.convertRow.raw.length;
        } else {
          // 項目定義のみ存在 ⇒ values, rownumは取得不能なので既定値のまま
          v.convertRow = null;
        }

      } else {
        if( arg.values ){
          v.step = 4; // 項目定義不在で初期データのみ存在の場合
          v.convertRow = convertRow(arg.values);
          if( v.convertRow instanceof Error ) throw v.convertRow;
          v.rv.values = v.convertRow.obj;
          v.rv.header = v.convertRow.header;
          v.rv.colnum = v.rv.header.length;
          v.rv.rownum = v.convertRow.raw.length;
        } else {
          // シートも項目定義も初期データも無いならエラー
          throw new Error(`シートも項目定義も初期データも存在しません`);
        }
      }

      v.step = 5; // スキーマをインスタンス化
      v.r = genSchema({
        cols: arg.cols || null,
        header: v.rv.header,
        notes: v.rv.notes,
        values: v.rv.values,
      });
      if( v.r instanceof Error ) throw v.r;
      v.rv.schema = v.r.schema;
      v.rv.notes = v.r.notes;

      // ----------------------------------------------
      v.step = 6; // シートが存在しない場合、新規追加
      // ----------------------------------------------
      v.step = 6.1; // シートの追加
      v.rv.sheet = pv.spread.insertSheet();
      v.rv.sheet.setName(arg.name);

      v.step = 6.2; // シートイメージのセット
      v.data = [v.rv.header, ...(v.convertRow === null ? [] : v.convertRow.raw)];
      v.rv.sheet.getRange(1,1,v.data.length,v.rv.colnum).setValues(v.data);

      v.step = 6.3; // 項目定義メモの追加
      console.log(`l.391 v.rv.column=${JSON.stringify(v.rv.column)}\nv.rv.notes=${JSON.stringify(v.rv.notes)}`)
      v.rv.sheet.getRange(1,1,1,v.rv.colnum).setNotes([v.rv.notes]);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}