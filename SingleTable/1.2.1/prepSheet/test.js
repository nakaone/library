function SingleTablePrepSheetTest(){
  const v = {};
  // シートからデータを取得
  v.r = new SingleTable('test!B3:E');
  SingleTableTestDump(v.r);
}
