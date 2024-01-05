const insertTest = () => {
  v.tData = [
    {B3:3,E3:1},
    [{B3:2,E3:2},{C3:1,Col1:'hoge'}],
  ];
  for( v.i=1 ; v.i<v.tData.length ; v.i++ ){
    v.r = v.test.insert(v.tData[v.i]);
    console.log("%s -> %s",v.i,JSON.stringify(v.r));
  }
}