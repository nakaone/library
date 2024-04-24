/**
 * 
 * @param {string} email - 入力されたメールアドレス
 * @returns {Object}
 */
async registMail(email){
  const v = {whois:this.constructor.name+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 鍵ペア生成
    v.passPhrase = createPassword(16);
    v.CSkey = cryptico.generateRSAKey(v.passPhrase,1024);
    v.CPkey = cryptico.publicKeyString(v.CSkey);
    v.updated = new Date();

    v.step = 2; // authServer.registMailに問合せ
    v.rv = await this.doGAS('registMail',{
      email: email,
      CPkey: v.CPkey,
      updated: v.updated.getTime(),
    });
    if( v.rv instanceof Error ) throw v.rv;
    console.log(`l.1062 v.rv=${stringify(v.rv)}`);

    v.step = 3.1; // ユーザ情報更新用に、格納する変数を補完
    v.rv.passPhrase = v.passPhrase;
    v.rv.CSkey = v.CSkey;
    v.rv.auth = Number(v.rv.auth);
    v.step = 3.2; // インスタンス変数の更新
    v.map = Object.keys(v.rv);
    for( v.i=0 ; v.i<v.map.length ; v.i++ ){
      this[v.map[v.i]] = v.rv[v.map[v.i]];
    }
    v.step = 3.3; // localStorageの更新
    localStorage.setItem(this.constructor.name,v.rv.userId);
    v.step = 3.4; // sessionStorageの更新
    v.prop = Object.assign({},
      JSON.parse(sessionStorage.getItem(this.constructor.name)),v.rv);
    sessionStorage.setItem(this.constructor.name,JSON.stringify(v.prop));

    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nemail=${email}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}