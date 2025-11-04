<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="autherrorlog">authErrorLog クラス仕様書</span>

## <span id="autherrorlog_summary">🧭 概要</span>

authServerのエラーログ

クラスとして定義、authServer内でインスタンス化(∵authServerConfigを参照するため)<br>
暗号化前encryptedRequest.memberId/deviceIdを基にインスタンス作成、その後resetメソッドで暗号化成功時に確定したauthRequest.memberId/deviceIdで上書きする想定。

### 🧩 <span id="autherrorlog_internal">内部構成</span>

🔢 authErrorLog メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| timestamp | ⭕ | string | Date.now() | 要求日時 | ISO8601拡張形式の文字列 | 
| memberId | ❌ | string | — | メンバの識別子 | =メールアドレス | 
| deviceId | ❌ | string | — | デバイスの識別子 |  | 
| result | ⭕ | string | fatal | サーバ側処理結果 | fatal/warning/normal | 
| message | ⭕ | string | — | サーバ側からのエラーメッセージ | normal時は`undefined` | 
| stackTrace | ⭕ | string | — | エラー発生時のスタックトレース | 本項目は管理者への通知メール等、シート以外には出力不可 | 


🧱 <span id="autherrorlog_method">authErrorLog メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#autherrorlog_constructor) | private | コンストラクタ |
| [log](#autherrorlog_log) | public | エラーログをシートに出力 |
| [reset](#autherrorlog_reset) | public | authErrorLogインスタンス変数の値を再設定 |

## <span id="autherrorlog_constructor">🧱 <a href="#autherrorlog_method">authErrorLog.constructor()</a></span>

コンストラクタ

### <span id="autherrorlog_constructor_param">📥 引数</span>


- 無し(void)

### <span id="autherrorlog_constructor_process">🧾 処理手順</span>

- [authServerConfig](authServerConfig.md#authserverconfig_internal).auditLogシートが無ければ作成

### <span id="autherrorlog_constructor_returns">📤 戻り値</span>

  - [authErrorLog](authErrorLog.md#autherrorlog_internal): authServerのエラーログ
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | — |
    | memberId | string | 【必須】 | — |
    | deviceId | string | 【必須】 | — |
    | result | string | fatal | — |
    | message | string | 【任意】 | — |
    | stackTrace | string | 【任意】 | — |

## <span id="autherrorlog_log">🧱 <a href="#autherrorlog_method">authErrorLog.log()</a></span>

エラーログをシートに出力

### <span id="autherrorlog_log_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| e | ❌ | Error | — | エラーオブジェクト | 

### <span id="autherrorlog_log_process">🧾 処理手順</span>

- this.message = e.message
- this.stackTrace = e.stack
- e.messageがJSON化可能な場合
  - e.messageをオブジェクト化してobjに代入
  - this.result = obj.result
  - this.message = obj.message
- シートの末尾行にauthErrorLogオブジェクトを追加

### <span id="autherrorlog_log_returns">📤 戻り値</span>

  - [authErrorLog](authErrorLog.md#autherrorlog_internal): authServerのエラーログ
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | — |
    | memberId | string | 【必須】 | — |
    | deviceId | string | 【必須】 | — |
    | result | string | fatal | — |
    | message | string | 【任意】 | — |
    | stackTrace | string | 【任意】 | — |

## <span id="autherrorlog_reset">🧱 <a href="#autherrorlog_method">authErrorLog.reset()</a></span>

authErrorLogインスタンス変数の値を再設定

### <span id="autherrorlog_reset_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="autherrorlog_reset_process">🧾 処理手順</span>

- 引数の内、authErrorLogと同一メンバ名があればthisに設定
- 📤 戻り値：変更後のauthErrorLogオブジェクト

### <span id="autherrorlog_reset_returns">📤 戻り値</span>

  - [authErrorLog](authErrorLog.md#autherrorlog_internal): authServerのエラーログ
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | — |
    | memberId | string | 【必須】 | — |
    | deviceId | string | 【必須】 | — |
    | result | string | fatal | — |
    | message | string | 【任意】 | — |
    | stackTrace | string | 【任意】 | — |