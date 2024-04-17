v.step = 0; // テスト用
if( true ){
  localStorage.removeItem(g.programId);
  sessionStorage.removeItem(g.programId);
}

v.step = 1; // userId,authをセット
v.config = storeUserInfo(g.programId,{CSSselector:'[name="userId"]'});
if( v.r instanceof Error ) throw v.r;

v.step = 2.1; // authClientクラスのインスタンス化
g.auth = new authClient();
v.step = 2.2; // BurgerMenuクラスのインスタンス化
g.menu = new BurgerMenu({auth:v.config.auth,homeForEachAuth:{
  1: '実施要領',  // auth毎のBurgerMenuホーム画面(.screen[name])
  2: '参加者パス',
  4: 'スタッフの手引き',
},func:{
  enterUserId:()=>{
    console.log('enterId start.');
    const v = window.prompt('受付番号を入力してください');
    if( v !== null ){
      if( v.match(/^[0-9]+/) ){
        v.step = 1;
        v.r = storeUserInfo(g.programId,{userId:v,CSSselector:'[name="userId"]'});
        if( v.r instanceof Error ) throw v.r;

        v.step = 2; // メニュー再描画
        v.r = g.menu.genNavi();
        if( v.r instanceof Error ) throw v.r;

        v.step = 3; // ホーム画面に遷移
        v.r = changeScreen(g.menu.home);
        if( v.r instanceof Error ) throw v.r;

      } else {
        v.step = 4;
        alert('受付番号は数値で指定してください');
      }
    }
  },
}});
