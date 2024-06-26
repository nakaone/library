<!-- modifyMD original document 
<style>
/* -----------------------------------------------
  library/CSS/1.3.0/core.css
----------------------------------------------- */
html, body{
  width: 100%;
  margin: 0;
  /*font-size: 4vw;*/
  text-size-adjust: none; /* https://gotohayato.com/content/531/ */
}
body * {
  font-size: 1rem;
  font-family: sans-serif;
  box-sizing: border-box;
}
.num, .right {text-align:right;}
.screen {padding: 1rem;} /* SPAでの切替用画面 */
.title { /* Markdown他でのタイトル */
  font-size: 2.4rem;
  text-shadow: 2px 2px 5px #888;
}

/* --- テーブル -------------------------------- */
.table {display:grid}
th, .th, td, .td {
  margin: 0.2rem;
  padding: 0.2rem;
}
th, .th {
  background-color: #888;
  color: white;
}
td, .td {
  border-bottom: solid 1px #aaa;
  border-right: solid 1px #aaa;
}

/* --- 部品 ----------------------------------- */
.triDown { /* 下向き矢印 */
  --bw: 50px;
  width: 0px;
  height: 0px;
  border-top: calc(var(--bw) * 0.7) solid #aaa;
  border-right: var(--bw) solid transparent;
  border-left: var(--bw) solid transparent;
  border-bottom: calc(var(--bw) * 0.2) solid transparent;
}

/* --- 部品：待機画面 --------------------------- */
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(204,204,204, 0.2);
  border-right: 1.1em solid rgba(204,204,204, 0.2);
  border-bottom: 1.1em solid rgba(204,204,204, 0.2);
  border-left: 1.1em solid #cccccc;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
<p class="title"><a name="Auth_top">class Auth</a></p>

イベントサイトにおける募集用・参加者用・スタッフ用メニューの表示制御等、認証に関する処理を行う。

クライアント(ブラウザ)側の"class authClient"とサーバ(GAS)側の"class authServer"に分かれるが、一体管理のためソースは一元管理する。

# 初期化処理

システム導入時、**Google Apps Scriptで一度だけ実行**する必要のある処理。

実行後は秘匿のため、ソースごと削除することを推奨。このため独立した`initial.gs`を作成する。

### シートアクセス権の取得

### server側鍵ペア生成

### config情報の作成と保存

# 機能別処理フロー

## onload時処理

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> server : 表示要求(URL)
  activate server
  Note right of server : doGet()
  rect rgba(0, 255, 255, 0.1)
    server ->> client : HTML(object)+ID
    activate client
    deactivate server
    Note right of client : storeUserInfo()
    client ->> client : ID確認処理
    Note right of client : BurgerMenu.constructor()
    alt IDが存在
      client ->> user : メンバ用サイト
    else
      client ->> user : 一般公開サイト
    end
    deactivate client

    user ->>+ client : ID入力
    Note right of client : enterUserId()
    client ->> client : storageに保存(storeUserInfo)
    client ->>- user : メンバ用画面
  end
```

- 水色の部分はhtmlのonload時処理
- 表示要求に対するserverからの戻り値(ID)は、bodyタグ直下の冒頭に隠しDIVを用意し、そのinnerTextとして返す。
- ID確認処理
  - 引数、HTML埋込情報、sessionStorage、localStorageのユーザ情報を取得
  - IDを特定(引数>HTML埋込>session>local。いずれにも無ければnull)
  - IDが特定されるならauthを一般公開->参加者に変更

<!--
- 「インスタンス生成」の処理内容
  1. authClient.constructor()
     1. localStorageにIDがあるか確認<br>
        不存在または不一致なら、serverから戻されたIDをlocalStorageに保存
  1. BurgerMenu.constructor()
     1. AuthインスタンスをBurgerMenuのインスタンスメンバとして生成(以下Burger.auth)
     1. Burger.auth.IDの値に従ってAuthメニュー描画(メニューアイコン、nav領域)

[HtmlOutput.appendUntrusted()](https://developers.google.com/apps-script/reference/html/html-output?hl=ja#appenduntrustedaddedcontent)を使用して、HTMLの要素として返す。

    user ->> client : ID入力
    activate client
    Note right of client : enterUserId()
    client ->> user : メンバ用サイト
    deactivate client

--＞

## 新規登録

新規登録では、[サーバ側のプロパティサービス](#332-%E3%83%A6%E3%83%BC%E3%82%B6%E6%83%85%E5%A0%B1)にIDとメアドのみ作成する。申込者名等、登録内容についてはユーザ情報の参照・編集画面を呼び出し、修正・加筆を行う。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> client : メアド
  activate client
  Note right of client : authClient.registMail()
  alt sessionにuserId保存済
    client ->> user : userIdをダイアログで表示して終了
  end
  client ->> client : 鍵ペア生成、sessionStorageに保存
  client ->> server : メアド＋CPkey
  activate server
  Note right of server : authServer.registMail()
  server ->> property : メアド
  property ->> server : userIdマップ
  alt マップにメアドが存在
    server ->> property : userId
    property ->> server : ユーザ情報
    alt CPkeyが不一致
      server ->> property : ユーザ情報(CPkey更新)
    end
    server ->> client : userId
    client ->> user : userIdをダイアログで表示
  else マップにメアドが不在
    server ->> server : userIdを新規採番
    server ->> property : userIdマップ
    server ->> property : userId,メアド,CPkey
    server ->> client : 検索結果＋ユーザ情報＋SPkey
    deactivate server
    client ->> client : userIdをlocal/sessionに、SPkeyをsessionに保存
    client ->> user : 新規登録画面表示
  end
  deactivate client
```

- 参加者が改めて参加要項からメールアドレスを入力するのは「自分のuserIdを失念した」場合を想定
- メアド入力欄は募集要項の一部とし、userId(受付番号)がlocalStrageに存在する場合は表示しない
- 応募締切等、新規要求ができる期間の制限は、client側でも行う(BurgerMenuの有効期間設定を想定)
- メアドは形式チェックのみ行い、到達確認および別ソースとの突合は行わない(ex.在校生メアド一覧との突合)
- ユーザはログインを行わないので、サーバ側のプロパティサービスにID/auth等のユーザ情報は保存しない。
- IDはstoreUserInfo関数を使用してlocal/sessionStorageでの保存を想定(∵タブを閉じても保存したい。個人情報とは言えず、特に問題ないと判断)
- 「検索結果=既存」の場合、ユーザ情報編集画面の表示も検討したが、なりすましでもe-mail入力で個人情報が表示されることになるので不適切と判断。
- 申込時に自分限定の申込情報操作のためログインすることになるので、メール到達確認はそこで行う

## ログイン要求

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant caller
  participant login
  participant server
  participant property

  caller ->> login : 呼び出し(userId,処理名)
  activate login
  Note right of login : authClient.login()
  alt 鍵ペアが無効
    login ->> login : 鍵ペア再生成＋sessionに保存
  end

  login ->> server : userId,CPkey(SPkey/--)
  activate server
  Note right of server : authServer.login1S()
  server ->> property : userId
  property ->> server  : ユーザ情報
  server ->> server : 実行権限確認(※1)
  alt 実行権限確認結果がOK or NG
    server ->> login : OK or NG
    login ->> caller : OK or NG
  end

  server ->> server : パスコード・要求ID生成(※2)
  server ->> property : パスコード,要求ID,要求時刻
  server ->> user : パスコード連絡メール
  server ->> login : OK＋要求ID
  deactivate server
  login ->> user : パスコード入力ダイアログ

  user ->> login : パスコード入力
  login ->> server : userId,パスコード＋要求ID(CS/SP)
  activate server
  Note right of server : authServer.login2S()
  server ->> property : userId
  property ->> server : ユーザ情報
  server ->> server : パスコード検証(※3)
  server ->> property : 検証結果記録
  server ->> login : OK or NG
  deactivate server
  login ->> caller : OK or NG
  deactivate login
