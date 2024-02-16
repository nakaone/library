function SingleTableSelectTest(){
  const v = {};
  v.table = new SingleTable('test!J1:N');
  SingleTableTestDump(v.table);

  [
    {label:'単一',obj:{where:x => x.id === 11}},
    {label:'複数(2件)',obj:{where:x => x.pId === 6}},
    {label:'複数で降順',obj:{where:x => x.id < 6,orderBy:[['date','desc']]}},
  ].forEach(x => console.log(`${x.label} : ${JSON.stringify(v.table.select(x.obj))}`));
}
