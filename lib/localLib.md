# localLib: HTMLまたはバッチ(Node.js)用ライブラリ

<p style='text-align:right'>last update: 2023年 6月28日 水曜日 13時04分42秒 JST</p>

## Functions

<dl>
<dt><a href="#analyzeArg">analyzeArg()</a> ⇒ <code><a href="#analyzeArg">analyzeArg</a></code></dt>
<dd><p>analyzeArg: コマンドライン引数を分析</p>
</dd>
<dt><a href="#executable">executable(content)</a> ⇒ <code>string</code></dt>
<dd><p>executable: コンポーネント(HTML)から必要な部分を抽出、Node.jsで実行可能なJSファイルを作成</p>
</dd>
<dt><a href="#textContent">textContent(content, selectors)</a> ⇒ <code>string</code></dt>
<dd><p>textContent: 指定CSSセレクタ内のテキストを抽出</p>
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
analyzeArg: コマンドライン引数を分析

**Kind**: global function  
**Returns**: [<code>analyzeArg</code>](#analyzeArg) - 分析結果のオブジェクト  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>void</code> | なし |

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
textContent: 指定CSSセレクタ内のテキストを抽出

**Kind**: global function  
**Returns**: <code>string</code> - 抽出された指定CSSセレクタ内のテキスト  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | エレメント(HTML)の全ソース |
| selectors | <code>Array.&lt;string&gt;</code> | 抽出対象となるCSSセレクタ |

<a name="analyzeArg"></a>

## analyzeArg : <code>object</code>
コマンドライン引数の分析結果

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| opt | <code>Object.&lt;string, number&gt;</code> | スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト |
| val | <code>Array.&lt;string&gt;</code> | スイッチを持たない引数の配列 |

