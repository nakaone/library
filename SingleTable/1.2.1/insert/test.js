function SingleTableInsertTest(){
  const v = {};
  v.table = new SingleTable('test!J1:N');

  [
    {label:'単一',arg:{date:new Date()}},
    {label:'複数(2件)',arg:[
      {date:new Date(),desc:'fuga'},{id:12,column:'hoge'}]},
  ].forEach(x => console.log(`${x.label} : ${JSON.stringify(v.table.insert(x.arg))}`));
}
