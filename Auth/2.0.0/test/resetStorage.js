/** sessionStorage/localStorageのユーザ情報を更新する
 * @param {void}
 * @returns {void}
 */
function resetStorage(userId=null){
  const v = {whois:'resetStorage',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1.1; // sessionStorageからユーザ情報を取得
    v.r = sessionStorage.getItem(config.programId);
    v.session = v.r ? JSON.parse(v.r) : {userId:null,auth:1};
    v.step = 1.2; // localStorageからユーザ情報を取得
    v.r = localStorage.getItem(config.programId);
    v.local = v.r ? Number(v.r) : null;
    v.step = 1.3; // HTMLに埋め込まれたuserIdを取得
    v.r = document.querySelector('[name="userId"]').innerText;
    v.html = v.r.length > 0 ? Number(v.r) : null;
    v.step = 1.4; // 引数で渡されたuserIdを取得
    v.arg = userId ? Number(userId) : null;

    v.step = 2.1; // userIdの特定
    // 優先順位は`arg > html > session > local`
    v.session.userId = v.arg !== null ? v.arg
    : ( v.html !== null ? v.html
    : ( v.session.userId !== null ? v.session.userId
    : ( v.local !== null ? v.local : null)));
    v.step = 2.2; // userIdが特定され且つauthが最低の場合は参加者(auth=2)に昇格
    if( v.session.userId !== null && v.session.auth === 1 ){
      v.session.auth = 2;
    }

    v.step = 3.1; // sessionStorageへの保存
    sessionStorage.setItem(config.programId,JSON.stringify(v.session));
    v.step = 3.2; // localStorageへの保存
    localStorage.setItem(config.programId,v.session.userId);
    
    v.step = 4; // 終了処理
    v.rv = v.session;
    console.log(`${v.whois} normal end.\n`
    +`v.session=${JSON.stringify(v.session)}\nv.local=${v.local}\nv.html=${v.html}\nv.arg=${v.arg}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
