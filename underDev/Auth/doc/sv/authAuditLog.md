<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

authServerの監査ログ

- 監査ログ出力が必要なメソッドの冒頭でインスタンス化、処理開始時刻等を記録
- 出力時にlogメソッドを呼び出して処理時間を計算、シート出力

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | string | Date.now() | 要求日時 | ISO8601拡張形式の文字列 |
| duration | number | <span style="color:red">必須</span> | 処理時間 | ミリ秒単位 |
| memberId | string | <span style="color:red">必須</span> | メンバの識別子 | メールアドレス |
| deviceId | string | 任意 | デバイスの識別子 |  |
| func | string | <span style="color:red">必須</span> | サーバ側関数名 |  |
| result | string | normal | サーバ側処理結果 | "fatal","warning","normal" |
| note | string | <span style="color:red">必須</span> | 備考 |  |

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authauditlog_constructor) | private | コンストラクタ |  |
| [log()](#authauditlog_log) | public | 監査ログシートに処理要求を追記 |  |

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | [authServerConfig](authServerConfig.md#authserverconfig_members) | <span style="color:red">必須</span> | authServerの動作設定変数 |  |

- [authAuditLog](#authauditlog_members)インスタンス

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [authRequest](authRequest.md#authrequest_members)\|string | <span style="color:red">必須</span> | 処理要求オブジェクトまたは内発処理名 |  |
| response | [authResponse](authResponse.md#authresponse_members) | <span style="color:red">必須</span> | 処理結果 |  |

- [authAuditLog](authAuditLog.md#authauditlog_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
  | :-- | :-- | :-- | :-- | :-- |
  | timestamp | string | Date.now() | 要求日時 | ISO8601拡張形式の文字列 |
  | duration | number | <span style="color:red">必須</span> | 処理時間 | ミリ秒単位 |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | メールアドレス |
  | deviceId | string | 任意 | デバイスの識別子 |  |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  |
  | result | string | normal | サーバ側処理結果 | "fatal","warning","normal" |
  | note | string | <span style="color:red">必須</span> | 備考 |  |