/** authClientからの要求を受け、ユーザ情報と状態を返す
 * 
 * ユーザIDやCS/CPkey他の自ユーザ情報、およびSPkeyはauthClient.constructor()で初期値を設定し、
 * 先行する「新規ユーザ登録」で修正済情報がインスタンス変数に存在する前提。
 * 
 * @param {Object} arg
 * @param {number} arg.userId - ユーザID
 * @param {string} arg.CPkey - 要求があったユーザの公開鍵
 * @param {string} arg.updated - CPkey生成・更新日時文字列
 * @returns {string} サーバ側公開鍵
 */
w.func.sendPasscode = function(arg){
  const v = {whois:w.whois+'.sendPasscode',step:0,rv:{
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

    v.step = 1.2; // シート上のCPkey/updatedの更新
    // sendPasscodeが呼ばれるのは「CP不一致 or CP無効」の場合。
    // よって送られてきたCPkey/updatedでシート上のそれを更新する


    // ---------------------------------------------
    v.step = 2; // パスコード生成
    // ---------------------------------------------
    v.step = 2.1; // アカウントが凍結されていないかの確認
    // ①前回ログイン失敗(3回連続失敗)から一定時間経過(loginRetryInterval)
    // ②試行回数が規定回数以内(numberOfLoginAttempts)
    // 
    // なおパスコード再発行は凍結中以外認めるが、再発行前の失敗は持ち越す。
    // 例：旧パスコードで2回連続失敗、再発行後の1回目で失敗したら凍結
    // 
    // パスコード再発行はパスコード入力ダイアログに負の数を入力し、
    // changeScreenからsendPasscodeを再度呼び出すことで行う

    v.step = 2.2; // trialオブジェクトを生成、シートに保存
    // - passcode {number} パスコード(原則数値6桁)
    // - log {object[]} 試行の記録。unshiftで先頭を最新にする
    //   - timestamp {number} 試行日時(UNIX時刻)
    //   - entered {number} 入力されたパスコード
    //   - result {number} 0:成功、1〜n:連続n回目の失敗
    // 
    // trialオブジェクトはunshiftで常に先頭(添字=0)が最新になるようにする。


    // ---------------------------------------------
    v.step = 3; // パスコード通知メールの発信
    // ---------------------------------------------
    // $lib/sendmail/1.0.0/core.js
    // @param {String} recipient - 受信者のアドレス
    // @param {String} subject - 件名
    // @param {String} body - メールの本文
    // @param {Object} options - 詳細パラメータを指定する JavaScript オブジェクト（下記を参照）
    // @param {BlobSource[]} options.attachments - メールと一緒に送信するファイルの配列
    // @param {String} options.bcc - Bcc で送信するメールアドレスのカンマ区切りのリスト
    // @param {String} options.cc - Cc に含めるメールアドレスのカンマ区切りのリスト
    // @param {String} options.from - メールの送信元アドレス。getAliases() によって返される値のいずれかにする必要があります。
    // @param {String} options.htmlBody - 設定すると、HTML をレンダリングできるデバイスは、必須の本文引数の代わりにそれを使用します。メール用にインライン画像を用意する場合は、HTML 本文にオプションの inlineImages フィールドを追加できます。
    // @param {Object} options.inlineImages - 画像キー（String）から画像データ（BlobSource）へのマッピングを含む JavaScript オブジェクト。これは、htmlBody パラメータが使用され、<img src="cid:imageKey" /> 形式でこれらの画像への参照が含まれていることを前提としています。
    // @param {String} options.name - メールの送信者の名前（デフォルト: ユーザー名）
    // @param {String} options.replyTo - デフォルトの返信先アドレスとして使用するメールアドレス（デフォルト: ユーザーのメールアドレス）
    // @returns {null|Error}


    // ---------------------------------------------
    v.step = 4; // 終了処理
    // ---------------------------------------------
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.sendPasscode(arg);
if( w.rv instanceof Error ) throw w.rv;