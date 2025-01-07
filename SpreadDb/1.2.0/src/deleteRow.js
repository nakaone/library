/** deleteRow: 領域から指定行を物理削除
 * @param {Object} any
 * @param {sdbTable} any.table - 操作対象のテーブル管理情報
 * @param {Object|Function|string} any.where - 対象レコードの判定条件
 * @returns {sdbLog[]}
 *
 * - where句の指定方法: functionalyze参照
 */
function deleteRow(arg){
  const v = {whois:`${pv.whois}.deleteRow`,step:0,rv:[],whereStr:[]};
  console.log(`${v.whois} start.`);
  try {

    // 削除対象行が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
    // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する

    v.step = 1; // 該当レコードかの判別用関数を作成
    v.whereStr = toString(arg.where); // 更新履歴記録用にwhereを文字列化
    arg.where = functionalyze({table:arg.table,data:arg.where});
    if( arg.where instanceof Error ) throw arg.where;

    v.step = 2; // 対象レコードか、後ろから一件ずつチェック
    for( v.i=arg.table.values.length-1 ; v.i>=0 ; v.i-- ){

      v.step = 2.1; // 対象外判定ならスキップ
      if( arg.where(arg.table.values[v.i]) === false ) continue;

      v.step = 2.2; // 一件分のログオブジェクトを作成
      v.log = genLog({
        table: arg.table.name,
        command: 'delete',
        arg: v.whereStr,
        ErrCD: null,
        before: arg.table.values[v.i],
        // after, diffは空欄
      });
      if( v.log instanceof Error ) throw v.log;
      v.rv.push(v.log);

      v.step = 2.3; // 削除レコードのunique項目をarg.table.schema.uniqueから削除
      // arg.table.schema.auto_incrementは削除の必要性が薄いので無視
      // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
      for( v.unique in arg.table.schema.unique ){ // unique項目を順次チェック
        if( arg.table.values[v.i][v.unique] ){  // 対象レコードの当該unique項目が有意な値
          // unique項目一覧(配列)から対象レコードの値の位置を探して削除
          v.idx = arg.table.schema.unique[v.unique].indexOf(arg.table.values[v.i][v.unique]);
          if( v.idx >= 0 ) arg.table.schema.unique[v.unique].splice(v.idx,1);
        }
      }

      v.step = 2.4; // arg.table.valuesから削除
      arg.table.values.splice(v.i,1);

      v.step = 2.5; // シートのセルを削除
      v.range = arg.table.sheet.deleteRow(v.i+2); // 添字->行番号で+1、ヘッダ行分で+1

      v.step = 2.6; // arg.table.rownumを書き換え
      arg.table.rownum -= 1;

    }

    v.step = 9; // 終了処理
    v.rv = v.rv;
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}