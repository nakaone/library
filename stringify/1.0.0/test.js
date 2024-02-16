function stringifyTest(){
  const v = {};
  const data = {
    // プリミティブ型(文字列, 数値, 長整数, 論理値, undefined, シンボル, null)
    p1:'abc',p2:123,p3:BigInt(9007199254740991),p4:true,
    p5:undefined,p6:Symbol('a'),p7:null,
    // 関数、既存オブジェクト
    t1:()=>true,t2:new Date(),
    // オブジェクト、配列
    o1:{a:10,b:20},
    o2:{a:10,b:{a:1,b:'abc'},c:[true,null,undefined,()=>false]},
    a1:[1,2,3],
    a2:['abc',false,{a:'a',b:{c:10}}],
  }
  console.log(`stringify: ${stringify(data)}`);
}
