v.step = 0; // テスト用
if( true ){
  localStorage.removeItem(g.programId);
  sessionStorage.removeItem(g.programId);
}

v.step = 1; // userId,authをセット
v.config = storeUserInfo(g.programId,{CSSselector:'[name="userId"]'});
if( v.r instanceof Error ) throw v.r;

v.step = 2.1; // 使用するクラスのインスタンス化
g.auth = new authClient();
v.step = 2.2;
v.menu = new BurgerMenu({auth:v.config.auth,func:{
  entry: ()=> {
    console.log('entry start.');
  },
  enterId:()=>{
    console.log('enterId start.');
    const v = window.prompt('受付番号を入力してください');
    if( v !== null ){
      if( v.match(/^[0-9]+/) ){
        v.r = storeUserInfo(g.programId,{userId:v,CSSselector:'[name="userId"]'});
        if( v.r instanceof Error ) throw v.r;
        console.log(this);
        //this.genNavi(2); -> thisはwindowになるのでNG
      } else {
        alert('受付番号は数値で指定してください');
      }
    }
  }
}});
