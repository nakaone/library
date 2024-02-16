function SingleTableServerDeleteTest(){
  const v = {table:'test!J1:N',func:'delete'};
  [
    {label:'単一',arg:{where:x => x.id === 11}},
    {label:'複数(2件)',arg:{where:x => x.pId === 6}},
  ].forEach(x => {
    v.r = SingleTableServer(v.table,v.func,x.arg);
    console.log(`${x.label} : ${JSON.stringify(v.r)}`);
  });
}

function SingleTableServerSelectTest(){
  const v = {table:'test!J1:N',func:'select'};
  [
    {label:'単一',opt:{where:x => x.id === 11}},
    {label:'複数(2件)',opt:{where:x => x.pId === 6}},
    {label:'複数で降順',opt:{where:x => x.id < 6,orderBy:[['date','desc']]}},
  ].forEach(x => {
    v.r = SingleTableServer(v.table,v.func,x.opt);
    console.log(`${x.label} : ${JSON.stringify(v.r)}`);
  });
}

function SingleTableServerUpdateTest(){
  const v = {table:'test!J1:N',func:'update'};
  [
    {label:'単一',set:{date:new Date()},opt:{where:x => x.id === 11}},
    {label:'複数(2件)',set:x => {return {desc:'hoge'+x.id}},opt:{where:x => x.pId === 6}},
  ].forEach(x => {
    v.r = SingleTableServer(v.table,v.func,x.set,x.opt);
    console.log(`${x.label} : ${JSON.stringify(v.r)}`);
  });
}

function SingleTableServerInsertTest(){
  const v = {table:'test!J1:N',func:'insert'};
  [
    {label:'単一',arg:{date:new Date()}},
    {label:'複数(2件)',arg:[
      {date:new Date(),desc:'fuga'},{id:12,column:'hoge'}]},
  ].forEach(x => {
    v.r = SingleTableServer(v.table,v.func,x.arg);
    console.log(`${x.label} : ${JSON.stringify(v.r)}`);
  });
}
