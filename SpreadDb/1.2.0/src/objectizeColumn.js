/** objectizeColumn: 項目定義メタ情報(JSDoc)からオブジェクトを生成
 * @param arg {Object[]|string} - 文字列の場合、pv.opt以下に定義されているメンバ(typedef)と看做す
 * @param arg.name {string}
 * @param arg.default {string|function}
 * @returns {Object}
 */
function objectizeColumn(arg){
  const v = {whois:`${pv.whois}.objectizeColumn`,step:0,rv:{}};
  try {

    if( typeof arg === 'string' ){
      v.arg = pv.opt[arg];
      v.fId = `: name=${arg}`;
    } else {
      v.arg = Array.isArray(arg) ? arg : [arg];  // 配列可の引数は配列に統一
      v.fId = '';
    }
    console.log(`${v.whois} start${v.fId}`);

    v.step = 1;
    for( v.i=0 ; v.i<v.arg.length ; v.i++ ){
      //console.log('l.1391',JSON.stringify(v.arg[v.i],(key,val)=>typeof val==='function'?val.toString():val,2))
      if( Object.hasOwn(v.arg[v.i],'default') && v.arg[v.i].default ){
        v.step = 2;
        //console.log(`l.1394 v.arg[${v.i}].default(${whichType(v.arg[v.i].default)})=${toString(v.arg[v.i].default)}`)
        v.func = functionalyze(v.arg[v.i].default);
        if( v.func instanceof Error ) throw v.func;
        v.rv[v.arg[v.i].name] = v.func();
      } else {
        v.step = 3; // 既定値の指定が無い場合はnullとする
        v.rv[v.arg[v.i].name] = null;
      }
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