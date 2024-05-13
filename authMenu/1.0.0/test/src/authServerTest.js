function authServerTest(){
  const v = {
    setRAS: () => {
      v.passPhrase = createPassword();
      v.Skey = cryptico.generateRSAKey(v.passPhrase,1024);
      v.Pkey = cryptico.publicKeyString(v.Skey);
      v.updated = toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn');
    },
    constructor: () => {
      //PropertiesService.getDocumentProperties().deleteAllProperties();
      v.rv = authServer();
      console.log(`v.rv=${stringify(v.rv)}\nproperties=${stringify(PropertiesService.getDocumentProperties().getProperties())}`);
    },
    getUserInfo: () => {/* getUserInfoメソッド(内部関数)のテスト
      ①新規ユーザ登録
      ②既存ユーザIDを指定してユーザ情報を取得
      ③CPkey,updatedの更新
      チェックポイントは
      a. ユーザ情報オブジェクトが正しいか
      b. trial情報が正しいか
      c. statusが正しいか
      d. その他項目に適切な値が設定されているか
      なお本テスト前にsetProperties()は実行済の前提
    */
      v.setRAS();
      //v.Pkey = 'jnJ4bY3b1deU737zq/DInrTSjaveFsoGx54BikllhwePlJxVT97avuWlaX4v7+v3E3CLO+l9bYmIuzCS9XY1vwAx3DVzdprXInsT+nzp2dbMexvkBUl/AXrtULRH5wzrhUV4gHHBN3hZkmjmhDwxQvrGCN1GGqfXSaq7PZjkY9k=';
      v.td = [
        //[null,JSON.stringify({email:'nakaone.kunihiro@gmail.com',CPkey:v.Pkey,updated:v.updated})],
        //[1], // 存在するuserId
        //[2], // 存在しないuserId
        [1,JSON.stringify({email:'nakaone.kunihiro@gmail.com',CPkey:v.Pkey,updated:v.updated,updateCPkey:true})],
      ];
      for( v.i=0 ; v.i<v.td.length ; v.i++ ){
        v.rv = authServer(...v.td[v.i]);
        console.log(`${v.i} => v.rv = ${stringify(v.rv)}`);
      }
    },
  };

  //v.constructor();
  v.getUserInfo();
}
