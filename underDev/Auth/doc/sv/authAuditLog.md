<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>
<style>
  td {white-space:nowrap;}
</style>

# <span id="authauditlog">authAuditLog クラス仕様書</span>

authServerの監査ログ

- 監査ログ出力が必要なメソッドの冒頭でインスタンス化、処理開始時刻等を記録
- 出力時にlogメソッドを呼び出して処理時間を計算、シート出力

## <span id="authauditlog_members">🔢 authAuditLog メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | string | Date.now() | 要求日時 | ISO8601拡張形式の文字列 |
| duration | number | <span style="color:red">必須</span> | 処理時間 | ミリ秒単位 |
| memberId | string | <span style="color:red">必須</span> | メンバの識別子 | メールアドレス |
| deviceId | string | 任意 | デバイスの識別子 |  |
| func | string | <span style="color:red">必須</span> | サーバ側関数名 |  |
| result | string | normal | サーバ側処理結果 | "fatal","warning","normal" |
| note | string | <span style="color:red">必須</span> | 備考 |  |

## <span id="authauditlog_methods">🧱 authAuditLog メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authauditlog_constructor) | private | コンストラクタ |  |
| [log()](#authauditlog_log) | public | 監査ログシートに処理要求を追記 |  |

### <span id="authauditlog_constructor"><a href="#authauditlog_methods">🧱 authAuditLog.constructor()</a></span>

#### <span id="authauditlog_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | [authServerConfig](authServerConfig.md#authserverconfig_members) | <span style="color:red">必須</span> | authServerの動作設定変数 |  |

#### <span id="authauditlog_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定
- authServerConfig].[auditLog](authServerConfig.md#authserverconfig_members)シートが無ければ作成
- 引数の内、authAuditLogと同一メンバ名があればthisに設定
- 引数にnoteがあればthis.noteに設定
- timestampに現在日時を設定

#### <span id="authauditlog_constructor_returns">📤 戻り値</span>

- [authAuditLog](#authauditlog_members)インスタンス
### <span id="authauditlog_log"><a href="#authauditlog_methods">🧱 authAuditLog.log()</a></span>

#### <span id="authauditlog_log_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [authRequest](authRequest.md#authrequest_members)\|string | <span style="color:red">必須</span> | 処理要求オブジェクトまたは内発処理名 |  |
| response | [authResponse](authResponse.md#authresponse_members) | <span style="color:red">必須</span> | 処理結果 |  |

#### <span id="authauditlog_log_process">🧾 処理手順</span>

- メンバに以下を設定
  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
  | :-- | :-- | :-- | :-- | :-- |
  | timestamp | string | Date.now() | 要求日時 | ISO8601拡張形式の文字列 |
  | duration | number | <span style="color:red">必須</span> | 処理時間 | ミリ秒単位 |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | メールアドレス |
  | deviceId | string | 任意 | デバイスの識別子 |  |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  |
  | result | string | normal | サーバ側処理結果 | "fatal","warning","normal" |
  | note | string | <span style="color:red">必須</span> | 備考 |  |

#### <span id="authauditlog_log_returns">📤 戻り値</span>

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