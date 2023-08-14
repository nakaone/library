## Functions

<dl>
<dt><a href="#doGet">doGet()</a> ⇒ <code><a href="#responseObj">responseObj</a></code></dt>
<dd><p>税務定期作業(ローカルhtml)の要求に対して各種証憑データを返す</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#responseObj">responseObj</a> : <code>Object</code></dt>
<dd><p>税務定期作業(ローカルhtml)の要求に対して返されるオブジェクト</p>
</dd>
<dt><a href="#fileInfo">fileInfo</a> : <code>Object</code></dt>
<dd><p>ファイル属性情報のオブジェクト</p>
</dd>
<dt><a href="#descObj">descObj</a> : <code>Object</code></dt>
<dd><p>Googleドライブ上のファイル詳細情報内「説明」欄の設定項目</p>
</dd>
<dt><a href="#transportInfo">transportInfo</a> : <code>Object</code></dt>
<dd><p>交通費情報</p>
</dd>
</dl>

<a name="doGet"></a>

## doGet() ⇒ [<code>responseObj</code>](#responseObj)
税務定期作業(ローカルhtml)の要求に対して各種証憑データを返す

**Kind**: global function  
**Returns**: [<code>responseObj</code>](#responseObj) - 証憑・交通費情報  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>void</code> | 無し |

<a name="responseObj"></a>

## responseObj : <code>Object</code>
税務定期作業(ローカルhtml)の要求に対して返されるオブジェクト

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| fy | <code>number</code> | 会計年度 |
| last | <code>string</code> | 前回更新日(ローカルでの差分チェックに使用) |
| files | [<code>Array.&lt;fileInfo&gt;</code>](#fileInfo) | ファイル属性情報の配列 |
| transport | [<code>Array.&lt;transportInfo&gt;</code>](#transportInfo) | 交通費情報の配列 |

<a name="fileInfo"></a>

## fileInfo : <code>Object</code>
ファイル属性情報のオブジェクト

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

<a name="descObj"></a>

## descObj : <code>Object</code>
Googleドライブ上のファイル詳細情報内「説明」欄の設定項目

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| date | <code>string</code> | 取引日 |
| summary | <code>string</code> | 品名(摘要) |
| price | <code>string</code> | 価格 |
| method | <code>string</code> | 支払方法。AMEX, 役員借入金, SMBCから振込, 等 |
| note | <code>string</code> | 備考 |

<a name="transportInfo"></a>

## transportInfo : <code>Object</code>
交通費情報

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| date | <code>string</code> | 日付 |
| perpose | <code>string</code> | 目的 |
| destination | <code>string</code> | 行先 |
| sub | <code>string</code> | 補助科目 |
| path | <code>string</code> | 経路 |
| number | <code>number</code> | 人数 |
| amount | <code>number</code> | 金額 |
| note | <code>string</code> | 備考 |
| status | <code>string</code> | 前回提出分からの状態変化。append/update/delete/steady |

