<style>
/*::$lib/CSS/1.3.0/core.css::*/
</style>
<p class="title">class authMenu</p>

# 機能概要

htmlからdata-menu属性を持つ要素を抽出、ハンバーガーメニューを作成する。

またHTML上のメニュー(SPAの機能)毎に許容権限を設定し、ユーザ毎に認証することで、表示制御を可能にする。

<!--::$doc/overview.svg::-->

本クラスは**Google SpreadのGASにデプロイし、SPAとして使用する**ことを想定しているため、'camp2024'等の**呼出元**で以下の作業を行う。

1. caller/index.htmlの作成
   1. body部での要素定義
   1. authMenuの適用値設定
   1. グローバル変数、local/sessionStorageでのユーザ情報保存(※1)
   1. class authMenu(=authMenu/client.js)の組み込み(※2)
1. caller/server.gs
   1. authServerの適用値設定
   1. documentPropertiesでのサーバ・ユーザ情報保存(※1)
   1. authServer(=authMenu/server.js)の組み込み(※2)
1. ユーザ情報保存用シートの作成

なお以下2点は自動的に行う。
- ※1 : 「〜情報保存」は、システム側で自動的に処理(作業は発生しない)
- ※2 : 呼出元のbuild.shで自動処理。記述方法は「フォルダ構成、ビルド手順」を参照。

# 使用方法

## body部での要素定義

<a name="receiving_query_string"></a>

### クエリ文字列の受取

以下は`https://script.google.com/〜4yz/exec?id=XXX`として、変数`id`でユーザIDを渡している例。

サーバ側でクエリ文字列を受け取り、HTML内の変数`userId`にセット。

```
function doGet(e){
  const template = HtmlService.createTemplateFromFile('index');
  template.userId = e.parameter.id;  // ここ!!
  const htmlOutput = template.evaluate();
  htmlOutput.setTitle('camp2024');
  return htmlOutput;
}
```

クライアント側では`<?= userId ?>`で値を取得。

```
<div style="display:none" name="userId"><?= userId ?></div>
```

以下、querySelector等で適宜参照する。

### メニュー要素の定義

- 表示部は&lt;div data-menu&gt;の階層内で定義する。<br>
  階層外の要素はメニューで選択しても表示されない。
- data-menu属性を持つ要素にIDとなるclass属性を付与

