## Functions

<dl>
<dt><a href="#embedComponent">embedComponent(doc)</a> ⇒ <code>HTMLElement</code></dt>
<dd><p>テンプレート(HTML)のタグに含まれる&#39;data-embed&#39;属性に基づき、他文書から該当箇所を挿入する</p>
</dd>
<dt><a href="#onNode">onNode([d], i, o)</a> ⇒ <code>void</code></dt>
<dd><p>コンソール(Node.js)でembedComponentを実行</p>
<pre><code>data-embed=&quot;{
  from: {
    filename: {string} - 参照先のファイル名
    selector: {string} - CSSセレクタ文字列。省略時はファイル全文と解釈
  },
  to: {string} [innerHTML|innerText|xxx|child],
    innerHTML : data-embedが記載された要素のinnerHTMLとする
    innerText : data-embedが記載された要素のinnerTextとする
    xxx : 属性名xxxの値とする
  type: {string} [pu,md,mmd]
    pu : PlantUMLとして子要素を生成して追加
    md : MarkDownとして子要素を生成して追加
    mmd : Mermaidとして子要素を生成して追加
}&quot;
</code></pre>
<p>window.onLoadで以下を呼び出して使用。</p>
<pre><code>document.querySelectorAll(&#39;[data-embed]&#39;).forEach(element =&gt; {
 embedComponent(element.getAttribute(&#39;data-embed&#39;));
});
</code></pre>
<p><strong>注意</strong></p>
<p>JavaScriptのライブラリ等、テンプレートが非HTMLの場合は処理できない。<br>
この場合、テンプレートを強引にHTML化して処理後、querySelector.jsで必要な部分を抽出するか、grep等で不要な部分を削除する。</p>
<p>以下はコンソールで使用する際、nodeの起動時オプションで指定するパラメータ。</p>
</dd>
</dl>

<a name="embedComponent"></a>

## embedComponent(doc) ⇒ <code>HTMLElement</code>
テンプレート(HTML)のタグに含まれる'data-embed'属性に基づき、他文書から該当箇所を挿入する

**Kind**: global function  
**Returns**: <code>HTMLElement</code> - 挿入済みのHTML文書(但、doctype,htmlタグは含まない)  

| Param | Type | Description |
| --- | --- | --- |
| doc | <code>Document</code> | 編集対象となるDocumentオブジェクト |

<a name="onNode"></a>

## onNode([d], i, o) ⇒ <code>void</code>
コンソール(Node.js)でembedComponentを実行

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
  type: {string} [pu,md,mmd]
    pu : PlantUMLとして子要素を生成して追加
    md : MarkDownとして子要素を生成して追加
    mmd : Mermaidとして子要素を生成して追加
}"
```

window.onLoadで以下を呼び出して使用。

```
document.querySelectorAll('[data-embed]').forEach(element => {
 embedComponent(element.getAttribute('data-embed'));
});
```

**注意**

JavaScriptのライブラリ等、テンプレートが非HTMLの場合は処理できない。<br>
この場合、テンプレートを強引にHTML化して処理後、querySelector.jsで必要な部分を抽出するか、grep等で不要な部分を削除する。


以下はコンソールで使用する際、nodeの起動時オプションで指定するパラメータ。

**Kind**: global function  
**Returns**: <code>void</code> - - 引数無しのパラメータはJSON文字列なので、コマンドライン上はシングルクォーテーションで囲む
- JSON文字列は長くなりがちなので、スイッチのないパラメータは全て結合した上で解釈する  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [d] | <code>string</code> | <code>&quot;&#x27;prototype.html&#x27;&quot;</code> | 入力ファイルのパス＋ファイル名 |
| i | <code>string</code> |  | 挿入先となるベースファイルのパス＋ファイル名 |
| o | <code>string</code> |  | 挿入後の結果を出力するファイルのパス＋ファイル名 |

**Example**  
```js
- [JSDOMを利用し、HTML + JavaScriptのプログラムをNode.jsで動作させる](https://symfoware.blog.fc2.com/blog-entry-2685.html)
```
