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
  template: {},
  list: [
    {entryNo:32, name:'嶋津'},
    {entryNo:27, name:'村田'},
    {entryNo:249, name:'山口'},
    {entryNo:115, name:'浦野'},
    {entryNo:193, name:'青木'},
    {entryNo:90, name:'上岡'},
    {entryNo:217, name:'杉村'},
    {entryNo:84, name:'渡部'},
    {entryNo:102, name:'野口'},
    {entryNo:232, name:'渡邉'},
    {entryNo:220, name:'小幡'},
    {entryNo:202, name:'種池'},
    {entryNo:73, name:'荒川'},
    {entryNo:92, name:'飯酒盃'},
    {entryNo:52, name:'石井'},
    {entryNo:237, name:'大草'},
    {entryNo:72, name:'馬淵'},
    {entryNo:86, name:'桑原'},
    {entryNo:63, name:'佐藤'},
    {entryNo:221, name:'齋藤'},
    {entryNo:150, name:'林'},
    {entryNo:99, name:'尾崎'},
    {entryNo:205, name:'上田'},
    {entryNo:105, name:'降旗'},
    {entryNo:194, name:'田中'},
    {entryNo:124, name:'川西'},
    {entryNo:125, name:'太田'},
    {entryNo:240, name:'可児'},
    {entryNo:226, name:'伊丹'},
    {entryNo:156, name:'持田'},
    {entryNo:231, name:'伊田'},
    {entryNo:109, name:'野地'},
    {entryNo:93, name:'山下'},
    {entryNo:200, name:'大﨑'},
    {entryNo:106, name:'中村'},
    {entryNo:142, name:'恩田'},
    {entryNo:245, name:'福元'},
    {entryNo:215, name:'中牧'},
    {entryNo:46, name:'勝'},
    {entryNo:131, name:'木下'},
    {entryNo:169, name:'登坂'},
    {entryNo:89, name:'山下'},
    {entryNo:218, name:'済藤'},
    {entryNo:128, name:'須藤'},
    {entryNo:168, name:'石田'},
    {entryNo:129, name:'井上'},
    {entryNo:145, name:'古村'},
    {entryNo:170, name:'藤田'},
    {entryNo:247, name:'堀川'},
    {entryNo:235, name:'樋口'},
    {entryNo:159, name:'杉本'},
    {entryNo:96, name:'本間'},
    {entryNo:233, name:'加納'},
    {entryNo:116, name:'羽生田'},
    {entryNo:60, name:'黒川'},
    {entryNo:132, name:'垣内'},
    {entryNo:199, name:'三浦'},
    {entryNo:192, name:'祝'},
    {entryNo:64, name:'飯島'},
    {entryNo:107, name:'石井'},
    {entryNo:140, name:'川藤'},
    {entryNo:134, name:'岡田'},
    {entryNo:126, name:'小林'},
    {entryNo:75, name:'上岡'},
    {entryNo:57, name:'爲貞'},
    {entryNo:227, name:'岩岡'},
    {entryNo:173, name:'新留'},
    {entryNo:148, name:'渡邉'},
    {entryNo:67, name:'八木'},
    {entryNo:103, name:'栗野'},
    {entryNo:163, name:'飯田'},
    {entryNo:212, name:'渡辺'},
    {entryNo:178, name:'土屋'},
    {entryNo:230, name:'土井'},
    {entryNo:77, name:'松田'},
    {entryNo:152, name:'田畑'},
    {entryNo:244, name:'石崎'},
    {entryNo:198, name:'一力'},
    {entryNo:36, name:'加藤'},
    {entryNo:189, name:'黒木'},
    {entryNo:149, name:'小針'},
    {entryNo:151, name:'鈴木'},
    {entryNo:176, name:'馬場'},
    {entryNo:74, name:'大隅'},
    {entryNo:175, name:'岩舘'},
    {entryNo:35, name:'目黒'},
    {entryNo:248, name:'桑井'},
    {entryNo:181, name:'鈴木'},
    {entryNo:71, name:'渡辺'},
    {entryNo:155, name:'本田'},
    {entryNo:70, name:'森川'},
    {entryNo:45, name:'木下'},
    {entryNo:58, name:'豊田'},
    {entryNo:123, name:'宮内'},
    {entryNo:91, name:'成瀬'},
    {entryNo:76, name:'木村'},
    {entryNo:62, name:'内藤'},
    {entryNo:122, name:'中村'},
    {entryNo:54, name:'濱本'},
    {entryNo:207, name:'大平'},
    {entryNo:117, name:'吉川'},
    {entryNo:201, name:'江本'},
    {entryNo:241, name:'河野'},
    {entryNo:143, name:'渡辺'},
    {entryNo:119, name:'河西'},
    {entryNo:225, name:'吹田'},
    {entryNo:179, name:'野沢'},
    {entryNo:160, name:'山内'},
    {entryNo:33, name:'南家'},
    {entryNo:229, name:'栗田'},
    {entryNo:111, name:'早川'},
    {entryNo:112, name:'西川'},
    {entryNo:214, name:'松崎'},
    {entryNo:37, name:'中村'},
    {entryNo:104, name:'敷野'},
    {entryNo:183, name:'小倉'},
    {entryNo:242, name:'野田'},
    {entryNo:120, name:'石井'},
    {entryNo:216, name:'菅野'},
    {entryNo:187, name:'宮東'},
    {entryNo:184, name:'和泉'},
    {entryNo:239, name:'吉田'},
    {entryNo:234, name:'鈴木'},
    {entryNo:157, name:'尾崎'},
    {entryNo:243, name:'岩間'},
    {entryNo:136, name:'わじま'},
    {entryNo:101, name:'池谷'},
    {entryNo:197, name:'田中'},
    {entryNo:195, name:'鈴木'},
    {entryNo:167, name:'川上'},
    {entryNo:80, name:'田中'},
    {entryNo:44, name:'神谷'},
    {entryNo:94, name:'小原'},
    {entryNo:174, name:'柿田'},
    {entryNo:138, name:'宮崎'},
  ],
}


To: _name 様

下北沢小おやじの会です。この度は校庭キャンプ2023に応募いただき、ありがとうございました。

応募人数350名に対して500名を大幅に超える応募をいただき、結果として抽選が必要になりました。
厳正なる抽選の結果、_name様については当選となりました。おめでとうございます。

当日はQRコード付きの本メール、または以下のサイトに準備している参加者パスを見せてね

コロナの流行が見られます。イベント参加を見送る場合、以下からキャンセルしてね

注意書き、確認してね。できたら掲示板も一読してね。

朝からお手伝いできる方は8:30集合、スポット予定は本部に声掛け

複数応募者は当選と落選が通知されるけど、当選でいいよ



To: _name 様

下北沢小おやじの会です。この度は校庭キャンプ2023に応募いただき、ありがとうございました。

応募人数350名に対して500名を大幅に超える応募をいただき、結果として抽選が必要になりました。
厳正なる抽選の結果、誠に残念ではございますが、今回はご期待に添いかねる結果となりました。
大変申し訳ございませんが、ご了承くださいますようお願い申し上げます。

なお応募の際に入力いただいた情報は、当方にて責任を持って破棄いたします。

ご応募いただいたことにお礼申し上げると共に、略式ながらメールにて通知申し上げます。
末筆になりますが、_name様のこれからのご活躍を心よりお祈り申し上げます。


-- 以下は省略？
なおキャンセルが発生した場合、お声がけさせていただく場合があります。