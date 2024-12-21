/** genTable: sdbTableオブジェクトを生成
 * @param arg {Object}
 * @param arg.name {string} - シート名
 * @param [arg.cols] {sdbColumn[]} - 新規作成シートの項目定義オブジェクトの配列
 * @param [arg.values] {Object[]|Array[]} - 新規作成シートに書き込む初期値
 * @returns {sdbTable|null} シート不存在ならnull
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
    if( v.rv.sheet === null ) return null;  // シート不存在ならnull

    // ----------------------------------------------
    v.step = 2; // シートから各種情報を取得
    // ----------------------------------------------

    v.step = 2.1; // シートイメージを読み込み
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

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}