<a name="Tips"></a>

## Tips
Tipsの表示

**Kind**: global class  

* [Tips](#Tips)
    * [new Tips(api)](#new_Tips_new)
    * [.drawItem](#Tips+drawItem) ⇒ <code>null</code> \| <code>Error</code>
    * [.search](#Tips+search) ⇒ <code>null</code> \| <code>Error</code>
    * [.toggle](#Tips+toggle) ⇒ <code>void</code>
    * [.clear](#Tips+clear)
    * [.edit](#Tips+edit)
    * [.build()](#Tips+build) ⇒ <code>null</code> \| <code>Error</code>
    * [.drawList([list])](#Tips+drawList) ⇒ <code>null</code> \| <code>Error</code>

<a name="new_Tips_new"></a>

### new Tips(api)

| Param | Type | Description |
| --- | --- | --- |
| api | <code>string</code> | スプレッドシートのAPI |

<a name="Tips+drawItem"></a>

### tips.drawItem ⇒ <code>null</code> \| <code>Error</code>
選択されたtipを表示

**Kind**: instance property of [<code>Tips</code>](#Tips)  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>PointerEvent</code> \| <code>Object</code> | 選択されたtip |

<a name="Tips+search"></a>

### tips.search ⇒ <code>null</code> \| <code>Error</code>
キーワード検索
表題またはタグの一部にキーワードがあればヒットと判定。

**Kind**: instance property of [<code>Tips</code>](#Tips)  

| Type |
| --- |
| <code>void</code> | 

<a name="Tips+toggle"></a>

### tips.toggle ⇒ <code>void</code>
一覧画面・個別tip表示画面の切替

**Kind**: instance property of [<code>Tips</code>](#Tips)  

| Type |
| --- |
| <code>void</code> | 

<a name="Tips+clear"></a>

### tips.clear
入力欄をクリア

**Kind**: instance property of [<code>Tips</code>](#Tips)  
<a name="Tips+edit"></a>

### tips.edit
tipsを格納しているスプレッドシートを表示

**Kind**: instance property of [<code>Tips</code>](#Tips)  
<a name="Tips+build"></a>

### tips.build() ⇒ <code>null</code> \| <code>Error</code>
スプレッドシートからデータを取得、メンバに格納

**Kind**: instance method of [<code>Tips</code>](#Tips)  

| Param | Type |
| --- | --- |
|  | <code>void</code> | 

<a name="Tips+drawList"></a>

### tips.drawList([list]) ⇒ <code>null</code> \| <code>Error</code>
tips一覧表示

**Kind**: instance method of [<code>Tips</code>](#Tips)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [list] | <code>Object</code> | <code></code> | 一覧表示するTipsデータ |

