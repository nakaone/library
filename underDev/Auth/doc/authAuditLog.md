<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authauditlog">authAuditLog クラス仕様書</span>

## <span id="authauditlog_summary">🧭 概要</span>

authServerの監査ログ

- 監査ログ出力が必要なメソッドの冒頭でインスタンス化、処理開始時刻等を記録
- 出力時にlogメソッドを呼び出して処理時間を計算、シート出力

### 🧩 <span id="authauditlog_internal">内部構成</span>

🔢 authAuditLog メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| timestamp | ⭕ | string | Date.now() | 要求日時 | ISO8601拡張形式の文字列 | 
| duration | ❌ | number | — | 処理時間 | ミリ秒単位 | 
| memberId | ❌ | string | — | メンバの識別子 | =メールアドレス | 
| deviceId | ⭕ | string | — | デバイスの識別子 |  | 
| func | ❌ | string | — | サーバ側関数名 |  | 
| result | ⭕ | string | normal | サーバ側処理結果 | fatal/warning/normal | 
| note | ❌ | string | — | 備考 |  | 


🧱 <span id="authauditlog_method">authAuditLog メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authauditlog_constructor) | private | コンストラクタ |
| [log](#authauditlog_log) | public | 監査ログシートに処理要求を追記 |

## <span id="authauditlog_constructor">🧱 <a href="#authauditlog_method">authAuditLog.constructor()</a></span>

コンストラクタ

### <span id="authauditlog_constructor_caller">📞 呼出元</span>

- [authServer.exec()](authServer.md#authauditlog_constructor)
- [authServer.listNotYetDecided()](authServer.md#authauditlog_constructor)
- [authServer.resetSPkey()](authServer.md#authauditlog_constructor)
- [authServer.setupEnvironment()](authServer.md#authauditlog_constructor)

### <span id="authauditlog_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| config | ❌ | [authServerConfig](authServerConfig.md#authserverconfig_internal) | — | authServerの動作設定変数 | 

### <span id="authauditlog_constructor_process">🧾 処理手順</span>

- "[authServerConfig](authServerConfig.md#authserverconfig_internal).auditLog"シートが無ければ作成
- 引数の内、authAuditLogと同一メンバ名があればthisに設定
- 引数にnoteがあればthis.noteに設定
- timestampに現在日時を設定

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

## <span id="authauditlog_log">🧱 <a href="#authauditlog_method">authAuditLog.log()</a></span>

監査ログシートに処理要求を追記

### <span id="authauditlog_log_caller">📞 呼出元</span>

- [authServer.exec()](authServer.md#authauditlog_log)
- [authServer.listNotYetDecided()](authServer.md#authauditlog_log)
- [authServer.resetSPkey()](authServer.md#authauditlog_log)
- [authServer.setupEnvironment()](authServer.md#authauditlog_log)
- [Member.reissuePasscode()](Member.md#authauditlog_log)
- [Member.removeMember()](Member.md#authauditlog_log)
- [Member.updateCPkey()](Member.md#authauditlog_log)

### <span id="authauditlog_log_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ❌ | [authRequest](authRequest.md#authrequest_internal) \| string | — | 処理要求オブジェクトまたは内発処理名 | 
| response | ❌ | [authResponse](authResponse.md#authresponse_internal) | — | 処理結果 | 

### <span id="authauditlog_log_process">🧾 処理手順</span>

- メンバに以下を設定

  - [authAuditLog](authAuditLog.md#authauditlog_internal): authServerの監査ログ
    | 項目名 | データ型 | 生成時 | 設定内容 |
    | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | **toLocale(this.timestamp)(ISO8601拡張形式)** |
    | duration | number | 【必須】 | **Date.now() - this.timestamp** |
    | memberId | string | 【必須】 | **request.memberId** |
    | deviceId | string | 【任意】 | **request.deviceId** |
    | func | string | 【必須】 | **request.func** |
    | result | string | normal | **response.result** |
    | note | string | 【必須】 | **this.note + response.message** |
- メンバを"[authServerConfig](authServerConfig.md#authserverconfig_internal).auditLog"シートの末尾に出力

### <span id="authauditlog_log_returns">📤 戻り値</span>

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