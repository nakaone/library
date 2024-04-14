/** authClientからの登録要求を受け、IDを返す
 * @param {void}
 * @returns {null|Error}
 */
v.func.registMail = function(){
  const v = {whois:this.constructor.name+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // メアド入力
    v.step = 2; // authServer.registMailにメアド転送
    v.step = 3; // IDをstorageに登録

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\narg=${stringify(arg)}`;  // 引数
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
