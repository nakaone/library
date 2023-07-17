## Classes

<dl>
<dt><a href="#BurgerMenu">BurgerMenu</a></dt>
<dd><p>HTMLにメニューを作成する</p>
<ul>
<li><a href="BurgerMenu.grid.md">画面分割のレイアウト</a></li>
</ul>
</dd>
<dt><a href="#TabMenu">TabMenu</a></dt>
<dd><p>タブ切り替えのHTMLページを作成する</p>
</dd>
<dt><a href="#TimeTable">TimeTable</a></dt>
<dd><p>HTMLにタイムテーブルを描画する</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#analyzeArg">analyzeArg()</a> ⇒ <code><a href="#AnalyzeArg">AnalyzeArg</a></code></dt>
<dd><p>コマンドラインから<code>node xxx.js aa bb</code>を実行した場合の引数(<code>aa</code>,<code>bb</code>)を取得し、オブジェクトにして返す。<br></p>
</dd>
<dt><a href="#analyzePath">analyzePath(arg)</a> ⇒ <code><a href="#AnalyzePath">AnalyzePath</a></code></dt>
<dd><p>パス名文字列から構成要素を抽出</p>
</dd>
<dt><a href="#Array_tabulize">Array_tabulize([opt])</a> ⇒ <code>HTMLTableObject</code></dt>
<dd><p>Array型の変数に2次元配列からHTMLの表を作成してtable要素として返すメソッドを追加する。</p>
<p>使用前<code>Array.prototype.tabulize = Array.tabulize;</code>実行のこと。</p>
</dd>
<dt><a href="#Date_calc">Date_calc(arg)</a> ⇒ <code>string</code></dt>
<dd><p>指定日に年/月/日/時/分/秒/ミリ秒数を加減した日時を計算する&quot;calc()&quot;メソッドをDate型に追加する。</p>
</dd>
<dt><a href="#Date_toLocale">Date_toLocale([format])</a> ⇒ <code>string</code></dt>
<dd><p>日時を指定形式の文字列にして返す&quot;toLocale()&quot;メソッドをDate型に追加する。</p>
</dd>
<dt><a href="#embedComponent">embedComponent(doc)</a> ⇒ <code>Document</code></dt>
<dd><p>テンプレート(HTML)のタグに含まれる&#39;data-embed&#39;属性に基づき、他文書から該当箇所を挿入する。</p>
<p>JavaScriptのライブラリ等、テンプレートが非HTMLの場合は処理できない。<br>
この場合、テンプレートを強引にHTML化して処理後、querySelector.jsで必要な部分を抽出するか、grep等で不要な部分を削除する。</p>
<ul>
<li><a href="https://symfoware.blog.fc2.com/blog-entry-2685.html">JSDOMを利用し、HTML + JavaScriptのプログラムをNode.jsで動作させる</a></li>
</ul>
</dd>
<dt><a href="#mergeDeeply">mergeDeeply(target, source, opts)</a> ⇒ <code>Object</code></dt>
<dd><p>オブジェクトのプロパティを再帰的にマージ</p>
<ul>
<li>Qiita <a href="https://qiita.com/riversun/items/60307d58f9b2f461082a">JavaScriptでオブジェクトをマージ（結合）する方法、JSONのマージをする方法</a></li>
</ul>
</dd>
<dt><a href="#querySelector">querySelector(content, selectors)</a> ⇒ <code><a href="#QuerySelector">Array.&lt;QuerySelector&gt;</a></code></dt>
<dd><p>HTMLの指定CSSセレクタの内容を抽出</p>
</dd>
<dt><a href="#whichType">whichType(arg, [is])</a> ⇒ <code>string</code> | <code>boolean</code></dt>
<dd><p>変数の型を判定し、型名を文字列で返す。なお引数&quot;is&quot;が指定された場合、判定対象が&quot;is&quot;と等しいかの真偽値を返す。</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#AnalyzeArg">AnalyzeArg</a> : <code>object</code></dt>
<dd><p>コマンドライン引数の分析結果</p>
</dd>
<dt><a href="#AnalyzePath">AnalyzePath</a> : <code>object</code></dt>
<dd><p>パス文字列から構成要素を抽出したオブジェクト</p>
</dd>
<dt><a href="#DateCalcArg">DateCalcArg</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#QuerySelector">QuerySelector</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#opt">opt</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="BurgerMenu"></a>

