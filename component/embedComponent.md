## Functions

<dl>
<dt><a href="#embedComponent">embedComponent(doc)</a> ⇒ <code>Document</code></dt>
<dd><p>テンプレート(HTML)のタグに含まれる&#39;data-embed&#39;属性に基づき、他文書から該当箇所を挿入する。</p>
<p>JavaScriptのライブラリ等、テンプレートが非HTMLの場合は処理できない。<br>
この場合、テンプレートを強引にHTML化して処理後、querySelector.jsで必要な部分を抽出するか、grep等で不要な部分を削除する。</p>
<ul>
<li><a href="https://symfoware.blog.fc2.com/blog-entry-2685.html">JSDOMを利用し、HTML + JavaScriptのプログラムをNode.jsで動作させる</a></li>
</ul>
</dd>
<dt><a href="#onNode">onNode(i, o, [t])</a></dt>
<dd><p>コンソールで起動された際のパラメータ処理</p>
</dd>
</dl>

<a name="embedComponent"></a>

## embedComponent(doc) ⇒ <code>Document</code>
テンプレート(HTML)のタグに含まれる'data-embed'属性に基づき、他文書から該当箇所を挿入する。

JavaScriptのライブラリ等、テンプレートが非HTMLの場合は処理できない。<br>
この場合、テンプレートを強引にHTML化して処理後、querySelector.jsで必要な部分を抽出するか、grep等で不要な部分を削除する。

- [JSDOMを利用し、HTML + JavaScriptのプログラムをNode.jsで動作させる](https://symfoware.blog.fc2.com/blog-entry-2685.html)

**Kind**: global function  
**Returns**: <code>Document</code> - 挿入済みのDocumentオブジェクト  

| Param | Type | Description |
| --- | --- | --- |
| doc | <code>Document</code> | 編集対象となるDocumentオブジェクト |

**Example**  
テンプレートのdata-embed書式

1. JSON.parseするので、メンバ名もダブルクォーテーションで囲む
1. 属性値全体はシングルクォーテーションで囲む

```
data-embed="{
  from: {
    filename: {string} - 参照先のファイル名
    selector: {string} - CSSセレクタ文字列。省略時はファイル全文と解釈
  },
  to: {string} [innerHTML|innerText|xxx|child],
    innerHTML : data-embedが記載された要素のinnerHTMLとする
    innerText : data-embedが記載された要素のinnerTextとする
    xxx : 属性名xxxの値とする
    replace : data-embedを持つ要素を置換する
  type: {string} [html,pu,md,mmd,text]
    html : テンプレート(HTML)同様、HTMLとして出力(既定値)
    pu : PlantUMLとして子要素を生成して追加
    md : MarkDownとして子要素を生成して追加
    mmd : Mermaidとして子要素を生成して追加
    text : bodyの中のみを、テキストとして出力
}"

例：
<div data-embed='{"from":{"filename":"../../component/analyzeArg.html","selector":"script.core"},"to":"replace"}'></div>
```
<a name="onNode"></a>

## onNode(i, o, [t])
コンソールで起動された際のパラメータ処理

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>string</code> | テンプレートファイル名。カレントフォルダからの相対パスで指定 |
| o | <code>string</code> | 出力ファイル名 |
| [t] | <code>string</code> | 出力タイプ | 記号 | 出力タイプ | | :--: | :-- | | html | テンプレート(HTML)同様、HTMLとして出力(既定値) | | text | bodyの中のみを、テキストとして出力 | |

