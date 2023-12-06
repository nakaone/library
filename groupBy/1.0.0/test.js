function groupByTest(){
  const v = {};
  v.t = new SingleTable('大福帳',{left:16,bottom:6});
  console.log('v.t.data.length=%s',v.t.data.length);
  v.r = groupBy(v.t.data,['表','科目'],arr=>{
    let rv = {'本体':0,'合計':0};
    for( let i=0 ; i<arr.length ; i++ ){
      rv['本体'] += arr[i]['本体'];
      rv['合計'] += arr[i]['合計'];
    }
    return rv;
  });
  console.log(JSON.stringify(v.r));
}