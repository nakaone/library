function SingleTablePrepDataTest(){
  const v = {
    ass: SpreadsheetApp.getActiveSpreadsheet(),
    sheetName: 'prepData!B4',
    data:[{},{"B3":5,"C3":4},
      {"B3":5,"C3":6,"Col3":7,"E3":8},
      {"B3":4,"C3":3,"Col3":"hoge","E3":"fuga"}
    ],
    raw:[
      ["B3","C3","","E3"],["","","",""],[5,4,"",""],[5,6,7,8],[4,3,"hoge","fuga"]
    ],
  };

  // オブジェクトの配列
  //SingleTableTestDump(new SingleTable({data:v.data}));
  // シートイメージ
  //SingleTableTestDump(new SingleTable({data:v.raw}));
  // シートの削除
  v.sheet = v.ass.getSheetByName(v.sheetName.match(/(.+?)!/)[1]);
  if( v.sheet !== null ) v.ass.deleteSheet(v.sheet);
  //SingleTableTestDump(new SingleTable(v.sheetName,{data:v.data}));
  SingleTableTestDump(new SingleTable({name:v.sheetName,raw:v.raw}));
}
