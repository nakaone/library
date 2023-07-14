## Functions

<dl>
<dt><a href="#analyzeArg">analyzeArg()</a> ⇒ <code><a href="#AnalyzeArg">AnalyzeArg</a></code></dt>
<dd><p>コマンドラインから<code>node xxx.js aa bb</code>を実行した場合の引数(<code>aa</code>,<code>bb</code>)を取得し、オブジェクトにして返す。<br></p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#AnalyzeArg">AnalyzeArg</a> : <code>object</code></dt>
<dd><p>コマンドライン引数の分析結果</p>
</dd>
</dl>

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
<a name="AnalyzeArg"></a>

## AnalyzeArg : <code>object</code>
コマンドライン引数の分析結果

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| opt | <code>Object.&lt;string, number&gt;</code> | スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト |
| val | <code>Array.&lt;string&gt;</code> | スイッチを持たない引数の配列 |

