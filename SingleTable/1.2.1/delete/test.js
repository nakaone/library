function SingleTableDeleteTest(){
  const v = {};
  v.table = new SingleTable('test!J1:N');

  [
    {label:'単一',arg:{where:x => x.id === 11}},
    {label:'複数(2件)',arg:{where:x => x.pId === 6}},
  ].forEach(x => console.log(`${x.label} : ${JSON.stringify(v.table.delete(x.arg))}`));
}
