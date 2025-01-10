/** appendRow: 領域に新規行を追加
 * @param {Object|Object[]} arg
 * @param {sdbTable} arg.table - 操作対象のテーブル名
 * @param {Object|Object[]} arg.record=[] - 追加する行オブジェクト
 * @returns {sdbLog[]}
 *
 * - 重複エラーが発生した場合、ErrCD='Duplicate' + diffに{項目名：重複値}形式で記録
 */
function appendRow(arg){
  const v = {whois:`${pv.whois}.appendRow`,step:0,rv:[],target:[]};
  try {

    // ------------------------------------------------
    v.step = 1; // 事前準備
    // ------------------------------------------------
    if( !Array.isArray(arg.record)) arg.record = [arg.record];
    v.fId = `: table=${arg.table} record=${arg.record.length}rows`;
    console.log(`${v.whois} start${v.fId}\nsample=${JSON.stringify(arg.record[0])}`);

    v.table = pv.table[arg.table];

    // ------------------------------------------------
    v.step = 2; // 追加レコードをシートイメージに展開
    // ------------------------------------------------
    for( v.i=0 ; v.i<arg.record.length ; v.i++ ){

      v.step = 2.1; // 1レコード分のログを準備
      v.log = objectizeColumn('sdbResult');
      if( v.log instanceof Error ) throw v.log;
      vlog(v.log,596)
      // 主キーの値をpKeyにセット
      vlog(v.table.schema,597)
      vlog(arg.record,598)
      v.log.pKey = arg.record[v.i][v.table.schema.primaryKey];

      v.step = 2.2; // auto_increment項目に値を設定
      // ※ auto_increment設定はuniqueチェックに先行
      for( v.ai in v.table.schema.auto_increment ){
        if( !arg.record[v.i][v.ai] ){ // 値が未設定だった場合は採番実行
          v.table.schema.auto_increment[v.ai].current += v.table.schema.auto_increment[v.ai].step;
          arg.record[v.i][v.ai] = v.table.schema.auto_increment[v.ai].current;
        }
      }

      v.step = 2.3; // 既定値の設定
      for( v.dv in v.table.schema.defaultRow ){
        arg.record[v.i][v.dv] = v.table.schema.defaultRow[v.dv](arg.record[v.i]);
      }

      v.step = 2.4; // 追加レコードの正当性チェック(unique重複チェック)
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

      v.step = 2.5; // 正当性チェックOKの場合の処理
      if( v.log.rSts === 'OK' ){

        v.step = 2.51; // シートイメージに展開して登録
        v.row = [];
        for( v.j=0 ; v.j<v.table.header.length ; v.j++ ){
          v.a = arg.record[v.i][v.table.header[v.j]];
          v.row[v.j] = (v.a && v.a !== 'null' && v.a !== 'undefined') ? v.a : '';
        }
        v.target.push(v.row);

        v.step = 2.52; // v.table.valuesへの追加
        v.table.values.push(arg.record[v.i]);

        v.step = 2.53; // ログに追加レコード情報を記載
        v.log.diff = JSON.stringify(arg.record[v.i]);
      }

      v.step = 2.6; // 成否に関わらず戻り値に保存
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