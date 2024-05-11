function authServerTest(){
  const v = {
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
      v.td = [
        {userId:null,arg:{email:'nakaone.kunihiro@gmail.com'}},
      ];
      for( v.i=0 ; v.i<v.td.length ; v.i++ ){
        v.rv = authServer(v.td[v.i].userId,JSON.stringify(v.td[v.i].arg));
        console.log(`$v.i => v.rv = ${stringify(v.rv)}`);
      }
    },
  };

  //v.constructor();
  v.getUserInfo();
}