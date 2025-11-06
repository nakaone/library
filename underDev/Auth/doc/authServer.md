<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authserver">authServer クラス仕様書</span>

## <span id="authserver_summary">🧭 概要</span>

サーバ側auth中核クラス

### <span id="authserver_example">実装・使用例</span>

```js
// ライブラリ関数定義
function devTools(){...}; // (中略)

// authServer関係クラス定義
class authServer{...};
class cryptoServer{...};
class Member{...};  // (中略)

// グローバル変数定義
const dev = devTools();
const asv = authServer({
  // プロジェクト毎の独自パラメータ
});

// Webアプリ定義
function doGet(e){
  const rv = asv.exec(e);
  if( rv !== null ){ // fatal(無応答)の場合はnullを返す
    return ContentService.createTextOutput(rv);
  }
}

// スプレッドシートメニュー定義
SpreadsheetApp.getUi().createMenu('追加したメニュー')
  .addItem('実行環境の初期化', 'menu10')
  .addItem('加入認否入力', 'menu20')
  .addSeparator()
  .addSubMenu(
    ui.createMenu("システム関係")
      .addItem("鍵ペアの更新", "menu31")
  )
  .addToUi();
const menu10 = () => asv.setupEnvironment();
const menu20 = () => asv.listNotYetDecided();
const menu31 = () => asv.resetSPkey();
```

### 🧩 <span id="authserver_internal">内部構成</span>

🔢 authServer メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| cf | ❌ | [authClientConfig](authClientConfig.md#authclientconfig_internal) | — | 動作設定変数(config) |  | 
| crypto | ❌ | [cryptoServer](cryptoServer.md#cryptoserver_internal) | — | 暗号化・復号用インスタンス |  | 
| member | ❌ | [Member](Member.md#member_internal) | — | 対象メンバのインスタンス |  | 
| auditLog | ❌ | [authAuditLog](authAuditLog.md#authauditlog_internal) | — | 監査ログのインスタンス |  | 
| errorLog | ❌ | [authErrorLog](authErrorLog.md#autherrorlog_internal) | — | エラーログのインスタンス |  | 
| pv | ❌ | Object | — | authServer内共通変数 |  | 


🧱 <span id="authserver_method">authServer メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authserver_constructor) | private | コンストラクタ |

## <span id="authserver_constructor">🧱 <a href="#authserver_method">authServer.constructor()</a></span>

コンストラクタ

### <span id="{cc}_source">📄 実装例</span>

```js
class authServer {
  constructor(config){
    this.cf = config; // 動作設定値をauthServer内で共有
    this.crypto = new cryptoServer(); // サーバ側の暗号化・復号処理
    this.member = new Member(config); // メンバ
    this.auditLog = new authAuditLog();  // 監査ログ
    this.errorLog = new authErrorLog();  // エラーログ
    this.pv = { // authServer内共通変数(public variables)
      // 中略。constructorのメンバ一覧参照
    };
  }
}
```

### <span id="authserver_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserver_constructor_process">🧾 処理手順</span>



### <span id="authserver_constructor_returns">📤 戻り値</span>

  - [authServer](authServer.md#authserver_internal): サーバ側auth中核クラス
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | cf | authClientConfig | 【必須】 | — |
    | crypto | cryptoServer | 【必須】 | — |
    | member | Member | 【必須】 | — |
    | auditLog | authAuditLog | 【必須】 | — |
    | errorLog | authErrorLog | 【必須】 | — |
    | pv | Object | 【必須】 | — |