```

- ※1 : 実行権限確認<br>
  | 実行権限 | CPkey | 凍結 | 結論 |
  | :-- | :-- | :-- | :-- |
  | 無し | — | — | NG (no permission) |
  | 有り | 有効 | — | OK |
  | 有り | 無効 | true | NG (lockout) |
  | 有り | 無効 | false | 以降の処理を実施 |
  - 実行権限 : authServer内関数毎の所要権限 & ユーザ権限 > 0 ? 有り : 無し
  - CPkey : ① and ② ? 有効 : 無効<br>
  ①送られてきたCPkeyがユーザ毎のプロパティサービスに保存されたCPkeyと一致<br>
  ②ユーザ毎のプロパティサービスに保存されたCPkeyが有効期限内
  - 凍結 : 前回ログイン失敗(3回連続失敗)から一定時間内 ? true : false
- ※2 : パスコード・要求ID生成
  - パスコードは数値6桁(既定値)
  - 要求IDはuserIdと要求時刻(UNIX時刻)を連結した文字列のMD5(or CRC32)をbase64化
- ※3 : 「パスコード検証」は復号・署名確認の上、以下の点をチェックする
  - 復号可能且つ署名が一致
  - 送付されたパスコード・要求IDがプロパティサービスのそれと一致
  - 試行回数が一定数以下(既定値3回)
  - パスコード生成から一定時間内(既定値15分)
  - ログイン可能な権限
- パスコード再発行は凍結中以外認めるが、再発行前の失敗は持ち越す。<br>
  例：旧パスコードで2回連続失敗、再発行後の1回目で失敗したら凍結

## ユーザ情報の参照・編集

シートの操作(CRUD)は、管理者が事前に`{操作名:実行関数}`の形でソースに埋め込んで定義する。<br>
例：`{lookup:(arg)=>data.find(x=>x.id==arg.id)}`

userは要求時に操作名を指定し、その実行結果を受け取る。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  participant sheet

  user ->> client : 操作要求
  activate client
  client ->> client : ログイン要求
  alt ログインNG
    client ->> user : エラー
  end
  
  client ->> server : ID,引数(CSkey/SPkey)
  activate server
  Note right of server : authServer.operation(xxx)
  server ->> property : userId
  property ->> server : ユーザ情報
  server ->> server : 引数を復号
  alt 復号不可
    server ->> client : エラーメッセージ
    client ->> user : ダイアログを出して終了
  end

  server ->> sheet : 操作名(xxx)に対応する関数呼び出し
  sheet ->> server : 関数(xxx)の処理結果
  server ->> client : 操作結果(SSkey/CPkey)
  deactivate server
  client ->> client : 復号＋署名検証、画面生成
  client ->> user : 結果表示画面
  deactivate client
```

## 権限設定、変更

権限を付与すべきかは個別に判断する必要があるため、システム化せず、管理者がソース(`authServer.changeAuth()`)を直接編集、GASコンソール上で実行する。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> admin : 権限要求
  admin ->>+ server : 権限設定状況確認
  Note right of server : authServer.listAuth()
  server ->>- admin : 権限設定リスト
  admin ->>+ server : ソース修正、実行
  Note right of server : authServer.changeAuth()
  server ->> property : 権限変更
  server ->>- admin : 権限設定リスト
```

# 設定情報とオブジェクト定義

- client/server共通設定情報(config.common)
  > クラスメンバ
- authClient固有設定情報(config.client)
  > 保持するデータ構造を含む
- authServer固有設定情報(config.server)
- 引数・戻り値となるオブジェクトの定義(typedef)
- ID, RSA鍵(crypto)
  > client/serverで表にする。使用するライブラリcrypticoの使用方法を含む

## client:localStorageに保存する情報

## client:sessionStorageに保存する情報

## server:プロパティサービスに保存する情報

### server側config

1. {number} loginRetryInterval=3,600,000(60分) - 前回ログイン失敗(3回連続失敗)から再挑戦可能になるまでの時間(ミリ秒)
1. {number} numberOfLoginAttempts=3 - ログイン失敗になるまでの試行回数
1. {number} loginGraceTime=900,000(15分) - パスコード生成からログインまでの猶予時間(ミリ秒)
1. {number} userLoginLifeTime=86,400,000(24時間) - ログイン(CPkey)有効期間

### ユーザ情報

以下のオブジェクトをユーザ単位に作成し、プロパティサービスに保存する(key = String(ID))。

1. {number} id - ユーザID
1. {string} email - e-mail
1. {number} created - ユーザ側鍵ペアの作成日時(UNIX時刻)。有効期間検証に使用
1. {string} publicKey - ユーザの公開鍵
1. {number} authority - ユーザの権限
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

- 有効期間内かは最新のendAtから判断

# フォルダ構成

- archves : アーカイブ
- doc/ : readme.mdの各記事のソース集
  - proto.md : readme.mdのプロトタイプ
  - xxx.md : readme.mdに埋め込む各記事のソース
- src/ : プログラムソース
  - config.common.js : client/server共通config
  - config.client.js : client特有のconfig
  - config.server.js : server特有のconfig
  - authClient.js : class authClientのテンプレート
  - authServer.js : class authServerのテンプレート
  - authXxxx.yyyy.js : class authClient/Server各メソッドのソース
- test/ : テスト用
- build.sh : client/server全体のビルダ
- index.html : クライアント側のソース
- server.gs : サーバ側のソース
- initialize.gs : サーバ側初期化処理のソース
- readme.md : doc配下を統合した、client/server全体の仕様書

# 仕様(JSDoc)

* [authClient](#authClient)
    * [new authClient(opt)](#new_authClient_new)
    * [.registMail(arg)](#authClient+registMail) ⇒ <code>null</code> \| <code>Error</code>

<a name="new_authClient_new"></a>

## new authClient(opt)

| Param | Type |
| --- | --- |
| opt | <code>Object</code> | 
| opt.programId | <code>string</code> | 

<a name="authClient+registMail"></a>

## authClient.registMail(arg) ⇒ <code>null</code> \| <code>Error</code>
ブラウザからの登録要求を受け、IDを返す

**Kind**: instance method of [<code>authClient</code>](#authClient)  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>HTMLElement</code> | ボタン要素 |

**Example**  
```js
- ボタンは`onclick="g.auth.registMail(this)"`を指定
- ボタンとinput要素は兄弟要素とし、それをdivで囲む
```

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>number</code> | <code></code> |  |
| arg | <code>string</code> | <code>null</code> | 暗号化結果の文字列 |

**Example**  
```js
**プロパティサービス：authServer**

