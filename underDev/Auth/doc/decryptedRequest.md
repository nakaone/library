<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="decryptedrequest">decryptedRequest クラス仕様書</span>

## <span id="decryptedrequest_summary">🧭 概要</span>

復号済の処理要求

encryptedRequestをcryptoServerで復号した処理要求オブジェクト

### 🧩 <span id="decryptedrequest_internal">内部構成</span>

🔢 decryptedRequest メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| result | ❌ | string | — | 処理結果 | "fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "normal" | 
| message | ⭕ | string | — | エラーメッセージ | result="normal"の場合`undefined` | 
| request | ❌ | [authRequest](authRequest.md#authrequest_internal) | — | ユーザから渡された処理要求 |  | 
| timestamp | ❌ | number | — | 復号処理実施日時 |  | 
| status | ❌ | string | — | ユーザ・デバイス状態 | Member.deviceが空ならメンバの、空で無ければデバイスのstatus | 


🧱 <span id="decryptedrequest_method">decryptedRequest メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#decryptedrequest_constructor) | private | コンストラクタ |

## <span id="decryptedrequest_constructor">🧱 <a href="#decryptedrequest_method">decryptedRequest.constructor()</a></span>

コンストラクタ

### <span id="decryptedrequest_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="decryptedrequest_constructor_process">🧾 処理手順</span>



### <span id="decryptedrequest_constructor_returns">📤 戻り値</span>

  - [decryptedRequest](decryptedRequest.md#decryptedrequest_internal): 復号済の処理要求
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | result | string | 【必須】 | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【必須】 | — |
    | timestamp | number | 【必須】 | — |
    | status | string | 【必須】 | — |