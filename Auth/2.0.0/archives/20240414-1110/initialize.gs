/** GAS側の初期化処理
 * システム導入・再初期化時のみ実行。実行後はソースファイルごとシートから削除すること。
 * @param {void}
 * @returns {void}
 */
function initialize(){
  const v = {whois:'initialize',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.auth = new authServer();
    v.r = v.auth.initialize();
    if( v.r instanceof Error ) throw v.r;
    
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
