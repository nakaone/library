## Functions

<dl>
<dt><a href="#main">main()</a></dt>
<dd><p>引数・戻り値ともに無し。結果はシートに出力
【事前準備】
対象フォルダ配下の各ファイルは事前に「詳細 &gt; 説明欄」にJSON形式で情報を追加しておく。
テンプレート：{&quot;date&quot;:&quot;2023//&quot;,&quot;summary&quot;:&quot;&quot;,&quot;price&quot;:0,&quot;method&quot;:&quot;役員借入金&quot;}</p>
<p>証憑台帳「履歴」シート上で不要な行は削除しておく</p>
</dd>
<dt><a href="#dateStr">dateStr()</a></dt>
<dd><p>dateStr: 日付Objを文字列に変換</p>
</dd>
<dt><a href="#preparation">preparation()</a></dt>
<dd><p>preparation: 事前準備</p>
</dd>
<dt><a href="#setLast">setLast()</a></dt>
<dd><p>setLast: 前回送信日および送信内容の取得</p>
</dd>
<dt><a href="#setFiles">setFiles(mainV)</a> ⇒ <code>void</code></dt>
<dd><p>setFiles: 指定フォルダ配下のファイル情報を取得</p>
</dd>
<dt><a href="#setTransport">setTransport()</a></dt>
<dd><p>setTransport: 交通費オブジェクトを取得</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#descObj">descObj</a> : <code>Object</code></dt>
<dd><p>descObj: Googleドライブ上のファイル詳細情報内「説明」欄の設定項目</p>
</dd>
<dt><a href="#fileInfo">fileInfo</a> : <code>Object</code></dt>
<dd><p>fileInfo: ファイル属性情報のオブジェクト</p>
</dd>
</dl>

<a name="main"></a>

## main()
引数・戻り値ともに無し。結果はシートに出力
【事前準備】
対象フォルダ配下の各ファイルは事前に「詳細 > 説明欄」にJSON形式で情報を追加しておく。
テンプレート：{"date":"2023//","summary":"","price":0,"method":"役員借入金"}

証憑台帳「履歴」シート上で不要な行は削除しておく

**Kind**: global function  
<a name="dateStr"></a>

## dateStr()
dateStr: 日付Objを文字列に変換

**Kind**: global function  
<a name="preparation"></a>

## preparation()
preparation: 事前準備

**Kind**: global function  
<a name="setLast"></a>

## setLast()
setLast: 前回送信日および送信内容の取得

**Kind**: global function  
<a name="setFiles"></a>

## setFiles(mainV) ⇒ <code>void</code>
setFiles: 指定フォルダ配下のファイル情報を取得

**Kind**: global function  
**Returns**: <code>void</code> - 【参考】
GoogleドライブのファイルID・ファイル名・URLを一括で取得する
  https://tetsuooo.net/gas/42/
GAS googleドライブ内のファイルの説明を取得する
  https://mebee.info/2022/11/08/post-79806/  

| Param | Type |
| --- | --- |
| mainV | <code>\*</code> | 

<a name="setTransport"></a>

## setTransport()
setTransport: 交通費オブジェクトを取得

**Kind**: global function  
<a name="descObj"></a>

## descObj : <code>Object</code>
descObj: Googleドライブ上のファイル詳細情報内「説明」欄の設定項目

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| date | <code>string</code> | 取引日 |
| summary | <code>string</code> | 品名(摘要) |
| price | <code>string</code> | 価格 |
| method | <code>string</code> | 支払方法。AMEX, 役員借入金, SMBCから振込, 等 |
| note | <code>string</code> | 備考 |

<a name="fileInfo"></a>

## fileInfo : <code>Object</code>
fileInfo: ファイル属性情報のオブジェクト

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | ファイル名 |
| id | <code>string</code> | ファイルID |
| url | <code>string</code> | URL |
| created | <code>string</code> | 生成日時(UNIX時刻) |
| updated | <code>string</code> | 最終変更日時(UNIX時刻) |
| status | <code>string</code> | 前回提出分からの状態変化。append/update/delete/steady |
| desc | [<code>descObj</code>](#descObj) | 「説明」に設定されたJSON文字列 |

