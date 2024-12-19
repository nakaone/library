/** convertRow: シートイメージと行オブジェクトの相互変換
 * @param {any[][]|Object[]} data - 行データ。シートイメージか行オブジェクトの配列
 * @param {string[]} [header]=[] - ヘッダ行。rowが行オブジェクトで項目の並びを指定したい場合に使用
 * @returns {Object}
 *
 * - 戻り値のオブジェクト
 *   - raw {any[][]} シートイメージ
 *   - obj {Object[]} 行オブジェクトの配列
 *   - header {string} ヘッダ行
 */
function convertRow(data,header=[]){
  const v = {whois:pv.whois+'.convertRow',step:0,rv:{}};
  console.log(`${v.whois} start.`);
  try {

    if( Array.isArray(data)[0] ){
      v.step = 1; // シートイメージ -> 行オブジェクト
      v.rv.raw = data;
      v.rv.obj = [];
      v.rv.header = data[0];
      for( v.i=0 ; v.i<data.length ; v.i++ ){
        v.o = {};
        for( v.j=0 ; v.j<data[v.i].length ; v.j++ ){
          if( data[v.i][v.j] ){
            v.o[data[0][v.j]] = data[v.i][v.j];
          }
        }
        v.rv.obj.push(v.o);
      }
    } else {
      v.step = 2; // 行オブジェクト -> シートイメージ
      v.rv.raw = [];
      v.rv.obj = data;
      v.rv.header = Object.keys(data[0]);
      for( v.map={},v.i=0 ; v.i<v.rv.header ; v.i++ ){
        v.map[v.rv.header[v.i]] = v.i;
      }
      for( v.i=0 ; v.i<data.length ; v.i++ ){
        v.arr = [];
        for( v.j in data[v.i] ){
          if( v.map[v.j] === undefined ){
            // 未登録の項目があれば追加
            v.map[v.j] = v.rv.header.length;
            v.rv.header.push(v.j);
          }
          v.arr[v.map[v.j]] = data[v.i][v.j];
        }
      }
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}