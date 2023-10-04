## Functions

<dl>
<dt><a href="#querySelector">querySelector(content, selectors)</a> ⇒ <code><a href="#QuerySelector">Array.&lt;QuerySelector&gt;</a></code></dt>
<dd><p>HTMLの指定CSSセレクタの内容を抽出</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#QuerySelector">QuerySelector</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="querySelector"></a>

## querySelector(content, selectors) ⇒ [<code>Array.&lt;QuerySelector&gt;</code>](#QuerySelector)
HTMLの指定CSSセレクタの内容を抽出

**Kind**: global function  
**Returns**: [<code>Array.&lt;QuerySelector&gt;</code>](#QuerySelector) - 抽出された指定CSSセレクタ内のテキスト  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | エレメント(HTML)の全ソース |
| selectors | <code>string</code> \| <code>Array.&lt;string&gt;</code> | 抽出対象となるCSSセレクタ |

<a name="QuerySelector"></a>

## QuerySelector : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| tag | <code>string</code> |  | タグ名 |
| attr | <code>Object.&lt;string, string&gt;</code> | <code>Null</code> | 属性名：属性値となるオブジェクト |
| inner | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 子要素タグも含む、タグ内のテキスト |

