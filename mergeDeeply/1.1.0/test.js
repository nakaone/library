function mergeDeeplyTest(){
  const v = {whois:'mergeDeeplyTest'};

  v.arg = {pri:{...v.proto},sub:{...v.proto},opt:undefined};
  const data = [
    {
      pri:{
        p1:'abc',p2:123,p3:BigInt(9007199254740991),p4:true,
      },
      sub:{
        // プリミティブ型(文字列, 数値, 長整数, 論理値, undefined, シンボル, null)
        p1:'def',p2:456,p3:BigInt(1234567890123456),p4:false,
        p5:undefined,p6:Symbol('a'),p7:null,
        // 関数、既存オブジェクト
        t1:()=>true,t2:new Date(),
        // オブジェクト
        o1:{a:10,b:20},
        o2:{a:10,b:{a:1,b:'abc'},c:[true,null,undefined,()=>false]},
      },
      opt:undefined
    },
    {
      pri:{a:['a',1,BigInt(123456),true,Symbol.for('a'),null,()=>true,new Date('1965/9/5'),{a:10},[1,2]]},
      sub:{a:['a',1,BigInt(123456),true,Symbol.for('a'),null,()=>true,new Date('1965/9/5'),{a:10},[1,2]]},
    },
    // 配列のマージパターンテスト
    {pri:[1,2,{x:'a'},{a:10,b:20}],sub:[1,3,{x:'a'},{a:30,c:40}],opt:{array:'pri'}},
    {pri:[1,2,{x:'a'},{a:10,b:20}],sub:[1,3,{x:'a'},{a:30,c:40}],opt:{array:'add'}},
    {pri:[1,2,{x:'a'},{a:10,b:20}],sub:[1,3,{x:'a'},{a:30,c:40}],opt:{array:'set'}},
    {pri:[1,2,{x:'a'},{a:10,b:20}],sub:[1,3,{x:'a'},{a:30,c:40}],opt:{array:'str'}},
  ];

  for( v.i=2 ; v.i<data.length ; v.i++ ){
    v.r = mergeDeeply(data[v.i].pri,data[v.i].sub,data[v.i].opt);
    console.log(`mergeDeeplyTest result.`
      + `\npri=${stringify(data[v.i].pri)}`
      + `\nsub=${stringify(data[v.i].sub)}`
      + `\nopt=${stringify(data[v.i].opt)}`
      + `\n⇒ ${stringify(v.r)}`
    );
  }
}
