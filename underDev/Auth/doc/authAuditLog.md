<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authauditlog">authAuditLog クラス仕様書</span>

## <span id="authauditlog_summary">🧭 概要</span>

authServerの監査ログ

- 監査ログ出力が必要なメソッドの冒頭でインスタンス化、処理開始時刻等を記録
- 出力時にlogメソッドを呼び出して処理時間を計算、シート出力

### 🧩 <span id="authauditlog_internal">内部構成</span>

🔢 authAuditLog メンバ一覧

| 項目名 | データ型 | 要否 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | string | Date.now() | 要求日時 | ISO8601拡張形式の文字列 |
| duration | number | <span style="color:red">必須</span> | 処理時間 | ミリ秒単位 |
| memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス |
| deviceId | string | 任意 | デバイスの識別子 |  |
| func | string | <span style="color:red">必須</span> | サーバ側関数名 |  |
| result | string | normal | サーバ側処理結果 | fatal/warning/normal |
| note | string | <span style="color:red">必須</span> | 備考 |  |

🧱 <span id="authauditlog_method">authAuditLog メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authauditlog_constructor) | private | コンストラクタ |

## <span id="authauditlog_constructor">🧱 <a href="#authauditlog_method">authAuditLog.constructor()</a></span>

コンストラクタ

### <span id="authauditlog_constructor_param">📥 引数</span>

| 項目名 | データ型 | 要否 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| note | [authConfig](authConfig.md#authconfig_internal) \| [authAuditLog](authAuditLog.md#authauditlog_internal) | <span style="color:red">必須</span> |  | test |

### <span id="authauditlog_constructor_process">🧾 処理手順</span>



### <span id="authauditlog_constructor_returns">📤 戻り値</span>

| [authAuditLog](authAuditLog.md#authauditlog_internal) | データ型 | 説明 | 備考 |
| :-- | :-- | :-- | :-- |
| timestamp | string | 要求日時 | ISO8601拡張形式の文字列 |
| duration | number | 処理時間 | ミリ秒単位 |
| memberId | string | メンバの識別子 | =メールアドレス |
| deviceId | string | デバイスの識別子 |  |
| func | string | サーバ側関数名 |  |
| result | string | サーバ側処理結果 | fatal/warning/normal |
| note | string | 備考 |  |