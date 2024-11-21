/** delete: 領域に新規行を追加
 * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
 * @returns {Object} {success:[],failure:[]}形式
 */
delete(records){
  const v = {whois:'sdbTable.delete',step:0,rv:{success:[],failure:[],log:[]},
    cols:[],sheet:[]};
  console.log(`${v.whois} start.\nrecords(${whichType(records)})=${stringify(records)}`);
  try {

    // ------------------------------------------------
    v.step = 1; // 事前準備
    // ------------------------------------------------

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
