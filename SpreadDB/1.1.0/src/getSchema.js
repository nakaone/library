/** getSchema: 指定テーブルの項目定義情報を取得
 * @param {string|string[]} arg - 取得対象テーブル名
 * @returns {Object.<string,sdbColumn[]>} {テーブル名：項目定義オブジェクトの配列}形式
 */
function getSchema(arg){
  const v = {whois:'sdbTable.getSchema',step:0,rv:[]};
  console.log(`${v.whois} start.`);
  try {

    if( typeof arg === 'string' ) arg = [arg];
    arg.forEach(x => v.rv.push(pv.table[x].schema));

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