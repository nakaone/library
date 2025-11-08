<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="autherrorlog">authErrorLog クラス仕様書</span>

## <span id="autherrorlog_summary">🧭 概要</span>

authServerのエラーログ

- エラーログ出力の可能性があるメソッドの冒頭でインスタンス化、処理開始時刻等を記録
- 出力時にlogメソッドを呼び出して処理時間を計算、シート出力

### 🧩 <span id="autherrorlog_internal">内部構成</span>

🔢 authErrorLog メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| timestamp | ⭕ | string | Date.now() | 要求日時 | ISO8601拡張形式の文字列 | 
| memberId | ❌ | string | — | メンバの識別子 | =メールアドレス | 
| deviceId | ❌ | string | — | デバイスの識別子 |  | 
| result | ⭕ | string | fatal | サーバ側処理結果 | fatal/warning/normal | 
| message | ⭕ | string | — | サーバ側からのエラーメッセージ | normal時は`undefined` | 
| stack | ⭕ | string | — | エラー発生時のスタックトレース | 本項目は管理者への通知メール等、シート以外には出力不可 | 


🧱 <span id="autherrorlog_method">authErrorLog メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#autherrorlog_constructor) | private | コンストラクタ |
| [log](#autherrorlog_log) | public | エラーログシートにエラー情報を追記 |

## <span id="autherrorlog_constructor">🧱 <a href="#autherrorlog_method">authErrorLog.constructor()</a></span>

コンストラクタ

### <span id="autherrorlog_constructor_caller">📞 呼出元</span>

- [authServer.exec()](authServer.md#autherrorlog_constructor)

### <span id="autherrorlog_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| config | ❌ | [authServerConfig](authServerConfig.md#authserverconfig_internal) | — | authServerの動作設定変数 | 

### <span id="autherrorlog_constructor_process">🧾 処理手順</span>

- [authServerConfig](authServerConfig.md#authserverconfig_internal).errorLogシートが無ければ作成
- 引数の内、authErrorLogと同一メンバ名があればthisに設定
- timestampに現在日時を設定

### <span id="autherrorlog_constructor_returns">📤 戻り値</span>

  - [authErrorLog](authErrorLog.md#autherrorlog_internal): authServerのエラーログ
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | — |
    | memberId | string | 【必須】 | — |
    | deviceId | string | 【必須】 | — |
    | result | string | fatal | — |
    | message | string | 【任意】 | — |
    | stack | string | 【任意】 | — |

## <span id="autherrorlog_log">🧱 <a href="#autherrorlog_method">authErrorLog.log()</a></span>

エラーログシートにエラー情報を追記

### <span id="autherrorlog_log_caller">📞 呼出元</span>

- [authServer.exec()](authServer.md#autherrorlog_log)

### <span id="autherrorlog_log_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| e | ❌ | Error | — | エラーオブジェクト | 
| response | ❌ | [authResponse](authResponse.md#authresponse_internal) | — | 処理結果 | 

### <span id="autherrorlog_log_process">🧾 処理手順</span>

- メンバに以下を設定

  - [authErrorLog](authErrorLog.md#autherrorlog_internal): authServerのエラーログ
    | 項目名 | データ型 | 生成時 | 設定内容 |
    | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | **toLocale(this.timestamp)(ISO8601拡張形式)** |
    | memberId | string | 【必須】 | **response.request.memberId** |
    | deviceId | string | 【必須】 | **response.request.deviceId** |
    | result | string | fatal | **response.result** |
    | message | string | 【任意】 | **response.message** |
    | stack | string | 【任意】 | **e.stack** |
- [authServerConfig](authServerConfig.md#authserverconfig_internal).errorLogシートの末尾行にauthErrorLogオブジェクトを追加

### <span id="autherrorlog_log_returns">📤 戻り値</span>

  - [authErrorLog](authErrorLog.md#autherrorlog_internal): authServerのエラーログ
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | — |
    | memberId | string | 【必須】 | — |
    | deviceId | string | 【必須】 | — |
    | result | string | fatal | — |
    | message | string | 【任意】 | — |
    | stack | string | 【任意】 | — |