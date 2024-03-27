## Classes

<dl>
<dt><a href="#Auth">Auth</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#AuthProp">AuthProp</a> : <code>Object</code></dt>
<dd><p>AuthOpt以外のAuthクラスプロパティ</p>
</dd>
<dt><a href="#AuthOpt">AuthOpt</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Auth"></a>

## Auth
**Kind**: global class  

* [Auth](#Auth)
    * [new Auth(parent, [opt])](#new_Auth_new)
    * [.toggle](#Auth+toggle) ⇒ <code>void</code>
    * [.open](#Auth+open)
    * [.close](#Auth+close)
    * [.template](#Auth+template) ⇒ <code>null</code> \| <code>Error</code>

<a name="new_Auth_new"></a>

### new Auth(parent, [opt])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| parent | <code>HTMLElement</code> \| <code>string</code> |  | 親要素またはそのCSSセレクタ |
| [opt] | <code>Object</code> | <code>{}</code> | オプション |

<a name="Auth+toggle"></a>

### auth.toggle ⇒ <code>void</code>
表示/非表示ボタンクリック時の処理を定義

**Kind**: instance property of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>PointerEvent</code> \| <code>string</code> | クリック時のイベントまたはボタンのCSSセレクタ |
| show | <code>boolean</code> | trueなら開く |

<a name="Auth+open"></a>

### auth.open
親要素内を表示

**Kind**: instance property of [<code>Auth</code>](#Auth)  
<a name="Auth+close"></a>

### auth.close
親要素内を隠蔽

**Kind**: instance property of [<code>Auth</code>](#Auth)  
<a name="Auth+template"></a>

### auth.template ⇒ <code>null</code> \| <code>Error</code>
**Kind**: instance property of [<code>Auth</code>](#Auth)  
<a name="AuthProp"></a>

## AuthProp : <code>Object</code>
AuthOpt以外のAuthクラスプロパティ

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| constructorStart | <code>number</code> | constructor開始時刻(UNIX時間) |
| parentSelector | <code>string</code> | 親画面のCSSセレクタ |
| parentWindow | <code>HTMLElement</code> | 親画面のHTML要素 |
| AuthWindow | <code>HTMLElement</code> | Auth関係画面のwrapper |
| loading | <code>HTMLElement</code> | ローディング画面のHTML要素 |

<a name="AuthOpt"></a>

## AuthOpt : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [entryNo] | <code>string</code> |  | 受付番号(ID) |
| [passWord] | <code>string</code> |  | パスワード |
| [header] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 受付番号入力画面に表示するheaderのinnerHTML |
| [entryNoMessage] | <code>string</code> | <code>&quot;&#x27;受付番号を入力してください&#x27;&quot;</code> | 受付番号入力画面に表示するメッセージ |
| [entryNoButton] | <code>string</code> | <code>&quot;&#x27;送信&#x27;&quot;</code> | 受付番号入力画面のボタンのラベル |
| [entryNoRegExp] | <code>RegExp</code> | <code>/^[0-9]{1,4}$/</code> | 受付番号チェック用正規表現 |

