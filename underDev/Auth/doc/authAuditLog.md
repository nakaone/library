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

| 項目名 | データ型 | 要否 | 説明 |
| :-- | :-- | :-- | :-- |
| timestamp | string | Date.now() | 要求日時 |
| duration | number | **必須** | 処理時間 |
| memberId | string | **必須** | メンバの識別子 |
| deviceId | string | 任意 | デバイスの識別子 |
| func | string | **必須** | サーバ側関数名 |
| result | string | normal | サーバ側処理結果 |
| note | string | **必須** | 備考 |

🧱 <span id="authauditlog_method">authAuditLog メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authauditlog_constructor) | private | コンストラクタ |

## <span id="authauditlog_constructor">🧱 <a href="#authauditlog_method">authAuditLog.constructor()</a></span>

コンストラクタ

### <span id="authauditlog_constructor_param">📥 引数</span>

| 項目名 | データ型 | 要否 | 説明 |
| :-- | :-- | :-- | :-- |
| note | [authConfig](authConfig.md#authconfig_internal) \| [authAuditLog](authAuditLog.md#authauditlog_internal) | **必須** |  |

### <span id="authauditlog_constructor_process">🧾 処理手順</span>



### <span id="authauditlog_constructor_returns">📤 戻り値</span>

  - [authAuditLog](authAuditLog.md#authauditlog_internal): authServerの監査ログ
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | — |
    | duration | number | 【必須】 | — |
    | memberId | string | 【必須】 | — |
    | deviceId | string | 【任意】 | — |
    | func | string | 【必須】 | — |
    | result | string | normal | — |
    | note | string | 【必須】 | — |