# jsLib: HTMLまたはバッチ(Node.js)用ライブラリ

<p style='text-align:right'>last update: 2023年 6月29日 木曜日 16時30分52秒 JST</p>

## Functions

<dl>
<dt><a href="#analyzeArg">analyzeArg()</a> ⇒ <code><a href="#analyzeArg">analyzeArg</a></code></dt>
<dd><p>コマンドラインから<code>node xxx.js aa bb</code>を実行した場合の引数(<code>aa</code>,<code>bb</code>)を取得し、オブジェクトにして返す。<br></p>
</dd>
<dt><a href="#executable">executable(content)</a> ⇒ <code>string</code></dt>
<dd><p>executable: コンポーネント(HTML)から必要な部分を抽出、Node.jsで実行可能なJSファイルを作成</p>
</dd>
<dt><a href="#textContent">textContent(content, selectors)</a> ⇒ <code>string</code></dt>
<dd><p>補足説明</p>
<table>
<thead>
<tr>
<th align="left">lv01</th>
<th align="left">lv02</th>
<th align="left">lv03</th>
<th align="left">value</th>
<th align="left">note</th>
</tr>
</thead>
<tbody><tr>
<td align="left">public</td>
<td align="left"></td>
<td align="left"></td>
<td align="left"></td>
<td align="left"></td>
</tr>
<tr>
<td align="left"></td>
<td align="left">inter</td>
<td align="left"></td>
<td align="left">30000</td>
<td align="left">定期配信の間隔</td>
</tr>
<tr>
<td align="left"></td>
<td align="left"></td>
<td align="left">inter</td>
<td align="left">30000</td>
<td align="left">NGのサンプル</td>
</tr>
</tbody></table>
<p>なお上の最下行のように階層が飛ぶことはNG(lv01:あり/lv02:なし/lv03:ありはNG)。</p>
<ul>
<li><a href="https://www.google.com/">Google</a></li>
</ul>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#analyzeArg">analyzeArg</a> : <code>object</code></dt>
<dd><p>コマンドライン引数の分析結果</p>
</dd>
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
<a name="executable"></a>

## executable(content) ⇒ <code>string</code>
executable: コンポーネント(HTML)から必要な部分を抽出、Node.jsで実行可能なJSファイルを作成

**Kind**: global function  
**Returns**: <code>string</code> - JSファイルの中身(テキスト)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | コンポーネント(HTML)の全ソース |

<a name="textContent"></a>

## textContent(content, selectors) ⇒ <code>string</code>
補足説明

| lv01   | lv02  | lv03  | value | note |
| :--    | :--   | :--   | :--   | :-- |
| public |       |       |       | |
|       | inter |       | 30000 | 定期配信の間隔 |
|       |       | inter | 30000 | NGのサンプル |

なお上の最下行のように階層が飛ぶことはNG(lv01:あり/lv02:なし/lv03:ありはNG)。

- [Google](https://www.google.com/)

**Kind**: global function  
**Returns**: <code>string</code> - 抽出された指定CSSセレクタ内のテキスト  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | エレメント(HTML)の全ソース |
| selectors | <code>Array.&lt;string&gt;</code> | 抽出対象となるCSSセレクタ |

**Example**  
objectize(arr,1,3) ⇒ {public:{inter:{value:30000,note:'定期配信の間隔'}}}
objectize(arr,'lv01','lv03','value') ⇒ {public:{inter:30000}}}
objectize(arr,'lv01','lv03','rowNumber20230302')
⇒ {public:{inter:{value:30000,note:'定期配信の間隔',rowNumber20230302:2}}}}

```
objectize(arr,1,3) ⇒ {public:{inter:{value:30000,note:'定期配信の間隔'}}}
objectize(arr,'lv01','lv03','value') ⇒ {public:{inter:30000}}}
objectize(arr,'lv01','lv03','rowNumber20230302')
⇒ {public:{inter:{value:30000,note:'定期配信の間隔',rowNumber20230302:2}}}}
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

