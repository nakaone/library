<div style="text-align: right;">

[総説](../spec.md) | [クライアント側クラス一覧](../cl/list.md) | [サーバ側クラス一覧](../sv/list.md)

<!--
[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)
-->
</div>

# <span id="authauditlog">authAuditLog クラス仕様書</span>

authServerの監査ログ

- 監査ログ出力が必要なメソッドの冒頭でインスタンス化、処理開始時刻等を記録
- 出力時にlogメソッドを呼び出して処理時間を計算、シート出力

## <span id="authauditlog_members">🔢 authAuditLog メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | string | Date.now() | 要求日時 | ISO8601拡張形式の文字列 |
| duration | number | 任意 | 処理時間 | ミリ秒単位 |
| memberId | string | 任意 | メンバの識別子 |  |
| deviceId | string | 任意 | デバイスの識別子 |  |
| func | string | 任意 | サーバ側関数名 |  |
| result | string | normal | サーバ側処理結果 | "fatal","warning","normal" |
| note | string | 任意 | 備考 |  |

## <span id="authauditlog_methods">🧱 authAuditLog メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authauditlog_constructor) | private | コンストラクタ |  |

### <span id="authauditlog_constructor">🧱 authAuditLog.constructor()</span>

#### <span id="authauditlog_constructor_caller">📞 呼出元</span>

#### <span id="authauditlog_constructor_params">📥 引数</span>

- 引数無し(void)

#### <span id="authauditlog_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定
- テスト：[authConfig](authConfig.md#authconfig_constructor)をインスタンス化
  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 異常テスト |
  | :-- | :-- | :-- | :-- | :-- | :-- |
  | responseTime | number | Date.now() | エラー発生日時 |  | — |
  | errorType | string | Error.name | エラーの型(ex."ReferenceError") |  | — |
  | function | string | v.whois | エラーが起きたクラス・メソッド名 |  | — |
  | step | string | v.step | エラーが起きたメソッド内の位置 |  | — |
  | variable | string | JSON.stringify(v) | エラー時のメソッド内汎用変数(JSON文字列) |  | — |
  | message | string | Error.message | エラーメッセージ |  | **テスト** |
  | stack | string | Error.stack | エラー時のスタックトレース |  | — |

#### <span id="authauditlog_constructor_returns">📤 戻り値</span>

- [authAuditLog](#authauditlog_members)インスタンス