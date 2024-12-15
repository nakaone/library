/** getSchema: 指定テーブルの項目定義情報を取得
 * @param {string|string[]} where=[] - 対象レコードの判定条件
 * @returns {sdbLog[]}
 */
function getSchema(where){
  const v = {whois:'sdbTable.getSchema',step:0,rv:[],log:[],where:[],argument:JSON.stringify(where)};
  console.log(`${v.whois} start.\nwhere(${whichType(where)})=${stringify(where)}`);
  try {


    v.step = 9; // 終了処理
    v.rv = v.log;
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}