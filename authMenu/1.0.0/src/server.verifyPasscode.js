/** authClientからの要求を受け、ユーザ情報と状態を返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {Object} arg
 * @param {string} arg.email - 要求があったユーザのe-mail
 * @param {string} arg.CPkey - 要求があったユーザの公開鍵
 * @returns {object} 以下のメンバを持つオブジェクト
 * 1. SPkey {string} - サーバ側公開鍵
 * 1. isExist {boolean} - 既存メアドならtrue、新規登録ならfalse
 * 1. isEqual {boolean} - 引数のCPkeyがシート上のCPkeyと一致するならtrue
 * 1. isExpired {boolean} - CPkeyが有効期限切れならtrue
 * 1. data {object} - 該当ユーザのシート上のオブジェクト
 */
w.func.verifyPasscode = function(arg){
  const v = {whois:w.whois+'.verifyPasscode',step:0,rv:{
    SPkey:w.prop.SPkey,
    isExist:true, isEqual:true, isExpired:false, data:null,
  }};
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    // ---------------------------------------------
    v.step = 1; // 事前準備
    // ---------------------------------------------
    v.step = 1.1; // ユーザ情報の取得
    v.master = new SingleTable(w.prop.masterSheet);
    if( v.master instanceof Error ) throw v.master;

    v.step = 1.2; // パスコードの復号、署名検証

    
    // ---------------------------------------------
    v.step = 2; // パスコード検証
    // ---------------------------------------------
    // ログイン失敗になるまでの試行回数(numberOfLoginAttempts)
    // パスコード生成からログインまでの猶予時間(ミリ秒)(loginGraceTime)
    // クライアント側ログイン(CPkey)有効期間(userLoginLifeTime)



    // ---------------------------------------------
    v.step = 3; // 終了処理
    // ---------------------------------------------
    v.step = 3.1; // trial更新(検証結果の格納)
    // - passcode {number} パスコード(原則数値6桁)
    // - log {object[]} 試行の記録。unshiftで先頭を最新にする
    //   - timestamp {number} 試行日時(UNIX時刻)
    //   - entered {number} 入力されたパスコード
    //   - result {number} 0:成功、1〜n:連続n回目の失敗
    // 
    // trialオブジェクトはunshiftで常に先頭(添字=0)が最新になるようにする。

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
w.rv = w.func.verifyPasscode(arg);
if( w.rv instanceof Error ) throw w.rv;