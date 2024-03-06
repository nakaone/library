<a name="BurgerMenu"></a>

## BurgerMenu
階層化された要素に基づきハンバーガーメニューを作成

**Kind**: global class  

* [BurgerMenu](#BurgerMenu)
    * [new BurgerMenu(parent, [opt])](#new_BurgerMenu_new)
    * [.change](#BurgerMenu+change) ⇒ <code>null</code> \| <code>Error</code>
    * [.dispatch](#BurgerMenu+dispatch)
    * [.toggle](#BurgerMenu+toggle) ⇒ <code>void</code>
    * [.showChildren](#BurgerMenu+showChildren)

<a name="new_BurgerMenu_new"></a>

### new BurgerMenu(parent, [opt])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| parent | <code>string</code> \| <code>HTMLElement</code> |  | 親要素(wrapper)またはそのCSSセレクタ |
| [opt] | <code>Object</code> | <code>{}</code> | オプション |

<a name="BurgerMenu+change"></a>

### burgerMenu.change ⇒ <code>null</code> \| <code>Error</code>
表示画面の変更

**Kind**: instance property of [<code>BurgerMenu</code>](#BurgerMenu)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> \| <code>PointerEvent</code> | クリックされたナビゲーションアイテムのイベント またはclassで定義された表示領域のID |

<a name="BurgerMenu+dispatch"></a>

### burgerMenu.dispatch
選択された関数の実行

**Kind**: instance property of [<code>BurgerMenu</code>](#BurgerMenu)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>PointerEvent</code> | ナビ領域で発生したイベントオブジェクト |

<a name="BurgerMenu+toggle"></a>

### burgerMenu.toggle ⇒ <code>void</code>
ナビゲーション領域の表示/非表示切り替え

**Kind**: instance property of [<code>BurgerMenu</code>](#BurgerMenu)  

| Type |
| --- |
| <code>void</code> | 

<a name="BurgerMenu+showChildren"></a>

### burgerMenu.showChildren
ブランチの下位階層メニュー表示/非表示切り替え

**Kind**: instance property of [<code>BurgerMenu</code>](#BurgerMenu)  
