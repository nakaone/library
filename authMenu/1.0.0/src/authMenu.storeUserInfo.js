/** storeUserInfo: インスタンス変数やstorageに保存したユーザ情報を更新
 * 
 * ユーザ情報を取得し、①引数 > ②インスタンス変数 > ③sessionStorage > ④localStorage > ⑤HTMLに埋め込まれたユーザ情報(userId)の順に最新の情報を特定、各々の内容を更新する。
 * 
 * @param {object} arg={} - 特定の値を設定する場合に使用 
 * @returns {object|Error} 更新結果
 */
storeUserInfo(arg={}){
  const v = {whois:this.constructor.name+'.storeUserInfo',rv:null,step:0};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    // -------------------------------------
    // 各格納場所から現在の保存内容を取得
    // -------------------------------------
    v.step = 1.1; //インスタンス変数
    v.user = this.hasOwnProperty('user') ? this.user : {};
    if( Object.keys(v.user).length === 0 ){
      // メンバが存在しない場合、全項目nullの初期オブジェクトを作成
      ['userId','created','email','auth','passPhrase','CSkey',
      'CPkey','updated','SPkey'].forEach(x => v.user[x]=null);
    }
    v.step = 1.2; // sessionStorage
    v.r = sessionStorage.getItem(this.constructor.name);
    v.session = v.r ? JSON.parse(v.r) : {};
    v.step = 1.3; // localStorage
    v.r = localStorage.getItem(this.constructor.name);
    v.local = v.r ? {userId:Number(v.r)} : {};
    v.step = 1.4; // HTMLに埋め込まれたユーザ情報(ID)
    v.dom = document.querySelector(this.userIdSelector);
    v.html = (v.dom !== null && v.dom.innerText.length > 0)
      ? {userId:Number(v.r)} :{};

    // -------------------------------------
    // 各格納場所のユーザ情報をv.rvに一元化
    // -------------------------------------
    v.step = 2.1; // 優先順位に沿ってユーザ情報を統合
    // 優先順位は`html < local < session < user < arg`
    v.rv = Object.assign(v.html,v.local,v.session,v.user,arg);

    v.step = 2.2; // 鍵ペア・秘密鍵が存在しなければ作成
    if( v.rv.passPhrase === null || v.rv.CSkey === null ){
      if( v.rv.passPhrase === null ){
        v.rv.passPhrase = createPassword(this.passPhraseLength);
        v.rv.updated = toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn');
      }
      v.rv.CSkey = cryptico.generateRSAKey(v.rv.passPhrase,(this.RSAkeyLength));
      v.rv.CPkey = cryptico.publicKeyString(v.rv.CSkey);
    }

    v.step = 2.3; // ユーザ権限の設定
    if( v.rv.auth === null ){
      // ユーザIDが未設定 ⇒ 一般公開用
      v.rv.auth = this.publicAuth;
    } else if( v.rv.auth === this.publicAuth ){
      // ユーザIDが設定済だが権限が一般公開用 ⇒ 参加者用に修正
      v.rv.auth = this.memberAuth;
    }

    // -------------------------------------
    // 各格納場所の値を更新
    // -------------------------------------
    v.step = 3.3; // インスタンス変数(メンバ)への保存
    this.user = v.rv;
    v.step = 3.2; // sessionStorageへの保存
    Object.keys(v.user).filter(x => x !== 'CSkey').forEach(x => {
      if( v.rv.hasOwnProperty(x) && v.rv[x] ){
        v.session[x] = v.rv[x];
      }
    });
    sessionStorage.setItem(this.constructor.name,JSON.stringify(v.session));
    v.step = 3.1; // localStorageへの保存
    localStorage.setItem(this.constructor.name,v.rv.userId);

    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}\nv.rv=${v.rv}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
