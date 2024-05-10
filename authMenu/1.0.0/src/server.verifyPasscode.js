/** verifyPasscode: 入力されたパスコードの検証
 * 
 * - 権限有無判断(auth&allow)は授受するデータを減らすため、クライアント側で行う
 * 
 * @param {Object} arg
 * @param {number} arg.userId=null - ユーザID
 * @param {string} arg.CPkey=null - 要求があったユーザの公開鍵
 * @param {string} arg.updated=null - CPkey生成・更新日時文字列
 * @param {number} arg.passcode=-1 - 入力されたパスコード
 * @returns {object} 以下のメンバを持つオブジェクト(getUserInfoの戻り値)
 * - data=null {Object} シート上のユーザ情報オブジェクト(除、trial)
 * - status
 *   - 0 : OK(パスコード一致、CPkey他も問題なし) ⇒ OK
 *   - 1〜4 : 要ログイン
 *     - 1 : ①パスコード生成からログインまでの猶予時間を過ぎている ⇒ NG
 *     - 2 : ②クライアント側ログイン(CPkey)有効期限切れ ⇒ (書き換えるから)OK
 *     - 4 : ③引数のCPkeyがシート上のCPkeyと不一致 ⇒ (書き換えるから)OK
 *   - 8 : NG(権限はあるが)凍結中 ⇒ NG
 *   - 16 : パスコード不一致
 */
w.func.verifyPasscode = function(arg){
  const v = {whois:w.whois+'.verifyPasscode',step:0,rv:null};
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    // ---------------------------------------------
    v.step = 1; // パスコード検証
    // ---------------------------------------------
    v.step = 1.1; // 引数の既定値の設定
    v.arg = Object.assign({
      userId: null,
      CPkey: null,
      updated: null,
      passcode: -1,
    },arg);

    v.step = 1.1; // 対象ユーザ情報の取得
    v.rv = this.getUserInfo(v.arg);
    if( v.rv instanceof Error ) throw v.rv;
    v.trial = v.rv.trial;
    delete v.rv.trial;  // trialは戻り値に含めない

    v.step = 1.2; // パスコード不一致 ⇒ statusのフラグを立てる
    if( Number(v.arg.passcode) !== Number(v.trial.passcode) ){
      v.rv.status += 16;
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
      entered: v.arg.passcode,
      status: v.rv.status,
      result: v.rv.status === 0 ? 0 : (v.trial.log[0].result + 1),
    });

    v.step = 2.2; // シートのtrial欄を更新
    v.obj = {trial:JSON.stringify(v.trial)};
    // パスコードが一致していたらCPkey,updatedも更新
    // 以下の条件を全て満たす場合、CPkey,updatedも更新
    // 1. getUserInfoのstatusが②有効期限切れまたは③不一致
    // 2. 有効なCPkey,updatedが両方引数で渡されている
    if( (v.rv.status & (2+4)) > 0 && arg.CPkey !== null && arg.updated !== null ){
      v.obj.CPkey = v.rv.data.CPkey = arg.CPkey;
      v.obj.updated = v.rv.data.updated = arg.updated;
      // ユーザ情報およびtrial欄に記録するstatusの値が2or4なら0に書き換え
      // 25 = 1 + 8 + 16 (2と4以外のフラグの合計値。2と4は強制的に0にする)
      v.rv.status = v.rv.status & 25;
      v.trial.log[0].status = v.trial.log[0].status & 25;
      v.obj.trial = JSON.stringify(v.trial);
    }
    v.r = v.master.update(v.obj,
      {where: x => x[w.prop.primatyKeyColumn] === arg.userId});
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
