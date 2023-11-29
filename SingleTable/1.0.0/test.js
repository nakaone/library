function SingleTableTest(){
  const v = {
    dump: (o,cut=[]) => { // ログが冗長になるため、一部メンバを削除
      cut.forEach(x => delete o[x]);
      console.log(JSON.stringify(o));
    },
    test: new SingleTable('test',{top:3}),
    tips: new SingleTable('tips'),
  };

  const constructorTest = () => {
    v.dump(new SingleTable('test',{top:3}),['sheet']);
    v.dump(new SingleTable('tips'),['sheet','data','raw']);
  }

  const selectTest = () => {
    //OK v.dump({where:v.tips.select(x=>x.id==2)});
    //OK v.r = v.tips.select({where:x=>1<x.id && x.id<5});
    //OK v.r = v.tips.select();
    // tag欄に「GAS」が含まれるレコード
    //v.r = v.tips.select({where:x=>x.tag.indexOf('GAS')>-1,orderBy:[['id','desc']]});
    //console.log(JSON.stringify(v.r.map(x=>x.id)));

    v.r = v.test.select({
      //where: x => x.B3 && 1<x.B3 && x.B3<9,
      where: x => {return x.Col1 && String(x.Col1).indexOf('g') > -1},
      orderBy:[['B3'],['C3','desc']]
    });
    console.log(JSON.stringify(v.r));
  }

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
  //v.result = constructorTest();
  //selectTest();
  updateTest();
  //insertTest();
  //deleteTest();
}