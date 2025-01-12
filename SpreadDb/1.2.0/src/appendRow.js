/** appendRow: 領域に新規行を追加
 * @param {Object|Object[]} arg
 * @param {sdbTable} arg.table - 操作対象のテーブル名
 * @param {Object|Object[]} arg.record=[] - 追加する行オブジェクト
 * @returns {sdbLog[]}
 *
 * - 重複エラーが発生した場合、ErrCD='Duplicate' + diffに{項目名：重複値}形式で記録
 */
function appendRow(arg){
  const v = {whois:`${pv.whois+('000'+(pv.jobId++)).slice(-6)}.appendRow`,step:0,rv:[],target:[]};
  try {

    // ------------------------------------------------
    v.step = 1; // 引数チェック、v.fId作成
    // ------------------------------------------------

    v.step = 1.1; // arg.tableの判定 ⇒ pv.tableに存在しなければエラー
    if( !Object.hasOwn(arg,'table') || typeof arg.table !== 'string' || !Object.hasOwn(pv.table,arg.table) )
      throw new Error(`Invalid Table`);
    v.fId = `: table=${arg.table}`;
    v.table = pv.table[arg.table];  // v.tableに対象のテーブル管理情報をセット

    v.step = 1.2; // arg.recordの判定
    if( !Object.hasOwn(arg,'record') ) throw new Error(`No Record`);  // arg.recordが不存在

    v.step = 1.3;
    // ①一行分のシートイメージ ⇒ any[] ⇒ 二次元配列化
    // ②一行分の行オブジェクト ⇒ Object ⇒ 配列化
    // ③複数行分のシートイメージ ⇒ any[][] ⇒ 行オブジェクトに変換
    // ④複数行分の行オブジェクト ⇒ Object[] ⇒ そのまま使用
    // ⑤上記以外 ⇒ エラー
    if( Array.isArray(arg.record) ){
      v.step = 1.31; // 配列の長さ0
      if( arg.record.length === 0 ) throw new Error(`Length is 0`);
      if( whichType(arg.record[0],'Object') ){
        v.step = 1.32; // ④ ⇒ そのまま使用
        v.img = `[4]sample=${JSON.stringify(arg.record[0])}`;
      } else {
        if( Array.isArray(arg.record[0]) ){
          v.step = 1.33; // ③ ⇒ 行オブジェクトに変換
          v.img = `[3]sample=${JSON.stringify(arg.record[0])}`;
          v.r = convertRow(arg.record);
          if( v.r instanceof Error ) throw v.r;
          arg.record = v.r.obj;
        } else {
          v.step = 1.34;  // ① ⇒ 二次元配列化
          v.img = `[1]record=${JSON.stringify(arg.record)}`;
          arg.record = [arg.record];
        }
      }
    } else {
      if( whichType(arg.record,'Object') ){
        v.step = 1.35; // ② ⇒ 配列化
        v.img = `[2]record=${JSON.stringify(arg.record)}`;
        arg.record = [arg.record];
      } else {
        v.step = 1.36; // ⑤ ⇒ エラー
        throw new Error(`Invalid Record`);
      }
    }
    v.step = 1.4;
    console.log(`${v.whois} start${v.fId}\n${v.img}`);

    // ------------------------------------------------
    v.step = 2; // 追加レコードをシートイメージに展開
    // ------------------------------------------------
    for( v.i=0 ; v.i<arg.record.length ; v.i++ ){

      v.step = 2.1; // 1レコード分のログを準備
      v.log = objectizeColumn('sdbResult');
      if( v.log instanceof Error ) throw v.log;

      v.step = 2.2; // 主キーの値をpKeyにセット
      v.log.pKey = arg.record[v.i][v.table.schema.primaryKey];

      v.step = 2.3; // auto_increment項目に値を設定
      // ※ auto_increment設定はuniqueチェックに先行
      for( v.ai in v.table.schema.auto_increment ){
        if( !arg.record[v.i][v.ai] ){ // 値が未設定だった場合は採番実行
          v.table.schema.auto_increment[v.ai].current += v.table.schema.auto_increment[v.ai].step;
          arg.record[v.i][v.ai] = v.table.schema.auto_increment[v.ai].current;
        }
      }

      v.step = 2.4; // 既定値の設定
      for( v.dv in v.table.schema.defaultRow ){
        arg.record[v.i][v.dv] = v.table.schema.defaultRow[v.dv](arg.record[v.i]);
      }

      v.step = 2.5; // 追加レコードの正当性チェック(unique重複チェック)
      for( v.unique in v.table.schema.unique ){
        if( v.table.schema.unique[v.unique].indexOf(arg.record[v.i][v.unique]) >= 0 ){
          // 登録済の場合はエラーとして処理
          v.log.rSts = 'Duplicate';
          v.log.diff[v.unique] = arg.record[v.i][v.unique]; // diffに{unique項目名:重複値}を保存
        } else {
          // 未登録の場合v.table.sdbSchema.uniqueに値を追加
          v.table.schema.unique[v.unique].push(arg.record[v.i][v.unique]);
        }
      }

      v.step = 2.6; // 正当性チェックOKの場合の処理
      if( v.log.rSts === 'OK' ){

        v.step = 2.61; // シートイメージに展開して登録
        v.row = [];
        for( v.j=0 ; v.j<v.table.header.length ; v.j++ ){
          v.a = arg.record[v.i][v.table.header[v.j]];
          v.row[v.j] = (v.a && v.a !== 'null' && v.a !== 'undefined') ? v.a : '';
        }
        v.target.push(v.row);

        v.step = 2.62; // v.table.valuesへの追加
        v.table.values.push(arg.record[v.i]);

        v.step = 2.63; // ログに追加レコード情報を記載
        v.log.diff = JSON.stringify(arg.record[v.i]);
      }

      v.step = 2.7; // 成否に関わらず戻り値に保存
      v.rv.push(v.log);
    }

    // ------------------------------------------------
    v.step = 3; // 対象シート・更新履歴に展開
    // ------------------------------------------------
    v.step = 3.1; // 対象シートへの展開
    if( v.target.length > 0 ){
      v.table.sheet.getRange(
        v.table.rownum + 2,
        1,
        v.target.length,
        v.target[0].length
      ).setValues(v.target);
    }
    v.step = 3.2; // v.table.rownumの書き換え
    v.table.rownum += v.target.length;

    v.step = 9; // 終了処理
    v.rv = v.rv;
    console.log(`${v.whois} normal end${v.fId}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}