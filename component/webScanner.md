<a name="webScanner"></a>

## webScanner
指定セレクタ以下にcanvas他の必要な要素を作成し、QRコードや文書をスキャン

**Kind**: global class  

* [webScanner](#webScanner)
    * [new webScanner(arg)](#new_webScanner_new)
    * [.start()](#webScanner+start) ⇒ <code>void</code>
    * [.stop()](#webScanner+stop) ⇒ <code>void</code>
    * [.onGoing(arg)](#webScanner+onGoing) ⇒ <code>boolean</code>
    * [.scanDoc(callback, opt)](#webScanner+scanDoc) ⇒ <code>void</code>
    * [.scanQR(callback, opt)](#webScanner+scanQR) ⇒ <code>void</code>
    * [.drawFinder()](#webScanner+drawFinder) ⇒ <code>void</code>
    * [.drawFrame(img)](#webScanner+drawFrame) ⇒ <code>void</code>
    * [.drawRect(location)](#webScanner+drawRect) ⇒ <code>void</code>
    * [.drawLine(begin, end)](#webScanner+drawLine) ⇒ <code>void</code>

<a name="new_webScanner_new"></a>

### new webScanner(arg)
指定セレクタ以下にcanvas他の必要な要素を作成してスキャン実行、指定の後続処理を呼び出す。

参考：[jsQRであっさりQRコードリーダ/メーカ](https://zenn.dev/sdkfz181tiger/articles/096dfb74d485db)

**Returns**: <code>void</code> - なし  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>object</code> \| <code>HTMLElement</code> | HTMLElementなら親要素のみ指定と解釈 |
| arg.parent | <code>object</code> | 親要素(DOM object) |
| arg.interval | <code>number</code> | 動画状態で撮像、読み込めなかった場合の間隔。ミリ秒 |
| arg.RegExp | <code>object</code> | QRコードスキャン時、内容が適切か判断 |
| arg.lifeTime | <code>number</code> | 一定時間操作がない場合の停止までのミリ秒。既定値60000 |
| arg.alert | <code>boolean</code> | 読み込み完了時に内容をalert表示するか |

<a name="webScanner+start"></a>

### webScanner.start() ⇒ <code>void</code>
start: カメラを起動する(private関数)

**Kind**: instance method of [<code>webScanner</code>](#webScanner)  
**Returns**: <code>void</code> - なし  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>void</code> | なし |

<a name="webScanner+stop"></a>

### webScanner.stop() ⇒ <code>void</code>
stop: カメラを停止する(private関数)

**Kind**: instance method of [<code>webScanner</code>](#webScanner)  
**Returns**: <code>void</code> - なし  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>void</code> | なし |

<a name="webScanner+onGoing"></a>

### webScanner.onGoing(arg) ⇒ <code>boolean</code>
onGoing: カメラの起動・停止の制御と状態参照

**Kind**: instance method of [<code>webScanner</code>](#webScanner)  
**Returns**: <code>boolean</code> - true:起動中、false:停止中  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>boolean</code> | true:起動、false:停止、undefind:状態参照 |

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

<a name="webScanner+scanQR"></a>

### webScanner.scanQR(callback, opt) ⇒ <code>void</code>
scanQR: QRコードスキャン

**Kind**: instance method of [<code>webScanner</code>](#webScanner)  
**Returns**: <code>void</code> - なし
callbackにはQRコードの文字列が渡される。  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | 後続処理 |
| opt | <code>object</code> | オプション |
| opt.RegExp | <code>object</code> | スキャン結果が適切か判断。RegExpオブジェクト |
| opt.alert | <code>boolean</code> | true:読み込み完了時に内容をalert表示 |

<a name="webScanner+drawFinder"></a>

### webScanner.drawFinder() ⇒ <code>void</code>
drawFinder: 動画をキャンバスに描画する

**Kind**: instance method of [<code>webScanner</code>](#webScanner)  
**Returns**: <code>void</code> - 無し
1フレーム読み込むごとにthis.scannedに読み込んだイメージを渡す。  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>void</code> | 無し |

<a name="webScanner+drawFrame"></a>

### webScanner.drawFrame(img) ⇒ <code>void</code>
drawFrame: 動画の1フレームからQRコードを抽出、後続処理に渡す

**Kind**: instance method of [<code>webScanner</code>](#webScanner)  
**Returns**: <code>void</code> - なし  

| Param | Type | Description |
| --- | --- | --- |
| img | <code>object</code> | 読み込んだ画像 |

<a name="webScanner+drawRect"></a>

### webScanner.drawRect(location) ⇒ <code>void</code>
drawRect: ファインダ上のQRコードに枠を表示

**Kind**: instance method of [<code>webScanner</code>](#webScanner)  
**Returns**: <code>void</code> - なし  

| Param | Type | Description |
| --- | --- | --- |
| location | <code>object</code> | QRコード位置情報 |

<a name="webScanner+drawLine"></a>

### webScanner.drawLine(begin, end) ⇒ <code>void</code>
drawLine: ファインダ上に線を描画

**Kind**: instance method of [<code>webScanner</code>](#webScanner)  
**Returns**: <code>void</code> - なし  

| Param | Type | Description |
| --- | --- | --- |
| begin | <code>object</code> | 始点の位置 |
| end | <code>object</code> | 終点の位置 |

