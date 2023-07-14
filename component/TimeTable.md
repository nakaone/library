## Classes

<dl>
<dt><a href="#TimeTable">TimeTable</a></dt>
<dd><p>HTMLにタイムテーブルを描画する</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#opt">opt</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="TimeTable"></a>

## TimeTable
HTMLにタイムテーブルを描画する

**Kind**: global class  

* [TimeTable](#TimeTable)
    * [new TimeTable(selector, data, opt)](#new_TimeTable_new)
    * [.applyStyle(arg)](#TimeTable+applyStyle) ⇒ <code>void</code>
    * [.createElement(tag, [text], xxx)](#TimeTable+createElement)
    * [.draw()](#TimeTable+draw)
    * [.showDetail()](#TimeTable+showDetail)
    * [.timeRange()](#TimeTable+timeRange)
    * [.toggleChildren()](#TimeTable+toggleChildren)

<a name="new_TimeTable_new"></a>

### new TimeTable(selector, data, opt)
既定値の設定、タスクデータ他のデータ加工を行い、タイムテーブルを描画する

<details><summary>入力シートイメージ</summary>

- start/endが赤字：マイルストーン(非導出項目、要手動設定)
- 背景色群青：セクション・タスク共通の必須項目
- 薄青：同任意項目
- 濃緑：タスクのみの必須項目
- 薄緑：同任意項目
- 赤：算式が設定された項目

<h3>timetable</h3>
<table calss="tt"><tr>
<th style="background:#ff0000;color:white">id</th>
<th style="background:#0000ff;color:white;">pId</th>
<th style="background:#0000ff;color:white;">name</th>
<th style="background:#cfe2f3;">summary</th>
<th style="background:#cfe2f3;">pending</th>
<th style="background:#cfe2f3;">note</th>
<th style="background:#38761d;color:white;">start</th>
<th style="background:#d9ead3;">lasts</th>
<th style="background:#38761d;color:white;">end</th>
<th style="background:#d9ead3;">location</th>
<th style="background:#d9ead3;">ideal</th>
<th style="background:#d9ead3;">fixed</th>
<th style="background:#d9ead3;">output</th>
<th style="background:#d9ead3;">style</th>
</tr><tr>
<td>2</td><td>0</td><td>イベント(大線表)</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr><tr>
<td>3</td><td>2</td><td>受付</td><td></td><td></td><td></td><td style="color:#f00;">9/30 13:30</td><td>30</td><td>9/30 14:00</td><td>正門</td><td></td><td></td><td></td><td></td>
</tr><tr>
<td>4</td><td>2</td><td>テント設営</td><td></td><td></td><td>子供達は体育館で遊ぶ</td><td>9/30 14:00</td><td></td><td>9/30 17:00</td><td>校庭</td><td></td><td></td><td></td><td></td>
</tr><tr>
<td>5</td><td>2</td><td>夕食</td><td></td><td></td><td></td><td style="color:#f00;">9/30 17:00</td><td>90</td><td>9/30 18:30</td><td>テントor喫食コーナ</td><td></td><td></td><td></td><td></td>
</tr><tr>
<td>6</td><td>2</td><td>肝試し</td><td></td><td></td><td></td><td>9/30 18:30</td><td>120</td><td>9/30 20:30</td><td>校内</td><td></td><td></td><td></td><td></td>
</tr><tr>
<td>7</td><td>2</td><td>宿泊</td><td></td><td></td><td></td><td>9/30 20:30</td><td></td><td style="color:#f00;">10/01 07:30</td><td>テントor体育館</td><td></td><td></td><td></td><td></td>
</tr><tr>
<td>8</td><td>2</td><td>朝食</td><td>素麺提供</td><td></td><td></td><td>10/01 07:30</td><td>30</td><td>10/01 08:00</td><td>テントor体育館</td><td></td><td></td><td></td><td></td>
</tr><tr>
<td>9</td><td>2</td><td>テント撤去</td><td></td><td></td><td></td><td>10/01 08:00</td><td>60</td><td>10/01 09:00</td><td>校庭</td><td></td><td></td><td></td><td></td>
</tr></table>

<h3>resources</h3>
<table><tr>
<th style="background:#0000ff;color:white;">tId</th>
<th style="background:#ff0000;color:white;">tName</th>
<th style="background:#ff0000;color:white;">id</th>
<th style="background:#0000ff;color:white;">name</th>
<th style="background:#cfe2f3;">quantity</th>
<th style="background:#cfe2f3;">unit</th>
<th style="background:#cfe2f3;">procure</th>
<th style="background:#cfe2f3;">budget</th>
<th style="background:#cfe2f3;">note</th>
</tr>
<tr><td>17</td><td>参加者受付</td><td>2</td><td>参加者名簿</td><td>3</td><td>冊</td><td>嶋津作成</td><td>0</td><td></td></tr>
<tr><td>17</td><td>参加者受付</td><td>3</td><td>文鎮</td><td>3</td><td>個</td><td></td><td></td><td></td></tr>
<tr><td>17</td><td>参加者受付</td><td>4</td><td>貯金箱</td><td>1</td><td>個</td><td></td><td></td><td></td></tr>
<tr><td>17</td><td>参加者受付</td><td>5</td><td>トレイ</td><td>3</td><td>個</td><td></td><td></td><td></td></tr>
<tr><td>17</td><td>参加者受付</td><td>6</td><td>ガムテープ</td><td>2</td><td>個</td><td></td><td></td><td>テントの有無で色を変える</td></tr>
<tr><td>17</td><td>参加者受付</td><td>7</td><td>おやじの会入会申込書</td><td>20</td><td>枚</td><td></td><td></td><td></td></tr>
</table>
</details>


| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | タイムテーブルを描画する要素のCSSセレクタ |
| data | <code>Object</code> | タイムテーブル用のデータ |
| opt | <code>Object</code> | オプションを指定するオブジェクト |

<a name="TimeTable+applyStyle"></a>

### timeTable.applyStyle(arg) ⇒ <code>void</code>
要素にスタイルを設定する

**Kind**: instance method of [<code>TimeTable</code>](#TimeTable)  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>Object</code> |  |
| arg.apply | <code>string</code> | 適用するスタイル名 |
| arg.addition | <code>Object.&lt;string, string&gt;</code> | 追加適用する属性名：属性値 |

<a name="TimeTable+createElement"></a>

### timeTable.createElement(tag, [text], xxx)
DIV要素を生成、属性を指定する

**Kind**: instance method of [<code>TimeTable</code>](#TimeTable)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tag | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> | タグ名 |
| [text] | <code>string</code> |  | 生成された要素のinnerHTML |
| xxx | <code>Object.&lt;string, string&gt;</code> |  | 生成された要素に設定するスタイルシート属性名：属性値 |

<a name="TimeTable+draw"></a>

### timeTable.draw()
タイムテーブルを(再)描画する

**Kind**: instance method of [<code>TimeTable</code>](#TimeTable)  
<a name="TimeTable+showDetail"></a>

### timeTable.showDetail()
ダイアログに詳細情報を表示

**Kind**: instance method of [<code>TimeTable</code>](#TimeTable)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | 表示するタスクのID |

<a name="TimeTable+timeRange"></a>

### timeTable.timeRange()
v.minTime, v.maxTimeの取得

**Kind**: instance method of [<code>TimeTable</code>](#TimeTable)  
<a name="TimeTable+toggleChildren"></a>

### timeTable.toggleChildren()
セクション名クリックで配下のタスクの表示/非表示切り替え

**Kind**: instance method of [<code>TimeTable</code>](#TimeTable)  
<a name="opt"></a>

## opt : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| datatype | <code>string</code> | データのタイプ。sheet:シートデータ |

