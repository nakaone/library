v.step = 0; // テスト用。storageのクリア
if( true ){
  localStorage.removeItem('authMenu');
  sessionStorage.removeItem('authMenu');
}

v.step = 1; // authMenuをグローバル変数としてインスタンス化
g.authMenu = new authMenu({
  home:{
    1: '実施要領',  // auth毎のBurgerMenuホーム画面(.screen[name])
    2: '参加者パス',
    4: 'スタッフの手引き',
  },
  func:{
    enterUserId:()=>{
      console.log('enterId start.');
      const v = window.prompt('受付番号を入力してください');
      if( v !== null ){
        if( v.match(/^[0-9]+/) ){
          v.step = 1;
          v.r = g.authMenu.storeUserInfo(Number(v));
          if( v.r instanceof Error ) throw v.r;

          v.step = 2; // メニュー再描画
          v.r = g.authMenu.genNavi();
          if( v.r instanceof Error ) throw v.r;

          v.step = 3; // ホーム画面に遷移
          v.r = g.authMenu.changeScreen();
          if( v.r instanceof Error ) throw v.r;

        } else {
          v.step = 4;
          alert('受付番号は数値で指定してください');
        }
      }
    },
}});