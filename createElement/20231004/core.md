## Functions

<dl>
<dt><a href="#createElement">createElement(arg, [parent])</a> ⇒ <code>HTMLElement</code> | <code>Error</code></dt>
<dd><p>HTMLElementを生成する</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CEDefObj">CEDefObj</a></dt>
<dd></dd>
</dl>

<a name="createElement"></a>

## createElement(arg, [parent]) ⇒ <code>HTMLElement</code> \| <code>Error</code>
HTMLElementを生成する

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arg | [<code>CEDefObj</code>](#CEDefObj) \| [<code>Array.&lt;CEDefObj&gt;</code>](#CEDefObj) |  | 生成するHTMLElementの定義 |
| [parent] | <code>HTMLElement</code> \| <code>string</code> | <code></code> | 本関数内部で親要素への追加まで行う場合に指定 |

<a name="CEDefObj"></a>

## CEDefObj
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [tag] | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> | タグ |
| [attr] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | タグの属性(ex.src, class) |
| [style] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | 適用するCSS。ラベルは通常のCSSと同じ。 |
| [event] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | イベント名：関数Objのオブジェクト。ex. {click:()=>{〜}} |
| [text] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | innerTextにセットする文字列 |
| [html] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | innerHTMLにセットする文字列 |
| [children] | [<code>Array.&lt;CEDefObj&gt;</code>](#CEDefObj) | <code>[]</code> | 子要素 |

