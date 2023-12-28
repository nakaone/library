/** 単純テーブルをクロス集計に変換する
 * @param {Object[]} data - 集計の基となるデータ
 * @param {string[]} yCols - 縦軸となる項目名の配列
 * @param {string} xCol - 横軸となる項目名
 * @param {string|string[]} val - 値としてほしい項目名の配列。
 * @returns {any[][]|Error}
 */
function crossTab(data,yCols,xCol,val){
  const v = {whois:'crossTab',rv:[],step:0};
  //console.log(`${v.whois} start.`);
  try {

    for( v.i=0 ; v.i<data.length ; v.i++ ){
      v.step = 1.1; // 縦軸となる項目名を持つ行が登録済か検索
      v.obj = v.rv.find(x => {
        let rv = true;
        yCols.forEach(y => {if(x[y] !== data[v.i][y]) rv=false});
        return rv;
      });

      if( !v.obj ){
        v.step = 1.2; // 未登録の場合は新規登録
        v.obj = {};
        // 縦軸となる項目名
        yCols.forEach(y => v.obj[y] = data[v.i][y]);
        // 横軸となる項目名をオブジェクトとして登録
        v.obj[xCol] = {};
        v.rv.push(v.obj);
      }

      v.step = 2; // 登録する値を作成
      if( typeof val === 'string' ){
        v.step = 2.1; // 項目が一つだけの場合
        v.obj[xCol][data[v.i][xCol]] = data[v.i][val];
      } else {
        v.step = 2.2; // 複数項目の場合
        v.val = {};
        val.forEach(x => v.val[x] = data[v.i][x] || 0)
        v.obj[xCol][data[v.i][xCol]] = v.val;
      }
    }

    v.step = 3; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\ndata=${JSON.stringify(data.slice(0,5))}`
    + `\nyCols=${JSON.stringify(yCols)}`
    + `\nxCol=${xCol}`
    + `\nval=${JSON.stringify(val)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}