v.step = 0; // テスト用
if( true ){
  localStorage.removeItem(config.programId);
  sessionStorage.removeItem(config.programId);
}

v.step = 1; // userId,authをセット
v.config = resetStorage();
if( v.r instanceof Error ) throw v.r;

v.step = 2.1; // 使用するクラスのインスタンス化
v.auth = new authClient();
v.step = 2.2;
v.menu = new BurgerMenu({auth:v.config.auth,func:{
  enterId:()=>{
    console.log('enterId start.');
    const v = window.prompt('受付番号を入力してください');
    if( v.match(/^[0-9]+/) ){
      v.r = resetStorage(v);
      if( v.r instanceof Error ) throw v.r;
      //this.auth = 2; -> thisはwindowになる
      console.log(this);
      //this.genNavi(2); -> thisはwindowになる
    }
  }
}});
