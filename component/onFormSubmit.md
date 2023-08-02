lastUpdate: 2023年 8月 2日 水曜日 11時32分48秒 JST

## Functions

<dl>
<dt><a href="#initMaster">initMaster()</a> ⇒ <code>void</code></dt>
<dd><p>管理局として必要な権限を要求</p>
</dd>
<dt><a href="#onFormSubmit">onFormSubmit(e)</a> ⇒ <code>void</code></dt>
<dd><p>申込フォームの入力を受け、シートの更新＋受付メールの発信を行う</p>
</dd>
<dt><a href="#postMails">postMails(arg, attachments, bcc, cc, inlineImages, name, noReply, replyTo)</a> ⇒ <code>null</code> | <code>Error</code></dt>
<dd><p>postMails: GAS上の管理局等の発信局でメールを発信、通数制限を超える場合は配信局を変更</p>
</dd>
<dt><a href="#szSheet">szSheet(arg, [key])</a> ⇒ <code><a href="#szSheetObj">szSheetObj</a></code></dt>
<dd><caption>シート記述時の注意</caption>

<ol>
<li>引数のキー指定は「primary key」のメモより優先される</li>
<li>「default:〜」はcomplement・append時、空欄に「〜」を設定。実データだけでなく算式も可。<br>
例：「default: =indirect(&quot;RC[-1]&quot;,false)」は一列左の値が設定される<br>
また「default: =editFormId(〜).xxx」とした場合、フォームからurl/id/email/timestampが引用される。</li>
<li>フォーム連動項目・arrayformula設定項目・メモ付き項目(primary key/default設定項目)は
update/append/complementの対象にしない。∵GAS側で書き換えると不正動作を誘引する</li>
</ol>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#szSheetObj">szSheetObj</a> : <code>object</code></dt>
<dd><p>szSheetの戻り値</p>
</dd>
<dt><a href="#complementedRow">complementedRow</a> : <code>object</code></dt>
<dd><p>行単位の補完結果</p>
</dd>
<dt><a href="#szSheetSearch">szSheetSearch</a> : <code>object</code></dt>
<dd><p>szSheet.search()の戻り値</p>
</dd>
<dt><a href="#changedColumns">changedColumns</a> : <code>object</code></dt>
<dd><p>szSheet.update/appendで更新・追加により変化した欄とその値</p>
</dd>
<dt><a href="#szSheetChanged">szSheetChanged</a> : <code>object</code></dt>
<dd><p>szSheet.update/appendの一行分の更新・追加結果</p>
</dd>
</dl>

<a name="initMaster"></a>

## initMaster() ⇒ <code>void</code>
管理局として必要な権限を要求

**Kind**: global function  

| Param | Type |
| --- | --- |
|  | <code>void</code> | 

<a name="onFormSubmit"></a>

## onFormSubmit(e) ⇒ <code>void</code>
申込フォームの入力を受け、シートの更新＋受付メールの発信を行う

**Kind**: global function  
**Returns**: <code>void</code> - なし

### 処理概要

参加者の追加・削除やキャンセル登録のため、登録者(参加者)がフォームを編集する必要があるが、編集用URLはGoogle Spreadには記録されず、フォームの登録情報にしか存在しない。

そこで①フォームの登録情報を全件取得し、②引数から何行目に書かれたか特定し、③タイムスタンプをキーに編集用URLを取得、という手順を踏む。

<img src="https://i0.wp.com/tgg.jugani-japan.com/tsujike/wp-content/uploads/210426-001.png?w=1256&ssl=1" width="80%" />

※回答シートとフォームで添字が一致しないかと考えたが、結果的には一致していない。よって「タイムスタンプのgetTime()」を検索キーとする。

1. フォームから渡されるオブジェクトから以下の情報を取得
   1. "range"から書き込まれた行(e.range.getRow())
   2. "namedValues"からメールアドレス(e.namedValues["メールアドレス"][0])
2. フォームの情報を取得
   1. 全回答情報を取得(FormApp.openById(v.formId).getResponses())
   2. {UNIX時刻:editURL}のマップを作成
3. シート"master"に追加情報を記入
   1. 要既定値設定項目(entryNo/editURL/authority)の空欄に既定値を設定
   2. "range"から書き込まれた行の情報はメール送信用に保存
4. 回答者にメールを送信

### 参考

