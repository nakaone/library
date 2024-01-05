const deleteTest = () => {
  v.tData = [
    //10,20,-1,  // 引数として渡す関数に呼出元で値がセットできるか確認 -> OK
    //{where:o=>o.Col1&&o.Col1==7}, // 判定用変数(Col1)の存否、要確認
    {where:o=>o.B3&&o.B3==5},
  ];
  for( v.i=0 ; v.i<v.tData.length ; v.i++ ){
    // 引数として渡す関数に呼出元で値がセットできるかのテスト -> OK
    //v.r = v.test.delete({where:o=>{return v.tData[v.i]}});
    v.r = v.test.delete(v.tData[v.i]);
    console.log("%s -> %s",v.i,JSON.stringify(v.r));
  }
}