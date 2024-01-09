/** 応募フォームへのリンクを知らせるメールを送信する
 * 
 * - 引数をGAS側のsendmail()に渡し、GASからメールを発信する。
 * - 送信内容を関数から分離するため、グローバル変数「config.invitation」を既定値とする
 * 
 * @param {Object} arg
 * @param {String} arg.recipient - 受信者のアドレス
 * @param {String} arg.subject - 件名
 * @param {String} arg.body - メールの本文
 * @param {Object} arg.options - 詳細パラメータを指定する JavaScript オブジェクト（下記を参照）
 * @param {BlobSource[]} arg.options.attachments - メールと一緒に送信するファイルの配列
 * @param {String} arg.options.bcc - Bcc で送信するメールアドレスのカンマ区切りのリスト
 * @param {String} arg.options.cc - Cc に含めるメールアドレスのカンマ区切りのリスト
 * @param {String} arg.options.from - メールの送信元アドレス。getAliases() によって返される値のいずれかにする必要があります。
 * @param {String} arg.options.htmlBody - 設定すると、HTML をレンダリングできるデバイスは、必須の本文引数の代わりにそれを使用します。メール用にインライン画像を用意する場合は、HTML 本文にオプションの inlineImages フィールドを追加できます。
 * @param {Object} arg.options.inlineImages - 画像キー（String）から画像データ（BlobSource）へのマッピングを含む JavaScript オブジェクト。これは、htmlBody パラメータが使用され、<img src="cid:imageKey" /> 形式でこれらの画像への参照が含まれていることを前提としています。
 * @param {String} arg.options.name - メールの送信者の名前（デフォルト: ユーザー名）
 * @param {String} arg.options.replyTo - デフォルトの返信先アドレスとして使用するメールアドレス（デフォルト: ユーザーのメールアドレス）
 * @returns {null|Error}
 * 
 * @example
 * 
 * ```
 * const config = {
 *   invitation:{
 *     subject: '応募フォームへのご案内',
 *     body: '',
 *     options: {
 *       name: '下北沢小おやじの会',
 *       replyTo: 'shimokitasho.oyaji@gmail.com',
 *       htmlBody:`<p>Fm: 下北沢小おやじの会</p>
 * 
 *         <p>この度は「校庭キャンプ2024」に応募いただき、ありがとうございました。<br>
 *         「<a href="〜">校庭キャンプ2024 応募フォーム</a>」から必要事項を入力してください。</p>
 * 
 *         <p><b>注意事項</b></p>
 *         <ol>
 *           <li><span style="color:red">現時点では申込は完了していません。</span><br>
 *             必要事項を記入後、改めてメールで「校庭キャンプ2024 参加者証」をメールでお送りします。<br>
 *             その受信をもって申し込み完了となります。
 *           </li>
 *         </ol>`,
 *     },
 *   },
 * }
 * ```
 */
async function sendInvitation(arg=config.invitation){
  const v = {whois:'sendInvitation',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {
    v.step = 1; // 送信先を取得
    v.recipient = event.target.parentNode.querySelector('input').value;

    v.step = 2; // GAS関数'sendmail()'の呼出
    v.r = await doGAS('sendmail',v.recipient,
      arg.subject,
      arg.body,
      arg.options
    );
    if( v.r instanceof Error ) throw v.r;

    v.step = 3; // 確認メッセージの表示
    alert('メールを送信しました');

    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\narg=${JSON.stringify(arg)}`;  // 引数
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}