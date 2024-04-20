<style>
/*::$lib/CSS/1.3.0/core.css::*/
</style>
<p class="title">class authMenu</p>

# 機能概要

htmlからdata-menu属性を持つ要素を抽出、ハンバーガーメニューを作成する。

またHTML上のメニュー(SPAの機能)毎に許容権限を設定し、ユーザ毎に認証することで、表示制御を可能にする。

<!--::$doc/overview.svg::-->

# 使用方法

## body内部の設定

- 表示部は&lt;div data-menu&gt;の階層内で定義する。<br>
  階層外の要素はメニューで選択しても表示されない。
- data-menu属性を持つ要素にIDとなるclass属性を付与

```
<body>
  <p class="title">校庭キャンプ2024</p>
  <div class="BurgerMenu screen" name="wrapper">
    <div data-menu="id:'イベント情報'">
      <div data-menu="id:'掲示板',func:'dispBoard'"></div>
      <div data-menu="id:'実施要領'">
        <!--：：$tmp/実施要領.html：：--> ※ embedRecursivelyのプレースホルダは一行で記述
      </div>
    </div>
  </div>
(中略)
```

下位の階層を持つ場合、自分自身の表示内容は持たせない(以下はNG)

```
<div data-menu="id:'お知らせ'">
!!NG!! <p>お知らせのページです</p>
  <div data-menu="id:'掲示板'">〜</div>
  <div data-menu="id:'注意事項'">〜</div>
</div>
```

「お知らせ」は「掲示板」「注意事項」のブランチとして扱われるので、「&lt;p&gt;お知らせのページです&lt;/p&gt;」というお知らせページ自身の表示内容は定義不可。

### data-menu属性に設定する文字列

タグのallowとその人の権限(auth)の論理積>0ならメニューを表示する。

オブジェクトの記述に準ずる。但し短縮するため前後の"{","}"は省略する。

- {string} id - 【必須】メニューID
- {string} [label] - メニュー化する時の名称。省略時はidを使用
- {string} [func] - メニュー選択時に実行する関数名。<br>
  関数名と実際の関数はBurgerMenuインスタンス生成時に定義。
- {string} [href] - 遷移先のURL。別タブが開かれる。
- {number} [allow=2^32-1] - 開示範囲。<br>
  BurgerMenuインスタンス生成時のユーザ権限(auth)との論理積>0なら表示する。
  > ex: 一般参加者1、スタッフ2として
  >     data-menu="allow:2"とされた要素は、
  >     new BurgerMenu({auth:1})の一般参加者は非表示、
  >     new BurgerMenu({auth:2})のスタッフは表示となる。
- {string} [from='1970/1/1'] - メニュー有効期間の開始日時。Dateオブジェクトで処理可能な日時文字列で指定
- {string} [to='9999/12/31'] - メニュー有効期間の終了日時

注意事項

- func, hrefは排他。両方指定された場合はfuncを優先する
- func, href共に指定されなかった場合、SPAの画面切替指示と見なし、idの画面に切り替える
- href指定の場合、タグ内の文字列は無視される(下例2行目の「テスト」)
  ```
  <div data-menu="id:'c41',label:'これはOK',href:'https://〜'"></div>
  <div data-menu="id:'c41',label:'これはNG',href:'https://〜'">テスト</div>
  ```
- 以下例ではシステム管理者(auth=8)は両方表示されるが、一般ユーザ(auth=1)にはシステム設定は表示されない
  ```
  <div data-menu="allow:9">利用案内</div>
  <div data-menu="allow:8">システム設定</div>
  (中略)
  <script>
    const auth = new Auth(...);  // 利用権限を取得。一般ユーザ:1, 管理者:8
    const menu = new BurgerMenu();
  ```
- ユーザ権限は一般公開部分は`auth=1`とし、auth=0は使用しない(∵0⇒誰も見えない)。以降**権限が大きくなるにつれて大きな数字を使用**する
- 申込フォームのように申込期限がある場合、同一IDで下の例のように設定する。
  ```
  <!-- 申込開始前 〜2024/03/31 -->
  <div data-menu="id:'entryForm',to:'2024/04/01 00:00:00'">
    「まだお申し込みいただけません」
  </div>

  <!-- 申込期間内 2024/04/01〜07 -->
  <div data-menu="id:'entryForm',from:'2024/04/01',to:'2024/04/08 00:00:00'">
    申込フォーム
  </div>

  <!-- 申込終了後 2024/04/08〜 -->
  <div data-menu="id:'entryForm',from:'2024/04/08'">
    「申込は終了しました」
  </div>
  ```
- メニュー生成時点で有効期限を判断、同一IDが複数存在する場合はいずれか一つのDIVのみ残して残りを削除してメニューを生成する。

## script部の設定

### scriptサンプル

```
window.addEventListener('DOMContentLoaded',() => {
  const v = {whois:'DOMContentLoaded',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // userId,authをセット
    v.config = storeUserInfo();
    if( v.r instanceof Error ) throw v.r;

    v.step = 2.1; // 使用するクラスのインスタンス化
    v.auth = new authClient();
    v.step = 2.2;
    v.menu = new authMenu({func:{
      enterId:()=>{
        console.log('enterId start.');
        const v = window.prompt('受付番号を入力してください');
        if( v.match(/^[0-9]+/) ){
          v.r = storeUserInfo(v);
          if( v.r instanceof Error ) throw v.r;
          //this.auth = 2; -> thisはwindowになる
          console.log(this);
          //this.genNavi(2); -> thisはwindowになる
        }
      }
    }});

    v.step = 99; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;
  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    alert(e.message);
  }
});
```

### インスタンス生成時の引数

インスタンス生成時の引数はそのまま**authMenuメンバ**となる。

以下はthisとして「constructorのv.default < constructorの引数 < listViewの引数」の順で有効となる。

1. 「**太字**」はインスタンス生成時、必須指定項目
1. 「【*内部*】」は指定不要の項目(constructor他で自動的に設定されるメンバ)
1. その他はconstructorの引数で指定可、指定が無い項目は既定値をセット

- wrapper='.authMenu.screen[name="wrapper"]' {string|HTMLElement} 作成対象のdata-menuを全て含む親要素。CSSセレクタかHTMLElementで指定。
- func {Object.<string,Function>} メニューから実行する関数を集めたライブラリ
- home {string} ホーム画面として使用するメニューの識別子。無指定の場合、wrapper直下でdata-menu属性を持つ最初の要素
- initialSubMenu=true {boolean} サブメニューの初期状態。true:開いた状態、false:閉じた状態
- css {string} authMenu専用CSS
- toggle {Arrow} 【*内部*】ナビゲーション領域の表示/非表示切り替え
- showChildren {Arrow} 【*内部*】ブランチの下位階層メニュー表示/非表示切り替え

## ストレージ/プロパティサービス、グローバル変数

# 機能別処理フロー

## インスタンス化時

## 新規ユーザ登録

## ログイン要求

## ユーザ情報の参照・編集

## 権限設定、変更

# フォルダ構成

# 仕様(JSDoc)

# プログラムソース

# 改版履歴

- rev 1.0.0 : 2024/04/20
  - "class BurgerMenu rev 1.2.0"および作成途中の"class authClient/Server 2.0.0"を統合
