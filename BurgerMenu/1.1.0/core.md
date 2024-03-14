
**Kind**: global class  
<a name="new_BurgerMenu_new"></a>

### new BurgerMenu(arg)

| Param | Type |
| --- | --- |
| arg | <code>Object</code> | 

**Example**  
### htmlの設定

- wrapperに`class="BurgerMenu screen" name="wrapper"`を設定
- メニュー化する領域(divタグ)に`data-BurgerMenu`属性を追加(設定値は後掲)

```
<p class="title">BurgerMenu Test</p>
<div class="BurgerMenu screen" name="wrapper">
  <div data-BurgerMenu="id:'c11',label:'掲示板'">掲示板</div>
  <div data-BurgerMenu="id:'c21',label:'入会申込'">入会申込</div>
  <div data-BurgerMenu="id:'c30',label:'イベント情報'">
    <div data-BurgerMenu="id:'c31',label:'会場案内図'">会場案内図</div>
    <div data-BurgerMenu="id:'c32',label:'タイムテーブル'">タイムテーブル</div>
  </div>
  <div data-BurgerMenu="id:'c40',label:'その他'">
    <div data-BurgerMenu="id:'c41',label:'リンクテスト',href:'https://developer.mozilla.org/ja/'">hoge</div>
    <div data-BurgerMenu="id:'c42',label:'funcテスト',func:'test'">funcテスト</div>
  </div>
</div>
```

### scriptの設定

- インスタンス生成時の引数については次項参照

```
v.menu = new BurgerMenu({func:{test:(e)=>{alert('hoge');changeScreen('c42');}}});
if( v.menu instanceof Error ) throw v.menu;
```

### BurgerMenuメンバ一覧

以下はthisとして「constructorのv.default < constructorの引数 < listViewの引数」の順で有効となる。

1. 「**太字**」はインスタンス生成時、必須指定項目
1. 「【*内部*】」は指定不要の項目(constructor他で自動的に設定されるメンバ)
1. その他はconstructorの引数で指定可、指定が無い項目は既定値をセット

- className {string} 【*内部*】'BurgerMenu'固定。ログ出力時に使用
- wrapper='.BurgerMenu.screen[name="wrapper"]' {string|HTMLElement} 作成対象のdata-BurgerMenuを全て含む親要素。CSSセレクタかHTMLElementで指定。
- auth=1 {number} 利用者の閲覧権限。メニューのauth(data-BurgerMenu:{auth:x})とのビット積=0なら当該メニューは作成しない
- func {Object.<string,Function>} メニューから実行する関数を集めたライブラリ
- home {string} ホーム画面として使用するメニューの識別子。無指定の場合、wrapper直下でdata-BurgerMenu属性を持つ最初の要素
- initialSubMenu=true {boolean} サブメニューの初期状態。true:開いた状態、false:閉じた状態
- css {string} BurgerMenu専用CSS
- toggle {Arrow} 【*内部*】ナビゲーション領域の表示/非表示切り替え
- showChildren {Arrow} 【*内部*】ブランチの下位階層メニュー表示/非表示切り替え

### data-BurgerMenu属性に設定する文字列

- id {string} メニュー毎に作成する識別子
- label {string} nav領域に表示するメニューの名称
- func {string} constructorの引数で渡されたfuncオブジェクトのメンバ名。
- href {string} 遷移先ページのURL。
- auth=1 {number} メニューの使用権限。以下例ではシステム管理者は両方表示されるが、一般ユーザにはシステム設定は表示されない
  ```
  <div data-BurgerMenu="auth:1">利用案内</div>
  <div data-BurgerMenu="auth:8">システム設定</div>
  (中略)
  <script>
    const authority = new Auth(...);  // 利用権限を取得。一般ユーザ:1, 管理者:15
    const menu = new BurgerMenu({auth:authority.level}); // レベルを渡してメニュー生成
  ```

注意事項

- func, hrefは排他。両方指定された場合はfuncを優先する
- func, href共に指定されなかった場合、SPAの画面切替指示と見なし、idの画面に切り替える
- href指定の場合、タグ内の文字列は無視される(下例2行目の「テスト」)
  ```
  <div data-BurgerMenu="id:'c41',label:'これはOK',href:'https://〜'"></div>
  <div data-BurgerMenu="id:'c41',label:'これはNG',href:'https://〜'">テスト</div>
  ```