```
<body>
  <p class="title">校庭キャンプ2024</p>
  <div class="authMenu screen" name="wrapper">
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
  関数名と実際の関数はauthMenuインスタンス生成時に定義。
- {string} [href] - 遷移先のURL。別タブが開かれる。
- {number} [allow=2^32-1] - 開示範囲。<br>
  authMenuインスタンス生成時のユーザ権限(auth)との論理積>0なら表示する。
  > ex: 一般参加者1、スタッフ2として
  >     data-menu="allow:2"とされた要素は、
  >     new authMenu({auth:1})の一般参加者は非表示、
  >     new authMenu({auth:2})のスタッフは表示となる。
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
    const menu = new authMenu();
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

## authMenuの適用値設定

インスタンス生成時の引数はそのまま**authMenuメンバ変数**となる。

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

### インスタンス生成時の処理フロー

<!--::onload時処理::$doc/onload.md::-->

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
    v.auth = new authMenu();
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

## グローバル変数、local/sessionStorageのユーザ情報保存

`onClick`や`addEventListener`から呼ばれる関数にauthMenuインスタンスを渡す必要があるため、**authMenuのインスタンスはグローバル変数として定義**する。

```
<script type="text/javascript">
const g = {};
(中略)
window.addEventListener('DOMContentLoaded',() => {
  g.menu = new authMenu({...});
  (後略)
});
</script>
```

- localStorage : `"authMenu"(固定) : ユーザID(初期値null)`
- sessionStorage : `"authMenu"(固定)`
  1. {number} userId=null - ユーザID
  1. {string} email='' - 連絡先メールアドレス
  1. {number} created=null - ユーザ側鍵ペアの作成日時(UNIX時刻)。有効期間検証に使用
  1. {string} passPhrase=createPassword() - クライアント側鍵ペア生成の際のパスフレーズ
  1. {number} auth=1 - ユーザの権限
  1. {number} unfreeze=null - ログイン連続失敗後、凍結解除される日時(UNIX時刻)
  1. {string} SPkey=null - サーバ側公開鍵
- グローバル変数
  1. {string} programId - authMenuを呼び出すプロジェクト(関数)名
  1. {Object} CSkey - クライアント側の秘密鍵
  1. {string} CPkey - クライアント側の公開鍵

**注意事項**

1. local/sessionStorageに`authMenu`キーがない場合、作成
1. グローバル変数にCS/CPkeyがない場合、作成

※ sessionStorageに秘密鍵を保存することができないため、鍵ペアはonload時に生成し、グローバル変数として保持する

<a name="7decbcdb14f79d872117b5ebedc691c5"></a>

## authServerの適用値設定

1. {Object.<string>:<Function>} func={} - 使用する関数を集めたオブジェクト
1. {number} loginRetryInterval=3,600,000(60分) - 前回ログイン失敗(3回連続失敗)から再挑戦可能になるまでの時間(ミリ秒)
1. {number} numberOfLoginAttempts=3 - ログイン失敗になるまでの試行回数
1. {number} loginGraceTime=900,000(15分) - パスコード生成からログインまでの猶予時間(ミリ秒)
1. {number} userLoginLifeTime=86,400,000(24時間) - クライアント側ログイン(CPkey)有効期間
1. {string} masterSheet='master' - 参加者マスタのシート名
1. {string} primatyKeyColumn='userId' - 主キーとなる項目名。主キーは数値で設定
1. {string} emailColumn='email' - e-mailを格納する項目名

## documentPropertiesのサーバ・ユーザ情報保存

- DocumentProperties : `"authServer"(固定)`
  1. {string} passPhrase - サーバ側鍵ペア生成の際のパスフレーズ
  1. {Object} SCkey - サーバ側秘密鍵
  1. {string} SPkey - サーバ側公開鍵
  1. {Object} map - `{email:userId}`形式のマップ
- DocumentProperties : `(ユーザID)`
  1. {number} userId - ユーザID
  1. {string} email - e-mail
  1. {number} created - ユーザ側鍵ペアの作成日時(UNIX時刻)。有効期間検証に使用
  1. {string} CPKey - ユーザの公開鍵
  1. {number} auth - ユーザの権限
  1. {Object[]} log - ログイン試行のログ。unshiftで保存、先頭を最新にする
     1. {number} startAt - 試行開始日時(UNIX時刻)
     1. {number} passcode - パスコード(原則数値6桁)
     1. {Object[]} trial - 試行。unshiftで保存、先頭を最新にする
        1. {number} timestamp - 試行日時(UNIX時刻)
        1. {number} entered - 入力されたパスコード
        1. {boolean} result - パスコードと入力値の比較結果(true:OK)
        1. {string} message='' - NGの場合の理由。OKなら空文字列
     1. {number} endAt - 試行終了日時(UNIX時刻)
     1. {boolean} result - 試行の結果(true:OK)

## ユーザ情報保存用シートの作成

システム関係項目として以下を作成し、シート名を[authServerの適用値設定](#7decbcdb14f79d872117b5ebedc691c5)の`masterSheet`に定義する。

1. 「【*内部*】」は指定不要の項目(システム側で自動的に作成・更新)

- userId {number} 【*内部*】ユーザID
- created {string} 【*内部*】ユーザIDを登録した日時文字列
- email {string} 【*内部*】ユーザのe-mailアドレス
- auth {number} ユーザの権限
- CPkey {string} 【*内部*】ユーザの公開鍵
- updated {string} 【*内部*】ユーザ公開鍵が作成・更新された日時文字列
- trial {string} 【*内部*】ログイン試行関係情報のJSON文字列

1. 順番は不問
1. ヘッダ部(1行目)のみ作成し、2行目以降のデータ部は作成不要
1. `auth`のみ手動で変更可。他項目はシステムで設定・変更するので手動での変更は不可
1. これ以外の項目は任意に追加可能

# 機能別処理フロー

窃取したIDでの操作を防止するため、clientで有効期間付きの鍵ペアを生成し、依頼元の信頼性を確保する(CSkey, CPkey : clientの秘密鍵・公開鍵)。

また何らかの手段でCPkeyが窃取されて操作要求が行われた場合、処理結果の暗号化で結果受領を阻止するため、server側も鍵ペアを使用する(SSkey, SPkey : serverの秘密鍵・公開鍵)。

以降の図中で`(XSkey/YPkey)`は「X側の秘密鍵で署名、Y側の公開鍵で暗号化する」の意味。

## 新規ユーザ登録

<!--::$doc/entry.md::-->

## 操作要求

<!--::$doc/request.md::-->

## ユーザ情報の参照・編集

<!--::$doc/crud.md::-->

## 権限設定、変更

<!--::$doc/permit.md::-->

# フォルダ構成、ビルド手順

クライアント(ブラウザ)側の"class authMenu"とサーバ(GAS)側の"class authServer"に分かれるが、一体管理のためソースは一元管理する。

<!--::$doc/folder.md::-->

# 仕様(JSDoc)

<!--::$tmp/client.md::-->

<!--::$tmp/server.md::-->

# テクニカルメモ

## GAS/htmlでの暗号化

<!--::$doc/crypto.md::-->

# プログラムソース

<!--::$tmp/client.js::-->

<!--::$tmp/server.js::-->

# 改版履歴

- rev 1.0.0 : 2024/04/20
  - "class authMenu(rev 1.2.0)"および作成途中の"class Auth(rev 2.0.0)"を統合
  - "storeUserInfo(rev 1.0.0)"を吸収