- 
```

# プログラムソース

<details><summary>client.js</summary>

```
class authClient {
/** @constructor
 * @param {Object} opt
 * @param {string} opt.programId
 */
constructor(opt){
  const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 引数のセット
    for(let x in opt){
      this[x] = opt[x];
    }

    v.step = 2; // ユーザ情報を設定
    this.#setUserInfo();

    v.step = 3; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nopt=${stringify(opt)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

  // setUserInfo, doGAS
/** ユーザ情報をメンバに(再)設定する
 * @param {void}
 * @returns {void}
 */
#setUserInfo(){
  const str = sessionStorage.getItem(this.programId);
  this.user = JSON.parse(str);
}

async doGAS(func,...args){
  return await doGAS('authServer',this.user.userId,func,...args);
}

/** ブラウザからの登録要求を受け、IDを返す
 * @param {HTMLElement} arg - ボタン要素
 * @returns {null|Error}
 * 
 * @example
 * 
 * - ボタンは`onclick="g.auth.registMail(this)"`を指定
 * - ボタンとinput要素は兄弟要素とし、それをdivで囲む
 */
async registMail(arg){
  const v = {whois:this.constructor.name+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // メールアドレスのチェック
    v.email = arg.parentNode.querySelector('input[type="email"]').value;
    if( checkFormat(v.email,'email') === false ){
      alert(`"${v.email}"は不適切なメールアドレスです`);
      throw new Error(`"${v.email}" is invalid mail address.`);
    }

    v.step = 2; // authServer.registMailにメアド転送
    v.r = changeScreen('loading');
    if( v.r instanceof Error ) throw v.r;
    v.id = await this.doGAS('registMail',v.email);
    if( v.id instanceof Error ) throw v.id;
    console.log(v.id);

    v.step = 3; // IDをstorageに登録
    v.r = storeUserInfo(this.programId,{userId:v.id});
    if( v.r instanceof Error ) throw v.r;

    v.step = 4; // メニュー再描画、ホーム画面の定義書き換え
    v.r = g.menu.genNavi();
    if( v.r instanceof Error ) throw v.r;
    v.step = 5; // 応募情報修正画面に遷移
    v.r = changeScreen('登録・修正・キャンセル');
    if( v.r instanceof Error ) throw v.r;

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${arg}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
  //:x:$src/client.login1C.js::
  //:x:$src/client.login2C.js::
}
```

</details>

<details><summary>server.gs</summary>

```
/**
 * 
 * @param {number} userId 
 * @param {string} arg - 暗号化結果の文字列
 * @returns {Object}
 * 
 * @example
 * 
 * **プロパティサービス：authServer**
 * 
 * - 
 */
function authServer(userId=null,func=null,arg=null) {
  // 内部関数で'v'を使用するため、ここでは'w'で定義
  const w = {whois:'authServer',rv:null,step:0,
    func:{},  // 使用する関数を集めたオブジェクト
    validityPeriod: 2 * 24 * 3600 * 1000, // クライアント側ログインの有効期間(2日)
    masterSheet: 'master', // 参加者マスタのシート名
    primatyKeyColumn: 'userId', // 主キーとなる項目名。主キーは数値で設定
    emailColumn: 'email', // e-mailを格納する項目名
  };
  console.log(`${w.whois} start.`);
  PropertiesService.getDocumentProperties().deleteProperty(w.whois);
  try {

    if( userId === null ){
      w.step = 1;
      // userId未定でも可能な処理
      // ⇒ 一般公開用メニュー
      if( ['registMail'].find(x => x === func) ){
        
/** authClientからの登録要求を受け、IDを返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {string} email - 要求があったユーザのe-mail
 * @returns {number|Error} 採番されたuserId
 */
w.func.registMail = function(email){
  const v = {whois:w.whois+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // emailアドレスの妥当性検証
    if( checkFormat(email,'email' ) === false ){
      throw new Error(`invalid e-mail address.`);
    }

    v.step = 2; // masterシートを読み込み
    v.master = new SingleTable(w.masterSheet);

    v.step = 3; // 既登録メアドでは無いか確認
    v.m = v.master.data.find(x => x[w.emailColumn] === email);
    if( v.m ) throw new Error(`"${email}" has already registrated.`);

    v.step = 4; // 新規userIdを採番
    if( v.master.data.length === 0 ){
      v.rv = 1;
    } else {
      v.exist = v.master.data.map(x => x[w.primatyKeyColumn]);
      v.rv = Math.max(...v.exist) + 1;
    }

    v.step = 5; // シートに登録
    v.r = v.master.insert([{
      userId:v.rv,
      email:email,
      created:toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn')
    }]);
    if( v.r instanceof Error ) throw v.r;

    v.step = 9; // 終了処理
    console.log(`${w.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nemail=${email}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
        w.rv = w.func.registMail(arg);
        if( w.rv instanceof Error ) throw w.rv;

      } else {
        w.step = 2; // 該当処理なし
        w.rv = null;
      }
    } else {
      if( ['login1S'].find(x => x === func) ){
        w.step = 3;
        // userIdは必要だが、ログインは不要な処理
        // ⇒ 参加者用メニュー(応募情報(自分の個人情報)修正を除く)

        //:x:$src/server.login1S.js::

      } else if( ['login2S','operation'].find(x => x === func) ){
        // ログインしないと操作不可の処理
        // ⇒ 応募情報修正、スタッフ用メニュー

        w.step = 4; // クライアント側の署名検証＋引数のオブジェクト化
/** クライアント側の署名を検証、引数を復号してオブジェクト化する
 * @param {number} userId - ユーザID
 * @param {string} arg - クライアント側での暗号化＋署名結果(文字列)
 * @returns {Object}
 * 
 * @example
 * 
 * サーバ側に鍵ペアが存在しない場合は自動生成してプロパティサービスに保存
 * 
 * ** 注意事項 **
 * 
 * 他のauthServerメソッドは`w.func.xxx`として定義するが、
 * 本メソッドはユーザに使用させないシステム的なメソッドのため、
 * funcではなく`w.initialize`として定義する。
 * 
 * **戻り値の形式**
 * 
 * - {Object|Error} rv
 *   - passPhrase {string} パスフレーズ
 *   - privateKey {Object} RSA形式の秘密鍵
 *   - publicKey {string} RSA形式の公開鍵
 * 
 * **参考：パスフレーズ・秘密鍵・公開鍵の一括保存はできない**
 * 
 * `{passPhrase:〜,privateKey:〜,publicKey:〜}`のように一括して保存しようとすると、以下のエラーが発生。
 * 
 * ```
 * You have exceeded the property storage quota.
 * Please remove some properties and try again.
 * ```
 * 
 * 原因は[プロパティ値のサイズ](https://developers.google.com/apps-script/guides/services/quotas?hl=ja)が超過したため。
 * ⇒ max 9KB/値なので、パスフレーズ・公開鍵・秘密鍵は別々のプロパティとして保存が必要
 */
w.func.verifySignature = function(userId=null,arg=null){
  const v = {whois:w.whois+'.verifySignature',rv:{},step:0};
  console.log(`${v.whois} start.`);
  try {

    // userId, argは共に必須
    if( userId === null ) throw new Error(`${v.whois} Error: no userId.`);
    if( arg === null ) throw new Error(`${v.whois} Error: no arg.`);

    v.step = 1; // サーバ側鍵ペアの取得・生成　※親関数のwhoisを使用
    v.RSA = PropertiesService.getDocumentProperties().getProperty(w.whois);
    if( v.RSA === null ){
      v.step = 1.1;
      v.bits = 1024;  // ビット長
      v.RSA.passPhrase = createPassword(16); // 16桁のパスワードを自動生成
      v.step = 1.2; // 秘密鍵の生成
      v.RSA.privateKey = cryptico.generateRSAKey(v.RSA.passPhrase, v.bits);
      v.step = 1.3; // 公開鍵の生成
      v.RSA.publicKey = cryptico.publicKeyString(v.RSA.privateKey);
      PropertiesService.getDocumentProperties().setProperty(w.whois,v.RSA);
    }

    v.step = 2; // クライアント側情報の取得
    v.client = PropertiesService.getDocumentProperties().getProperty(userId);

    if( v.client === null ){
      v.step = 3; // クライアント側情報未登録 ⇒ 空オブジェクトを返す
      v.client = {
        userId: userId,
        email: '',
        created: Date.now(),
        publicKeyID: '',
        authority: 2,
        log: [],
      };
      PropertiesService.getDocumentProperties().setProperty(userId,v.client);
    } else {
      v.step = 4; // クライアント側情報登録済
      v.step = 4.1; // 引数の復元
      v.decrypt = cryptico.decrypt(arg,v.RSA.privateKey);
      console.log(`v.decrypt=${stringify(v.decrypt)}`);
      v.step = 4.2; // 署名の検証
      v.decrypt.publicKeyID = cryptico.publicKeyID(v.decrypt.publicKeyString);
      v.decrypt.verify = v.client.publicKeyID === v.decrypt.publicKeyID;
      v.step = 4.3; // 有効期間の確認。　※親関数のvalidityPeriodを使用
      v.decrypt.validityPeriod = (v.client.created + w.validityPeriod) < Date.now();
      v.step = 4.3; // 戻り値をオブジェクト化
      v.rv = v.decrypt.status === 'success' && v.decrypt.verify && v.decrypt.validityPeriod
      ? JSON.parse(v.decrypt.plaintext)
      : new Error(`cryptico.decrypt error.`
      + `\nstatus="${v.decrypt.status}"`
      + `\nplaintext="${v.decrypt.plaintext}"`
      + `\nsignature="${v.decrypt.signature}"`
      + `\npublicKeyString="${v.decrypt.publicKeyString}"`
      + `\npublicKeyID="${v.decrypt.publicKeyID}"`
      + `\nverify="${v.decrypt.verify}"`
      + `\nvalidityPeriod="${v.decrypt.validityPeriod}"`);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    console.log(`type = ${typeof v.rv}\npassPhrase="${v.rv.passPhrase}\npublicKey="${v.rv.publicKey}"`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    return e;
  }
}
        w.r = w.func.verifySignature(userId,arg);
        if( w.r instanceof Error ) throw w.r;

        switch( func ){
          case 'login2S': w.step = 4 + ':login2S';
            //:x:$src/server.login2S.js::
            break;
          // 後略
          //:x:$src/server.listAuth.js::
          //:x:$src/server.changeAuth.js::
          //:x:$src/server.operation.js::
        }
      } else {
        w.step = 5; // 該当処理なし
        w.rv = null;
      }
    }

    w.step = 6; // 終了処理
    console.log(`${w.whois} normal end.\nw.rv=${stringify(w.rv)}`);
    // 該当処理なしの場合、何も返さない
    if( w.rv !== null ) return w.rv;

  } catch(e) {
    e.message = `${w.whois} abnormal end at step.${w.step}`
    + `\n${e.message}\nuserId=${userId}\nfunc=${func}`;
    console.error(`${e.message}\nw=${stringify(w)}`);
    return e;
  }
}
```

</details>

# 改版履歴

- rev.2.0.0 : class Authと統合
- rev.1.1.0 : 2024/03/14
  - setupInstanceをmergeDeeplyに置換(setupInstanceは廃番)
  - arg.funcの取り扱いを`new Function()`から直接関数を渡す形に修正
  - changeメソッドを廃止、changeScreenで代替
- rev.1.0.0 : 2024/01/03 初版
-->
<a name="ac0000"></a>
<style>
/* -----------------------------------------------
  library/CSS/1.3.0/core.css
----------------------------------------------- */
html, body{
  width: 100%;
  margin: 0;
  /*font-size: 4vw;*/
  text-size-adjust: none; /* https://gotohayato.com/content/531/ */
}
body * {
  font-size: 1rem;
  font-family: sans-serif;
  box-sizing: border-box;
}
.num, .right {text-align:right;}
.screen {padding: 1rem;} /* SPAでの切替用画面 */
.title { /* Markdown他でのタイトル */
  font-size: 2.4rem;
  text-shadow: 2px 2px 5px #888;
}

/* --- テーブル -------------------------------- */
.table {display:grid}
th, .th, td, .td {
  margin: 0.2rem;
  padding: 0.2rem;
}
th, .th {
  background-color: #888;
  color: white;
}
td, .td {
  border-bottom: solid 1px #aaa;
  border-right: solid 1px #aaa;
}

/* --- 部品 ----------------------------------- */
.triDown { /* 下向き矢印 */
  --bw: 50px;
  width: 0px;
  height: 0px;
  border-top: calc(var(--bw) * 0.7) solid #aaa;
  border-right: var(--bw) solid transparent;
  border-left: var(--bw) solid transparent;
  border-bottom: calc(var(--bw) * 0.2) solid transparent;
}

/* --- 部品：待機画面 --------------------------- */
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(204,204,204, 0.2);
  border-right: 1.1em solid rgba(204,204,204, 0.2);
  border-bottom: 1.1em solid rgba(204,204,204, 0.2);
  border-left: 1.1em solid #cccccc;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
<p class="title"><a name="Auth_top">class Auth</a></p>

イベントサイトにおける募集用・参加者用・スタッフ用メニューの表示制御等、認証に関する処理を行う。

クライアント(ブラウザ)側の"class authClient"とサーバ(GAS)側の"class authServer"に分かれるが、一体管理のためソースは一元管理する。


# 目次

1. <a href="#ac0001">初期化処理</a>
      1. <a href="#ac0002">シートアクセス権の取得</a>
      1. <a href="#ac0003">server側鍵ペア生成</a>
      1. <a href="#ac0004">config情報の作成と保存</a>
1. <a href="#ac0005">機能別処理フロー</a>
   1. <a href="#ac0006">onload時処理</a>
   1. <a href="#ac0007">新規登録</a>
   1. <a href="#ac0008">ログイン要求</a>
   1. <a href="#ac0009">ユーザ情報の参照・編集</a>
   1. <a href="#ac0010">権限設定、変更</a>
1. <a href="#ac0011">設定情報とオブジェクト定義</a>
   1. <a href="#ac0012">client:localStorageに保存する情報</a>
   1. <a href="#ac0013">client:sessionStorageに保存する情報</a>
   1. <a href="#ac0014">server:プロパティサービスに保存する情報</a>
      1. <a href="#ac0015">server側config</a>
      1. <a href="#ac0016">ユーザ情報</a>
1. <a href="#ac0017">フォルダ構成</a>
1. <a href="#ac0018">仕様(JSDoc)</a>
   1. <a href="#ac0019">new authClient(opt)</a>
   1. <a href="#ac0020">authClient.registMail(arg) ⇒ <code>null</code> \| <code>Error</code></a>
1. <a href="#ac0021">プログラムソース</a>
1. <a href="#ac0022">改版履歴</a>

# 1 初期化処理<a name="ac0001"></a>

[先頭](#ac0000)
<br>&gt; [初期化処理 | [機能別処理フロー](#ac0005) | [設定情報とオブジェクト定義](#ac0011) | [フォルダ構成](#ac0017) | [仕様(JSDoc)](#ac0018) | [プログラムソース](#ac0021) | [改版履歴](#ac0022)]


システム導入時、**Google Apps Scriptで一度だけ実行**する必要のある処理。

実行後は秘匿のため、ソースごと削除することを推奨。このため独立した`initial.gs`を作成する。

### 1.1 シートアクセス権の取得<a name="ac0002"></a>

[先頭](#ac0000) > [初期化処理](#ac0001)
<br>&gt; [シートアクセス権の取得 | [server側鍵ペア生成](#ac0003) | [config情報の作成と保存](#ac0004)]


### 1.2 server側鍵ペア生成<a name="ac0003"></a>

[先頭](#ac0000) > [初期化処理](#ac0001)
<br>&gt; [[シートアクセス権の取得](#ac0002) | server側鍵ペア生成 | [config情報の作成と保存](#ac0004)]


### 1.3 config情報の作成と保存<a name="ac0004"></a>

[先頭](#ac0000) > [初期化処理](#ac0001)
<br>&gt; [[シートアクセス権の取得](#ac0002) | [server側鍵ペア生成](#ac0003) | config情報の作成と保存]


# 2 機能別処理フロー<a name="ac0005"></a>

[先頭](#ac0000)
<br>&gt; [[初期化処理](#ac0001) | 機能別処理フロー | [設定情報とオブジェクト定義](#ac0011) | [フォルダ構成](#ac0017) | [仕様(JSDoc)](#ac0018) | [プログラムソース](#ac0021) | [改版履歴](#ac0022)]


## 2.1 onload時処理<a name="ac0006"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0005)
<br>&gt; [onload時処理 | [新規登録](#ac0007) | [ログイン要求](#ac0008) | [ユーザ情報の参照・編集](#ac0009) | [権限設定、変更](#ac0010)]


```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> server : 表示要求(URL)
  activate server
  Note right of server : doGet()
  rect rgba(0, 255, 255, 0.1)
    server ->> client : HTML(object)+ID
    activate client
    deactivate server
    Note right of client : storeUserInfo()
    client ->> client : ID確認処理
    Note right of client : BurgerMenu.constructor()
    alt IDが存在
      client ->> user : メンバ用サイト
    else
      client ->> user : 一般公開サイト
    end
    deactivate client

    user ->>+ client : ID入力
    Note right of client : enterUserId()
    client ->> client : storageに保存(storeUserInfo)
    client ->>- user : メンバ用画面
  end
```

- 水色の部分はhtmlのonload時処理
- 表示要求に対するserverからの戻り値(ID)は、bodyタグ直下の冒頭に隠しDIVを用意し、そのinnerTextとして返す。
- ID確認処理
  - 引数、HTML埋込情報、sessionStorage、localStorageのユーザ情報を取得
  - IDを特定(引数>HTML埋込>session>local。いずれにも無ければnull)
  - IDが特定されるならauthを一般公開->参加者に変更

<!--
- 「インスタンス生成」の処理内容
  1. authClient.constructor()
     1. localStorageにIDがあるか確認<br>
        不存在または不一致なら、serverから戻されたIDをlocalStorageに保存
  1. BurgerMenu.constructor()
     1. AuthインスタンスをBurgerMenuのインスタンスメンバとして生成(以下Burger.auth)
     1. Burger.auth.IDの値に従ってAuthメニュー描画(メニューアイコン、nav領域)

[HtmlOutput.appendUntrusted()](https://developers.google.com/apps-script/reference/html/html-output?hl=ja#appenduntrustedaddedcontent)を使用して、HTMLの要素として返す。

    user ->> client : ID入力
    activate client
    Note right of client : enterUserId()
    client ->> user : メンバ用サイト
    deactivate client

-->

## 2.2 新規登録<a name="ac0007"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0005)
<br>&gt; [[onload時処理](#ac0006) | 新規登録 | [ログイン要求](#ac0008) | [ユーザ情報の参照・編集](#ac0009) | [権限設定、変更](#ac0010)]


新規登録では、[サーバ側のプロパティサービス](#332-%E3%83%A6%E3%83%BC%E3%82%B6%E6%83%85%E5%A0%B1)にIDとメアドのみ作成する。申込者名等、登録内容についてはユーザ情報の参照・編集画面を呼び出し、修正・加筆を行う。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> client : メアド
  activate client
  Note right of client : authClient.registMail()
  alt sessionにuserId保存済
    client ->> user : userIdをダイアログで表示して終了
  end
  client ->> client : 鍵ペア生成、sessionStorageに保存
  client ->> server : メアド＋CPkey
  activate server
  Note right of server : authServer.registMail()
  server ->> property : メアド
  property ->> server : userIdマップ
  alt マップにメアドが存在
    server ->> property : userId
    property ->> server : ユーザ情報
    alt CPkeyが不一致
      server ->> property : ユーザ情報(CPkey更新)
    end
    server ->> client : userId
    client ->> user : userIdをダイアログで表示
  else マップにメアドが不在
    server ->> server : userIdを新規採番
    server ->> property : userIdマップ
    server ->> property : userId,メアド,CPkey
    server ->> client : 検索結果＋ユーザ情報＋SPkey
    deactivate server
    client ->> client : userIdをlocal/sessionに、SPkeyをsessionに保存
    client ->> user : 新規登録画面表示
  end
  deactivate client
```

- 参加者が改めて参加要項からメールアドレスを入力するのは「自分のuserIdを失念した」場合を想定
- メアド入力欄は募集要項の一部とし、userId(受付番号)がlocalStrageに存在する場合は表示しない
- 応募締切等、新規要求ができる期間の制限は、client側でも行う(BurgerMenuの有効期間設定を想定)
- メアドは形式チェックのみ行い、到達確認および別ソースとの突合は行わない(ex.在校生メアド一覧との突合)
- ユーザはログインを行わないので、サーバ側のプロパティサービスにID/auth等のユーザ情報は保存しない。
- IDはstoreUserInfo関数を使用してlocal/sessionStorageでの保存を想定(∵タブを閉じても保存したい。個人情報とは言えず、特に問題ないと判断)
- 「検索結果=既存」の場合、ユーザ情報編集画面の表示も検討したが、なりすましでもe-mail入力で個人情報が表示されることになるので不適切と判断。
- 申込時に自分限定の申込情報操作のためログインすることになるので、メール到達確認はそこで行う

## 2.3 ログイン要求<a name="ac0008"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0005)
<br>&gt; [[onload時処理](#ac0006) | [新規登録](#ac0007) | ログイン要求 | [ユーザ情報の参照・編集](#ac0009) | [権限設定、変更](#ac0010)]


```mermaid
sequenceDiagram
  autonumber
  actor user
  participant caller
  participant login
  participant server
  participant property

  caller ->> login : 呼び出し(userId,処理名)
  activate login
  Note right of login : authClient.login()
  alt 鍵ペアが無効
    login ->> login : 鍵ペア再生成＋sessionに保存
  end

  login ->> server : userId,CPkey(SPkey/--)
  activate server
  Note right of server : authServer.login1S()
  server ->> property : userId
  property ->> server  : ユーザ情報
  server ->> server : 実行権限確認(※1)
  alt 実行権限確認結果がOK or NG
    server ->> login : OK or NG
    login ->> caller : OK or NG
  end

  server ->> server : パスコード・要求ID生成(※2)
  server ->> property : パスコード,要求ID,要求時刻
  server ->> user : パスコード連絡メール
  server ->> login : OK＋要求ID
  deactivate server
  login ->> user : パスコード入力ダイアログ

  user ->> login : パスコード入力
  login ->> server : userId,パスコード＋要求ID(CS/SP)
  activate server
  Note right of server : authServer.login2S()
  server ->> property : userId
  property ->> server : ユーザ情報
  server ->> server : パスコード検証(※3)
  server ->> property : 検証結果記録
  server ->> login : OK or NG
  deactivate server
  login ->> caller : OK or NG
  deactivate login
```

- ※1 : 実行権限確認<br>
  | 実行権限 | CPkey | 凍結 | 結論 |
  | :-- | :-- | :-- | :-- |
  | 無し | — | — | NG (no permission) |
  | 有り | 有効 | — | OK |
  | 有り | 無効 | true | NG (lockout) |
  | 有り | 無効 | false | 以降の処理を実施 |
  - 実行権限 : authServer内関数毎の所要権限 & ユーザ権限 > 0 ? 有り : 無し
  - CPkey : ① and ② ? 有効 : 無効<br>
  ①送られてきたCPkeyがユーザ毎のプロパティサービスに保存されたCPkeyと一致<br>
  ②ユーザ毎のプロパティサービスに保存されたCPkeyが有効期限内
  - 凍結 : 前回ログイン失敗(3回連続失敗)から一定時間内 ? true : false
- ※2 : パスコード・要求ID生成
  - パスコードは数値6桁(既定値)
  - 要求IDはuserIdと要求時刻(UNIX時刻)を連結した文字列のMD5(or CRC32)をbase64化
- ※3 : 「パスコード検証」は復号・署名確認の上、以下の点をチェックする
  - 復号可能且つ署名が一致
  - 送付されたパスコード・要求IDがプロパティサービスのそれと一致
  - 試行回数が一定数以下(既定値3回)
  - パスコード生成から一定時間内(既定値15分)
  - ログイン可能な権限
- パスコード再発行は凍結中以外認めるが、再発行前の失敗は持ち越す。<br>
  例：旧パスコードで2回連続失敗、再発行後の1回目で失敗したら凍結

## 2.4 ユーザ情報の参照・編集<a name="ac0009"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0005)
<br>&gt; [[onload時処理](#ac0006) | [新規登録](#ac0007) | [ログイン要求](#ac0008) | ユーザ情報の参照・編集 | [権限設定、変更](#ac0010)]


シートの操作(CRUD)は、管理者が事前に`{操作名:実行関数}`の形でソースに埋め込んで定義する。<br>
例：`{lookup:(arg)=>data.find(x=>x.id==arg.id)}`

userは要求時に操作名を指定し、その実行結果を受け取る。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  participant sheet

  user ->> client : 操作要求
  activate client
  client ->> client : ログイン要求
  alt ログインNG
    client ->> user : エラー
  end
  
  client ->> server : ID,引数(CSkey/SPkey)
  activate server
  Note right of server : authServer.operation(xxx)
  server ->> property : userId
  property ->> server : ユーザ情報
  server ->> server : 引数を復号
  alt 復号不可
    server ->> client : エラーメッセージ
    client ->> user : ダイアログを出して終了
  end

  server ->> sheet : 操作名(xxx)に対応する関数呼び出し
  sheet ->> server : 関数(xxx)の処理結果
  server ->> client : 操作結果(SSkey/CPkey)
  deactivate server
  client ->> client : 復号＋署名検証、画面生成
  client ->> user : 結果表示画面
  deactivate client
```

## 2.5 権限設定、変更<a name="ac0010"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0005)
<br>&gt; [[onload時処理](#ac0006) | [新規登録](#ac0007) | [ログイン要求](#ac0008) | [ユーザ情報の参照・編集](#ac0009) | 権限設定、変更]


権限を付与すべきかは個別に判断する必要があるため、システム化せず、管理者がソース(`authServer.changeAuth()`)を直接編集、GASコンソール上で実行する。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> admin : 権限要求
  admin ->>+ server : 権限設定状況確認
  Note right of server : authServer.listAuth()
  server ->>- admin : 権限設定リスト
  admin ->>+ server : ソース修正、実行
  Note right of server : authServer.changeAuth()
  server ->> property : 権限変更
  server ->>- admin : 権限設定リスト
```

# 3 設定情報とオブジェクト定義<a name="ac0011"></a>

[先頭](#ac0000)
<br>&gt; [[初期化処理](#ac0001) | [機能別処理フロー](#ac0005) | 設定情報とオブジェクト定義 | [フォルダ構成](#ac0017) | [仕様(JSDoc)](#ac0018) | [プログラムソース](#ac0021) | [改版履歴](#ac0022)]


- client/server共通設定情報(config.common)
  > クラスメンバ
- authClient固有設定情報(config.client)
  > 保持するデータ構造を含む
- authServer固有設定情報(config.server)
- 引数・戻り値となるオブジェクトの定義(typedef)
- ID, RSA鍵(crypto)
  > client/serverで表にする。使用するライブラリcrypticoの使用方法を含む

## 3.1 client:localStorageに保存する情報<a name="ac0012"></a>

[先頭](#ac0000) > [設定情報とオブジェクト定義](#ac0011)
<br>&gt; [client:localStorageに保存する情報 | [client:sessionStorageに保存する情報](#ac0013) | [server:プロパティサービスに保存する情報](#ac0014)]


## 3.2 client:sessionStorageに保存する情報<a name="ac0013"></a>

[先頭](#ac0000) > [設定情報とオブジェクト定義](#ac0011)
<br>&gt; [[client:localStorageに保存する情報](#ac0012) | client:sessionStorageに保存する情報 | [server:プロパティサービスに保存する情報](#ac0014)]


## 3.3 server:プロパティサービスに保存する情報<a name="ac0014"></a>

[先頭](#ac0000) > [設定情報とオブジェクト定義](#ac0011)
<br>&gt; [[client:localStorageに保存する情報](#ac0012) | [client:sessionStorageに保存する情報](#ac0013) | server:プロパティサービスに保存する情報]


### 3.3.1 server側config<a name="ac0015"></a>

[先頭](#ac0000) > [設定情報とオブジェクト定義](#ac0011) > [server:プロパティサービスに保存する情報](#ac0014)
<br>&gt; [server側config | [ユーザ情報](#ac0016)]


1. {number} loginRetryInterval=3,600,000(60分) - 前回ログイン失敗(3回連続失敗)から再挑戦可能になるまでの時間(ミリ秒)
1. {number} numberOfLoginAttempts=3 - ログイン失敗になるまでの試行回数
1. {number} loginGraceTime=900,000(15分) - パスコード生成からログインまでの猶予時間(ミリ秒)
1. {number} userLoginLifeTime=86,400,000(24時間) - ログイン(CPkey)有効期間

### 3.3.2 ユーザ情報<a name="ac0016"></a>

[先頭](#ac0000) > [設定情報とオブジェクト定義](#ac0011) > [server:プロパティサービスに保存する情報](#ac0014)
<br>&gt; [[server側config](#ac0015) | ユーザ情報]


以下のオブジェクトをユーザ単位に作成し、プロパティサービスに保存する(key = String(ID))。

1. {number} id - ユーザID
1. {string} email - e-mail
1. {number} created - ユーザ側鍵ペアの作成日時(UNIX時刻)。有効期間検証に使用
1. {string} publicKey - ユーザの公開鍵
1. {number} authority - ユーザの権限
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

- 有効期間内かは最新のendAtから判断

# 4 フォルダ構成<a name="ac0017"></a>

[先頭](#ac0000)
<br>&gt; [[初期化処理](#ac0001) | [機能別処理フロー](#ac0005) | [設定情報とオブジェクト定義](#ac0011) | フォルダ構成 | [仕様(JSDoc)](#ac0018) | [プログラムソース](#ac0021) | [改版履歴](#ac0022)]


- archves : アーカイブ
- doc/ : readme.mdの各記事のソース集
  - proto.md : readme.mdのプロトタイプ
  - xxx.md : readme.mdに埋め込む各記事のソース
- src/ : プログラムソース
  - config.common.js : client/server共通config
  - config.client.js : client特有のconfig
  - config.server.js : server特有のconfig
  - authClient.js : class authClientのテンプレート
  - authServer.js : class authServerのテンプレート
  - authXxxx.yyyy.js : class authClient/Server各メソッドのソース
- test/ : テスト用
- build.sh : client/server全体のビルダ
- index.html : クライアント側のソース
- server.gs : サーバ側のソース
- initialize.gs : サーバ側初期化処理のソース
- readme.md : doc配下を統合した、client/server全体の仕様書

# 5 仕様(JSDoc)<a name="ac0018"></a>

[先頭](#ac0000)
<br>&gt; [[初期化処理](#ac0001) | [機能別処理フロー](#ac0005) | [設定情報とオブジェクト定義](#ac0011) | [フォルダ構成](#ac0017) | 仕様(JSDoc) | [プログラムソース](#ac0021) | [改版履歴](#ac0022)]


* [authClient](#authClient)
    * [new authClient(opt)](#new_authClient_new)
    * [.registMail(arg)](#authClient+registMail) ⇒ <code>null</code> \| <code>Error</code>

<a name="new_authClient_new"></a>

## 5.1 new authClient(opt)<a name="ac0019"></a>

[先頭](#ac0000) > [仕様(JSDoc)](#ac0018)
<br>&gt; [new authClient(opt) | [authClient.registMail(arg) ⇒ <code>null</code> \| <code>Error</code>](#ac0020)]


| Param | Type |
| --- | --- |
| opt | <code>Object</code> | 
| opt.programId | <code>string</code> | 

<a name="authClient+registMail"></a>

## 5.2 authClient.registMail(arg) ⇒ <code>null</code> \| <code>Error</code><a name="ac0020"></a>

[先頭](#ac0000) > [仕様(JSDoc)](#ac0018)
<br>&gt; [[new authClient(opt)](#ac0019) | authClient.registMail(arg) ⇒ <code>null</code> \| <code>Error</code>]

ブラウザからの登録要求を受け、IDを返す

**Kind**: instance method of [<code>authClient</code>](#authClient)  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>HTMLElement</code> | ボタン要素 |

**Example**  
```js
- ボタンは`onclick="g.auth.registMail(this)"`を指定
- ボタンとinput要素は兄弟要素とし、それをdivで囲む
```

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>number</code> | <code></code> |  |
| arg | <code>string</code> | <code>null</code> | 暗号化結果の文字列 |

**Example**  
```js
**プロパティサービス：authServer**

- 
```

# 6 プログラムソース<a name="ac0021"></a>

[先頭](#ac0000)
<br>&gt; [[初期化処理](#ac0001) | [機能別処理フロー](#ac0005) | [設定情報とオブジェクト定義](#ac0011) | [フォルダ構成](#ac0017) | [仕様(JSDoc)](#ac0018) | プログラムソース | [改版履歴](#ac0022)]


<details><summary>client.js</summary>

```
class authClient {
/** @constructor
 * @param {Object} opt
 * @param {string} opt.programId
 */
constructor(opt){
  const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 引数のセット
    for(let x in opt){
      this[x] = opt[x];
    }

    v.step = 2; // ユーザ情報を設定
    this.#setUserInfo();

    v.step = 3; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nopt=${stringify(opt)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

  // setUserInfo, doGAS
/** ユーザ情報をメンバに(再)設定する
 * @param {void}
 * @returns {void}
 */
#setUserInfo(){
  const str = sessionStorage.getItem(this.programId);
  this.user = JSON.parse(str);
}

async doGAS(func,...args){
  return await doGAS('authServer',this.user.userId,func,...args);
}

/** ブラウザからの登録要求を受け、IDを返す
 * @param {HTMLElement} arg - ボタン要素
 * @returns {null|Error}
 * 
 * @example
 * 
 * - ボタンは`onclick="g.auth.registMail(this)"`を指定
 * - ボタンとinput要素は兄弟要素とし、それをdivで囲む
 */
async registMail(arg){
  const v = {whois:this.constructor.name+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // メールアドレスのチェック
    v.email = arg.parentNode.querySelector('input[type="email"]').value;
    if( checkFormat(v.email,'email') === false ){
      alert(`"${v.email}"は不適切なメールアドレスです`);
      throw new Error(`"${v.email}" is invalid mail address.`);
    }

    v.step = 2; // authServer.registMailにメアド転送
    v.r = changeScreen('loading');
    if( v.r instanceof Error ) throw v.r;
    v.id = await this.doGAS('registMail',v.email);
    if( v.id instanceof Error ) throw v.id;
    console.log(v.id);

    v.step = 3; // IDをstorageに登録
    v.r = storeUserInfo(this.programId,{userId:v.id});
    if( v.r instanceof Error ) throw v.r;

    v.step = 4; // メニュー再描画、ホーム画面の定義書き換え
    v.r = g.menu.genNavi();
    if( v.r instanceof Error ) throw v.r;
    v.step = 5; // 応募情報修正画面に遷移
    v.r = changeScreen('登録・修正・キャンセル');
    if( v.r instanceof Error ) throw v.r;

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${arg}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
  //:x:$src/client.login1C.js::
  //:x:$src/client.login2C.js::
}
```

</details>

<details><summary>server.gs</summary>

```
/**
 * 
 * @param {number} userId 
 * @param {string} arg - 暗号化結果の文字列
 * @returns {Object}
 * 
 * @example
 * 
 * **プロパティサービス：authServer**
 * 
 * - 
 */
function authServer(userId=null,func=null,arg=null) {
  // 内部関数で'v'を使用するため、ここでは'w'で定義
  const w = {whois:'authServer',rv:null,step:0,
    func:{},  // 使用する関数を集めたオブジェクト
    validityPeriod: 2 * 24 * 3600 * 1000, // クライアント側ログインの有効期間(2日)
    masterSheet: 'master', // 参加者マスタのシート名
    primatyKeyColumn: 'userId', // 主キーとなる項目名。主キーは数値で設定
    emailColumn: 'email', // e-mailを格納する項目名
  };
  console.log(`${w.whois} start.`);
  PropertiesService.getDocumentProperties().deleteProperty(w.whois);
  try {

    if( userId === null ){
      w.step = 1;
      // userId未定でも可能な処理
      // ⇒ 一般公開用メニュー
      if( ['registMail'].find(x => x === func) ){
        
/** authClientからの登録要求を受け、IDを返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {string} email - 要求があったユーザのe-mail
 * @returns {number|Error} 採番されたuserId
 */
w.func.registMail = function(email){
  const v = {whois:w.whois+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // emailアドレスの妥当性検証
    if( checkFormat(email,'email' ) === false ){
      throw new Error(`invalid e-mail address.`);
    }

    v.step = 2; // masterシートを読み込み
    v.master = new SingleTable(w.masterSheet);

    v.step = 3; // 既登録メアドでは無いか確認
    v.m = v.master.data.find(x => x[w.emailColumn] === email);
    if( v.m ) throw new Error(`"${email}" has already registrated.`);

    v.step = 4; // 新規userIdを採番
    if( v.master.data.length === 0 ){
      v.rv = 1;
    } else {
      v.exist = v.master.data.map(x => x[w.primatyKeyColumn]);
      v.rv = Math.max(...v.exist) + 1;
    }

    v.step = 5; // シートに登録
    v.r = v.master.insert([{
      userId:v.rv,
      email:email,
      created:toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn')
    }]);
    if( v.r instanceof Error ) throw v.r;

    v.step = 9; // 終了処理
    console.log(`${w.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nemail=${email}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
        w.rv = w.func.registMail(arg);
        if( w.rv instanceof Error ) throw w.rv;

      } else {
        w.step = 2; // 該当処理なし
        w.rv = null;
      }
    } else {
      if( ['login1S'].find(x => x === func) ){
        w.step = 3;
        // userIdは必要だが、ログインは不要な処理
        // ⇒ 参加者用メニュー(応募情報(自分の個人情報)修正を除く)

        //:x:$src/server.login1S.js::

      } else if( ['login2S','operation'].find(x => x === func) ){
        // ログインしないと操作不可の処理
        // ⇒ 応募情報修正、スタッフ用メニュー

        w.step = 4; // クライアント側の署名検証＋引数のオブジェクト化
/** クライアント側の署名を検証、引数を復号してオブジェクト化する
 * @param {number} userId - ユーザID
 * @param {string} arg - クライアント側での暗号化＋署名結果(文字列)
 * @returns {Object}
 * 
 * @example
 * 
 * サーバ側に鍵ペアが存在しない場合は自動生成してプロパティサービスに保存
 * 
 * ** 注意事項 **
 * 
 * 他のauthServerメソッドは`w.func.xxx`として定義するが、
 * 本メソッドはユーザに使用させないシステム的なメソッドのため、
 * funcではなく`w.initialize`として定義する。
 * 
 * **戻り値の形式**
 * 
 * - {Object|Error} rv
 *   - passPhrase {string} パスフレーズ
 *   - privateKey {Object} RSA形式の秘密鍵
 *   - publicKey {string} RSA形式の公開鍵
 * 
 * **参考：パスフレーズ・秘密鍵・公開鍵の一括保存はできない**
 * 
 * `{passPhrase:〜,privateKey:〜,publicKey:〜}`のように一括して保存しようとすると、以下のエラーが発生。
 * 
 * ```
 * You have exceeded the property storage quota.
 * Please remove some properties and try again.
 * ```
 * 
 * 原因は[プロパティ値のサイズ](https://developers.google.com/apps-script/guides/services/quotas?hl=ja)が超過したため。
 * ⇒ max 9KB/値なので、パスフレーズ・公開鍵・秘密鍵は別々のプロパティとして保存が必要
 */
w.func.verifySignature = function(userId=null,arg=null){
  const v = {whois:w.whois+'.verifySignature',rv:{},step:0};
  console.log(`${v.whois} start.`);
  try {

    // userId, argは共に必須
    if( userId === null ) throw new Error(`${v.whois} Error: no userId.`);
    if( arg === null ) throw new Error(`${v.whois} Error: no arg.`);

    v.step = 1; // サーバ側鍵ペアの取得・生成　※親関数のwhoisを使用
    v.RSA = PropertiesService.getDocumentProperties().getProperty(w.whois);
    if( v.RSA === null ){
      v.step = 1.1;
      v.bits = 1024;  // ビット長
      v.RSA.passPhrase = createPassword(16); // 16桁のパスワードを自動生成
      v.step = 1.2; // 秘密鍵の生成
      v.RSA.privateKey = cryptico.generateRSAKey(v.RSA.passPhrase, v.bits);
      v.step = 1.3; // 公開鍵の生成
      v.RSA.publicKey = cryptico.publicKeyString(v.RSA.privateKey);
      PropertiesService.getDocumentProperties().setProperty(w.whois,v.RSA);
    }

    v.step = 2; // クライアント側情報の取得
    v.client = PropertiesService.getDocumentProperties().getProperty(userId);

    if( v.client === null ){
      v.step = 3; // クライアント側情報未登録 ⇒ 空オブジェクトを返す
      v.client = {
        userId: userId,
        email: '',
        created: Date.now(),
        publicKeyID: '',
        authority: 2,
        log: [],
      };
      PropertiesService.getDocumentProperties().setProperty(userId,v.client);
    } else {
      v.step = 4; // クライアント側情報登録済
      v.step = 4.1; // 引数の復元
      v.decrypt = cryptico.decrypt(arg,v.RSA.privateKey);
      console.log(`v.decrypt=${stringify(v.decrypt)}`);
      v.step = 4.2; // 署名の検証
      v.decrypt.publicKeyID = cryptico.publicKeyID(v.decrypt.publicKeyString);
      v.decrypt.verify = v.client.publicKeyID === v.decrypt.publicKeyID;
      v.step = 4.3; // 有効期間の確認。　※親関数のvalidityPeriodを使用
      v.decrypt.validityPeriod = (v.client.created + w.validityPeriod) < Date.now();
      v.step = 4.3; // 戻り値をオブジェクト化
      v.rv = v.decrypt.status === 'success' && v.decrypt.verify && v.decrypt.validityPeriod
      ? JSON.parse(v.decrypt.plaintext)
      : new Error(`cryptico.decrypt error.`
      + `\nstatus="${v.decrypt.status}"`
      + `\nplaintext="${v.decrypt.plaintext}"`
      + `\nsignature="${v.decrypt.signature}"`
      + `\npublicKeyString="${v.decrypt.publicKeyString}"`
      + `\npublicKeyID="${v.decrypt.publicKeyID}"`
      + `\nverify="${v.decrypt.verify}"`
      + `\nvalidityPeriod="${v.decrypt.validityPeriod}"`);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    console.log(`type = ${typeof v.rv}\npassPhrase="${v.rv.passPhrase}\npublicKey="${v.rv.publicKey}"`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    return e;
  }
}
        w.r = w.func.verifySignature(userId,arg);
        if( w.r instanceof Error ) throw w.r;

        switch( func ){
          case 'login2S': w.step = 4 + ':login2S';
            //:x:$src/server.login2S.js::
            break;
          // 後略
          //:x:$src/server.listAuth.js::
          //:x:$src/server.changeAuth.js::
          //:x:$src/server.operation.js::
        }
      } else {
        w.step = 5; // 該当処理なし
        w.rv = null;
      }
    }

    w.step = 6; // 終了処理
    console.log(`${w.whois} normal end.\nw.rv=${stringify(w.rv)}`);
    // 該当処理なしの場合、何も返さない
    if( w.rv !== null ) return w.rv;

  } catch(e) {
    e.message = `${w.whois} abnormal end at step.${w.step}`
    + `\n${e.message}\nuserId=${userId}\nfunc=${func}`;
    console.error(`${e.message}\nw=${stringify(w)}`);
    return e;
  }
}
```

</details>

# 7 改版履歴<a name="ac0022"></a>

[先頭](#ac0000)
<br>&gt; [[初期化処理](#ac0001) | [機能別処理フロー](#ac0005) | [設定情報とオブジェクト定義](#ac0011) | [フォルダ構成](#ac0017) | [仕様(JSDoc)](#ac0018) | [プログラムソース](#ac0021) | 改版履歴]


- rev.2.0.0 : class Authと統合
- rev.1.1.0 : 2024/03/14
  - setupInstanceをmergeDeeplyに置換(setupInstanceは廃番)
  - arg.funcの取り扱いを`new Function()`から直接関数を渡す形に修正
  - changeメソッドを廃止、changeScreenで代替
- rev.1.0.0 : 2024/01/03 初版

