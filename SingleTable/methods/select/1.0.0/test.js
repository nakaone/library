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