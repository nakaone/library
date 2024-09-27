/** summaryTable: 集計表作成用のcreateElementオブジェクトを作成
 * @param {Object} arg
 * @param {Object[]} arg.data - 集計表の元となるデータ。1行1Objectの配列
 * @param {string[]} arg.cols - 横軸の項目名
 * @param {string[]} arg.rows - 縦軸の項目名
 * @param {string[]} arg.colsFormula - 横軸の集計項目の算式。但し加減に限る
 * @param {string[]} arg.rowsFormula - 縦軸の集計項目の算式
 * @param {function} arg.normalize - データを正規化する関数
 * @param {Object} arg.thead - ヘッダ部を作成するcreateElementオブジェクト
 * @param {Object} arg.tbody - ボディ部を作成するcreateElementオブジェクト。但し計数項目・導出項目は除く
 * @returns {Object} createElemntの引数となるオブジェクト
 * 
 * - 空白行は想定しない(全てのセルが計数項目または導出項目の前提)
 * - Google Spread [表形式仕様・テストデータ](https://docs.google.com/spreadsheets/d/1fvCYOfp35LivbZlQHIhnGaujpCUeoI7u2qydFrMFem0/edit?gid=1400698249#gid=1400698249)
 * 
 * **normalizeの仕様**
 * 
 * - 引数：1行分のオブジェクト
 *   ex.`{"申込者の参加": "参加予定(宿泊なし)","宿泊、テント": "宿泊しない","参加者01所属": "1年生","参加者02所属": "2年生","参加者03所属": "2年生"}`
 * - 戻り値：1件毎に分割されたオブジェクトの配列。メンバはrow,colのみ、値はarg.rows/colsに存在する文字列
 *   ex.`[{row:"申込口数",col:"日帰り"},{row:"1年生",col:"日帰り"},{row:"2年生",col:"日帰り"},{row:"2年生",col:"日帰り"}]`
 */
function summaryTable(arg){
  const v = {whois:'summaryTable',step:0,rv:null,data:[]};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    v.step = 1; // データを正規化する
    arg.data.forEach(o => v.data.push(...arg.normalize(o)));
    vlog(v,'data');

    v.step = 2; // 計数項目の集計
    v.sql = 'select `row`,`col`,count(*) as `num` from ? group by `row`,`col`;';
    v.table = alasql(v.sql,[v.data]);
    vlog(v,'table');

    v.step = 3; // 横方向での導出項目の計算
    arg.colsFormula.forEach(formula => {
      v.step = 3.1;
      v.m = formula.match(/^(.+?)=(.+)$/);
      v.left = v.m[1];
      v.fm = [];
      v.cols = v.m[2].replaceAll(/([\+\-])/g,"\t$1").split('\t');
      v.cols.forEach(col => {
        v.m = col.match(/^([\+\-])(.+)$/);
        if( v.m ) v.fm.push({sign:v.m[1]==='+',name:v.m[2]});
        else v.fm.push({sign:true,name:col});
      });
      vlog(v,['m','cols','to','fm']);

      arg.rows.forEach(row => {
        v.step = 3.2; // 集計結果を格納するセルを特定、v.cellとする
        v.cell = v.table.find(x => x.row === row && x.col === v.left);
        if( v.cell === undefined ){
          v.cell = {row:row,col:v.left,num:0};
          v.table.push(v.cell);
        }

        v.step = 3.3; // 式に現れた項目毎に加減
        v.fm.forEach(col => {
          v.cell.num += ((v.table.find(x => x.row === row && x.col === col.name)
          || {num:0}).num) * (col.sign ? 1 : -1);
        });
        vlog(v,'cell');
      });
    });

    v.step = 4; // 縦方向での導出項目の計算
    arg.rowsFormula.forEach(formula => {
      v.step = 4.1;
      v.m = formula.match(/^(.+?)=(.+)$/);
      v.left = v.m[1];
      v.fm = [];
      v.rows = v.m[2].replaceAll(/([\+\-])/g,"\t$1").split('\t');
      v.rows.forEach(row => {
        v.m = row.match(/^([\+\-])(.+)$/);
        if( v.m ) v.fm.push({sign:v.m[1]==='+',name:v.m[2]});
        else v.fm.push({sign:true,name:row});
      });
      vlog(v,['m','rows','to','fm']);

      arg.cols.forEach(col => {
        v.step = 4.2; // 集計結果を格納するセルを特定、v.cellとする
        v.cell = v.table.find(x => x.row === v.left && x.col === col);
        if( v.cell === undefined ){
          v.cell = {row:v.left,col:col,num:0};
          v.table.push(v.cell);
        }

        v.step = 4.3; // 式に現れた項目毎に加減
        v.fm.forEach(row => {
          v.cell.num += ((v.table.find(x => x.row === row.name && x.col === col)
          || {num:0}).num) * (row.sign ? 1 : -1);
        });
        vlog(v,'cell');
      });
    });

    for( v.i=0 ; v.i<arg.tbody.length ; v.i++ ){
      v.step = 5.1; // 表要素の作成：行単位
      v.tr = arg.tbody[v.i].children;
      for( v.j=0 ; v.j<arg.cols.length ; v.j++ ){
        v.step = 5.2; // 列単位
        v.val = (v.table.find(x => x.row === arg.rows[v.i] && x.col === arg.cols[v.j]) || {num:0}).num;
        v.tr.push({tag:'td',text:v.val});
      }
      vlog(v,'tr')
    }


    v.step = 5.3; // 表の作成
    v.rv = {
      children:[
        {tag:'table',children:[
          {tag:'thead',children:arg.thead},
          {tag:'tbody',children:arg.tbody},
        ]}
    ]};

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}