/** authClientからの登録要求を受け、IDを返す
 * @param {string} email - 要求があったユーザのe-mail
 * @returns {number|Error} 採番されたuserId
 */
w.func.registMail = function(email){
  const v = {whois:w.whois+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    // masterシートを読み込み
    v.master = new SingleTable(w.masterSheet);

    if( v.master.data.length === 0 ){
      v.rv = 1; // シートを新規作成した時のuserIdは'1'
    } else {
      // 通常の場合

      // 既登録メアドでは無いか確認
      v.m = v.master.data.find(x => x[w.emailColumn] === email);
      if( v.m ) throw new Error(`${v.whois} Error: "${email}" has already registrated.`);

      // userIdを採番
      v.exist = v.master.data.map(x => x[w.primatyKeyColumn]);
      v.rv = Math.max(...v.exist) + 1;
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nemail=${email}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
