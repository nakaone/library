const test = () => {
  const v = {
    proto: (t,o={}) => {
      t.forEach(x => {
        t.forEach(y => {
          const r = isEqual(x,y,o);
          if( r instanceof Error ) throw r;
          if( r )
            console.log(`${typeof x === 'object' ? JSON.stringify(x) : x}(${typeof x}), ${typeof y === 'object' ? JSON.stringify(y) : y}(${typeof y}) -> ${r}`)
        });
      });
    },
    p01: () => v.proto(v.data.base),
    p11: () => v.proto(v.data.string_number),
    p12: () => v.proto(v.data.string_number,{string_number:false}), // 厳密比較を解除
    p21: () => v.proto(v.data.date),  // -> 文字列同士は異なると判断される(ex.'1965/9/5'!='9-5-1965')
    p22: () => v.proto(v.data.date,{v1:'date',v2:'date'}),  // 日付型であることを強制
    data: {
      // 基本型
      base: ['abc',10,new Date('1965/9/5'),true,null,undefined,[1,2],{a:10}],
      // string/number/BigInt混在
      string_number: [10,'10',BigInt(10),0,'0',BigInt(0),Infinity,'Infinity'],
      // Date混在
      date: [
        '1965/9/5',new Date('1965/9/5'),-136458000000,
        'Sun Sep 05 1965 00:00:00 GMT+0900 (日本標準時)',
        '9-5-1965','Sep.5,1965',
      ]
    }
  }
  v.p22();
}