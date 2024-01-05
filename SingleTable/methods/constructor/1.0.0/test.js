const constructorTest = () => {
  const tData = [
    ['kz標準'],
    ['勘定科目',{top:5,left:8,right:17}],
    ['勘定科目!h5:q'],
    ['勘定科目!s5:z'],
  ];
  for( v.i=0 ; v.i<tData.length ; v.i++ ){
    v.r = new SingleTable(...tData[v.i]);
    console.log('v.r.data=%s',JSON.stringify(v.r.data.slice(0,3)));
  }
  //v.dump(new SingleTable('test',{top:3}),['sheet']);
  //v.dump(new SingleTable('tips'),['sheet','data','raw']);
}