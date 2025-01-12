/** genTable: pv.table(sdbTable)を生成
 * @param arg {Object}
 * @param arg.name {string} - シート名
 * @param [arg.cols] {sdbColumn[]} - 新規作成シートの項目定義オブジェクトの配列
 * @param [arg.values] {Object[]|Array[]} - 新規作成シートに書き込む初期値
 * @returns {sdbTable|null} シート不存在ならnull
 */
function genTable(arg){
  const v = {whois:`${pv.whois}.genTable`,step:0,rv:null};
  try {

    if( !arg || !arg.name ) throw new Error(`No Name`);
    v.fId = `: name=${arg.name}`;
    console.log(`${v.whois} start${v.fId}`);

    v.step = 1; // 既にpv.tableに存在するなら何もしない
    if( !pv.table[arg.name] ){

      v.step = 2; // テーブルのプロトタイプを作成、初期化＋既定値設定
      v.r = objectizeColumn('sdbTable');
      if( v.r instanceof Error ) throw v.r;
      pv.table[arg.name] = v.table = Object.assign(v.r,{
        name: arg.name, // {string} テーブル名(範囲名)
        sheet: pv.spread.getSheetByName(arg.name), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
      });

      v.step = 3; // シートの存否確認
      if( v.table.sheet === null ){

        v.step = 4; // シート不在なら引数から項目定義を作成
        if( arg.cols ){
          v.step = 4.1; // 引数に項目定義オブジェクトが存在
          v.table.schema.cols = arg.cols;
          v.table.header = arg.cols.map(x => x.name);
        } else {
          if( arg.values ){
            v.step = 4.2; // 引数に項目定義オブジェクトが不存在だが初期データは存在
            v.r = convertRow(arg.values);
            if( v.r instanceof Error ) throw v.r;
            v.table.header = v.r.header;
          } else {
            v.step = 4.3; // 項目定義も初期データも無いならエラー
            throw new Error('No Cols and Data');
          }
        }

        v.step = 4.4; // 項目数・データ行数の設定
        v.table.colnum = v.table.header.length;
        v.table.rownum = 0;

        // 尚v.table.notes(項目定義メモ)は設定不要
        // ∵ step.6のgenSchema経由genColumnでcolsから作成される

      } else {

        v.step = 5; // シートが存在するならシートから各種情報を取得
        v.step = 5.1; // シートイメージを読み込み
        v.getDataRange = v.table.sheet.getDataRange();
        v.getValues = v.getDataRange.getValues();

        v.step = 5.2; // シートイメージからヘッダ行・行オブジェクトを作成
        v.r = convertRow(v.getValues);
        if( v.r instanceof Error ) throw v.r;

        v.step = 5.3; // ヘッダ・データの設定
        v.table.header = v.r.header;
        v.table.values = v.r.obj;
        v.table.colnum = v.table.header.length;
        v.table.rownum = v.table.values.length;

        v.step = 5.4; // ヘッダ行のメモ(項目定義メモ)を取得
        v.table.notes = v.getDataRange.getNotes()[0];

      }

      v.step = 6; // スキーマをインスタンス化
      v.r = genSchema(v.table);
      if( v.r instanceof Error ) throw v.r;
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end${v.fId}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v,(key,val)=>typeof val==='function'?val.toString():val,2)}`);
    return e;
  }
}