## BurgerMenu
HTMLにメニューを作成する

- [画面分割のレイアウト](BurgerMenu.grid.md)

**Kind**: global class  
<a name="new_BurgerMenu_new"></a>

### new BurgerMenu(conf)

| Param | Type |
| --- | --- |
| conf | <code>string</code> | 

<a name="TabMenu"></a>

## TabMenu
タブ切り替えのHTMLページを作成する

**Kind**: global class  
<a name="new_TabMenu_new"></a>

### new TabMenu([opt])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opt] | <code>string</code> | <code>&quot;{}&quot;</code> | オプション |

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

<h3>TimeTable</h3>
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
<a name="analyzeArg"></a>

## analyzeArg() ⇒ [<code>AnalyzeArg</code>](#AnalyzeArg)
コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す。<br>

**Kind**: global function  
**Returns**: [<code>AnalyzeArg</code>](#AnalyzeArg) - 分析結果のオブジェクト  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>void</code> | なし |

**Example**  
```
node xxx.js -i:aaa.html bbb -o:ccc.json ddd eee
⇒ {opt:{i:"aaa.html",o:"ccc.json"},val:["bbb","ddd","eee"]}
```

<caution>注意</caution>

- スイッチは`(\-*)([0-9a-zA-Z]+):*(.*)$`形式であること
- スイッチに該当しないものは配列`val`にそのまま格納される
<a name="analyzePath"></a>

## analyzePath(arg) ⇒ [<code>AnalyzePath</code>](#AnalyzePath)
パス名文字列から構成要素を抽出

**Kind**: global function  
**Returns**: [<code>AnalyzePath</code>](#AnalyzePath) - 構成要素を抽出したオブジェクト  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>string</code> | パス文字列 |

**Example**  
```
"/Users/ena.kaon/Desktop/GitHub/library/JavaScript/analyzePath.html" ⇒ {
  "path":"/Users/ena.kaon/Desktop/GitHub/library/JavaScript/",
  "file":"analyzePath.html",
  "base":"analyzePath",
  "suffix":"html"
}

"/Users/ena.kaon/Desktop/GitHub/library/JavaScript" ⇒ {
  "path":"/Users/ena.kaon/Desktop/GitHub/library/",
  "file":"JavaScript",
  "base":"JavaScript",
  "suffix":""
}

"./analyzePath.html" ⇒ {
  "path":"./",
  "file":"analyzePath.html",
  "base":"analyzePath",
  "suffix":"html"
}

"analyzePath.html" ⇒ {
  "path":"",
  "file":"analyzePath.html",
  "base":"analyzePath",
  "suffix":"html"
}

"analyzePath.hoge.html" ⇒ {
  "path":"",
  "file":"analyzePath.hoge.html",
  "base":"analyzePath.hoge",
  "suffix":"html"
}

"analyzePath.fuga" ⇒ {
  "path":"",
  "file":"analyzePath.fuga",
  "base":"analyzePath",
  "suffix":"fuga"
}

"https://qiita.com/analyzePath.html" ⇒ {
  "path":"https://qiita.com/",
  "file":"analyzePath.html",
  "base":"analyzePath",
  "suffix":"html"
}

```
<a name="Array_tabulize"></a>

## Array\_tabulize([opt]) ⇒ <code>HTMLTableObject</code>
Array型の変数に2次元配列からHTMLの表を作成してtable要素として返すメソッドを追加する。

使用前`Array.prototype.tabulize = Array.tabulize;`実行のこと。

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [opt] | <code>Object</code> |  |
| opt.dateFormat | <code>string</code> | {string} - 配列内のDateを表示する日時形式指定文字列(yMdhms.n) |

<a name="Date_calc"></a>

## Date\_calc(arg) ⇒ <code>string</code>
指定日に年/月/日/時/分/秒/ミリ秒数を加減した日時を計算する"calc()"メソッドをDate型に追加する。

**Kind**: global function  
**Returns**: <code>string</code> - 加減したDateオブジェクト(新規、非破壊)。無効な指定ならNull

arg = string -> "+1M"(1ヶ月後)のように、加減する値＋単位で指定
arg = number[] -> [年,月,日,時,分,秒,ミリ秒]で複数単位での加減を一括指定
arg = DateCalcArg -> 単位を指定した複数単位での加減。例：1時間10分後なら{h:1,m:10}  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>string</code> \| <code>Array.&lt;number&gt;</code> \| [<code>DateCalcArg</code>](#DateCalcArg) | 加減する年/月/日/時/分/秒/ミリ秒数の指定 |

**Example**  
```
base: 2001/01/01 00:00:00.000
"+3y" ⇒ 2004/01/01 00:00:00.000
"2M" ⇒ 2001/03/01 00:00:00.000
"1d" ⇒ 2001/01/02 00:00:00.000
"-1h" ⇒ 2000/12/31 23:00:00.000
"-2m" ⇒ 2000/12/31 23:58:00.000
"-3s" ⇒ 2000/12/31 23:59:57.000
"-4n" ⇒ 2000/12/31 23:59:59.996
[3,2,1,-1,-2,-3,-4] ⇒ 2004/03/01 22:57:56.996
[3,2,1] ⇒ 2004/03/02 00:00:00.000
{"y":3,"M":2,"d":1} ⇒ 2004/03/02 00:00:00.000
```


<details><summary>作成中：日付が存在しない場合の対処案</summary>

- 参考：[CSSで三角形を作ろう！](https://spicaweblog.com/2022/05/triangle/)

# 日付が存在しない場合の対処案

## 問題点と対処案

**問題点**

「2022年12月29日の2ヶ月後(⇒2/29)」「5月31日の1ヶ月前(⇒4/31)」等、日付をそのまま適用すると存在しない日付になる場合、何日にすべきか？

**対処案**

1. 単純に加減算(算出日ベース)
    2022/12/29 + 2M = 2022/14/29 = 2023/02/29 = 2023/03/01
1. 存在しない日は月末日と解釈(月末日ベース)
    2022/12/29 + 2M = 2022/14/29 = 2023/02/29 = 2023/03/00 = 2023/02/28
1. 月末日から逆算(逆算日ベース)
    2022/12/29 = 2023/01/-2 + 2M = 2023/03/-2 = 2023/02/26

**前提、注意事項**

- JavaScriptでの日付は自然数(1〜31)だけでなく、0や負数も受け付ける。
- "0"は前月末日、"-1"は前月末日の前日、以降遡及して考える。
  ```
  new Date(2023,6,0) ⇒ 2023/06/30
  new Date(2023,6,-1) ⇒ 2023/06/29
  new Date(2023,6,-2) ⇒ 2023/06/28
  ```

なおこの問題は「開始月の日数＞終了月の日数」の場合のみ発生する(開始月の全ての日が終了月に存在場合は発生しない)。

<details><summary>計算手順</summary>

1. Dateオブジェクトに単純に指定期間を加減算した日付を作成
    - ex. 2023/01/29 + 1M = 2023/02/29(a) ⇒ 2023/03/01(b)
1. 単純に加減算した月(a)と、算出された月(b)を比較、一致した場合は終了
1. a≠bの場合、対処案により以下のように分岐させる
    - ①算出日 ⇒ そのまま2023/03/01
    - ②月末日 ⇒ 有り得ない日付は「翌月0日」と解釈 ⇒ 2023/03/00 ⇒ 2023/02/28
    - ③月末からの逆算日 ⇒ 1月29日は2月-2日なので、+1Mで3月-2日 ⇒ 2023/02/26

</details>

# 引数が日付型

Dateオブジェクトから引数までの期間を返す

```
typedef {object} DateCalc
prop {boolean} sign=true - Dateオブジェクト≦引数ならtrue
prop {number} y=null - 年
prop {number} M=null - 月
prop {number} d=null - 日
prop {number} h=null - 時
prop {number} m=null - 分
prop {number} s=null - 秒
prop {number} n=null - ミリ秒
```

## 開始(S)≦終了(E)

注：以降、以下の変数を使用する。

| 変数名 | 意味 | 備考 |
| :-- | :-- | :-- |
| S | 開始日 | 算出の基点となる日付 |
| E | 終了日 | 算出の終点となる日付 |
| Sy | 開始年 | 開始日の年 |
| Ey | 終了年 | 終了日の年 |
| Sm | 開始月 |
| Em | 終了月 |
| Sd | 開始日 | 開始日の日付(Start | date) |
| Ed | 終了日 | 終了日の日付(End | date) |
| Sym | 開始年月 | 開始月のシリアル値(serial number of Start Year and Month) |
| Eym | 終了年月 | 終了月のシリアル値(serial number of End Year and Month) |

### 開始(S)≦終了(E) and 開始日(Sd)≦終了日(Ed)

Sd<Ed例：「2022/12/21(Sd=21) -> 2023/02/28(Ed=28)」 ⇒ `{sign:true,M:2,d:8}`

<div class="axis" style="grid-template-columns:1fr 2rem">
  <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
    <div class="col"><div>12/21</div><div>[1M]</div><div>1/20</div></div>
    <div class="col"><div>1/21</div><div>[1M]</div><div>2/20</div></div>
    <div class="col"><div>2/21</div><div>[8D]</div><div>2/28</div></div>
  </div>
  <div class="arrow" style="border-left: 2rem solid #aaa;"></div>
</div>

- 上図は時刻指定無しのサンプル。灰色矢印は「開始日▶️終了日」を示す
- 「1ヶ月後」は翌月同日同時刻

Sd=Ed例：「2022/12/28(Sd=28) -> 2023/02/28(Ed=28)」 ⇒ `{sign:true,M:2,d:1}`

<div class="axis" style="grid-template-columns:1fr 2rem">
  <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
    <div class="col"><div>12/28</div><div>[1M]</div><div>1/27</div></div>
    <div class="col"><div>1/28</div><div>[1M]</div><div>2/27</div></div>
    <div class="col"><div>2/28</div><div>[1D]</div><div>2/28</div></div>
  </div>
  <div class="arrow" style="border-left: 2rem solid #aaa;"></div>
</div>

```
diffM = Eym - Sym = 2
diffD = Ed - (Sd - 1)
```

### 開始(S)≦終了(E) and 開始日(Sd)＞終了日(Ed)

Sd>Ed例：「2022/12/31(Sd=31) -> 2023/02/26(Ed=26)」 ⇒ `{sign:true,M:1,d:27}`

  <div class="axis" style="grid-template-columns:1fr 2rem">
    <div class="cols" style="grid-template-columns:1fr 1fr">
      <div class="col"><div>12/31</div><div>[1M]</div><div>1/30</div></div>
      <div class="col"><div>1/31</div><div>[1+26D]</div><div>2/26</div></div>
    </div>
    <div class="arrow" style="border-left: 2rem solid #aaa;"></div>
  </div>

```
diffM = Eym - Sym - 1
diffD = (Smの日数 - Sd + 1) + Ed
```

## 開始(S)＞終了(E)

### 開始(S)＞終了(E) and 開始日(Sd)＜終了日(Ed)

Sd<Ed例：「2023/02/28(Sd=28) -> 2022/12/30(Ed=30)」

**2/28から逆算する場合** ⇒ `{sign:false,M:1,d:30}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:1fr 2fr">
    <div class="col"><div>12/30</div><div>[2+28D]</div><div>1/28</div></div>
    <div class="col"><div>1/29</div><div>[1M]</div><div>2/28</div></div>
  </div>
</div>

**12/30から算出する場合** ⇒ `{sign:false,M:1,d:30}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:2fr 1fr">
    <div class="col"><div>12/30</div><div>[1M]</div><div>1/29</div></div>
    <div class="col"><div>1/30</div><div>[2+28D]</div><div>2/28</div></div>
  </div>
</div>

```
diffM = Sym - Eym - 1
diffD = ( Emの日数 - Ed + 1 ) + Sd
```

### 開始(S)＞終了(E) and 開始日(Sd)＝終了日(Ed)

Sd=Ed例：「2022/12/28(Sd=28) -> 2023/02/28(Ed=28)」 ⇒ `{sign:false,M:2,d:1}`

**2/28から逆算する場合** ⇒ `{sign:false,M:2,d:1}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:1fr 2fr 2fr">
    <div class="col"><div>12/28</div><div>[1D]</div><div>12/28</div></div>
    <div class="col"><div>12/29</div><div>[1M]</div><div>1/28</div></div>
    <div class="col"><div>1/29</div><div>[1M]</div><div>2/28</div></div>
  </div>
</div>

**12/28から算出する場合** ⇒ `{sign:false,M:2,d:1}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
    <div class="col"><div>12/28</div><div>[1M]</div><div>1/27</div></div>
    <div class="col"><div>1/28</div><div>[1M]</div><div>2/27</div></div>
    <div class="col"><div>2/28</div><div>[1D]</div><div>2/28</div></div>
  </div>
</div>

```
diffM = Sym - Eym
diffD = 1
```

### 開始(S)＞終了(E) and 開始日(Sd)＞終了日(Ed)

Sd=Ed例：「2023/02/28(Sd=28) -> 2022/12/21(Ed=21) -> 」 ⇒ `{sign:false,M:2,d:1}`

**2/28から逆算する場合** ⇒ `{sign:false,M:2,d:8}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:1fr 2fr 2fr">
    <div class="col"><div>12/21</div><div>[8D]</div><div>12/28</div></div>
    <div class="col"><div>12/29</div><div>[1M]</div><div>1/28</div></div>
    <div class="col"><div>1/29</div><div>[1M]</div><div>2/28</div></div>
  </div>
</div>

**12/28から算出する場合** ⇒ `{sign:false,M:2,d:8}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
    <div class="col"><div>12/21</div><div>[1M]</div><div>1/20</div></div>
    <div class="col"><div>1/21</div><div>[1M]</div><div>2/20</div></div>
    <div class="col"><div>2/21</div><div>[8D]</div><div>2/28</div></div>
  </div>
</div>

```
diffM = Sym - Eym
diffD = 1
```

Sd>Ed例：「2023/04/30(Sd=30) -> 2023/02/28(Ed=28) -> 」 ⇒ `{sign:false,M:2,d:1}`

**4/30から逆算する場合** ⇒ `{sign:true,M:2,d:8}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:1fr 2fr 2fr">
    <div class="col"><div>12/21</div><div>[8D]</div><div>12/28</div></div>
    <div class="col"><div>2/31</div><div>[1M]</div><div>3/30</div></div>
    <div class="col"><div>3/31</div><div>[1M]</div><div>4/30</div></div>
  </div>
</div>

**いまここ：2/28から算出する場合** ⇒ `{sign:false,M:2,d:8}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
    <div class="col"><div>2/28</div><div>[1M]</div><div>3/27</div></div>
    <div class="col"><div>3/28</div><div>[1M]</div><div>4/27</div></div>
    <div class="col"><div>4/28</div><div>[3D]</div><div>4/30</div></div>
  </div>
</div>

開始月の日数>終了月の日数 となるパターンはある？

```
diffM = Sym - Eym
diffD = 1
```

# 引数が非日付型

Dateオブジェクトに指定期間を加減算したDateオブジェクトを返す

# 注意事項

1. 時刻が指定されていない場合、開始日・終了日とも終日範囲内と見做す
    ex. 「2023/01/01 -> 2023/12/31」 ⇒ 2023/01/01 00:00:00 ≦ n ＜ 2023/12/31 24:00:00
    - 「時刻が指定されていない」とは、開始日・終了日とも時刻が00:00:00であることを示す
    - 時刻指定があれば、それに従って計算する(終日範囲内とは見做さない)

1. 「1ヶ月＋1日」後と「1ヶ月後」の「1日後」とは結果が異なる場合がある

# Date.serial: 内部用シリアル月・シリアル日の計算

```
typedef {object} DateSerial
prop {number} month - シリアル月の値
prop {number} date - シリアル日の値
prop {number} fam - シリアル月朔日0:00以降の経過ミリ秒数(fraction after month)
prop {number} fad - シリアル日0:00以降の経過ミリ秒数(fraction after date)

desc 2つの日付の間隔を算出するための一連番号を計算する。シリアル月は`(Date.getFullYear()-1970)×12ヶ月＋Date.getMonth()`、シリアル日は`Math.floor(Date.getTime()÷(24×60×60×1000))`で計算する。

なお内部用を念頭に開発し、かつ互換性確保のロジックが煩雑なため、Excelで使用されるシリアル日との互換性はない。

param {any} [arg=this] - 計算対象となる日付情報(ex."2023/07/02")。Date型に変換できないならエラー。指定無しなら本体
returns {DateSerial} シリアル化された日付情報
```

# Date.numberOfDays: 指定月の日数を取得

```
param {any} [arg=this] - 計算対象となる日付情報(ex."2023/07/02")。Date型に変換できないならエラー。指定無しなら本体
returns {number} 指定月の日数(1〜31)
```

<style type="text/css">
  .axis, .cols, .col {display:grid;}
  .axis {
    width:80%;
    margin: 0.5rem 2rem;
  }
  .cols {
    padding: 0.5rem;
    background-color:#aaa;
  }
  .col {
    padding: 0.1rem;
    border: solid 1px #000;
    background-color:#fff;
    grid-template-columns:repeat(3, 1fr);
  }
  .col div:nth-child(1) {text-align:left;}
  .col div:nth-child(2) {text-align:center;}
  .col div:nth-child(3) {text-align:right;}
  .arrow {
    width:0; height:0;
    border-top: 1.4rem solid transparent;
    border-bottom: 1.4rem solid transparent;
  }
</style>

</details>
<a name="Date_toLocale"></a>

## Date\_toLocale([format]) ⇒ <code>string</code>
日時を指定形式の文字列にして返す"toLocale()"メソッドをDate型に追加する。

**Kind**: global function  
**Returns**: <code>string</code> - 指定形式に変換された文字列。無効な日付なら長さ0の文字列  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [format] | <code>string</code> | <code>&quot;&#x27;yyyy/MM/dd&#x27;&quot;</code> | 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n |

**Example**  
```
"1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
"1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
"1965/9/5"[hh:mm] ⇒ "00:00"
"1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
"1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
"1977-03-04"[hh:mm] ⇒ "09:00"
1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
1688189258262[hh:mm] ⇒ "14:27"
"Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
"Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
"Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
"12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
"12:34"[yyyy-MM-dd] ⇒ ""
"12:34"[hh:mm] ⇒ ""
```
<a name="embedComponent"></a>

## embedComponent(doc) ⇒ <code>Document</code>
テンプレート(HTML)のタグに含まれる'data-embed'属性に基づき、他文書から該当箇所を挿入する。

JavaScriptのライブラリ等、テンプレートが非HTMLの場合は処理できない。<br>
この場合、テンプレートを強引にHTML化して処理後、querySelector.jsで必要な部分を抽出するか、grep等で不要な部分を削除する。

- [JSDOMを利用し、HTML + JavaScriptのプログラムをNode.jsで動作させる](https://symfoware.blog.fc2.com/blog-entry-2685.html)

**Kind**: global function  
**Returns**: <code>Document</code> - 挿入済みのDocumentオブジェクト  

| Param | Type | Description |
| --- | --- | --- |
| doc | <code>Document</code> | 編集対象となるDocumentオブジェクト |

**Example**  
テンプレートのdata-embed書式

```
// SVG：embed指定要素の子要素としてSVG追加
<div name="案内図"><div class="img" data-embed="map2023.svg"></div></div>
-> <div name="案内図"><div class="img"><svg id="exportSVG"〜

// PlantUML：指定要素の子要素として、隠蔽された要素を追加。兄弟にIMG要素が必要
<div name="日程表"><div class="PlantUML"  data-embed="schedule.pu"><img /></div></div>
-> <div name="日程表"><div class="PlantUML"><img><div style="display:none">@startgantt〜

// PNG：自要素(IMG)のsrc属性の値としてbase64文字列を追加
<div name="校内探検"><img width="600px" data-embed='{"from":{"filename":"expedition.txt"},"to":"png"}' /></div>
-> <div name="校内探検"><img width="600px" src="data:image/png;base64,iVBORw0KG〜

// MarkDown：自要素のinnerTextとして追加
<div class="markdown" name="6/10定例会" data-embed="20230610.md"></div>
-> <div class="markdown" name="6/10定例会">1. 日程：9/23〜24 or **9/30〜10/01**(第一候補)

// 自作ライブラリ(通常関数)
<script type="text/javascript" data-embed='{"from":{"filename":"../../component/mergeDeeply.html","selector":"script.core"},"to":"js"}'><／script>

// 既存クラスの拡張
<script type="text/javascript" data-embed='{"from":{"filename":"../../component/Array.tabulize.html","selector":"script.core"},"to":"js"}'><／script>

// CSS指定付きのクラス(style,script両方を指定)
<style type="text/css" data-embed='{"from":{"filename":"../../component/TimeTable.html","selector":"style.core"},"to":"css"}'></style>
<script type="text/javascript" data-embed='{"from":{"filename":"../../component/TimeTable.html","selector":"script.core"},"to":"js"}'><／script>
```

**data-embedに指定する文字列**

```
data-embed="ファイル名"  // 文字列だった場合はfrom.filename(ファイル全文)と解釈。拡張子でtoを指定
or
data-embed='{  // JSON形式だった場合、囲み記号はシングルクォーテーション
  "from": {    // メンバ名・値ともダブルクォーテーションで囲む
    "filename": "{string}" - 参照先のファイル名
    "selector": "{string}" - CSSセレクタ文字列。省略時はファイル全文と解釈
  },
  "to": "{string}" - 出力先に対する指定
     replace:自要素を中身で代替(embed要素は削除)
     svg: SVG画像(embed要素の子要素として追加)
     js: JavaScript(同上)
     css: CSS(同上)
     md: MarkDown(同上)
     mmd: Mermaid(同上)
     txt: その他形式のテキスト(同上)
     pu: PlantUMLのソースとしてIMGタグのsrc属性の値として設定
     その他: embed要素のその他属性の値として設定
}'
```
<a name="mergeDeeply"></a>

## mergeDeeply(target, source, opts) ⇒ <code>Object</code>
オブジェクトのプロパティを再帰的にマージ
- Qiita [JavaScriptでオブジェクトをマージ（結合）する方法、JSONのマージをする方法](https://qiita.com/riversun/items/60307d58f9b2f461082a)

**Kind**: global function  
**Returns**: <code>Object</code> - 結合されたオブジェクト  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| target | <code>Object</code> |  | 結合対象のオブジェクト1 |
| source | <code>Object</code> |  | 結合対象のオブジェクト2。同名のプロパティはこちらで上書き |
| opts | <code>Object</code> |  | オプション |
| [opts.concatArray] | <code>boolean</code> | <code>false</code> | プロパティの値が配列だった場合、結合するならtrue |

<a name="querySelector"></a>

## querySelector(content, selectors) ⇒ [<code>Array.&lt;QuerySelector&gt;</code>](#QuerySelector)
HTMLの指定CSSセレクタの内容を抽出

**Kind**: global function  
**Returns**: [<code>Array.&lt;QuerySelector&gt;</code>](#QuerySelector) - 抽出された指定CSSセレクタ内のテキスト  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | エレメント(HTML)の全ソース |
| selectors | <code>string</code> \| <code>Array.&lt;string&gt;</code> | 抽出対象となるCSSセレクタ |

<a name="whichType"></a>

## whichType(arg, [is]) ⇒ <code>string</code> \| <code>boolean</code>
変数の型を判定し、型名を文字列で返す。なお引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。

**Kind**: global function  
**Returns**: <code>string</code> \| <code>boolean</code> - - 型の名前。is指定有りなら判定対象が想定型かの真偽値  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>any</code> | 判定対象の変数 |
| [is] | <code>string</code> | 想定される型(型名の大文字小文字は意識不要) |

**Example**  
```
let a = 10;
whichType(a);  // 'Number'
whichType(a,'string'); // false
```

<b>確認済戻り値一覧</b>

オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。

| 型名 | 戻り値 | 備考 |
| :-- | :-- | :-- |
| 文字列 | String |  |
| 数値 | Number |  |
| NaN | NaN |  |
| 長整数 | BigInt |  |
| 論理値 | Boolean |  |
| シンボル | Symbol |  |
| undefined | Undefined | 先頭大文字 |
| Null | Null |  |
| オブジェクト | Object |  |
| 配列 | Array |  |
| 関数 | Function |  |
| アロー関数 | Arrow |  |
| エラー | Error | RangeError等も'Error' |
| Date型 | Date |  |
| Promise型 | Promise |  |
 
- Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
<a name="AnalyzeArg"></a>

## AnalyzeArg : <code>object</code>
コマンドライン引数の分析結果

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| opt | <code>Object.&lt;string, number&gt;</code> | スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト |
| val | <code>Array.&lt;string&gt;</code> | スイッチを持たない引数の配列 |

<a name="AnalyzePath"></a>

## AnalyzePath : <code>object</code>
パス文字列から構成要素を抽出したオブジェクト

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| full | <code>string</code> | 引数の文字列(フルパス) |
| path | <code>string</code> | ファイル名を除いたパス文字列 |
| file | <code>string</code> | ファイル名 |
| base | <code>string</code> | 拡張子を除いたベースファイル名 |
| suffix | <code>string</code> | 拡張子 |

<a name="DateCalcArg"></a>

## DateCalcArg : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [y] | <code>number</code> | 年 |
| [M] | <code>number</code> | 月 |
| [d] | <code>number</code> | 日 |
| [h] | <code>number</code> | 時 |
| [m] | <code>number</code> | 分 |
| [s] | <code>number</code> | 秒 |
| [n] | <code>number</code> | ミリ秒 |

<a name="QuerySelector"></a>

## QuerySelector : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| tag | <code>string</code> |  | タグ名 |
| attr | <code>Object.&lt;string, string&gt;</code> | <code>Null</code> | 属性名：属性値となるオブジェクト |
| inner | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 子要素タグも含む、タグ内のテキスト |

<a name="opt"></a>

## opt : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| datatype | <code>string</code> | データのタイプ。sheet:シートデータ |

