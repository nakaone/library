## Functions

<dl>
<dt><a href="#esed">esed(x, s, f, e)</a> ⇒ <code>void</code></dt>
<dd><p>標準入力を指定正規表現で置換し、標準出力に送る</p>
<ul>
<li>複数箇所にマッチした場合、全て置換する。</li>
</ul>
</dd>
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

<a name="esed"></a>

## esed(x, s, f, e) ⇒ <code>void</code>
標準入力を指定正規表現で置換し、標準出力に送る

- 複数箇所にマッチした場合、全て置換する。

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>string</code> |  | 正規表現文字列 |
| s | <code>string</code> |  | 置換後の文字列。ファイルと択一 |
| f | <code>string</code> |  | 置換後の文字列を格納したファイル |
| e | <code>string</code> | <code>&quot;&#x27;utf-8&#x27;&quot;</code> | エンコード指定 |

**Example**  
CSSからコメントを削除

```
tf="/Users/ena.kaon/Desktop/GitHub/library/CSS/1.3.0/core.css"
cat $tf | node esed.js -x:"\/\*[\s\S]+?\*\/\n" -s:"" > result01.txt
```

- `[\s\S]`は改行を含むあらゆる文字(`.`は改行にはマッチしない)

ファイルの中身で置換

```
cat << EOF > test.txt
aaa
bbb
EOF
cat $tf | node esed.js -x:"\/\*[\s\S]+?\*\/\n" -f:"test.txt" > result02.txt
```
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

