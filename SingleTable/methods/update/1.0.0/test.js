const updateTest = () => {
  v.tData = [
    // test!E5に'a'をセットする
    {func:{E3:'a'},opt:{where:o=>o.B3==5&&o.C3==4}},
    // Col1欄にB3+C3の値をセットする
    {func:o=>{return {Col1:(o.B3||0)+(o.C3||0)}},opt:{where:o=>o.B3==5&&o.C3==4}},
    {func:o=>{return {E3:'a'}},opt:{where:o=>o.B3==5&&o.C3==4}},
    // test!D7:E7に['hoge','fuga']をセット
    {func:o=>{return {Col1:'hoge',E3:'fuga'}},opt:{where:o=>o.B3==4}},

  ];
  for( v.i=1 ; v.i<2 ; v.i++ ){ //v.tData.length ; v.i++ ){
    v.r = v.test.update(v.tData[v.i].func,v.tData[v.i].opt);
    console.log("%s -> %s",v.i,JSON.stringify(v.r));
  }
}
