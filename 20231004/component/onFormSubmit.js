/** 管理局として必要な権限を要求
 * @param {void}
 * @returns {void}
 */
function initMaster(){
  // シートへのアクセス権
  const s = GASLib.szSheet('master');
  console.log(s.data.length);

  // メール発信
  console.log(MailApp.getRemainingDailyQuota());
  MailApp.sendEmail("nakaone.kunihiro@gmail.com", "test", String(new Date()));
  console.log(MailApp.getRemainingDailyQuota());
}

/** 申込フォームの入力を受け、シートの更新＋受付メールの発信を行う
 * @param {Object} e - [イベント](https://developers.google.com/apps-script/guides/triggers/events?hl=ja#form-submit)オブジェクト
 * @returns {void}
 * 
 * ## 処理概要
 * 
 * 1. フォームから渡されるオブジェクトから以下の情報を取得
 *    1. "range"から書き込まれた行(e.range.getRow())
 *    2. "namedValues"からメールアドレス(e.namedValues["メールアドレス"][0])
 * 2. フォームの情報を取得
 *    1. 全回答情報を取得(FormApp.openById(v.formId).getResponses())
 *    2. {UNIX時刻:editURL}のマップを作成
 * 3. シート"master"に追加情報を記入
 *    1. 要既定値設定項目(entryNo/editURL/authority)の空欄に既定値を設定
 *    2. "range"から書き込まれた行の情報はメール送信用に保存
 * 4. 回答者にメールを送信
 * 
 * ## 参考
 * 
 * - [GASでGoogleフォームの値を取得する](https://walking-elephant.blogspot.com/2021/01/gas.formapp.html)
 * - GAS公式 [Class FormApp](https://developers.google.com/apps-script/reference/forms/form-app?hl=ja)
 * - GAS公式 [Class Form](https://developers.google.com/apps-script/reference/forms/form?hl=ja)
 * 
 * メール送信については以下を参照。
 * 
 * - [Google App Script メモ（メール送信制限 回避術）](https://zenn.dev/tatsuya_okzk/articles/259203cc416328)
 * - GAS公式[createDraft](https://developers.google.com/apps-script/reference/gmail/gmail-app?hl=ja#createdraftrecipient,-subject,-body,-options)
 */
