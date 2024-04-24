function authServerTest(){
  //PropertiesService.getDocumentProperties().deleteAllProperties();
  const p = PropertiesService.getDocumentProperties().getProperties();
  console.log(p);
  /*
  ローカル側での重複メアドチェック
  サーバ側での重複メアドチェック
  シートに格納された値
  localStorage
  sessionStorage
  properties.authServer(特にmap)
  properties.userId

  const v = {target:'registMail',
    registMail:[
      //[null,'registMail','invalid'],
      [null,'registMail','hoge@gmail.com'],
      [null,'registMail','fuga@gmail.com'],
    ],
  };
  if( true ){ // debug
    PropertiesService.getDocumentProperties().deleteAllProperties();
  }
  if( v.target === 'registMail' ){
    for( v.i=0 ; v.i<v[v.target].length ; v.i++ ){
      v.rv = authServer(...v[v.target][v.i]);
      console.log(`${v.i} v.rv=${stringify(v.rv)}`);
    }
  }
  */
}