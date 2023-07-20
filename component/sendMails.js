/* コアスクリプト */
/**
 * @typedef {object} mailOptions - MailApp.sendEmail(recipient, subject, body, options)のoptions
 * @prop {BlobSource[]} attachments - メールで送信するファイルの配列
 * @prop {String} bcc - BCC 宛てのメールアドレスのカンマ区切りリスト
 * @prop {String} cc - Cc に含めるメールアドレスのカンマ区切りリスト
 * @prop {String} htmlBody - 設定すると必須の本文引数の代わりにHTMLをレンダリング
 * @prop {Object} inlineImages - 画像キーから画像データへのマッピングを含むオブジェクト
 * @prop {String} name - メールの送信者の名前。デフォルトは送信者のユーザー名。
 * @prop {Boolean} noReply - 受信者からの発信元メールアドレスへの返信を抑止
 * @prop {String} replyTo - デフォルトの返信先アドレス。noReply=trueなら無視される
 */
/**
 * @typedef {object} mailObj - 送信するメールのオブジェクト。MailApp.sendEmailに準拠
 * @prop {string} mailObj.recipient - 宛先
 * @prop {string} mailObj.subject - 件名
 * @prop {string} mailObj.body - メールの本文(テンプレート)
 * @prop {mailOptions} [mailObj.options={}] - MailApp.sendEmailのオプション
 */
/**
 * @typedef {object} sendMailsResult - sendMailsの戻り値
 * @prop {number} remain - 送信後の残通数
 * @prop {mailObj[]} OK - 送信に成功したメールの配列
 * @prop {mailObj[]} NG - 送信に失敗したメールの配列
 */
/** sendMails: GAS上の配信局でテンプレートに個別メールのデータを差し込み、送信する
 * @desc 本関数は配信局で利用し、呼出元(管理局、認証局)は別アカウントを想定。よって以下は呼出元で行う。
 * <ol>
 * <li>シートに保存されているテンプレートの読み込み
 * <li>呼出先配信局の選定
 * <li>1日あたり配信通数を超えた場合、制限超過配信局の記録(候補からの除外)
 * </ol>
 * @param {mailObj|mailObj[]} arg - 送信するメールのオブジェクトまたはその配列
 * @returns {sendMailsResult} 送信結果
 * 
 * @desc <caption>参考</caption>
 * <ul>
 * <li>[Class MailApp]{@link https://developers.google.com/apps-script/reference/mail/mail-app?hl=ja}
 * <li>要権限付与
 * <li>指定の優先順位は引数＞テンプレート＞config.mail＞プログラム内で設定する既定値
 * </ul>
 */
 function sendMails(arg){
  const v = {whois:'GAS.sendMails',arg:arg,rv:{OK:[],NG:[]}};
  try {
    console.log(v.whois+' start.\n',arg);
  
    v.step = '1'; // 引数を強制的に配列化
    v.arg = whichType(arg) === 'Object' ? [arg] : arg;

    v.step = '2'; // 残通数超の部分は送信対象から外し、失敗リストに追加
    v.rv.remain = MailApp.getRemainingDailyQuota();
    if( v.rv.remain < v.arg.length ){
      v.rv.NG = v.arg.splice(v.rv.remain);
    }

    v.step = '3'; // 送信実行
    for( v.i=0 ; v.i<v.arg.length ; v.i++ ){
      MailApp.sendEmail(
        v.arg[v.i].recipient,
        v.arg[v.i].subject,
        v.arg[v.i].body,
        v.arg[v.i].options
      );
      v.rv.OK.push(v.to);
    }

    v.step = '4'; // 終了処理
    console.log(v.whois+' normal end.\n',arg);
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}
