/** simpleTable: 指定シートをオブジェクトの配列とし、JSONで返す
 * @param {Object} arg
 * @param {string} arg.func - 'get' or 'set'
 * @param {string} arg.name - シート名
 * @param {string} arg.key - 対象判定時のキーとなる項目名
 * @param {string} arg.val - 対象判定時の値。日時はUNIX時刻で指定
 * @param {Object} arg.data - 更新内容
 * @returns {Object.<string,any>} 行単位のデータオブジェクトの配列
 * 
 * **制約事項**
 * 
 * - ラベル行は1行目で固定、ラベル行内の空欄は不可
 * - 空白行は出力対象に含めない
 * - 空欄は出力対象に含めない
 * - 更新は一回一行、かつ条件は一項目のみ指定可
 * - getは全件取得のみ、抽出は行わない
 */
function simpleTable(arg){
  const v = {whois:'simpleTable',step:0,rv:[]};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    v.step = 1; // 事前準備
    if( whichType(arg,'String') ) arg = {func:'get',name:arg};
    arg.func = arg.func || 'get';

    v.step = 2; // シートデータの取得
    v.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(arg.name);
    v.data = v.sheet.getDataRange().getValues();
    if( !v.data || v.data.length < 2 ) throw new Error('invalid sheet data');


    if( arg.func === 'get' ){
      v.step = 3; // オブジェクトの配列に変換
      for( v.r=1 ; v.r < v.data.length ; v.r++ ){
        v.o = {};
        for( v.c=0 ; v.c<v.data[0].length ; v.c++ ){
          v.val = v.data[v.r][v.c];
          if( String(v.val).length > 0 ){
            v.o[v.data[0][v.c]] // 日付型はフォーマット変換
            = whichType(v.val,'Date') ? toLocale(v.val) : v.val;
          }
        }
        if( Object.keys(v.o).length > 0 ) v.rv.push(v.o);
      }      
    } else {
      v.step = 4.1; // 列番号を特定
      v.c = v.data[0].findIndex(x => x === arg.key);
      if( v.c < 0 ) throw new Error(`Couldn't find key column "${arg.key}"`);

      for( v.r=1 ; v.r<v.data.length ; v.r++ ){
        v.step = 4.2; // 行を特定
        v.val = v.data[v.r][v.c]; // Date型はUNIX時刻に統一
        if( whichType(v.val,'Date') ) v.val = v.val.getTime();
        if( v.val === arg.val ){
          v.arr = [];
          for( v.c=0 ; v.c<v.data[0].length ; v.c++ ){
            v.arr.push(arg.data.hasOwnProperty(v.data[0][v.c])
            ? arg.data[v.data[0][v.c]] : v.data[v.r][v.c]);
          }
          v.sheet.getRange(v.r+1,1,1,v.data[0].length).setValues([v.arr]);
          v.rv.push(v.arr);
        }
      }      
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return JSON.stringify(v.rv);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