- [GASでGoogleフォームの値を取得する](https://walking-elephant.blogspot.com/2021/01/gas.formapp.html)
- GAS公式 [Class FormApp](https://developers.google.com/apps-script/reference/forms/form-app?hl=ja)
- GAS公式 [Class Form](https://developers.google.com/apps-script/reference/forms/form?hl=ja)

メール送信については以下を参照。

- [Google App Script メモ（メール送信制限 回避術）](https://zenn.dev/tatsuya_okzk/articles/259203cc416328)
- GAS公式[createDraft](https://developers.google.com/apps-script/reference/gmail/gmail-app?hl=ja#createdraftrecipient,-subject,-body,-options)

### 導入時の注意

以下の手順でトリガーを設定すること。<br>
AppsScript > 時計アイコン > トリガーを追加 > 「Masterのトリガーを追加」

- 実行する関数を選択：onFormSubmit
- 実行するデプロイを選択：Head
- イベントのソースを選択：スプレッドシートから
- イベントの種類を選択：フォーム送信時
- エラー通知設定：今すぐ通知を受け取る

### 参考：フォーム上のonFormSubmitに渡される引数

<ul>
<li>GAS公式 <a href="https://developers.google.com/apps-script/guides/triggers/events#google_forms_events">Google フォームのイベント</a>
<li><a href="https://tgg.jugani-japan.com/tsujike/2021/05/gas-form5/#toc2">フォームのコンテナバインドのフォーム送信時イベントオブジェクト</a>
</ul>
<img src="https://i0.wp.com/tgg.jugani-japan.com/tsujike/wp-content/uploads/210427-001.png?w=1256&ssl=1" width="80%" />
<ul>
<li>response : <a href="https://developers.google.com/apps-script/reference/forms/form-response">Form Response</a> Object
<ul>
<li><a href="https://developers.google.com/apps-script/reference/forms/form-response#geteditresponseurl">getEditResponseUrl()</a>
<li><a href="https://developers.google.com/apps-script/reference/forms/form-response#gettimestamp">getTimestamp()</a>
</ul>
<li>source : <a href="https://developers.google.com/apps-script/reference/forms/form">Form</a>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>Object</code> | [イベント](https://developers.google.com/apps-script/guides/triggers/events?hl=ja#form-submit)オブジェクト |

<a name="postMails"></a>

## postMails(arg, attachments, bcc, cc, inlineImages, name, noReply, replyTo) ⇒ <code>null</code> \| <code>Error</code>
postMails: GAS上の管理局等の発信局でメールを発信、通数制限を超える場合は配信局を変更

**Kind**: global function  
**Returns**: <code>null</code> \| <code>Error</code> - 配信結果。正常ならnull  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>arg</code> | 発信するメールの情報 |
| [arg.from] | <code>string</code> | 送信者名(発信元メールアドレスではない) |
| arg.to | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>object</code> \| <code>Array.&lt;object&gt;</code> | 受信者のe-mailアドレスまたは受信者情報の配列 |
| arg.to.address | <code>string</code> | 受信者のe-mailアドレス |
| [arg.to.data] | <code>Object.&lt;string, string&gt;</code> | 「変数名:文字列」形式の差込データ |
| arg.subject | <code>string</code> | 件名 |
| [arg.body] | <code>string</code> | メールの本文(テンプレート)。arg.htmlが存在する場合は代替テキスト。 指定されていない場合、sendMail()でarg.htmlからタグを除いた文字列とする。 |
| [arg.html] | <code>string</code> | 存在するならHTMLメールとして扱う |
| attachments | <code>Array.&lt;BlobSource&gt;</code> | メールで送信するファイルの配列 |
| bcc | <code>String</code> | BCC 宛てのメールアドレスのカンマ区切りリスト |
| cc | <code>String</code> | Cc に含めるメールアドレスのカンマ区切りリスト |
| inlineImages | <code>Object</code> | 画像キーから画像データへのマッピングを含むオブジェクト |
| name | <code>String</code> | メールの送信者の名前。デフォルトは送信者のユーザー名。 |
| noReply | <code>Boolean</code> | 受信者からの発信元メールアドレスへの返信を抑止 |
| replyTo | <code>String</code> | デフォルトの返信先アドレス。noReply=trueなら無視される |

<a name="szSheet"></a>

## szSheet(arg, [key]) ⇒ [<code>szSheetObj</code>](#szSheetObj)
<caption>シート記述時の注意</caption>

1. 引数のキー指定は「primary key」のメモより優先される
2. 「default:〜」はcomplement・append時、空欄に「〜」を設定。実データだけでなく算式も可。<br>
   例：「default: =indirect("RC[-1]",false)」は一列左の値が設定される<br>
   また「default: =editFormId(〜).xxx」とした場合、フォームからurl/id/email/timestampが引用される。
3. フォーム連動項目・arrayformula設定項目・メモ付き項目(primary key/default設定項目)は
update/append/complementの対象にしない。∵GAS側で書き換えると不正動作を誘引する

**Kind**: global function  
**Returns**: [<code>szSheetObj</code>](#szSheetObj) - 取得したシートのデータ  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arg | <code>object</code> \| <code>string</code> |  | 文字列の場合「コンテナのシートでヘッダ行は1行目」と看做す |
| arg.spreadId | <code>string</code> |  | 外部スプレッドシートのID |
| arg.sheetName | <code>string</code> |  | シート名 |
| arg.headerRow | <code>number</code> |  | ヘッダ行の行番号(>0)。既定値1。項目名は重複不可 |
| [key] | <code>string</code> | <code>null</code> | プライマリキーとなる項目名 |

<a name="szSheetObj"></a>

## szSheetObj : <code>object</code>
szSheetの戻り値

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| sheetName | <code>string</code> | シート名 |
| spreadId | <code>string</code> | スプレッドシートID。外部シートの場合のみ設定 |
| sheet | <code>object</code> | getSheetで取得したシートのオブジェクト |
| headerRow | <code>number</code> | ヘッダ行番号 |
| lastRow | <code>number</code> | データが存在する最下行の行番号(>0) |
| key | <code>Array.&lt;string&gt;</code> | キー項目名。引数＞シート上の「primary key」指定項目 |
| keys | <code>Array.&lt;string&gt;</code> | ヘッダ行の一次元配列 |
| colIdx | <code>Object.&lt;string, number&gt;</code> | 項目名:列番号(自然数) |
| raw | <code>Array.&lt;Array.&lt;any&gt;&gt;</code> | 取得した生データ(二次元配列) |
| data | <code>Array.Object.&lt;string, any&gt;</code> | データ行を[{ラベル1:値, ラベル2:値, ..},{..},..]形式にした配列 |
| members | <code>Object.&lt;string, any&gt;</code> | 本オブジェクト内の各メンバ。メソッドへの受渡用 |
| default | <code>Object.&lt;string, number&gt;</code> | 指定項目の既定値 |
| formObj | <code>Object.&lt;string, FormResponse&gt;</code> | defaultで指定されたフォームのオブジェクト。キーはタイムスタンプのgetTime(文字列) [Class FormResponse](https://developers.google.com/apps-script/reference/forms/form-response?hl=ja) |
| isEqual | <code>function</code> | メソッド。変数とシート上の値が等価か判断する。search等のメソッドで使用 |
| complement | <code>function</code> | メソッド。主キーおよび既定値未設定項目の補完を行う |
| search | <code>function</code> | メソッド。行の検索。主に内部利用を想定 |
| lookup | <code>function</code> | メソッド。search結果を基に項目名'key'の値がvalueである行Objを返す |
| update | <code>function</code> | メソッド。行の更新 |
| append | <code>function</code> | メソッド。行の追加 |
| delete | <code>function</code> | メソッド。行の削除 |
| objectize | <code>function</code> | メソッド。階層形式のシートをオブジェクト化 |

<a name="complementedRow"></a>

## complementedRow : <code>object</code>
行単位の補完結果

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dataNum | <code>number</code> | rv.data上の添字 |
| changed | <code>Object.&lt;string, (string\|number)&gt;</code> | 補完した項目と設定値 |

<a name="szSheetSearch"></a>

## szSheetSearch : <code>object</code>
szSheet.search()の戻り値

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| obj | <code>Object.&lt;string, any&gt;</code> | 行オブジェクト({項目名1:値1,項目名2:値2,..}形式) |
| dataNum | <code>number</code> | data上の添字 |
| rawNum | <code>number</code> | raw上の添字 |
| rowNum | <code>number</code> | スプレッドシート上の行番号 |

<a name="changedColumns"></a>

## changedColumns : <code>object</code>
szSheet.update/appendで更新・追加により変化した欄とその値

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| colName | <code>string</code> | 更新・追加により値が変化した項目名 |
| colNum | <code>number</code> | 同列番号(自然数) |
| before | <code>any</code> | 修正前の値 |
| after | <code>any</code> | 修正後の値 |

<a name="szSheetChanged"></a>

## szSheetChanged : <code>object</code>
szSheet.update/appendの一行分の更新・追加結果

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| func | <code>string</code> | append/update/deleteのいずれか |
| dataNum | <code>number</code> | 更新・追加行のrv.data上の添字 |
| rawNum | <code>number</code> | 更新・追加行のrv.raw上の添字 |
| rowNum | <code>number</code> | 更新・追加行のスプレッドシート上の行番号 |
| changed | [<code>Array.&lt;changedColumns&gt;</code>](#changedColumns) \| <code>Object.&lt;string, any&gt;</code> | 更新・追加により変化した欄とその値。削除の場合は削除行のdata |


## source

```
/* コアScript */
/** 管理局として必要な権限を要求
 * @param {void}
 * @returns {void}
 */
 function initMaster(){
  // シートへのアクセス権
  const s = szSheet('master');
  console.log(s.data.length);

  // メール発信
  console.log(MailApp.getRemainingDailyQuota());
  MailApp.sendEmail("nakaone.kunihiro@gmail.com", "test", String(new Date()));
  console.log(MailApp.getRemainingDailyQuota());
}

/** 申込フォームの入力を受け、シートの更新＋受付メールの発信を行う
 * 
 * @param {Object} e - [イベント](https://developers.google.com/apps-script/guides/triggers/events?hl=ja#form-submit)オブジェクト
 * @returns {void} なし
 * 
 * ### 処理概要
 * 
 * 参加者の追加・削除やキャンセル登録のため、登録者(参加者)がフォームを編集する必要があるが、編集用URLはGoogle Spreadには記録されず、フォームの登録情報にしか存在しない。
 * 
 * そこで①フォームの登録情報を全件取得し、②引数から何行目に書かれたか特定し、③タイムスタンプをキーに編集用URLを取得、という手順を踏む。
 * 
 * <img src="https://i0.wp.com/tgg.jugani-japan.com/tsujike/wp-content/uploads/210426-001.png?w=1256&ssl=1" width="80%" />
 * 
 * ※回答シートとフォームで添字が一致しないかと考えたが、結果的には一致していない。よって「タイムスタンプのgetTime()」を検索キーとする。
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
 * ### 参考
 * 
 * - [GASでGoogleフォームの値を取得する](https://walking-elephant.blogspot.com/2021/01/gas.formapp.html)
 * - GAS公式 [Class FormApp](https://developers.google.com/apps-script/reference/forms/form-app?hl=ja)
 * - GAS公式 [Class Form](https://developers.google.com/apps-script/reference/forms/form?hl=ja)
 * 
 * メール送信については以下を参照。
 * 
 * - [Google App Script メモ（メール送信制限 回避術）](https://zenn.dev/tatsuya_okzk/articles/259203cc416328)
 * - GAS公式[createDraft](https://developers.google.com/apps-script/reference/gmail/gmail-app?hl=ja#createdraftrecipient,-subject,-body,-options)
 * 
 * ### 導入時の注意
 * 
 * 以下の手順でトリガーを設定すること。<br>
 * AppsScript > 時計アイコン > トリガーを追加 > 「Masterのトリガーを追加」
 * 
 * - 実行する関数を選択：onFormSubmit
 * - 実行するデプロイを選択：Head
 * - イベントのソースを選択：スプレッドシートから
 * - イベントの種類を選択：フォーム送信時
 * - エラー通知設定：今すぐ通知を受け取る
 * 
 * ### 参考：フォーム上のonFormSubmitに渡される引数
 * 
 * <ul>
 * <li>GAS公式 <a href="https://developers.google.com/apps-script/guides/triggers/events#google_forms_events">Google フォームのイベント</a>
 * <li><a href="https://tgg.jugani-japan.com/tsujike/2021/05/gas-form5/#toc2">フォームのコンテナバインドのフォーム送信時イベントオブジェクト</a>
 * </ul>
 * <img src="https://i0.wp.com/tgg.jugani-japan.com/tsujike/wp-content/uploads/210427-001.png?w=1256&ssl=1" width="80%" />
 * <ul>
 * <li>response : <a href="https://developers.google.com/apps-script/reference/forms/form-response">Form Response</a> Object
 * <ul>
 * <li><a href="https://developers.google.com/apps-script/reference/forms/form-response#geteditresponseurl">getEditResponseUrl()</a>
 * <li><a href="https://developers.google.com/apps-script/reference/forms/form-response#gettimestamp">getTimestamp()</a>
 * </ul>
 * <li>source : <a href="https://developers.google.com/apps-script/reference/forms/form">Form</a>
 * </ul>
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
    v.sheet = szSheet('master','タイムスタンプ');
    for( v.i=0 ; v.i<v.sheet.data.length ; v.i++ ){
      v.d = v.sheet.data[v.i];
      v.stamp = new Date(v.d['タイムスタンプ']).getTime();
      if( !v.d.entryNo || !v.d.editURL || !v.d.authority ){
        v.updateResult = v.sheet.update({
          entryNo: v.i+1,
          editURL: v.form[String(v.stamp)].editURL,
          authority: 1,
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
/* コアスクリプト */
/** postMails: GAS上の管理局等の発信局でメールを発信、通数制限を超える場合は配信局を変更
 * @param {arg} arg - 発信するメールの情報
 * @param {string} [arg.from] - 送信者名(発信元メールアドレスではない)
 * @param {string|string[]|object|object[]} arg.to - 受信者のe-mailアドレスまたは受信者情報の配列
 * @param {string} arg.to.address - 受信者のe-mailアドレス
 * @param {Object.<string, string>} [arg.to.data] - 「変数名:文字列」形式の差込データ
 * @param {string} arg.subject - 件名
 * @param {string} [arg.body] - メールの本文(テンプレート)。arg.htmlが存在する場合は代替テキスト。
 * 指定されていない場合、sendMail()でarg.htmlからタグを除いた文字列とする。
 * @param {string} [arg.html] - 存在するならHTMLメールとして扱う
 * @param {BlobSource[]} attachments - メールで送信するファイルの配列
 * @param {String} bcc - BCC 宛てのメールアドレスのカンマ区切りリスト
 * @param {String} cc - Cc に含めるメールアドレスのカンマ区切りリスト
 * @param {Object} inlineImages - 画像キーから画像データへのマッピングを含むオブジェクト
 * @param {String} name - メールの送信者の名前。デフォルトは送信者のユーザー名。
 * @param {Boolean} noReply - 受信者からの発信元メールアドレスへの返信を抑止
 * @param {String} replyTo - デフォルトの返信先アドレス。noReply=trueなら無視される
 * @returns {null|Error} 配信結果。正常ならnull 
 */
 function postMails(arg){
  const v = {whois:'GAS.postMails',arg:arg,rv:null,post:[],to:[]};
  try {
    console.log(v.whois+' start.\n',arg);

    // 1.事前準備
    v.step = '1.1'; // 引数をMailApp.sendEMailsの引数の形に変換
    v.template = {
      recipient: undefined,
      subject: arg.subject,
      body: arg.body || undefined,
      options: {
        attachments: arg.attachments || undefined,
        bcc: arg.bcc || undefined,
        cc: arg.cc || undefined,
        htmlBody:	arg.html || undefined,
        inlineImages: arg.inlineImages || undefined,
        name: arg.from || undefined,
        noReply: arg.noReply || false,
        replyTo: arg.replyTo || undefined
      }
    }

    v.step = '1.2'; // bodyが未設定の場合、タグを除いたテキストを設定
    if( typeof v.template.body === 'undefined' ){
      v.m = arg.html.match(/<body[^>]*>([\s\S]+?)<\/body>/); // body内部のみ抽出
      v.template.body = v.m ? v.m[1] : arg.html;
      v.template.body = v.template.body
      .replace(/<a href="([^"]+?)".*?>([^<]+?)<\/a>/g,'$2($1)') // hrefはアドレス表示
      .replace(/<[^<>]+?>/g,'');  // HTMLのタグは削除
    }

    v.step = '1.3'; // テンプレートを文字列化
    v.template = JSON.stringify(v.template);

    v.step = '1.4'; // 配信先(arg.to)を配列に変形
    if( whichType(arg.to) === 'Array' ){
      if( typeof arg.to[0] === 'string' ){  // string[]
        for( v.i=0 ; v.i<arg.to.length ; v.i++ ){
          v.to.push({address:arg.to[v.i],data:{}});
        }
      } else {  // object[]
        v.to = arg.to;
      }
    } else {
      if( typeof arg.to === 'string' ){ // string
        v.to = [{address:arg.to,data:{}}];
      } else {  // object
        v.to = [arg.to];
      }
    }

    v.step = '1.5'; // 内部関数定義：プレースホルダを差込データで置換
    v.merge = (p,str,data) => {
      const v = {whois:p.whois+'.v.merge',rv:null};
      try{
        v.rv = str;
        for( v.x in data ){
          v.rex = new RegExp('::' + v.x + '::','g');
          v.rv = v.rv.replaceAll(v.rex,String(data[v.x]));
        }
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
        v.rv = e;
      } finally {
        return v.rv;
      }
    }

    v.step = '2'; // 宛先ごとにデータを作成、postに格納
    for( v.i=0 ; v.i<v.to.length ; v.i++ ){
      v.step = '2.1'; // 一通分のデータをv.mailとして作成
      v.mail = JSON.parse(v.template);
      v.step = '2.2'; // 宛先(recipient)の設定
      v.mail.recipient = v.to[v.i].address;
      v.step = '2.3'; // subjectの仮引数を差込データで置換
      v,v.mail.subject = v.merge(v,v.mail.subject,v.to[v.i].data);
      if( v,v.mail.subject instanceof Error ) throw v,v.mail.subject;
      v.step = '2.4'; // bodyの仮引数を差込データで置換
      v.mail.body = v.merge(v,v.mail.body,v.to[v.i].data);
      if( v.mail.body instanceof Error ) throw v.mail.body;
      v.step = '2.5'; // htmlBodyの仮引数を差込データで置換
      if( typeof v.mail.options.htmlBody !== 'undefined' ){
        v.mail.options.htmlBody = v.merge(v,v.mail.options.htmlBody,v.to[v.i].data);
        if( v.mail.options.htmlBody instanceof Error ) throw v.mail.options.htmlBody;
      }
      v.step = '2.6'; // v.mailをv.postに保存
      v.post.push(v.mail);
    }

    v.step = '3';  // 残通数=0になるまでsendMailsを呼び出し
    while( v.to.length > 0 ){
      v.step = '3.1'; // 送信実行
      v.r = sendMails(v.post);
      /* 以下、テスト用。コメントアウトを外した上でconfig.dummyCounter設定時のみ稼働
      if( typeof config.dummyCounter !== 'undefined' && config.dummyCounter === 0 ){
        config.dummyCounter++;
        v.r = { // 1度目に呼ばれた時は残通数0を返す
          remain:0,
          NG:[{address:'nakaone.kunihiro@gmail.com',data:{aaa:'111',bbb:'333'}}]
        };
      } else {
        v.r = {remain:98,NG:[]} // 2度目に呼ばれた時は正常終了を返す
      }*/
      if( v.r instanceof Error ) throw v.r;
      v.step = '3.2'; // 不成功分を次回送信対象に
      v.to = v.r.NG;
      if( v.r.remain === 0 || v.r.NG.length > 0 ){
        // 4.使用した配信局が通数オーバーした
        // ⇒ configシートのsendOverに記録し、現在稼働中の郵便局(config.mail)を再取得
        v.step = '4.1'; // 現状の配信局の登録状況を取得
        v.oldMail = config.mail;
        v.sheet = szSheet({spreadId:config.master.spreadId,sheetName:'config'});
        if( v.sheet instanceof Error ) throw v.sheet;

        // 通数オーバーした配信局(=config.mail)を特定し、sendOverの値を更新
        v.step = '4.2'; // 行番号付きでGASLib.configをv.confとして取得
        v.rowNumber = 'rowNumber' + Date.now();
        v.conf = v.sheet.objectize('lv01','lv03',['value',v.rowNumber]);
        if( v.conf instanceof Error ) throw v.conf;
        v.step = '4.3'; // 修正対象となるlist上のsendOverの行番号をtNumとして取得
        for( v.x in v.conf.list ){
          if( v.conf.list[v.x].endpoint.value == config.mail.endpoint ){
            v.tNum = v.conf.list[v.x].sendOver[v.rowNumber] - 1;
            break;
          }
        }
        v.step = '4.4'; // sendOverのvalue欄に現在時刻文字列をセット
        v.r = v.sheet.update({value:getJPDateTime()},{num:v.tNum});
        if( v.r instanceof Error ) throw v.r;
        v.step = '4.5'; // configを取得し直し、Mailにセットされるlistを更新
        config = setSzConf();
        v.step = '4.6'; // メール配信局の交代をAdministratorに通知
        v.newMail = config.mail;
        MailApp.sendEmail(
          config.public.Administrator,
          '[おまつり奉行]メール通数制限超過に伴う配信局交代通知',
          getJPDateTime()
          + '\n\nold=' + JSON.stringify(v.oldMail)
          + '\n\nnew=' + JSON.stringify(v.newMail)
        );

      }
    }

    v.step = '5'; // 終了処理    
    console.log(v.whois+' normal end.\n',arg);
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}
/* コアスクリプト */
/** GASLib.szSheet: Google Spread操作に関する擬似クラス */

/**
 * @typedef {object} szSheetObj - szSheetの戻り値
 * @prop {string} sheetName - シート名
 * @prop {string} spreadId - スプレッドシートID。外部シートの場合のみ設定
 * @prop {object} sheet - getSheetで取得したシートのオブジェクト
 * @prop {number} headerRow - ヘッダ行番号
 * @prop {number} lastRow - データが存在する最下行の行番号(>0)
 * @prop {string[]} key - キー項目名。引数＞シート上の「primary key」指定項目
 * @prop {string[]} keys - ヘッダ行の一次元配列
 * @prop {Object.<string, number>} colIdx - 項目名:列番号(自然数)
 * @prop {any[][]} raw - 取得した生データ(二次元配列)
 * @prop {Array.Object.<string, any>} data - データ行を[{ラベル1:値, ラベル2:値, ..},{..},..]形式にした配列
 * @prop {Object.<string, any>} members - 本オブジェクト内の各メンバ。メソッドへの受渡用
 * @prop {Object.<string, number>} default - 指定項目の既定値
 * @prop {Object.<string, FormResponse>} formObj - defaultで指定されたフォームのオブジェクト。キーはタイムスタンプのgetTime(文字列)
 * [Class FormResponse]{@link https://developers.google.com/apps-script/reference/forms/form-response?hl=ja}
 * @prop {function} isEqual - メソッド。変数とシート上の値が等価か判断する。search等のメソッドで使用
 * @prop {function} complement - メソッド。主キーおよび既定値未設定項目の補完を行う
 * @prop {function} search - メソッド。行の検索。主に内部利用を想定
 * @prop {function} lookup - メソッド。search結果を基に項目名'key'の値がvalueである行Objを返す
 * @prop {function} update - メソッド。行の更新
 * @prop {function} append - メソッド。行の追加
 * @prop {function} delete - メソッド。行の削除
 * @prop {function} objectize - メソッド。階層形式のシートをオブジェクト化
 */

/** szSheet: Googleスプレッドでデータ/行のCRUDを行う擬似クラス
 * @desc GAS用擬似クラス。CRUD用メソッドを持つオブジェクトを生成する。
 * 
 * 1. isEqual: 引数とシート上の値が等価か判断
 * 1. complement: 主キー及び既定値設定項目の補完を行う
 * 1. search: 項目名'key'の値がvalueである行Objを全て検索する
 * 1. lookup: 項目名'key'の値がvalueである最初の行Objを返す
 * 1. update: 該当する行の値を変更する
 * 1. append: 行の追加
 * 1. delete: 行の削除
 * 1. objectize: 階層形式のシートをオブジェクト化
 * 
 * @function
 * @param {object|string} arg - 文字列の場合「コンテナのシートでヘッダ行は1行目」と看做す
 * @param {string} arg.spreadId - 外部スプレッドシートのID
 * @param {string} arg.sheetName - シート名
 * @param {number} arg.headerRow - ヘッダ行の行番号(>0)。既定値1。項目名は重複不可
 * @param {string} [key=null] - プライマリキーとなる項目名
 * @returns {szSheetObj} 取得したシートのデータ
 * 
 * @desc <caption>シート記述時の注意</caption>
 * 
 * 1. 引数のキー指定は「primary key」のメモより優先される
 * 2. 「default:〜」はcomplement・append時、空欄に「〜」を設定。実データだけでなく算式も可。<br>
 *    例：「default: =indirect("RC[-1]",false)」は一列左の値が設定される<br>
 *    また「default: =editFormId(〜).xxx」とした場合、フォームからurl/id/email/timestampが引用される。
 * 3. フォーム連動項目・arrayformula設定項目・メモ付き項目(primary key/default設定項目)は
 * update/append/complementの対象にしない。∵GAS側で書き換えると不正動作を誘引する
 */
function szSheet(arg,key=null){
  const v = {whois:'szSheet',rv:{}};
  try {
    console.log(v.whois+' start.\n',arg,key);

    // 1.既定値の設定
    if( typeof arg === 'string' ){  // 文字列のみ ⇒ シート名の指定
      v.step = '1a';
      v.rv.sheetName = arg;
      v.rv.spreadId = null;
      v.rv.sheet = SpreadsheetApp.getActive().getSheetByName(arg);
      v.rv.headerRow = 1; // ヘッダ行は1行目(固定)
    } else {
      v.step = '1b';
      v.rv.sheetName = arg.sheetName;
      v.rv.spreadId = null;
      if( 'spreadId' in arg ){
        v.step = '1ba';
        v.rv.spreadId = arg.spreadId;
        v.rv.sheet = SpreadsheetApp.openById(arg.spreadId).getSheetByName(arg.sheetName);
        if( v.rv.sheet instanceof Error ) throw v.rv.sheet;
      } else {
        v.step = '1bb';
        v.rv.sheet = SpreadsheetApp.getActive().getSheetByName(arg.sheetName);
      }
      v.rv.headerRow = arg.headerRow || 1;  // ヘッダ行の既定値は1行目
      if( v.rv.headerRow < 1 ){
        throw new Error('ヘッダ行は自然数で指定してください');
      }
    }
    if( v.rv.sheet === null ) throw new Error('指定された"'+v.rv.sheetName+'"シートは存在しません');
    v.rv.key = key;
    
    // 2.データの取得・加工
    v.step = '2.1';
    v.dRange = v.rv.sheet.getDataRange();
    v.rv.raw = v.dRange.getValues();
    const raw = JSON.parse(JSON.stringify(v.rv.raw));
    v.rv.keys = raw.splice(v.rv.headerRow-1,1)[0];
    if( v.rv.key !== null && v.rv.keys.findIndex(x => x === v.rv.key ) < 0 ){
      throw new Error('キーとして指定された項目が存在しません');
    }
    v.rv.colIdx = {};
    for( v.i=0 ; v.i<v.rv.keys.length ; v.i++ ){
      v.rv.colIdx[v.rv.keys[v.i]] = v.i + 1;
    }
    v.rv.data = raw.splice(v.rv.headerRow-1).map(row => {
      const obj = {};
      row.map((item, index) => {
        obj[String(v.rv.keys[index])] = String(item);
      });
      return obj;
    });
    v.rv.lastRow = v.rv.raw.length;

    // 2.2.primary key, defaultの取得
    v.step = '2.2';
    v.rv.default = {};
    v.dRange.getNotes()[v.rv.headerRow-1].forEach((x,i) => {
      if( x.match(/primary key/) && v.rv.key === null )
        v.rv.key = v.rv.keys[i];  // "primary key"指定があればkeyとする
      v.m = x.match(/default\s*:?\s*(\S+)/);
      if( v.m ) v.rv.default[v.rv.keys[i]] = v.m[1];
    });
    // 2.3.defaultにFormのeditURLの指定があれば、事前にFormのデータを取得
    v.step = '2.3';
    v.rv.formObj = {m:[]};
    for( v.i in v.rv.default ){
      v.m = v.rv.default[v.i].match(/^=editFormId\((.+?)\)/);
      v.rv.formObj.m.push(v.m);
      if( v.m !== null ){
        v.step = '2.3a';
        // 2.3a.全フォームデータを読み込み、登録日時をキーにformDataに登録
        v.formData = FormApp.openById(v.m[1]).getResponses();
        for( v.j=0 ; v.j<v.formData.length ; v.j++ ){
          v.rv.formObj[String(v.formData[v.j].getTimestamp().getTime())] = v.formData[v.j];
        }
      }
    }

    // 3.内部関数の定義
    /** isEqual: 引数とシート上の値が等価か判断
     * @param {any} a - 引数
     * @param {any} s - シート上の値
     * @returns {boolean} true:等価
     */
    v.rv.isEqual = (a,b) => {
      return a == b || new Date(a).getTime() === new Date(b).getTime()
    }

    /**
     * @typedef {object} complementedRow - 行単位の補完結果
     * @prop {number} dataNum - rv.data上の添字
     * @prop {Object.<string, string|number>} changed - 補完した項目と設定値
     */
    /** complement: 主キー及び既定値設定項目の補完を行う
     * @desc 主キーは数値のみ、空欄は位置に関わらず最大値＋1を設定。既定値はメモにある文字列をセット
     * @param {void} - なし
     * @returns {complementedRow[]} 補完結果の配列
     */
    v.rv.complement = () => {return ((p)=>{
      const v = {whois:p.whois+'.complement',rv:[]};
      try {
        console.log(v.whois+' start.');

        // 1.主キーの最大値を取得
        v.step = '1';
        v.pMax = -999999;
        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          if( v.pMax < Number(p.data[v.i][p.key]) ){
            v.pMax = Number(p.data[v.i][p.key]);
          }
        }

        // 2.rv.dataを順次検索、主キー・既定値設定項目に空欄があればセット
        v.step = '2';
        v.dMap = Object.keys(p.default);  // 補完項目名のリスト
        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          // 2.1.行単位更新の事前準備
          v.step = '2.1';
          v.t = String(new Date(p.data[v.i]['タイムスタンプ']).getTime());
          v.obj = {}; // 更新項目：値のオブジェクト
          // 2.2.キー項目が空欄なら最大値をセット
          v.step = '2.2';
          if( p.data[v.i][p.key] == '' ){
            v.obj[p.key] = ++v.pMax;
          }
          // 2.3.既定値項目のセット
          v.step = '2.3';
          for( v.j=0 ; v.j<v.dMap.length ; v.j++ ){
            if( String(p.data[v.i][v.dMap[v.j]]).length === 0 ){
              // 2.3a.要補完項目に未入力(空白セル)が存在した場合
              v.step = '2.3a';
              v.m = p.default[v.dMap[v.j]].match(/^=editFormId\(.+?\)\.([a-z]+)/);
              if( v.m === null ){
                // 2.3aa.要補完項目がFormから引用する項目ではない場合、既定値をそのまま設定
                v.step = '2.3aa';
                v.obj[v.dMap[v.j]] = p.default[v.dMap[v.j]];
              } else {
                // 2.3ab.要補完項目がFormから引用する項目の場合、formObjから引用
                if( typeof p.formObj[v.t] === 'undefined' ){
                  v.step = '2.3aba';  // フォームデータが見つからなければ空白セルのまま
                  v.obj[v.dMap[v.j]] = '';
                } else {
                  v.step = '2.3abb';  // 指定項目をフォームデータから引用してセット
                  switch( v.m[1] ){
                    case 'url':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getEditResponseUrl();
                      break;
                    case 'id':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getId();
                      break;
                    case 'email':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getRespondentEmail();
                      break;
                    case 'timestamp':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getTimestamp();
                      break;
                  }
                }
              }
            }
          }
          // 2.4.補完すべき項目があればupdate
          v.step = '2.4';
          if( Object.keys(v.obj).length > 0 ){
            v.r = p.update(v.obj,{num:v.i});
            if( v.r instanceof Error ) throw v.r;
            v.rv.push({dataNum:v.i,changed:v.obj});
          }
        }

        v.step = '3'; // 終了処理
        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members)};  // complement終了

    // 4.メソッドの定義
    /**
     * @typedef {object} szSheetSearch - szSheet.search()の戻り値
     * @prop {Object.<string, any>} obj - 行オブジェクト({項目名1:値1,項目名2:値2,..}形式)
     * @prop {number} dataNum - data上の添字
     * @prop {number} rawNum - raw上の添字
     * @prop {number} rowNum - スプレッドシート上の行番号
     */
    /** search: 項目名'key'の値がvalueである行Objを全て検索する
     * @param {any}    value - キー値
     * @param {string} [key] - キーとなる項目名。既定値はキー項目名(rv.key)
     * @returns {szSheetSearch[]} 検索結果。マッチしなければ空配列
     */
    v.step = '4.1 search';
    v.rv.search = (value,key=v.rv.key) => {return ((p,value,key)=>{
      const v = {whois:p.whois+'.search',rv:[]};
      try {
        console.log(v.whois+' start. value='+value+', key='+key);

        if( p.keys.findIndex(x => x === key) < 0 ){
          throw new Error('指定された欄名がヘッダ行にありません');
        }

        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          if( p.isEqual(value,p.data[v.i][key]) ){
            v.rv.push({
              obj: p.data[v.i],
              dataNum: v.i,
              rawNum: v.i + p.headerRow,
              rowNum: v.i + p.headerRow + 1,
            });
          }
        }

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,value,key)};  // search終了

    /** lookup: 項目名'key'の値がvalueである最初の行Objを返す
     * @param {any}    value - キー値
     * @param {string} key   - キーとなる項目名。既定値はキー項目名
     * @returns {szSheetSearch|null} 行オブジェクト({項目名1:値1,項目名2:値2,..}形式)またはnull
     */
    v.step = '4.2 lookup';
    v.rv.lookup = (value,key) => {return ((p,value,key)=>{
      const v = {whois:p.whois+'.lookup',rv:{}};
      try {
        console.log(v.whois+' start. value='+value+', key='+key);

        v.searchResult = p.search(value,key);
        v.rv = v.searchResult.length > 0 ? v.searchResult[0].obj : null;

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,value,key)};  // lookup終了

    /**
     * @typedef {object} changedColumns - szSheet.update/appendで更新・追加により変化した欄とその値
     * @prop {string} colName - 更新・追加により値が変化した項目名
     * @prop {number} colNum - 同列番号(自然数)
     * @prop {any} before - 修正前の値
     * @prop {any} after - 修正後の値
     */
    /**
     * @typedef {object} szSheetChanged - szSheet.update/appendの一行分の更新・追加結果
     * @prop {string} func - append/update/deleteのいずれか
     * @prop {number} dataNum - 更新・追加行のrv.data上の添字
     * @prop {number} rawNum - 更新・追加行のrv.raw上の添字
     * @prop {number} rowNum - 更新・追加行のスプレッドシート上の行番号
     * @prop {changedColumns[]|Object.<string, any>} changed - 更新・追加により変化した欄とその値。削除の場合は削除行のdata
     */
    /** update: 該当する行の値を変更する
     * @desc key/valueにマッチする行が複数あった場合、最初の行のみ更新。
     * @desc 同一条件・複数変更は対応しているが、複数条件・複数対応は非対応(複数回updateを呼び出す)。
     * 例：「参加="参加する"->"true"」は対応、「"ID"=1->参加="true","ID"=2->参加="false"」は非対応
     * @desc any[]型の更新データには対応しない(修正位置が不明確になるため)
     * @desc <caption>戻り値に関する注意</caption>
     * 引数のkey,valueにマッチするものがなかったら空配列、
     * マッチするものがあったが変更がない場合szSheetChangedオブジェクトの配列が返るが、そのchangedは空配列になる。
     * 
     * @param {Object.<string, any>} data - 更新データ。{項目名：設定値,..}形式
     * @param {object|any} opt - オプション指定。非objならkey=rv.key,value=opt,append=trueと看做す
     * @param {string} [opt.key=rv.key] - キーとなる項目名
     * @param {any}    opt.value - キー値
     * @param {number} [opt.num=null] - 更新対象のrv.data上の添字。complementで使用、key/value指定と排他
     * @param {boolean} opt.append - true(既定値)ならキー値が存在しない場合は追加
     * @returns {szSheetChanged[]} 修正前後の値
     */
    v.step = '4.3 update';
    v.rv.update = (data,opt) => {return ((p,data,opt)=>{
      const v = {whois:p.whois+'.update',rv:[]};
      try {
        console.log(v.whois+' start.\ndata='+JSON.stringify(data)+'\nopt='+JSON.stringify(opt));
        // 1.オプションに既定値セット、検索キー・検索値を明確化
        v.step = '1';
        if( whichType(opt).toLocaleLowerCase() === 'object' ){
          opt.key = typeof opt.key !== 'undefined' ? opt.key : p.key;
          opt.append = typeof opt.append === 'undefined' ? true : opt.append;
          opt.num = typeof opt.num === 'undefined' ? null : opt.num;
        } else {
          opt = {key:p.key,value:opt,append:true,num:null};
        }
        if( opt.num === null && (p.keys.findIndex(x => x === opt.key) < 0) )
          throw new Error('キー項目が不適切です');

        // 2.現状のシートデータ(raw,data)を修正
        //   - 該当なし且つopt.appendの場合、appendメソッドに振る
        //   - 併せて更新範囲の特定、ログ作成を行う
        // 2.1.各種変数の初期化
        v.step = '2.1';
        v.maxRow = v.maxCol = -Infinity;
        v.minRow = v.minCol = Infinity;
        v.isExist = false; // 更新対象行が存在すればtrue。ループ後falseならappend呼び出し
        v.isUpdated = false; // 更新を行なったらtrue。更新対象行が存在しても既に更新済の場合はfalseのまま。ループ後trueならシート更新
        v.map = Object.keys(data); // 更新対象項目名の配列

        // 2.2.行単位に修正対象か判断、対象なら行データを修正
        v.step = '2.2';
        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          v.step = '2.2.1'; // 修正対象外なら後続処理はスキップ
          // 比較は厳密等価ではない等価で判断
          // opt.numはcomplementで指定されたrv.dataの添字
          if( (opt.num === null && (!p.isEqual(p.data[v.i][opt.key],opt.value)))
           || (opt.num !== null && opt.num !== v.i )) continue;

          v.step = '2.2.2'; // 行単位の処理結果Obj作成(単独のszSheetChanged作成)
          v.isExist = true;
          v.l = p.headerRow + v.i;  // raw上の添字。シートの行番号はこれに＋1
          v.log = {func:'update',dataNum:v.i,rawNum:v.l,rowNum:v.l+1,changed:[]};

          v.step = '2.2.3'; // 更新範囲(行)の更新
          v.a = v.l + 1;  // v.lは添字(0以上の整数)なので行番号(自然数)に変換
          v.maxRow = v.maxRow < v.a ? v.a : v.maxRow;
          v.minRow = v.minRow > v.a ? v.a : v.minRow;

          v.step = '2.2.4'; // 項目(raw,data)の更新
          for( v.j=0 ; v.j<v.map.length ; v.j++ ){
            v.step = '2.2.4.1';
            v.o = {colName: v.map[v.j]};
            v.o.colNum = p.colIdx[v.o.colName];
            v.o.before = p.data[v.i][v.o.colName];
            v.o.after = data[v.o.colName];
            if( v.o.before != v.o.after ){
              v.step = '2.2.4.2';
              p.raw[v.l][v.o.colNum-1] = v.o.after;
              p.data[v.i][v.o.colName] = v.o.after;
              v.maxCol = v.maxCol < v.o.colNum ? v.o.colNum : v.maxCol;
              v.minCol = v.minCol > v.o.colNum ? v.o.colNum : v.minCol;
              v.isUpdated = true;
              v.log.changed.push(v.o);
            }
          }

          v.step = '2.2.5'; // ログに行単位の更新記録を追加
          v.rv.push(v.log);
        }

        // 2.3.該当なし且つopt.appendの場合、appendメソッドに振る
        v.step = '2.3';
        if( v.isExist === false && opt.append ){
          opt.update = false;
          return p.append(data,opt);
        }

        // 3.更新範囲についてシートを更新
        v.step = '3';
        if( v.isUpdated ){
          v.range = p.sheet.getRange(v.minRow, v.minCol, (v.maxRow-v.minRow+1), (v.maxCol-v.minCol+1));
          v.sv = [];
          p.raw.slice(v.minRow-1,v.maxRow).forEach(x => v.sv.push(x.slice(v.minCol-1,v.maxCol)));
          v.range.setValues(v.sv);
        }

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,data,opt)};  // update終了

    /** append: 行の追加
     * @param {any[]|any[][]|Object.<string, any>|Array.Object.<string, any>} data
     *  - 追加行の一次元配列または{項目名:値}形式のオブジェクト、またはその配列
     * @param {object|any} opt - オプション指定。非objならkey=rv.key,value=opt,append=trueと看做す
     * @param {string} [opt.key=rv.key] - キーとなる項目名
     * @param {any}    opt.value - キー値
     * @param {boolean} [opt.update=true] - trueならキー値が存在するならupdate
     * @returns {szSheetChanged[]} 更新結果
     */
    v.step = '4.4 append';
    v.rv.append = (data,opt) => {return ((p,data,opt)=>{
      const v = {whois:p.whois+'.append',rv:[]};
      try {
        console.log(v.whois+' start.\n',data);

        // 1.事前処理
        // 1.1.パラメータの既定値設定
        v.step = '1.1';
        if( !opt || typeof opt === 'string' ){
          v.opt = {
            key: p.key,
            value: opt,
            update: true,
          }
        } else {
          v.opt = opt;
          v.opt.key = typeof opt.key === 'undefined' ? p.key : opt.key;
          v.opt.update = typeof opt.value === 'undefined' ? true : opt.update;
        }
        // 1.2.追加データを強制的に二次元に変換
        v.step = '1.2';
        switch(whichType(data)){
          case 'Object': v.data = [data]; break;
          case 'Array':
            v.type = whichType(data[0]);
            v.data = v.type !== 'Array' && v.type !== 'Object'? v.data = [data] : data;
            break;
          default: 
            throw new Error('行データの形式が不適切です');
        }

        // 2.追加データが配列ならオブジェクトに変換
        v.step = '2';
        for( v.i=0 ; v.i<v.data.length ; v.i++ ){
          v.obj = v.data[v.i];
          if( whichType(v.obj) === 'Array' ){
            v.obj = {};
            for( v.j=0 ; v.j<v.data[v.i].length ; v.j++ ){
              if( v.data[v.i][v.j] ){ // nullや空文字列は除外
                v.obj[p.keys[v.j]] = v.data[v.i][v.j];
              }
            }
          }

          // 3.既定値設定項目が空なら既定値を追加
          v.step = '3';
          v.dMap = Object.keys(p.default);
          for( v.j=0 ; v.j<v.dMap.length ; v.j++ ){
            if( typeof v.obj[v.dMap[v.j]] === 'undefined' ){
              v.obj[v.dMap[v.j]] = p.default[v.dMap[v.j]];
            }
          }

          // 4.追加データにキー項目が指定されているか判断
          v.step = '4';
          if( v.opt.key === null || typeof v.obj[v.opt.key] === 'undefined' ){
            // 4a.キー項目の値が追加データ(引数'data')に不在
            v.step = '4a';
            // 4aa.rv.key === null -> そのまま追加(何もしない)
            // 4ab.rv.key !== null -> キー項目の値を補完して追加
            if( v.opt.key !== null ){
              v.step = '4ab';
              v.obj[v.opt.key] = 0;
              for( v.j=0 ; v.j<p.data.length ; v.j++ ){
                v.n = Number(p.data[v.j][v.opt.key]);
                if( v.obj[v.opt.key] < v.n ){
                  v.obj[v.opt.key] = v.n;
                }
              }
              v.obj[v.opt.key] += 1;
            }
          } else {
            // 4b.キー項目の値が追加データに存在するかチェック
            v.step = '4b';
            v.flag = false;
            for( v.j=0 ; v.j<p.data.length ; v.j++ ){
              if( v.obj[v.opt.key] == p.data[v.j][v.opt.key] ) v.flag = true;
            }
            if( v.flag ){
              // 4ba.キー項目の値が未登録 -> そのまま追加(何もしない)
              // 4bb.キー項目の値が登録済(シートのキー項目欄に存在)
              v.step = '4bb';
              if( v.opt.update ){
                // 4bba. v.opt.update === true -> updateとして処理
                v.step = '4bba';
                v.opt.value = v.obj[v.opt.key];
                v.opt.append = false;
                if((v.r=p.update(v.obj,v.opt)) instanceof Error) throw v.r;
                v.rv.push(v.r);
                continue;
              } else {
                // 4bbb. v.opt.update === false -> エラー
                v.step = '4bbb';
                throw new Error('指定されたキーで既に登録されています');
              }
            }
          }

          // 5. 作成したオブジェクトを追加
          // 5.1.append用配列を作成、シートに追加
          v.step = '5.1';
          v.arr = [];
          for( v.j=0 ; v.j<p.keys.length ; v.j++ ){
            v.arr.push(v.obj[p.keys[v.j]] || null);
          }
          p.sheet.appendRow(v.arr);
          // 5.2.結果オブジェクト(szSheetChanged)を作成
          v.step = '5.2';
          v.rv.push({
            func: 'append',
            dataNum: p.data.length, // 更新・追加行のrv.data上の添字
            rawNum: p.raw.length, // 更新・追加行のrv.raw上の添字
            rowNum: p.raw.length + p.headerRow + 1, // 更新・追加行のスプレッドシート上の行番号
            changed: ((obj)=>{ // 更新・追加により変化した欄とその値
              const rv = [];
              Object.keys(obj).forEach(x => {
                rv.push({ // changedColumns - szSheet.update/appendで更新・追加により変化した欄とその値
                  colName: x, // 更新・追加により値が変化した項目名
                  colNum: p.colIdx[x],  // 同列番号(自然数)
                  before: '', // 修正前の値
                  after: obj[x],  // 修正後の値
                });
              });
              return rv;
            })(v.obj),
          });
          // 5.3.関連するメンバを更新
          v.step = '5.3';
          p.lastRow += 1;
          p.raw.push(v.arr);
          p.data.push(v.obj);
        }

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,data,opt)};  // append終了

    /** delete: 行の削除
     * @param {Object.<string, any>} cond - 削除条件。項目名:値が「全て」該当する行を削除
     * @returns {szSheetChanged[]} 更新結果
     */
    v.step = '4.5 delete';
    v.rv.delete = (cond) => {return ((p,cond)=>{
      const v = {whois:p.whois+'.delete',rv:[]};
      try {
        console.log(v.whois+' start.\ncond='+JSON.stringify(cond));

        // 1.事前準備
        v.step = '1';
        v.cond = cond;
        v.map = Object.keys(v.cond);

        // 2.逆順に一件ずつ確認
        for( v.i=p.data.length-1 ; v.i>=0 ; v.i-- ){
          // 2.1.該当するか判断
          v.step = '2.1';
          v.flag = true;
          for( v.j=0 ; v.j<v.map.length ; v.j++ ){
            v.r = p.isEqual(v.cond[v.map[v.j]],p.data[v.i][v.map[v.j]]);
            if( v.r instanceof Error ) throw v.r;
            if( v.r === false ) v.flag = false;
          }
          if( v.flag === true ){
            // 2.2.該当した場合、削除処理
            v.step = '2.2';
            v.rObj = {
              func: 'delete',
              dataNum: v.i,
              rawNum: p.headerRow+v.i,
              rowNum: p.headerRow+v.i+1,
              changed: {...p.data[v.i]}
            }
            v.rv.push(v.rObj);
            p.sheet.deleteRow(v.rObj.rowNum);
            p.lastRow -= 1;
            p.raw.splice(v.rObj.rawNum,1);
            p.data.splice(v.rObj.dataNum,1);
          }
        }

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,cond)};  // delete終了

    /** objectize: 階層形式のシートをオブジェクト化
     * @param {number|string} stCol - 分類の開始列番号(自然数)、または項目名
     * @param {number|string} edCol - 分類の終了列番号(自然数)、または項目名
     * @param {string|string[]} [valid] - データとして取得したい項目名。省略すると分類範囲列以外の全項目。
     * @returns {Object.<string, any>} 変換結果
     */
    v.step = '4.6 objectize';
    v.rv.objectize = (stCol,edCol,valid) => {return ((p,stCol,edCol,valid)=>{
      const v = {whois:p.whois+'.objectize',rv:{}};
      try {
        console.log(v.whois+' start.\nstCol='+stCol+', edCol='+edCol+', valid='+valid);

        v.arr = [p.keys];
        for( v.i=p.headerRow ; v.i<p.raw.length ; v.i++ ){
          v.arr.push(p.raw[v.i]);
        }
        v.rv = objectize(v.arr,stCol,edCol,valid);
        if( v.rv instanceof Error ) throw v.rv;

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,stCol,edCol,valid)};  // objectize終了

    // 5.メソッドへの受渡用のメンバ変数のオブジェクトを作成
    v.step = '5';
    const members = {whois:v.whois};
    Object.keys(v.rv).forEach(x => members[x] = v.rv[x]);
    v.rv.members = members;

    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
    v.rv = e;
  } finally {
    return v.rv;
  }
}
```
