/**
 * @constructor
 * @param {Object} arg 
 * @returns {BurgerMenu|Error}
 */
constructor(arg={}){
  this.className = 'BurgerMenu';
  const v = {whois:this.className+'.constructor',rv:null,step:0};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    v.step = 1; // 引数と既定値からメンバの値を設定

    v.step = 9; // 終了処理
    changeScreen(this.home);
    console.log(`${v.whois} normal end.`);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\narg=${stringify(arg)}`;  // 引数
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
