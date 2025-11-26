<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

クライアント側中核クラス

authClientは、ローカル関数(ブラウザ内JavaScript)からの要求を受け、
サーバ側(authServer)への暗号化通信リクエストを署名・暗号化、
サーバ側処理を経てローカル側に戻された結果を復号・検証し、
処理結果に応じてクライアント側処理を適切に振り分ける中核関数です。

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | [authClientConfig](authClientConfig.md#authclientconfig_members) | <span style="color:red">必須</span> | 動作設定変数(config) |  |
| crypto | [cryptoClient](cryptoClient.md#cryptoclient_members) | <span style="color:red">必須</span> | クライアント側暗号関係処理 |  |
| idb | authIndexedDB | <span style="color:red">必須</span> | IndexedDBの内容をauthClient内で共有 |  |

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authclient_constructor) | private | コンストラクタ |  |
| [initialize()](#authclient_initialize) | async static | コンストラクタ(非同期処理対応) |  |
| [exec()](#authclient_exec) | public |  |  |

- 引数無し(void)

- [authClient](#authclient_members)インスタンス

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | [authClientConfig](authClientConfig.md#authclientconfig_members) | <span style="color:red">必須</span> | authClientの動作設定変数 |  |

- [authClient](authClient.md#authclient_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
  | :-- | :-- | :-- | :-- | :-- |
  | cf | [authClientConfig](authClientConfig.md#authclientconfig_members) | <span style="color:red">必須</span> | 動作設定変数(config) |  |
  | crypto | [cryptoClient](cryptoClient.md#cryptoclient_members) | <span style="color:red">必須</span> | クライアント側暗号関係処理 |  |
  | idb | authIndexedDB | <span style="color:red">必須</span> | IndexedDBの内容をauthClient内で共有 |  |

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | string | <span style="color:red">必須</span> |  |  |

- [authClient](authClient.md#authclient_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
  | :-- | :-- | :-- | :-- | :-- |
  | cf | [authClientConfig](authClientConfig.md#authclientconfig_members) | <span style="color:red">必須</span> | 動作設定変数(config) |  |
  | crypto | [cryptoClient](cryptoClient.md#cryptoclient_members) | <span style="color:red">必須</span> | クライアント側暗号関係処理 |  |
  | idb | authIndexedDB | <span style="color:red">必須</span> | IndexedDBの内容をauthClient内で共有 |  |