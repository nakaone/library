## Classes

<dl>
<dt><a href="#webScanner">webScanner</a></dt>
<dd><p>指定セレクタ以下にcanvas他の必要な要素を作成し、QRコードや文書をスキャン</p>
<p><strong>残課題</strong></p>
<ol>
<li>scanDoc稼働未確認</li>
</ol>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#webScannerOpt">webScannerOpt</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="webScanner"></a>

## webScanner
指定セレクタ以下にcanvas他の必要な要素を作成し、QRコードや文書をスキャン

**残課題**

1. scanDoc稼働未確認

**Kind**: global class  

* [webScanner](#webScanner)
    * [new webScanner(parent, [opt])](#new_webScanner_new)
    * [.scanQR(callback, [opt])](#webScanner+scanQR) ⇒ <code>void</code>
    * [.scanDoc(callback, opt)](#webScanner+scanDoc) ⇒ <code>void</code>

<a name="new_webScanner_new"></a>

### new webScanner(parent, [opt])
指定セレクタ以下にcanvas他の必要な要素を作成してスキャン実行、指定の後続処理を呼び出す。

- [jsQRであっさりQRコードリーダ/メーカ](https://zenn.dev/sdkfz181tiger/articles/096dfb74d485db)
- [PCにおける内蔵/webカメラの切り替え](webScanner.html#switchCamera)

**Returns**: <code>void</code> - なし  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| parent | <code>string</code> \| <code>HTMLElement</code> |  | 親要素(ラッパー)。文字列ならCSSセレクタと解釈 |
| [opt] | [<code>webScannerOpt</code>](#webScannerOpt) | <code>{}</code> | オプション |

**Example**  
```
<div class="webScanner"></div>
〜
const ws = new webScanner('.webScanner');
ws.scanQR();   // QRコードの読み込み
ws.scanDoc();  // 文書の撮影
```
<a name="webScanner+scanQR"></a>

### webScanner.scanQR(callback, [opt]) ⇒ <code>void</code>
scanQR: QRコードスキャン

**Kind**: instance method of [<code>webScanner</code>](#webScanner)  
**Returns**: <code>void</code> - なし
callbackにはQRコードの文字列が渡される。  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>function</code> |  | 後続処理 |
| [opt] | <code>object</code> | <code>{}</code> | オプション |
| [opt.RegExp] | <code>RegExp</code> | <code>/.+/</code> | スキャン結果が適切か判断 |
| [opt.alert] | <code>boolean</code> | <code>false</code> | true:読み込み完了時に内容をalert表示 |

<a name="webScanner+scanDoc"></a>

### webScanner.scanDoc(callback, opt) ⇒ <code>void</code>
scanDoc: 文書のスキャン

**Kind**: instance method of [<code>webScanner</code>](#webScanner)  
**Returns**: <code>void</code> - 無し
callbackにはbase64化したpng(文字列)が渡される。  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | 後続処理 |
| opt | <code>object</code> | オプション指定 |
| opt.maxImageSize | <code>number</code> | 画像をbase64化した後の最大文字長。既定値500K |

<a name="webScannerOpt"></a>

## webScannerOpt : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| interval | <code>number</code> | 動画状態で撮像、読み込めなかった場合の間隔。ミリ秒 |
| RegExp | <code>object</code> | QRコードスキャン時、内容が適切か判断 |
| lifeTime | <code>number</code> | 一定時間操作がない場合の停止までのミリ秒。既定値60000 |
| alert | <code>boolean</code> | 読み込み完了時に内容をalert表示するか |

