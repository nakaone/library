/** @constructor
 * @param {Object} opt
 * @param {string} opt.programId
 */
constructor(opt){
  const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 引数のセット
    for(let x in opt){
      this[x] = opt[x];
    }

    v.step = 2; // ユーザ情報を設定
    this.#setUserInfo();

    v.step = 3; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nopt=${stringify(opt)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
