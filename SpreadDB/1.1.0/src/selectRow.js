/** selectRow: テーブルから該当行を抽出
 * @param {Object|Object[]} arg
 * @param {sdbTable} arg.table - 操作対象のテーブル管理情報
 * @param {Object|function} arg.where - 対象レコード判定条件
 * @returns {Object[]} 該当行オブジェクトの配列
 *
 * - where句の指定方法: functionalyze参照
 */
function selectRow(arg){
  const v = {whois:`${pv.whois}.selectRow`,step:0,rv:[]};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 判定条件を関数に統一
    v.where = functionalyze({table:arg.table,data:arg.where});
    if( v.where instanceof Error ) throw v.where;

    v.step = 2; // 行オブジェクトを順次走査、該当行を戻り値に追加
    for( v.i=0 ; v.i<arg.table.values.length ; v.i++ ){
      if( v.where(arg.table.values[v.i]) ){
        v.rv.push(arg.table.values[v.i]);
      }
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nrows=${v.rv.length}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}