v.step = 0; // テスト用。storageのクリア
if( true ){
  localStorage.removeItem('authMenu');
  sessionStorage.removeItem('authMenu');
}

v.step = 1; // authMenuをグローバル変数としてインスタンス化
g.authMenu = new authMenu({
  home:{  // auth毎のBurgerMenuホーム画面(.screen[name])
    1: '実施要領',
    2: '参加者パス',
    4: 'スタッフの手引き',
  },
});