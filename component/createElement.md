## Functions

<dl>
<dt><a href="#createElement">createElement(arg)</a> ⇒ <code>HTMLElement</code></dt>
<dd><p>HTMLの要素を生成</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#createElementDef">createElementDef</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="createElement"></a>

## createElement(arg) ⇒ <code>HTMLElement</code>
HTMLの要素を生成

**Kind**: global function  
**Returns**: <code>HTMLElement</code> - 生成された要素  

| Param | Type | Description |
| --- | --- | --- |
| arg | [<code>createElementDef</code>](#createElementDef) \| <code>string</code> | 生成する要素の定義 |

<a name="createElementDef"></a>

## createElementDef : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| tag | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> | タグ名 |
| [attr] | <code>Object.&lt;string, string&gt;</code> |  | タグに設定する属性。ex.attr:{name:'hoge'} |
| [style] | <code>Object.&lt;string, string&gt;</code> |  | 〃スタイル。ex.style:{display:'none'} |
| [event] | <code>Object.&lt;string, string&gt;</code> |  | 〃イベント。ex.event:{onclick:()=>{〜}} |
| [text] | <code>string</code> |  | タグ内にセットする文字列 |
| [html] | <code>string</code> |  | タグ内にセットするhtml文字列 |
| [children] | [<code>Array.&lt;createElementDef&gt;</code>](#createElementDef) |  | 子要素の配列 |

