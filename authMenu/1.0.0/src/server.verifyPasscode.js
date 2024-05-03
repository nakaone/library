/** 入力されたパスコードの検証
 * 
 * @param {Object} arg
 * @param {number} arg.userId=null - ユーザID
 * @param {string} arg.CPkey=null - 要求があったユーザの公開鍵
 * @param {string} arg.updated=null - CPkey生成・更新日時文字列
 * @param {number} arg.passcode - 入力されたパスコード
 * @returns {object} 以下のメンバを持つオブジェクト(getUserInfoの戻り値)
 * - data=null {Object} シート上のユーザ情報オブジェクト(除、trial)
 * - status
 *   - 0 : OK(パスコード一致、CPkey他も問題なし)
 *   - 1〜4 : 要ログイン
 *     - 1 : ①パスコード生成からログインまでの猶予時間を過ぎている
 *     - 2 : ②クライアント側ログイン(CPkey)有効期限切れ
 *     - 4 : ③引数のCPkeyがシート上のCPkeyと不一致
 *   - 8 : NG(権限はあるが)凍結中
 *   - 16 : NG(権限なし)　※allowとの比較。verifyPasscodeでは発生しない
 *   - 32 : パスコード不一致
 * - numberOfLoginAttempts {number} 試行可能回数
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
    v.step = 1; // パスコード検証
    // ---------------------------------------------
    v.step = 1.1; // 対象ユーザ情報の取得
    v.rv = this.getUserInfo(Object.assign(arg,{createIfNotExist:true}));
    if( v.rv instanceof Error ) throw v.rv;
    v.trial = v.rv.trial;
    delete v.rv.trial;  // trialは戻り値に含めない

    v.step = 1.2; // パスコード不一致 ⇒ statusのフラグを立てる
    if( arg.passcode !== v.trial.passcode ){
      v.rv.status += 32;
    }

    // ---------------------------------------------
    v.step = 2; // trial更新(検証結果)
    //【trialオブジェクト定義】
    // - passcode {number} パスコード(原則数値6桁)
    // - created {number} パスコード生成日時(UNIX時刻)
    // - log {object[]} 試行の記録。unshiftで先頭を最新にする
    //   - timestamp {number} 試行日時(UNIX時刻)
    //   - entered {number} 入力されたパスコード
    //   - status {number} v.rv.statusの値
    //   - result {number} 0:成功、1〜n:連続n回目の失敗
    // trialオブジェクトはunshiftで常に先頭(添字=0)が最新になるようにする。
    // ---------------------------------------------
    v.step = 2.1; // ログObjを作成、log配列先頭に追加
    v.trial.log.unshift({
      timestamp: Date.now(),
      entered: arg.passcode,
      status: v.rv.status,
      result: v.rv.status === 0 ? 0 : (v.trial.log[0].result + 1),
    });

    v.step = 2.2; // シートのtrial欄を更新
    v.obj = {trial:JSON.stringify(v.trial)};
    // パスコードが一致していたらCPkey,updatedも更新
    if( v.rv.status === 0 ){
      v.obj.CPkey = arg.CPkey;
      v.obj.updated = arg.updated;
    }
    v.r = v.master.update(v.obj,{where: x => x[w.prop.primatyKeyColumn] === arg.userId});
    if( v.r instanceof Error ) throw v.r;

    // ---------------------------------------------
    v.step = 3; // 終了処理
    // ---------------------------------------------
    // OK以外はユーザ情報を戻り値から削除
    if( v.rv.status !== 0 ) delete v.rv.data;
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