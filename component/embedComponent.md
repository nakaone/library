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

```
// SVG：embed指定要素の子要素としてSVG追加
<div name="案内図"><div class="img" data-embed="map2023.svg"></div></div>
-> <div name="案内図"><div class="img"><svg id="exportSVG"〜

// PlantUML：指定要素の子要素として、隠蔽された要素を追加。兄弟にIMG要素が必要
<div name="日程表"><div class="PlantUML"  data-embed="schedule.pu"><img /></div></div>
-> <div name="日程表"><div class="PlantUML"><img><div style="display:none">@startgantt〜

// PNG：自要素(IMG)のsrc属性の値としてbase64文字列を追加
<div name="校内探検"><img width="600px" data-embed='{"from":{"filename":"expedition.txt"},"to":"png"}' /></div>
-> <div name="校内探検"><img width="600px" src="data:image/png;base64,iVBORw0KG〜

// MarkDown：自要素のinnerTextとして追加
<div class="markdown" name="6/10定例会" data-embed="20230610.md"></div>
-> <div class="markdown" name="6/10定例会">1. 日程：9/23〜24 or **9/30〜10/01**(第一候補)

// 自作ライブラリ(通常関数)
<script type="text/javascript" data-embed='{"from":{"filename":"../../component/mergeDeeply.html","selector":"script.core"},"to":"js"}'><／script>

// 既存クラスの拡張
<script type="text/javascript" data-embed='{"from":{"filename":"../../component/Array.tabulize.html","selector":"script.core"},"to":"js"}'><／script>

// CSS指定付きのクラス(style,script両方を指定)
<style type="text/css" data-embed='{"from":{"filename":"../../component/TimeTable.html","selector":"style.core"},"to":"css"}'></style>
<script type="text/javascript" data-embed='{"from":{"filename":"../../component/TimeTable.html","selector":"script.core"},"to":"js"}'><／script>
```

**data-embedに指定する文字列**

```
data-embed="ファイル名"  // 文字列だった場合はfrom.filename(ファイル全文)と解釈。拡張子でtoを指定
or
data-embed='{  // JSON形式だった場合、囲み記号はシングルクォーテーション
  "from": {    // メンバ名・値ともダブルクォーテーションで囲む
    "filename": "{string}" - 参照先のファイル名
    "selector": "{string}" - CSSセレクタ文字列。省略時はファイル全文と解釈
  },
  "to": "{string}" - 出力先に対する指定
     replace:自要素を中身で代替(embed要素は削除)
     svg: SVG画像(embed要素の子要素として追加)
     js: JavaScript(同上)
     css: CSS(同上)
     md: MarkDown(同上)
     mmd: Mermaid(同上)
     txt: その他形式のテキスト(同上)
     pu: PlantUMLのソースとしてIMGタグのsrc属性の値として設定
     その他: embed要素のその他属性の値として設定
}'
```
