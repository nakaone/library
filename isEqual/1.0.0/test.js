function isEqualTest(){
  const v = {};
  const data = [
    {
      // プリミティブ型(文字列, 数値, 長整数, 論理値, undefined, シンボル, null)
      p1:'abc',p2:123,p3:BigInt(9007199254740991),p4:true,
      p5:undefined,p6:Symbol('a'),p7:null,
      // 関数、既存オブジェクト
      t1:()=>true,t2:new Date(),
      // オブジェクト
      o1:{a:10,b:20},
      o2:{a:10,b:{a:1,b:'abc'},c:[true,null,undefined,()=>false]},
    },
    [{c:true,a:10,d:()=>true,b:20},{d:()=>true,b:20,a:10,c:true}],  // true
    [{c:true,a:10,d:()=>true,b:20},{d:()=>false,b:20,a:10,c:true}], // false
    [{a:new Date('1965/9/5')},{a:new Date('1965/9/5')}],  // true
    [{a:[1,2,[3,4,{a:5},()=>true,[new Date('1965/9/5')]]]},
    {a:[1,2,[3,4,{a:5},()=>true,[new Date('1965/9/5')]]]}],  // true
  ]
  //for( v.i in data[0] ) console.log(`${v.i}=${stringify(data[0][v.i])} -> ${isEqual(data[0][v.i],data[0][v.i])}`);
  for( v.i=1 ; v.i<data.length ; v.i++ )
    console.log(`${JSON.stringify(data[v.i])} -> ${isEqual(data[v.i][0],data[v.i][1])}`);
}
