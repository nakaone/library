/** authClientからの登録要求を受け、IDを返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {string} email - 要求があったユーザのe-mail
 * @returns {number|Error} 採番されたuserId
 */
w.func.registMail = function(email){
  const v = {whois:w.whois+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // emailアドレスの妥当性検証
    if( checkFormat(email,'email' ) === false ){
      throw new Error(`invalid e-mail address.`);
    }

    v.step = 2; // masterシートを読み込み
    v.master = new SingleTable(w.masterSheet);

    v.step = 3; // 既登録メアドでは無いか確認
    v.m = v.master.data.find(x => x[w.emailColumn] === email);
    if( v.m ) throw new Error(`"${email}" has already registrated.`);

    v.step = 4; // 新規userIdを採番
    if( v.master.data.length === 0 ){
      v.rv = 1;
    } else {
      v.exist = v.master.data.map(x => x[w.primatyKeyColumn]);
      v.rv = Math.max(...v.exist) + 1;
    }

    v.step = 5; // シートに登録
    v.r = v.master.insert([{
      userId:v.rv,
      email:email,
      created:toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn')
    }]);
    if( v.r instanceof Error ) throw v.r;

    v.step = 9; // 終了処理
    console.log(`${w.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nemail=${email}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.registMail(arg);
if( w.rv instanceof Error ) throw w.rv;
