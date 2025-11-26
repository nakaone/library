<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

クライアント側の暗号化・復号処理

- メンバ無し

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#cryptoclient_constructor) | private | コンストラクタ |  |
| [decrypt()](#cryptoclient_decrypt) | public | authServer->authClientのメッセージを復号＋署名検証 |  |
| [encrypt()](#cryptoclient_encrypt) | public | authClient->authServerのメッセージを暗号化＋署名 |  |
| [generateKeys()](#cryptoclient_generatekeys) | public | 新たなクライアント側鍵ペアを作成 |  |

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | [authClientConfig](authClientConfig.md#authclientconfig_members) | <span style="color:red">必須</span> |  | authClientの動作設定変数 |

- [cryptoClient](#cryptoclient_members)インスタンス

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| response | encryptedResponse | <span style="color:red">必須</span> | 暗号化された処理結果 |  |

- [authResponse](authResponse.md#authresponse_members) : 復号された処理結果

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
  | :-- | :-- | :-- | :-- | :-- |
  |  | string | <span style="color:red">必須</span> |  |  |

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [authRequest](authRequest.md#authrequest_members) | <span style="color:red">必須</span> | 平文の処理要求 |  |

- [encryptedRequest](encryptedRequest.md#encryptedrequest_members) : 暗号化された処理要求

Error: Error: not fixed: "encryptedRequest"

- 引数無し(void)

- [cryptoClient](cryptoClient.md#cryptoclient_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
  | :-- | :-- | :-- | :-- | :-- |