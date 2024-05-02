function authServerTest(){
  const v = {};
  v.constructor = function(){
    PropertiesService.getDocumentProperties().deleteAllProperties();
    v.rv = authServer();
    console.log(`v.rv=${stringify(v.rv)}\nproperties=${stringify(PropertiesService.getDocumentProperties().getProperties())}`);
  }
  v.constructor();
  //const p = PropertiesService.getDocumentProperties().getProperties();
  //console.log(p);
  /*
  ローカル側での重複メアドチェック
  サーバ側での重複メアドチェック
  シートに格納された値
  localStorage
  sessionStorage
  properties.authServer(特にmap)
  properties.userId

  const v = {data:[
    //[null,'registMail','invalid'],
    [null,'registMail',{email:'hoge@gmail.com',CPkey:'abcdefg0123',updated:'2024/04/25 15:00:01.234'}],
  ]};
  for( v.i=0 ; v.i<v.data.length ; v.i++ ){
    v.rv = authServer(...v.data[v.i]);
    console.log(`${v.i} v.rv=${stringify(v.rv)}`);
  }
  */
}