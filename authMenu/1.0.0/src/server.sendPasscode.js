/** authClientからの要求を受け、ユーザ情報と状態を返す
 * 
 * ユーザIDやCS/CPkey他の自ユーザ情報、およびSPkeyはauthClient.constructor()で初期値を設定し、
 * 先行する「新規ユーザ登録」で修正済情報がインスタンス変数に存在する前提。
 * 
 * @param {Object} arg
 * @param {number} arg.userId - ユーザID
 * @param {string} arg.CPkey - 要求があったユーザの公開鍵
 * @param {string} arg.updated - CPkey生成・更新日時文字列
 * @returns {object} 以下のメンバを持つオブジェクト
 * - status {number}
 *   - 0 : 成功(パスコード通知メールを送信)
 *   - 1 : パスコード生成からログインまでの猶予時間を過ぎている
 *   - 2 : 凍結中(前回ログイン失敗から一定時間経過していない)
 * - data=null {Object} シート上のユーザ情報オブジェクト(除、trial)
 * - SPkey=null {Object} サーバ側公開鍵
 * - loginGraceTime=900,000(15分) {number}<br>
 *   パスコード生成からログインまでの猶予時間(ミリ秒)
 * - remainRetryInterval=0 {number} 再挑戦可能になるまでの時間(ミリ秒)
 * - passcodeDigits=6 {number} : パスコードの桁数
 */
w.func.sendPasscode = function(arg){
  const v = {whois:w.whois+'.sendPasscode',step:0,rv:{
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
    v.step = 2; // パスコード生成
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

    v.step = 2.1; // 試行可能かの確認
    // 以下のいずれかの場合はエラーを返して終了
    // ①パスコード生成からログインまでの猶予時間を過ぎている
    if( (w.prop.loginGraceTime + trial.created) > Date.now() ){
      v.rv.status = 1;
      return v.rv;
    }
    // ②前回ログイン失敗から凍結時間を過ぎていない
    if( v.trial.log.length > 0 ){
      if( trial.log[0].status === w.prop.numberOfLoginAttempts
      && (trial.log[0].timestamp + w.prop.loginRetryInterval) > Date.now() )
        v.rv.status = 2;
        v.rv.remainRetryInterval = trial.log[0].timestamp
          + w.prop.loginRetryInterval - Date.now();
        return v.rv;
    }

    v.step = 2.2; // trialオブジェクトを生成、シートに保存
    v.trial.passcode = Math.floor(Math.random() * Math.pow(10,w.prop.passcodeDigits));
    v.trial.created = Date.now();

    v.step = 2.3; // trial更新に合わせ、CPkey/updatedも更新
    // sendPasscodeが呼ばれるのは「CP不一致 or CP無効」の場合。
    // よって送られてきた新規CPkey/updatedでシート上のそれを更新する
    v.r = v.master.update({
      CPkey: arg.CPkey,
      updated: arg.updated,
      trial: JSON.stringify(v.trial)
    },{where: x => x[w.prop.primatyKeyColumn] === arg.userId});


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
    //
    // w.prop.notificatePasscodeMailでテンプレート設定済
    // notificatePasscodeMail: {
    //   subject: '[連絡] パスコード',
    //   body: 'パスコードは以下の通りです。\n\n::passcode::',
    //   options: {},
    // },
    v.trial.body = w.prop.notificatePasscodeMail.body
    .replaceAll('::passcode::',('0'.repeat(w.prop.passcodeDigits)
    + String(v.trial.passcode)).slice(-w.prop.passcodeDigits));
    v.r = sendmail(
      v.user.email, // recipient
      w.prop.notificatePasscodeMail.subject, // subject
      v.trial.body, // body
      w.prop.notificatePasscodeMail.options // options
    );
    if( v.r instanceof Error ) throw v.r;


    // ---------------------------------------------
    v.step = 4; // 終了処理
    // ---------------------------------------------
    v.rv.data = v.user;
    delete v.rv.data.trial; // 悪用されないよう、念のため削除
    v.rv.SPkey = w.prop.SPkey;
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