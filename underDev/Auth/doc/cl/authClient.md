<style>
  .submenu {  /* MD内のサブメニュー。右寄せ＋文字サイズ小 */
    text-align: right;
    font-size: 0.8rem;
  }
  .nowrap td {white-space:nowrap;} /* 横長な表を横スクロール */
  .nowrap b {background:yellow;}

.popup {color:#084} /* titleに文字列を設定した項目 */
  td {white-space:nowrap;}
</style>
<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md) | [開発](../dev.md)

</div>

# <span id="authclient">authClient クラス仕様書</span>

クライアント側中核クラス

authClientは、ローカル関数(ブラウザ内JavaScript)からの要求を受け、
サーバ側(authServer)への暗号化通信リクエストを署名・暗号化、
サーバ側処理を経てローカル側に戻された結果を復号・検証し、
処理結果に応じてクライアント側処理を適切に振り分ける中核関数です。

## <span id="authclient_summary">🧭 authClient クラス 概要</span>

- クロージャ関数ではなくクラスとして作成
- 内発処理はローカル関数からの処理要求に先行して行う

### 🧩 想定する実装

constructorは非同期処理を行えないので、initializeを別途用意する。

```js
class authClient {
  /**
   * コンストラクタは同期的に動作し、非同期処理は行わない
   */
  constructor(data){
    // 非同期処理の結果を使ってインスタンスのプロパティを初期化
    this.data = data;
    console.log("✅ インスタンスが初期化されました:", this.data);
  }

  /**
   * ⚡ 非同期でデータを取得し、インスタンスを生成・返す静的ファクトリ関数
   */
  static async initialize(){

    // --- IndexedDB等、初期化時に必要となる一連の非同期処理を実行 -----
    const rawData = await new Promise(resolve => {
      setTimeout(() => {
        resolve(”非同期で取得されたデータ:"+resourceId);
      }, 1000); // 1秒待機
    });
    // --- 非同期処理サンプルここまで -----

    // 取得したデータを使ってインスタンスを生成し、返す
    const instance = new authClient(rawData);
    return instance;
  }

  /**
   * 以降、その他メソッド
   */
  exec(){
    // 省略
  }
}
```

## <span id="authclient_members">🔢 authClient メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| _IndexedDB | static | <span style="color:red">必須</span> | データベース接続オブジェクトを格納する静的変数 |  |
| idb | public | <span style="color:red">必須</span> | IndexedDBの内容をauthClient内で共有 |  |

## <span id="authclient_methods">🧱 authClient メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authclient_constructor) | private | コンストラクタ |  |
| [exec()](#authclient_exec) | public | ローカル関数の処理要求を処理 |  |
| [initialize()](#authclient_initialize) | static async | コンストラクタ(非同期処理対応) |  |
| [setIndexedDB()](#authclient_setindexeddb) | async | IndexedDBの更新(upsert) |  |

### <span id="authclient_constructor"><a href="#authclient_methods">🧱 authClient.constructor()</a></span>

#### <span id="authclient_constructor_params">📥 引数</span>

- 引数無し(void)

#### <span id="authclient_constructor_process">🧾 処理手順</span>

- this.cfに[authClientConfig](authClientConfig.md#authclientconfig_members)をセット
- this.idbを初期化

#### <span id="authclient_constructor_returns">📤 戻り値</span>

- [authClient](#authclient_members)インスタンス
### <span id="authclient_exec"><a href="#authclient_methods">🧱 authClient.exec()</a></span>

#### <span id="authclient_exec_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | [LocalRequest](LocalRequest.md#localrequest_members) | <span style="color:red">必須</span> | ローカル関数からの処理要求 |  |

#### <span id="authclient_exec_process">🧾 処理手順</span>

#### <span id="authclient_exec_returns">📤 戻り値</span>

- Object : 

### <span id="authclient_initialize"><a href="#authclient_methods">🧱 authClient.initialize()</a></span>

#### <span id="authclient_initialize_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | [authClientConfig](authClientConfig.md#authclientconfig_members) | <span style="color:red">必須</span> | authClientの動作設定変数 |  |

#### <span id="authclient_initialize_process">🧾 処理手順</span>

- authClientインスタンス作成
- DB接続を実行、`_IndexedDB`に格納
- オプション設定値をIndexedDBに保存

#### <span id="authclient_initialize_returns">📤 戻り値</span>

- [authClient](authClient.md#authclient_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
  | :-- | :-- | :-- | :-- | :-- |
  | _IndexedDB | static | <span style="color:red">必須</span> | データベース接続オブジェクトを格納する静的変数 |  |
  | idb | public | <span style="color:red">必須</span> | IndexedDBの内容をauthClient内で共有 |  |
### <span id="authclient_setindexeddb"><a href="#authclient_methods">🧱 authClient.setIndexedDB()</a></span>

#### <span id="authclient_setindexeddb_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object.<string,any> | <span style="color:red">必須</span> |  | 更新する{キー：値} |

#### <span id="authclient_setindexeddb_process">🧾 処理手順</span>

#### <span id="authclient_setindexeddb_returns">📤 戻り値</span>

- null : 正常終了時

- Error : 異常終了時(messageはシステムメッセージ)