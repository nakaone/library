# jsLib: HTMLまたはバッチ(Node.js)用ライブラリ

<p style='text-align:right'>last update: 2023年 7月 1日 土曜日 10時50分51秒 JST</p>

## Functions

<dl>
<dt><a href="#analyzeArg">analyzeArg()</a> ⇒ <code><a href="#analyzeArg">analyzeArg</a></code></dt>
<dd><p>コマンドラインから<code>node xxx.js aa bb</code>を実行した場合の引数(<code>aa</code>,<code>bb</code>)を取得し、オブジェクトにして返す。<br></p>
</dd>
<dt><a href="#querySelector">querySelector(content, selectors)</a> ⇒ <code><a href="#querySelector">Array.&lt;querySelector&gt;</a></code></dt>
<dd><p>querySelector: HTMLの指定CSSセレクタの内容を抽出</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#analyzeArg">analyzeArg</a> : <code>object</code></dt>
<dd><p>コマンドライン引数の分析結果</p>
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
<a name="querySelector"></a>

## querySelector(content, selectors) ⇒ [<code>Array.&lt;querySelector&gt;</code>](#querySelector)
querySelector: HTMLの指定CSSセレクタの内容を抽出

**Kind**: global function  
**Returns**: [<code>Array.&lt;querySelector&gt;</code>](#querySelector) - 抽出された指定CSSセレクタ内のテキスト  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | エレメント(HTML)の全ソース |
| selectors | <code>string</code> \| <code>Array.&lt;string&gt;</code> | 抽出対象となるCSSセレクタ |

<a name="analyzeArg"></a>

## analyzeArg : <code>object</code>
コマンドライン引数の分析結果

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| opt | <code>Object.&lt;string, number&gt;</code> | スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト |
| val | <code>Array.&lt;string&gt;</code> | スイッチを持たない引数の配列 |

<a name="querySelector"></a>

## querySelector : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| tag | <code>string</code> |  | タグ名 |
| attr | <code>Object.&lt;string, string&gt;</code> | <code></code> | 属性名：属性値となるオブジェクト |
| inner | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 子要素タグも含む、タグ内のテキスト |

