function groupByTest(){
  const v = {};
  const tData = [[
    {"表":"BS","科目":"現金","本体":50000000,"合計":50000000},
    {"表":"BS","科目":"資本金","本体":50000000,"合計":50000000},
    {"表":"CF","科目":"資本金","本体":50000000,"合計":50000000},
    {"表":"PL","科目":"旅費交通費","本体":340,"合計":340},
    {"表":"BS","科目":"現金","本体":-340,"合計":-340}
  ],['表','科目']];
  v.lv = Symbol('level');
  v.fc = (arr)=>{
    let rv = {'本体':0,'合計':0};
    for( let i=0 ; i<arr.length ; i++ ){
      rv['本体'] += arr[i]['本体'];
      rv['合計'] += arr[i]['合計'];
    }
    return rv;
  };
  // オプション無指定(中間分類行も集計も無し)
  //v.r = groupBy(...tData);
  // 中間分類行を含める(集計は無し)
  //v.r = groupBy(...tData,{classify:true});
  // 中間分類行なしで集計
  //v.r = groupBy(...tData,{func:v.fc});
  // 中間分類行ありで集計
  v.r = groupBy(...tData,{classify:true,func:v.fc});
  v.r.arr.forEach(x => x.level = x[v.r.level]); // levelはシンボルなので個別対応
  console.log(`groupByTest result:\n${JSON.stringify(v.r)}`);

}