/**
 * 
 * @param {string} email - 入力されたメールアドレス
 * @returns {Object}
 */
async registMail(email){
  const v = {whois:this.constructor.name+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // authServer.registMailに問合せ
    v.rv = await this.doGAS('registMail',{
      email: email,
      CPkey: this.user.CPkey,
      updated: this.user.updated,
    });
    if( v.rv instanceof Error ) throw v.rv;

    v.step = 2; // ユーザ情報更新用
    v.rv = this.storeUserInfo(v.rv);
    if( v.rv instanceof Error ) throw v.rv;

    v.step = 3; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nemail=${email}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}