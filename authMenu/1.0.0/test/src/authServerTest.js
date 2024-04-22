function authServerTest(){
  const v = {target:'registMail',
    registMail:[
      //[null,'registMail','invalid'],
      [null,'registMail','hoge@gmail.com'],
      [null,'registMail','fuga@gmail.com'],
    ],
  };
  for( v.i=0 ; v.i<v[v.target].length ; v.i++ ){
    v.rv = authServer(...v[v.target][v.i]);
    console.log(`${v.i} v.rv=${stringify(v.rv)}`);
  }
}