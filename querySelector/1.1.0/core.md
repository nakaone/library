## Functions

<dl>
<dt><a href="#querySelector">querySelector(content, selectors)</a> ⇒ <code><a href="#QuerySelector">Array.&lt;QuerySelector&gt;</a></code> | <code>Error</code></dt>
<dd><p>HTML文書から指定CSSセレクタの情報を抽出</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#QuerySelector">QuerySelector</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="querySelector"></a>

## querySelector(content, selectors) ⇒ [<code>Array.&lt;QuerySelector&gt;</code>](#QuerySelector) \| <code>Error</code>
HTML文書から指定CSSセレクタの情報を抽出

**Kind**: global function  
**Returns**: [<code>Array.&lt;QuerySelector&gt;</code>](#QuerySelector) \| <code>Error</code> - - [Node.jsのサーバサイドでDOMを使う](https://moewe-net.com/nodejs/jsdom)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | 処理対象となるテキスト |
| selectors | <code>string</code> \| <code>Array.&lt;string&gt;</code> | 抽出条件を指定するCSSセレクタ(複数可) |

<a name="QuerySelector"></a>

## QuerySelector : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| tag | <code>string</code> |  | タグ名 |
| selector | <code>string</code> |  | 指定に使用されたCSSセレクタ |
| attr | <code>Object.&lt;string, string&gt;</code> | <code>Null</code> | 属性名：属性値となるオブジェクト |
| html | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | innerHTMLの値。要素に含まれるすべてのテキスト |
| text | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | innerTextの値。 |
| content | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | textContentの値。要素およびその子要素に含まれるすべてのテキスト |

