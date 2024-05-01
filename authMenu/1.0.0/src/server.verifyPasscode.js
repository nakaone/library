/** 入力されたパスコードの検証
 * 
 * @param {Object} arg
 * @param {number} arg.userId - ユーザID
 * @param {number} arg.passcode - 入力されたパスコード
 * @returns {Object|number} ユーザ情報オブジェクト。エラーならエラーコード
    // ログイン失敗になるまでの試行回数(numberOfLoginAttempts)
    // パスコード生成からログインまでの猶予時間(ミリ秒)(loginGraceTime)
    // クライアント側ログイン(CPkey)有効期間(userLoginLifeTime)
 * @returns {object} 以下のメンバを持つオブジェクト
 * - status {number}
 *   - 0 : 成功(パスコードが一致)
 *   - 1 : パスコード生成からログインまでの猶予時間を過ぎている
 *   - 2 : 凍結中(前回ログイン失敗から一定時間経過していない)
 *   - 3 : クライアント側ログイン(CPkey)有効期限切れ
 *   - 4 : パスコード不一致
 * - data=null {Object} シート上のユーザ情報オブジェクト(除、trial)
 * - SPkey=null {Object} サーバ側公開鍵
 * - loginGraceTime=900,000(15分) {number}<br>
 *   パスコード生成からログインまでの猶予時間(ミリ秒)
 * - remainRetryInterval=0 {number} 再挑戦可能になるまでの時間(ミリ秒)
 * - passcodeDigits=6 {number} : パスコードの桁数
 */
w.func.verifyPasscode = function(arg){
  const v = {whois:w.whois+'.verifyPasscode',step:0,rv:{
    status: 0, data: null, SPkey: null,
    loginGraceTime: w.prop.loginGraceTime,
    remainRetryInterval: 0,
    passcodeDigits: w.prop.passcodeDigits,
  }};
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    // ---------------------------------------------
    v.step = 1; // 事前準備
    // ---------------------------------------------
    v.step = 1.1; // シートから全ユーザ情報の取得
    v.master = new SingleTable(w.prop.masterSheet);
    if( v.master instanceof Error ) throw v.master;

    v.step = 1.2; // 対象ユーザ情報の取得
    v.user = v.master.select({where: x => x[w.prop.primatyKeyColumn] === arg.userId});
    if( v.user instanceof Error ) throw v.user;

    v.step = 1.3; // trialオブジェクトの取得
    v.trial = JSON.parse(v.user.trial);
    if( !v.trial.hasOwnProperty('log') ) v.trial.log = [];


    // ---------------------------------------------
    v.step = 2; // パスコード検証
    // ---------------------------------------------
    // ログイン失敗になるまでの試行回数(numberOfLoginAttempts)
    // パスコード生成からログインまでの猶予時間(ミリ秒)(loginGraceTime)
    // クライアント側ログイン(CPkey)有効期間(userLoginLifeTime)

    v.step = 2.1; // 試行可能かの確認
    // 以下のいずれかの場合はエラーを返して終了
    if( (w.prop.loginGraceTime + v.trial.created) > Date.now() ){
      // ①パスコード生成からログインまでの猶予時間を過ぎている
      v.rv.status = 1;
    } else if( v.trial.log.length > 0
      && trial.log[0].status === w.prop.numberOfLoginAttempts
      && (trial.log[0].timestamp + w.prop.loginRetryInterval) > Date.now() ){
      // ②前回ログイン失敗から凍結時間を過ぎていない
      v.rv.status = 2;
      v.rv.remainRetryInterval = trial.log[0].timestamp
        + w.prop.loginRetryInterval - Date.now();
    } else if( (new Date(v.user.updated).getTime() + w.prop.userLoginLifeTime) < Date.now() ){
      // ③クライアント側ログイン(CPkey)有効期限切れ(userLoginLifeTime)
      v.rv.status = 3;
    } else if( v.trial.passcode !== arg.passcode ){
      // ④パスコード不一致
      v.rv.status = 4;
    } else {
      // パスコードが一致
      v.rv.data = v.user;
    }

    // ---------------------------------------------
    v.step = 3; // 終了処理
    // ---------------------------------------------
    v.step = 3.1; // trial更新(検証結果の格納)
    // - passcode {number} パスコード(原則数値6桁)
    // - log {object[]} 試行の記録。unshiftで先頭を最新にする
    //   - timestamp {number} 試行日時(UNIX時刻)
    //   - entered {number} 入力されたパスコード
    //   - status {number} v.rv.statusの値
    //   - result {number} 0:成功、1〜n:連続n回目の失敗
    // 
    // trialオブジェクトはunshiftで常に先頭(添字=0)が最新になるようにする。
    // 新しいlogオブジェクトの作成
    v.log = {
      timestamp: Date.now(),
      entered: arg.passcode,
      status: v.status,
      result: v.status === 0 ? 0 : (v.trial.log[0].result + 1),
    }
    v.trial.log.unshift(v.log);
    v.r = v.master.update({trial:JSON.stringify(v.trial)},
      {where:x => x.userId === arg.userId});
    if( v.r instanceof Error ) throw v.r;


    v.step = 3.2; // 検証OKならユーザ情報を、NGなら通知を返す
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.verifyPasscode(w.r);  // w.rはserver.verifySignatureの戻り値
if( w.rv instanceof Error ) throw w.rv;