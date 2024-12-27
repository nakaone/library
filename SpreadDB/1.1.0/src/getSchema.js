/** getSchema: 指定テーブルの項目定義情報を取得
 * @param {string|string[]} arg - 取得対象テーブル名
 * @returns {Object.<string,sdbColumn[]>} {テーブル名：項目定義オブジェクトの配列}形式
 */
function getSchema(arg){
  const v = {whois:`${pv.whois}.getSchema`,step:0,rv:[]};
  console.log(`${v.whois} start.\narg(${whichType(arg)})=${JSON.stringify(arg)}`);
  try {

    v.step = 1.1; // 引数のデータ型チェック
    if( !whichType(arg,'Object') || !Object.hasOwn(arg,'table') ){
      throw new Error('引数にtableが含まれていません');
    }
    v.step = 1.2; // 対象テーブル名の配列化
    v.arg = typeof arg.table === 'string' ? [arg.table]: arg.table;

    v.step = 2; // 戻り値の作成
    for( v.i=0 ; v.i<v.arg.length ; v.i++ ){
      if( !pv.table[v.arg[v.i]] ){  // 以前のcommandでテーブル管理情報が作られていない場合は作成
        pv.table[v.arg[v.i]] = genTable({name:v.arg[v.i]});
        if( pv.table[v.arg[v.i]] instanceof Error ) throw pv.table[v.arg[v.i]];
      }
      v.rv.push(pv.table[v.arg[v.i]]);
    }

    v.step = 9; // 終了処理
    v.rv = v.log;
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}