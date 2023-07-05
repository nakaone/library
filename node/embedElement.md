## Functions

<dl>
<dt><a href="#embedElement">embedElement(doc)</a> ⇒ <code>HTMLElement</code></dt>
<dd><p>編集対象となるHTMLに含まれる&#39;data-embed&#39;属性に基づき、他文書から該当箇所を挿入する</p>
</dd>
<dt><a href="#onNode">onNode([d], i, o)</a> ⇒ <code>void</code></dt>
<dd><p>コンソール(Node.js)でembedElementを実行</p>
<p>以下はnodeの起動時オプションで指定するパラメータ。</p>
</dd>
</dl>

<a name="embedElement"></a>

## embedElement(doc) ⇒ <code>HTMLElement</code>
編集対象となるHTMLに含まれる'data-embed'属性に基づき、他文書から該当箇所を挿入する

**Kind**: global function  
**Returns**: <code>HTMLElement</code> - 挿入済みのHTML文書(但、doctype,htmlタグは含まない)  

| Param | Type | Description |
| --- | --- | --- |
| doc | <code>Document</code> | 編集対象となるDocumentオブジェクト |

<a name="onNode"></a>

## onNode([d], i, o) ⇒ <code>void</code>
コンソール(Node.js)でembedElementを実行

以下はnodeの起動時オプションで指定するパラメータ。

**Kind**: global function  
**Returns**: <code>void</code> - - 引数無しのパラメータはJSON文字列なので、コマンドライン上はシングルクォーテーションで囲む
- JSON文字列は長くなりがちなので、スイッチのないパラメータは全て結合した上で解釈する  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [d] | <code>string</code> | <code>&quot;&#x27;prototype.html&#x27;&quot;</code> | 入力ファイルのパス＋ファイル名 |
| i | <code>string</code> |  | 挿入先となるベースファイルのパス＋ファイル名 |
| o | <code>string</code> |  | 挿入後の結果を出力するファイルのパス＋ファイル名 |

**Example**  
**起動コマンド**

```
node embedElement.js -i:base.html -o:webScanner.html
```

**挿入先となるベースファイル**

```
<!DOCTYPE html><html xml:lang="ja" lang="ja">
<head>
  <title>webScanner</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <!-- 外部参照はbaseに直接転記 -->
  <link rel="stylesheet" href="/Users/ena.kaon/Desktop/GitHub/library/CSS/szDefault.css" />
  <meta data-embed='/Users/ena.kaon/Desktop/GitHub/library/JavaScript/'>
  <style data-embed='{"src":"webScanner.html","sel":".webApp"}'></style>
</head>
<body>
  <div data-embed='{"src":"webScanner.html","sel":".webScanner"}'></div>

  <!-- 外部参照はbaseに直接転記 -->
  <script src="jsLib.js"></script>
  <!-- QRコード検出 -->
  <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
  <script data-embed='{"src":"webScanner.html","sel":".core"}'></script>
</body></html>
```

- data-embedの属性値はJSON化するため、メンバ名・値は`"`で・全体を`'`で囲む
- `<meta data-embed='〜'>`は以降のdata-embed内でのファイル指定の基点となるパスを指定
- metaタグ以外のdata-embedは`{src:参照先ファイル名,sel:挿入元要素のCSSセレクタ}`で指定

**挿入後の出力ファイル**

```
<!DOCTYPE html><html xml:lang="ja" lang="ja"><head>
  <title>webScanner</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <!-- 外部参照はbaseに直接転記 -->
  <link rel="stylesheet" href="/Users/ena.kaon/Desktop/GitHub/library/CSS/szDefault.css">
  <!-- meta data-embed: 以降のdata-embed内でのファイル指定の基点となるパス -->
  <meta data-embed="/Users/ena.kaon/Desktop/GitHub/library/JavaScript/">
  <style>  // 挿入された部分
    .webScanner div {
    (中略)
  </style>
</head>
<body>
  <div><div class="webApp webScanner">　  // 挿入された部分
    <h1>class webScanner test</h1>
    <p>実運用時には script src の読み込み先を修正する</p>
    <div class="scanner"></div>
    <img src="" style="border:solid 5px red">
  </div></div>

  <!-- 外部参照はbaseに直接転記 -->
  <script src="jsLib.js"></script>
  <!-- QRコード検出 -->
  <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
  <script>  // 挿入された部分
/&#042;&#042;
 &#042; @classdesc 指定セレクタ以下にcanvas他の必要な要素を作成し、QRコードや文書をスキャン
 &#042;/

class webScanner {
  (中略)
}
</script>
</body></html>
``` 

- [JSDOMを利用し、HTML + JavaScriptのプログラムをNode.jsで動作させる](https://symfoware.blog.fc2.com/blog-entry-2685.html)
