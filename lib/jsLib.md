# jsLib: HTMLまたはバッチ(Node.js)用ライブラリ

<p style='text-align:right'>last update: 2023年 7月 1日 土曜日 14時57分35秒 JST</p>

アンダーバー('_')が含まれる関数名「XXX_yyy()」は、XXX型オブジェクトへのyyyメソッド追加を示す。

## Functions

<dl>
<dt><a href="#analyzeArg">analyzeArg()</a> ⇒ <code><a href="#analyzeArg">analyzeArg</a></code></dt>
<dd><p>コマンドラインから<code>node xxx.js aa bb</code>を実行した場合の引数(<code>aa</code>,<code>bb</code>)を取得し、オブジェクトにして返す。<br></p>
</dd>
<dt><a href="#analyzePath">analyzePath(arg)</a> ⇒ <code><a href="#analyzePath">analyzePath</a></code></dt>
<dd><p>パス名文字列から構成要素を抽出</p>
</dd>
<dt><a href="#querySelector">querySelector(content, selectors)</a> ⇒ <code><a href="#querySelector">Array.&lt;querySelector&gt;</a></code></dt>
<dd><p>HTMLの指定CSSセレクタの内容を抽出</p>
</dd>
<dt><a href="#whichType">whichType(arg, [is])</a> ⇒ <code>string</code> | <code>boolean</code></dt>
<dd><p>変数の型を判定し、型名を文字列で返す。なお引数&quot;is&quot;が指定された場合、判定対象が&quot;is&quot;と等しいかの真偽値を返す。</p>
<ul>
<li>Qiita <a href="https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3">JavaScriptの型などの判定いろいろ</a></li>
</ul>
</dd>
<dt><a href="#Date_toLocale">Date_toLocale([format])</a> ⇒ <code>string</code></dt>
<dd><p>日時を指定形式の文字列にして返す&quot;toLocale()&quot;メソッドをDate型に追加する。</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#analyzeArg">analyzeArg</a> : <code>object</code></dt>
<dd><p>コマンドライン引数の分析結果</p>
</dd>
<dt><a href="#analyzePath">analyzePath</a> : <code>object</code></dt>
<dd><p>パス文字列から構成要素を抽出したオブジェクト</p>
</dd>
<dt><a href="#querySelector">querySelector</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="analyzeArg"></a>

## analyzeArg() ⇒ [<code>analyzeArg</code>](#analyzeArg)
コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す。<br>

**Kind**: global function  
**Returns**: [<code>analyzeArg</code>](#analyzeArg) - 分析結果のオブジェクト  

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

## analyzePath(arg) ⇒ [<code>analyzePath</code>](#analyzePath)
パス名文字列から構成要素を抽出

**Kind**: global function  
**Returns**: [<code>analyzePath</code>](#analyzePath) - 構成要素を抽出したオブジェクト  

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
<a name="querySelector"></a>

## querySelector(content, selectors) ⇒ [<code>Array.&lt;querySelector&gt;</code>](#querySelector)
HTMLの指定CSSセレクタの内容を抽出

**Kind**: global function  
**Returns**: [<code>Array.&lt;querySelector&gt;</code>](#querySelector) - 抽出された指定CSSセレクタ内のテキスト  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | エレメント(HTML)の全ソース |
| selectors | <code>string</code> \| <code>Array.&lt;string&gt;</code> | 抽出対象となるCSSセレクタ |

<a name="whichType"></a>

## whichType(arg, [is]) ⇒ <code>string</code> \| <code>boolean</code>
変数の型を判定し、型名を文字列で返す。なお引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。

- Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)

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
<a name="analyzeArg"></a>

## analyzeArg : <code>object</code>
コマンドライン引数の分析結果

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| opt | <code>Object.&lt;string, number&gt;</code> | スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト |
| val | <code>Array.&lt;string&gt;</code> | スイッチを持たない引数の配列 |

<a name="analyzePath"></a>

## analyzePath : <code>object</code>
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

<a name="querySelector"></a>

## querySelector : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| tag | <code>string</code> |  | タグ名 |
| attr | <code>Object.&lt;string, string&gt;</code> | <code></code> | 属性名：属性値となるオブジェクト |
| inner | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 子要素タグも含む、タグ内のテキスト |

