/**
 * @typedef Template
 * @prop {Object.<string, string>} - テンプレート名と本文。_[0-9a-zA-Z]は埋込キー
 */

/** 宛先リスト
 * @typedef recipient
 * @prop {string} recipient - 宛先のe-mailアドレス
 * @prop {string} subject - 題名
 * @prop {string} body - 本文(プレーンテキスト)
 * @prop {string} name - 発信者名
 * @prop {string} htmlBody - 本文(HTML)
 * @prop {string} replyTo - 返信先アドレス
 * @prop {Object.<string, string>} embed - 埋込データ
 */


const arg = {
  template: {winning:`To: _name 様

下北沢小おやじの会です。この度は校庭キャンプ2023に応募いただき、ありがとうございました。

応募人数350名に対して500名を大幅に超える応募をいただき、結果として抽選が必要になりました。
厳正なる抽選の結果、_name様については当選となりました。おめでとうございます。

【注意事項】

(01) 参加者用のサイトを用意しています。
  https://shimokitazawashooyajinokai.on.drv.tw/public/camp2023.html?id=_entryNo

(02) キャンセルは参加者用のサイトから「メニュー > 参加者パス > 詳細情報 > 申込フォームを開く」を選択して行ってください。

(03) インフルエンザ、コロナの流行が見られます。なるべくマスクを着用してください。

(04) 雨天中止です。中止の場合、以下のサイトで告知します。
  https://tinyurl.com/2aeqv5f5

(05) インフルエンザ・コロナ・台風等の事情により、宿泊が中止されディキャンプになる可能性があること、お含みおきください。

(06) 当日の受付は、スマホの場合は参加者用のサイトから「メニュー > 参加者パス」を提示してください。
  お子様またはスマホがない場合は受付番号(No._entryNo)またはお名前をお伝えください。

(07) お手伝いいただける方は受付時にお声がけください。

(08) テントの使用はお申し込みいただいている方以外はご遠慮ください。


それではイベント当日にお会いできること、楽しみにしております。`,
failed:`To: _name 様

下北沢小おやじの会です。この度は校庭キャンプ2023に応募いただき、ありがとうございました。

応募人数350名に対して500名を大幅に超える応募をいただき、結果として抽選が必要になりました。

厳正なる抽選の結果、誠に残念ではございますが、今回はご期待に添いかねる結果となりました。
大変申し訳ございませんが、ご了承くださいますようお願い申し上げます。

なお応募の際に入力いただいた情報は、当方にて責任を持って破棄いたします。

ご応募いただいたことにお礼申し上げると共に、略式ながらメールにて通知申し上げます。
末筆になりますが、_name様のこれからのご活躍を心よりお祈り申し上げます。`},
  list: [ // [a-z0-9\-_\.]+@[a-z\.]+
    {"template":"winning","recipient":"nakaone.kunihiro@gmail.com","entryNo":"210","name":"久保田"},
    {"template":"failed","recipient":"nakaone.kunihiro@gmail.com","entryNo":"149","name":"小針"},
    {"template":"winning","recipient":"nakaone.kunihiro@gmail.com","entryNo":"114","name":"浅利"},
    {"template":"winning","recipient":"nakaone.kunihiro@gmail.com","entryNo":"148","name":"渡邉"},
    {"template":"failed","recipient":"nakaone.kunihiro@gmail.com","entryNo":"56","name":"遠藤"},
    {"template":"winning","recipient":"nakaone.kunihiro@gmail.com","entryNo":"167","name":"川上"},
    {"template":"winning","recipient":"nakaone.kunihiro@gmail.com","entryNo":"84","name":"渡部"},
    {"template":"winning","recipient":"nakaone.kunihiro@gmail.com","entryNo":"153","name":"伊藤"},
    {"template":"winning","recipient":"nakaone.kunihiro@gmail.com","entryNo":"122","name":"中村"}
  ],
}






