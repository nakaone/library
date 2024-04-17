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
g.menu = new BurgerMenu({auth:v.config.auth,func:{
  entry: ()=> {
    const v = {whois:'entry',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
      v.step = 1; // メールアドレスの入力
      v.email = window.prompt('メールアドレスを入力してください');
      if( v.email !== null ){
        if( checkFormat(v.email,'email') ){
          v.step = 2; // IDの取得
          v.r = g.auth.doGAS('registMail',v.email);
          if( v.r instanceof Error ) throw v.r;
          v.step = 3; // 取得したIDの保存
          v.r = storeUserInfo(g.programId,{userId:v.r,CSSselector:'[name="userId"]'});
          if( v.r instanceof Error ) throw v.r;
          v.step = 4; // 応募フォームの表示
          v.r = g.menu.changeScreen('登録・修正・キャンセル');
        } else {
          throw new Error(`入力された"${v.email}"は不適切なメールアドレスです`);
        }
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      alert(e.message);
      return e;
    }
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
