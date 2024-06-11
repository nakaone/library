/** authFront: authMenu機能群に於いてサーバ側処理を振り分けるフロント
 * 
 * @param {numer} userId = null
 * @param {string} arg 
 * @returns 
 */
function authFront(userId=null,arg=null) {
  const v = {whois:'authFront',rv:null,step:0,};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // authServerのインスタンス作成
    v.auth = new authServer(userId,arg);

    

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nuserId=${userId}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nw=${stringify(w)}`);
    return e;
  }
}
