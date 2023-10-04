# class BurgerMenu

## 用語解説

- ブランチ：下位の表示画面を持つ要素。下位画面のラッパーとしてのみ機能し、自らの表示画面は持てない。
- リーフ：自分自身の表示画面のみ持ち、下位画面を持たない要素。
- 遷移指定(href)：ナビで選択することで、指定サイトの表示を行う。画面は指定時の画面のまま、変化しない。
- 指定関数：ナビで選択することで、指定サイトの表示を行った上で指定された関数を実行する。

## 全体の構成

1. 表示部は&lt;div data-BurgerMenu&gt;の階層内で定義する。<br>
   階層外の要素はメニューで選択しても表示されない。

2. 下位の階層を持つ場合、自分自身の表示内容は持たせない(以下はNG)
   ```
   <div data-BurgerMenu="label:'お知らせ'">
   !!NG!! <p>お知らせのページです</p>
     <div data-BurgerMenu="label:'掲示板'">〜</div>
     <div data-BurgerMenu="label:'注意事項'">〜</div>
   </div>
   ```
   「お知らせ」は「掲示板」「注意事項」のブランチとして扱われるので、「&lt;p&gt;お知らせのページです&lt;/p&gt;」というお知らせページ自身の表示内容は定義不可。

## data-BurgerMenu属性の書き方

オブジェクトの記述に準ずる。但し短縮するため前後の"{","}"は省略する。

- {string} label - メニュー化する時の名称
- {string} [func] - メニュー選択時に実行する関数名。<br>
  関数名と実際の関数はBurgerMenuインスタンス生成時に定義。
- {string} [href] - 遷移先のURL。別タブが開かれる。
- {number} [authority] - 表示権限。<br>
  BurgerMenuインスタンス生成時のauthorityとの論理積>0なら表示する。<br>
  ex: 一般参加者1、スタッフ2として<br>
      data-BurgerMenu="authrotiry:2"とされた要素は、<br>
      new BurgerMenu({authority:1})の一般参加者は非表示、<br>
      new BurgerMenu({authority:2})のスタッフは表示となる。

## 処理の流れ

HTMLソース(≒body内部)を基に、BurgerMenu.#genNaviでソースの修正とナビゲーションの生成を行う


### サンプル

```
<body>
  <div data-BurgerMenu="label:'スタッフ'">
    <div data-BurgerMenu="label:'受付業務',func:'recept'"></div>
    <div data-BurgerMenu="label:'校内探険'">
        <img src="expedition.png" width="600px" />
    </div>
  </div>
  <div data-BurgerMenu="label:'Tips',href:'https://〜/tips.html'"></div>
</body>
```

### ソースの修正部分

- data-BurgerMenu属性を持つ要素にIDとなるclass属性を付与

```
<body>
  <div class="c1001" data-BurgerMenu="label:'スタッフ',authority:2">
    <div class="c1002" data-BurgerMenu="label:'受付業務',func:'recept'"></div>
    <div class="c1003" data-BurgerMenu="label:'校内探険'">
        <img src="expedition.png" width="600px" />
    </div>
  </div>
  <div class="c1004" data-BurgerMenu="label:'Tips',href:'https://〜/tips.html'"></div>
</body>
```

### 生成されるナビゲーション

- 通常の画面(校内探検)<br>
  ソースに付与されたIDに対応する文字列をname属性として持ち、
  クリックすると`<div class="(name属性の値)">`を持つ要素(該当画面)を開くイベントを付与
- func指定があった場合(受付業務)<br>
  name属性として「ID＋実行する関数名」を持ち、
  クリックすると該当画面を開き、指定された関数を実行するイベントを付与
- href指定があった場合(Tips)<br>
  href属性を持ち、クリックすると遷移先画面を開くイベントを付与

```
<nav>
  <ul>
    <li name="c1001">スタッフ
      <ul>
        <li><a name="c1002\trecept">受付業務</a></li>
        <li><a name="c1003">校内探検</a></li>
      </ul>
    </li>
    <li><a name="c1004" href="https://〜/tips.html">Tips</a></li>
  </ul>
</nav>
```

### data-BurgerMenu属性内「func」と関数の対応

BurgerMenuのインスタンス生成時、オプションで指定する

`func:{aaa:bbb}`：aaaはdata-BurgerMenu属性内で指定した関数名、bbbは実行する関数オブジェクトのラベル。

```
<script type="text/javascript">
v.BurgerMenu = new BurgerMenu('body',{
  authority: v.Auth.info.authority,
  home: 'c1005',  // パスポート画面をホームに設定(暫定)
  func: {recept:v.Reception.main},
});
</script>
```