function onFormSubmit(e){
  const v = {rv:null,form:{},
    whois:'管理局.onFormSubmit',

    // formId: フォーム編集画面のURL(下の「〜」の部分)
    // https://docs.google.com/forms/d/〜/edit
    // log > fy2023 > 20230930_校庭キャンプ > サイト・フォーム > 申込フォーム
    formId:'1wsEtp-SdI0ypsoIzaWFXH6rPEn9G5ywL98OSUqJHCyQ',

    // content: メール本文
    content: `<p>To: _name 様</p>

<p>下北沢小おやじの会です。<br>
この度は「校庭キャンプ2023」にお申し込みいただき、ありがとうございました。</p>

<p style="font-size:2rem">受付番号：_entryNo</p>

<p>昨年度大変多くの参加をいただいたため、今回定員オーバーの場合は申込締切日に抽選させていただき、結果はメールでご連絡差し上げることとしました。<br>
お申し込み即参加可能とはならず誠に恐縮ですが、何卒ご理解いただけますようお願い申し上げます。</p>

<p>参加要項を以下に掲載しています。持ち物や注意事項を記載しており、またイベント当日の受付で必要になりますので、事前にご確認いただけますようお願い申し上げます。<br>
_camp2023</p>

<p>なお申込〜イベント当日の間に何らかの事情でお申し込み内容に変更がある場合、またはお申し込み自体をキャンセルする場合、以下から申込内容を修正いただけますようお願いいたします。<br>
_editURL</p>

<p>尚ご不明な点がございましたら、以下までご連絡お願いいたします。<br>
shimokitasho.oyaji@gmail.com</p>`,

    // button: ボタンに適用するCSS
    button: 'style="'
      + 'display : inline-block;'
      + 'text-decoration: none;'
      + 'font-size : 18pt;'
      + 'text-align : center;'
      + 'cursor : pointer;'
      + 'padding : 12px 12px;'
      + 'background : #1a1aff;'
      + 'color : #ffffff;'
      + 'line-height : 1em;'
      + 'transition : .3s;'
      + 'box-shadow : 6px 6px 5px #666666;'
      + 'border : 2px solid #1a1aff;'
    + '" onMouseOver="'
      + 'box-shadow: none;'
      + 'color: #1a1aff;'
      + 'background: #ffffff;'
    + '" onMouseOut="'
      + 'box-shadow: 6px 6px 5px #666666;'
      + 'color: #ffffff;'
      + 'background: #1a1aff;'
    + '"',
  };
  try {
    console.log(v.whois+' start.',e.response); // onFormSubmit開始ログ

    v.step = '1';  // フォームから渡されるオブジェクトから行番号とメアドを取得
    v.lineNum = e.range.getRow();
    v.email = e.namedValues["メールアドレス"][0];
    console.log('lineNum:%s, email:%s',v.lineNum,v.email);

    v.step = '2'; // フォームの情報を取得
    v.responses = FormApp.openById(v.formId).getResponses();
    for( v.i=0 ; v.i<v.responses.length ; v.i++ ){
      v.timestamp = v.responses[v.i].getTimestamp().getTime();
      console.log('2.1. timestamp='+v.timestamp);
      v.form[String(v.timestamp)] = {
        timestamp: v.timestamp,
        email: v.responses[v.i].getRespondentEmail(),
        editURL: v.responses[v.i].getEditResponseUrl()
      }
    }
    console.log('v.form='+JSON.stringify(v.form));

    v.step = '3'; // シート"master"に追加情報を記入
    v.sheet = GASLib.szSheet('master','タイムスタンプ');
    for( v.i=0 ; v.i<v.sheet.data.length ; v.i++ ){
      v.d = v.sheet.data[v.i];
      v.stamp = new Date(v.d['タイムスタンプ']).getTime();
      if( !v.d.entryNo || !v.d.editURL || !v.d.authority ){
        v.updateResult = v.sheet.update({
          entryNo: v.i+1,
          editURL: v.form[String(v.stamp)].editURL,
          authority: 0,
        },{num:v.i,append:false});
        //console.log('updateResult:'+JSON.stringify(v.updateResult));
      }
      if( v.i === (v.lineNum - 2) ){
        v.entryData = v.sheet.data[v.i];
        console.log('entryData:'+JSON.stringify(v.entryData));
      }
    }

    v.step = '4';   // 回答者にメールを送信
    v.step = '4.1'; // プレーン・html共通部分の置換
    v.content = v.content.replace('_name',v.entryData['申込者氏名']);
    v.content = v.content.replace('_entryNo',('000'+v.entryData.entryNo).slice(-4));
    v.camp2023 = 'https://shimokitazawashooyajinokai.on.drv.tw'
      + '/public/camp2023.html?id=' + v.entryData.entryNo;
    console.log('4.1 content='+v.content);

    v.step = '4.2'; // プレーンの作成
    v.plane = v.content
      .replaceAll(/<.+?>/g,'')  // htmlタグの削除
      .replace('_camp2023',v.camp2023)
      .replace('_editURL',v.entryData.entryNo);
    console.log("4.2 plane="+v.plane);

    v.step = '4.3'; // htmlの作成
    v.html = v.content
      .replace('_camp2023','<a ' + v.button + ' href="'
        + v.camp2023 + '" class="button">参加案内</a>')
      .replace('_editURL','<a ' + v.button + ' href="'
        + v.entryData.editURL + '" class="button">回答を編集</a>');
    v.html = '<!DOCTYPE html><html xml:lang="ja" lang="ja">'
      + '<head></head><body>' + v.html + '</body></html>';
    console.log("4.3 html="+v.html);

    v.draft = GmailApp.createDraft(
      v.entryData['メールアドレス'],
      '[受付]校庭キャンプ2023 申込',
      v.plane,
      {
        htmlBody: v.html,
        name: '下北沢小おやじの会',
      }
    );
    v.draftId = v.draft.getId();
    GmailApp.getDraft(v.draftId).send();

    console.log('Mail Remaining Daily Quota:'+MailApp.getRemainingDailyQuota());

    console.log(v.whois+' end.'); // onFormSubmit正常終了ログ
  } catch(e) {
    console.error(v.whois+' abnormal end.\n',e,v);
  }
}
