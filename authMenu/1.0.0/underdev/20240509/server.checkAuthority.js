/** シートからユーザ情報を取得、メニュー表示権限を持つか判断
 * 
 * @param {Object} arg
 * @param {number} arg.userId=null - ユーザID
 * @param {string} arg.email=null - e-mail。新規ユーザ登録時のみ使用の想定
 * @param {string} arg.CPkey=null - 要求があったユーザの公開鍵
 * @param {string} arg.updated=null - CPkey生成・更新日時文字列
 * @param {number} arg.allow=0 - 表示対象メニューの開示範囲
 * @returns {object} 以下のメンバを持つオブジェクト(SPkey以外はgetUserInfoの戻り値)
 * - data=null {Object} シート上のユーザ情報オブジェクト(除、trial)
 * - isExist=0 {number} - 既存メアドなら0、新規登録したなら新規採番したユーザID
 * - status
 *   - 0 : OK(権限ありかつログイン不要 ⇒ 要求画面表示可)
 *   - 1〜4 : 要ログイン
 *     - 1 : ①パスコード生成からログインまでの猶予時間を過ぎている
 *     - 2 : ②クライアント側ログイン(CPkey)有効期限切れ
 *     - 4 : ③引数のCPkeyがシート上のCPkeyと不一致
 *   - 8 : NG(権限はあるが)凍結中
 *   - 16 : NG(権限なし)　※allowと比較し、該当すれば追加
 * - numberOfLoginAttempts {number} 試行可能回数
 * - loginGraceTime=900,000(15分) {number}<br>
 *   パスコード生成からログインまでの猶予時間(ミリ秒)
 * - remainRetryInterval=0 {number} 再挑戦可能になるまでの時間(ミリ秒)
 * - passcodeDigits=6 {number} : パスコードの桁数
 * - SPkey=null {Object} サーバ側公開鍵。status=0(OK)の場合のみ追加
 */
w.func.checkAuthority = function(arg){
  const v = {whois:w.whois+'.checkAuthority',step:0,rv:null};
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    // ---------------------------------------------
    v.step = 1; // 権限有無判断
    // ---------------------------------------------
    v.step = 1.1; // 対象ユーザ情報の取得
    v.rv = this.getUserInfo(Object.assign(arg,{createIfNotExist:true}));
    if( v.rv instanceof Error ) throw v.rv;
    v.trial = v.rv.trial;
    delete v.rv.trial;  // trialは戻り値に含めない

    v.step = 1.2; // 権限なし ⇒ statusのフラグを立てる
    if( (arg.allow & v.rv.data.auth) === 0 ){
      v.rv.status += 16;
    }

    v.step = 1.3; // 要ログイン以外の場合、ユーザの状態を返して終了
    // 「権限なし or 凍結中 ⇒ エラー」または「権限あり and ログイン不要」
    if( v.rv.status === 0 || (v.rv.status & 24) > 0 ){
      if( v.rv.status === 0 ){
        // 権限あり and ログイン不要 ⇒ OK、SPkeyを追加
        v.rv.SPkey = w.prop.SPkey;
      }
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;  
    }


    // ---------------------------------------------
    v.step = 2; // 要ログイン ⇒ パスコード生成して試行可能回数を返す
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

    v.step = 2.1; // パスコードを生成、シートに保存
    v.trial.passcode = Math.floor(Math.random() * Math.pow(10,w.prop.passcodeDigits));
    v.trial.created = Date.now();

    v.step = 2.3; // 【没。これ要る？】trial更新に合わせ、CPkey/updatedも更新
    // checkAuthorityが呼ばれるのは「CP不一致 or CP無効」の場合。
    // よって送られてきた新規CPkey/updatedでシート上のそれを更新する
    v.r = v.master.update({
      //CPkey: arg.CPkey,
      //updated: arg.updated,
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
      v.rv.data.email, // recipient
      w.prop.notificatePasscodeMail.subject, // subject
      v.trial.body, // body
      w.prop.notificatePasscodeMail.options // options
    );
    if( v.r instanceof Error ) throw v.r;


    // ---------------------------------------------
    v.step = 4; // 終了処理
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
