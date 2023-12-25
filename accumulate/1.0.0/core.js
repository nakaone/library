/** 累計を行う
 * @param {string[]} yCols - 縦軸となる項目名の配列
 * @param {Object} xCols
 * @param {string} xCols.label - 横軸となる項目名
 * @param {string[]|number[]} xCols.list - 横軸となる項目の値の配列
 * @param {Function} func - 一つ前の値に対して行う関数
 * @returns 
 */
function accumulate(yCols,xCol,func){
  const v = {whois:'accumulate',rv:null,step:0};
  //console.log(`${v.whois} start.`);
  try {

    v.step = 9; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\njournalsRange=${journalsRange}`  // 引数
    + `, accountsRange=${accountsRange}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}