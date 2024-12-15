/** selectRow: テーブルから該当行を抽出
 * @param {Object|Object[]} record=[] - 追加するオブジェクトの配列
 * @returns {sdbLog[]}
 */
function selectRow(record){
  const v = {whois:`${pv.whois}.selectRow`,step:0,rv:[],argument:JSON.stringify(record)};
  console.log(`${v.whois} start.\nrecord(${whichType(record)})=${stringify(record)}`);
  try {

    // ------------------------------------------------
    v.step = 1; // 事前準備
    // ------------------------------------------------


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