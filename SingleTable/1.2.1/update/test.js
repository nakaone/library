function SingleTableUpdateTest(){
  const v = {};
  v.table = new SingleTable('test!J1:N');
  v.table.dump();

  [
    //{label:'単一',set:{date:new Date()},opt:{where:x => x.id === 11}},
    {label:'複数(2件)',set:x => {return {desc:'hoge'+x.id}},opt:{where:x => x.pId === 6}},
  ].forEach(x => console.log(`${x.label} : ${JSON.stringify(v.table.update(x.set,x.opt))}`));
}
