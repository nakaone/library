<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authauditlog">authAuditLog クラス仕様書</span>

## <span id="authauditlog_summary">🧭 概要</span>

authServerの監査ログ

クラスとして定義、authServer内でインスタンス化(∵authServerConfigを参照するため)<br>
暗号化前encryptedRequest.memberId/deviceIdを基にインスタンス作成、その後resetメソッドで暗号化成功時に確定したauthRequest.memberId/deviceIdで上書きする想定。

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
| [reset](#authauditlog_reset) | public | authAuditLogインスタンス変数の値を再設定 |

## <span id="authauditlog_constructor">🧱 <a href="#authauditlog_method">authAuditLog.constructor()</a></span>

コンストラクタ

### <span id="authauditlog_constructor_param">📥 引数</span>


- 無し(void)

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

- [Member.reissuePasscode()](Member.md#authauditlog_log)
- [Member.removeMember()](Member.md#authauditlog_log)
- [Member.updateCPkey()](Member.md#authauditlog_log)

### <span id="authauditlog_log_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ❌ | [authRequest](authRequest.md#authrequest_internal) \| string | — | 処理要求オブジェクトまたは内発処理名 | 

### <span id="authauditlog_log_process">🧾 処理手順</span>

- 引数がObjectの場合：func,result,noteがあればthisに上書き
- 引数がstringの場合：this.funcにargをセット
- 所要時間の計算(this.duration = Date.now() - this.timestamp)
- timestampはISO8601拡張形式の文字列に変更
- シートの末尾行にauthAuditLogオブジェクトを追加

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

## <span id="authauditlog_reset">🧱 <a href="#authauditlog_method">authAuditLog.reset()</a></span>

authAuditLogインスタンス変数の値を再設定

### <span id="authauditlog_reset_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ⭕ | [authRequest](authRequest.md#authrequest_internal) | {} | 変更する設定値 | 

### <span id="authauditlog_reset_process">🧾 処理手順</span>

- 【要修正】用途を明確化、不要なら削除
- [authServerConfig](authServerConfig.md#authserverconfig_internal).auditLogシートが無ければ作成
- 引数の内、authAuditLogと同一メンバ名があればthisに設定

### <span id="authauditlog_reset_returns">📤 戻り値</span>

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