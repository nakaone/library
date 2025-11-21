<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

<!--
[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)
-->
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

## <span id="authclient_members">🔢 authClient メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authClientConfig | <span style="color:red">必須</span> | 動作設定変数(config) |  |
| crypto | cryptoClient | <span style="color:red">必須</span> | クライアント側暗号関係処理 |  |
| idb | authIndexedDB | <span style="color:red">必須</span> | IndexedDBの内容をauthClient内で共有 |  |

## <span id="authclient_methods">🧱 authClient メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authclient_constructor) | private | コンストラクタ |  |

### <span id="authclient_constructor">🧱 authClient.constructor()</span>

#### <span id="authclient_constructor_caller">📞 呼出元</span>

#### <span id="authclient_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | authClientConfig | <span style="color:red">必須</span> | authClientの動作設定変数 |  |

#### <span id="authclient_constructor_process">🧾 処理手順</span>

- メンバ変数の初期化
  - authClient内共有用変数を準備("cf = new [authClientConfig](authClientConfig.md#authclientconfig_constructor)()")
  - 鍵ペアを準備("crypto = new [cryptoClient](cryptoClient.md#cryptoclient_constructor)()")
  - IndexedDbを準備("idb = new [authIndexedDb](authIndexedDb.md#authindexeddb_constructor)()")

#### <span id="authclient_constructor_returns">📤 戻り値</span>

- [authClient](#authclient_members)インスタンス