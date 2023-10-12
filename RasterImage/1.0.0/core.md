## Classes

<dl>
<dt><a href="#BasePage">BasePage</a></dt>
<dd><p>ページ表示を行うクラスのための基底クラス</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#BasePageMembers">BasePageMembers</a></dt>
<dd></dd>
<dt><a href="#CEDefObj">CEDefObj</a></dt>
<dd></dd>
</dl>

<a name="BasePage"></a>

## BasePage
ページ表示を行うクラスのための基底クラス

**Kind**: global class  

* [BasePage](#BasePage)
    * [new BasePage([def], [opt])](#new_BasePage_new)
    * [.deepcopy](#BasePage+deepcopy) ⇒ <code>null</code> \| <code>Error</code>
    * [.createElement](#BasePage+createElement) ⇒ <code>HTMLElement</code> \| <code>Error</code>
    * [.isObj](#BasePage+isObj) ⇒ <code>boolean</code>
    * [.isArr](#BasePage+isArr) ⇒ <code>boolean</code>
    * [.changeScreen](#BasePage+changeScreen) ⇒ <code>null</code> \| <code>Error</code>
    * [.sleep](#BasePage+sleep) ⇒ <code>void</code>

<a name="new_BasePage_new"></a>

### new BasePage([def], [opt])
**Returns**: <code>null</code> \| <code>Error</code> - ## 処理概要

1. オプション・既定値をメンバに設定
1. オプション(Object)の第一階層にメンバ"parent"が存在する場合、
   1. メンバ"parent"がHTMLElement型の場合、
      - this.parentにメンバ"parent"をそのまま登録
      - this.parentSelectorにnullを設定
   1. メンバ"parent"が文字列型の場合、
      - this.parentにdocument.querySelector(opt.parent)を登録
      - this.parentSelectorにメンバ"parent"を設定
   1. this.parent直下にthis.wrapperを作成<br>
      `div class="呼出元クラス名" name="wrapper"`
   1. this.wrapperに"act"クラスを追加、既定値表示の状態とする
1. オプション(Object)の第一階層にメンバ"css"が存在する場合、
   呼出元クラスで作成されたスタイルシートが存在しないなら新規作成する
1. オプション(Object)の第一階層にメンバ"html"が存在する場合、
   this.wrapper内に指定のHTML要素を生成

## 注意事項

1. 複数画面使用時、各画面はwrapper直下で定義し、メンバとして名前をつける<br>
   これにより画面切り替え(changeScreen)を行う

## 参考

- [ローディングアイコン集](https://projects.lukehaas.me/css-loaders/)
- [CSSで全画面オーバーレイを実装する方法＆コード例](https://pisuke-code.com/css-fullscreen-overlay/)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [def] | <code>Object</code> | <code>{}</code> | メンバの既定値(default) |
| [opt] | <code>Object</code> | <code>{}</code> | オプションとして与えられたオブジェクト |

<a name="BasePage+deepcopy"></a>

### basePage.deepcopy ⇒ <code>null</code> \| <code>Error</code>
劣後(dest)オブジェクトに優先(opt)のメンバを追加・上書きする

**Kind**: instance property of [<code>BasePage</code>](#BasePage)  
**Returns**: <code>null</code> \| <code>Error</code> - ## デシジョンテーブル

| 優先(a) | 劣後(b) | 結果 | 備考 |
| :--: | :--: | :--: | :-- |
|  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
|  A  |  B  |  A  | |
|  A  | [B] |  A  | |
|  A  | {B} |  A  | |
| [A] |  -  | [A] | |
| [A] |  B  | [A] | |
| [A] | [B] | [A+B] | 配列は置換ではなく結合。但し重複不可 |
| [A] | {B} | [A] | |
| {A} |  -  | {A} | |
| {A} |  B  | {A} | |
| {A} | [B] | {A} | |
| {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
|  -  |  -  |  -  | |
|  -  |  B  |  B  | |
|  -  | [B] | [B] | |
|  -  | {B} | {B} | |  

| Param | Type |
| --- | --- |
| dest | <code>Object</code> | 
| opt | <code>Object</code> | 

<a name="BasePage+createElement"></a>

### basePage.createElement ⇒ <code>HTMLElement</code> \| <code>Error</code>
HTMLElementを生成する

**Kind**: instance property of [<code>BasePage</code>](#BasePage)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arg | [<code>CEDefObj</code>](#CEDefObj) \| [<code>Array.&lt;CEDefObj&gt;</code>](#CEDefObj) |  | 生成するHTMLElementの定義 |
| [parent] | <code>HTMLElement</code> \| <code>string</code> | <code></code> | 本関数内部で親要素への追加まで行う場合に指定 |

<a name="BasePage+isObj"></a>

### basePage.isObj ⇒ <code>boolean</code>
引数がオブジェクトか判定

**Kind**: instance property of [<code>BasePage</code>](#BasePage)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>any</code> | 判定対象 |

<a name="BasePage+isArr"></a>

### basePage.isArr ⇒ <code>boolean</code>
引数が配列か判定

**Kind**: instance property of [<code>BasePage</code>](#BasePage)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>any</code> | 判定対象 |

<a name="BasePage+changeScreen"></a>

### basePage.changeScreen ⇒ <code>null</code> \| <code>Error</code>
表示する画面の切替

**Kind**: instance property of [<code>BasePage</code>](#BasePage)  

| Param | Type | Description |
| --- | --- | --- |
| screenName | <code>string</code> | 表示する画面のcreateElementで指定したnameの値 |

<a name="BasePage+sleep"></a>

### basePage.sleep ⇒ <code>void</code>
指定時間待機

**Kind**: instance property of [<code>BasePage</code>](#BasePage)  

| Param | Type | Description |
| --- | --- | --- |
| sec | <code>number</code> | 待機時間(ミリ秒) |

<a name="BasePageMembers"></a>

## BasePageMembers
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| className | <code>string</code> |  | 継承先クラス名。自動設定 |
| parent | <code>string</code> \| <code>HTMLElement</code> | <code>&quot;&#x27;body&#x27;&quot;</code> | ページ表示領域の親要素またはCSSセレクタ。  constructorでHTMLElementに自動的に変換される。 |
| parentSelector | <code>string</code> |  | ページ表示領域の親要素に対するCSSセレクタ。  parentがHTMLElementだった場合は空文字列('')が設定される。 |
| wrapper | <code>HTMLElement</code> |  | ページ表示領域 |
| wrapperSelector | <code>string</code> |  | ページ表示領域に対するCSSセレクタ |
| css | <code>string</code> \| <code>Array.&lt;string&gt;</code> |  | CSS定義。配列は途中にコメントを入れたい場合に使用 |
| html | <code>string</code> \| [<code>CEDefObj</code>](#CEDefObj) \| [<code>Array.&lt;CEDefObj&gt;</code>](#CEDefObj) |  | HTML定義。  文字列ならinnerHTMLそのもの、オブジェクトならcreateElementの引数と看做す |
| screenList | <code>Object.&lt;string, HTMLElement&gt;</code> |  | 複数画面を切り替える場合の画面名と要素 |
| home | <code>string</code> |  | ホーム画面名 |

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
| [name] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | クラスメンバにする場合、メンバ名となる文字列 |

