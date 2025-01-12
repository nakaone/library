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
function convertRow(data=[],header=[]){
  const v = {whois:pv.whois+'.convertRow',step:0,rv:{raw:[],obj:data,header:header}};
  try {

    console.log(`${v.whois} start\ndata=${JSON.stringify(data.slice(0,2))}\nheader=${JSON.stringify(header)}`);

    if( data.length > 0 ){

      v.step = 1; // ヘッダ未定義の場合、dataがシートイメージなら先頭行、行オブジェクトならメンバ名から作成
      // シートイメージの先頭行を使用する場合、createで主キー項目を追加(unshift)する場合に元データの先頭行も変化してしまうのでシャローコピーする
      if( v.rv.header.length === 0 ){
        v.rv.header = Array.isArray(data[0]) ? [...data[0]] : [...new Set(data.flatMap(d => Object.keys(d)))];
      }

      if( Array.isArray(data[0]) ){ // dataがシートイメージの場合
        v.step = 2; // シートイメージを一度行オブジェクトに変換(∵列の並びをheader指定に合わせる)
        v.rv.obj = [];
        for( v.i=1 ; v.i<data.length ; v.i++ ){
          v.o = {};
          for( v.j=0 ; v.j<data[v.i].length ; v.j++ ){
            if( data[v.i][v.j] ){
              v.o[data[0][v.j]] = data[v.i][v.j];
            }
          }
          v.rv.obj.push(v.o);
        }
      }

      v.step = 3; // ヘッダの項目名の並びに基づき、行オブジェクトからシートイメージを生成
      for( v.i=0 ; v.i<v.rv.obj.length ; v.i++ ){
        v.arr = [];
        for( v.j=0 ; v.j<v.rv.header.length ; v.j++ ){
          v.arr.push(v.rv.obj[v.i][v.rv.header[v.j]] || '');
        }
        v.rv.raw.push(v.arr);
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