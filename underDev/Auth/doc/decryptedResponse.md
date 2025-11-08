<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="decryptedresponse">decryptedResponse クラス仕様書</span>

## <span id="decryptedresponse_summary">🧭 概要</span>

復号済の処理結果

encryptedResponseをcryptoClientで復号した処理結果オブジェクト

### 🧩 <span id="decryptedresponse_internal">内部構成</span>

🔢 decryptedResponse メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| timestamp | ❌ | number | — | cryptoClient処理日時 | UNIX時刻 | 
| result | ❌ | string | — | cryptoClient処理結果 | fatal/warning/normal | 
| message | ⭕ | string | — | cryptoClientからのエラーメッセージ | normal時は`undefined` | 
| request | ❌ | [authRequest](authRequest.md#authrequest_internal) | — | 処理要求オブジェクト(authResponse.request) |  | 
| response | ⭕ | any | — | 要求されたサーバ側関数の戻り値(authResponse.response) | fatal/warning時は`undefined` | 
| sv | ❌ | Object | — |  |  | 
| sv.timestamp | ❌ | number | — | サーバ側処理日時 | UNIX時刻 | 
| sv.result | ❌ | string | — | サーバ側処理結果 | fatal/warning/normal | 
| sv.message | ⭕ | string | — | サーバ側からのエラーメッセージ | normal時は`undefined` | 


🧱 <span id="decryptedresponse_method">decryptedResponse メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#decryptedresponse_constructor) | private | コンストラクタ |

## <span id="decryptedresponse_constructor">🧱 <a href="#decryptedresponse_method">decryptedResponse.constructor()</a></span>

コンストラクタ

### <span id="decryptedresponse_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="decryptedresponse_constructor_process">🧾 処理手順</span>



### <span id="decryptedresponse_constructor_returns">📤 戻り値</span>

  - [decryptedResponse](decryptedResponse.md#decryptedresponse_internal): 復号済の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | 【必須】 | — |
    | result | string | 【必須】 | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【必須】 | — |
    | response | any | 【任意】 | — |
    | sv | Object | 【必須】 | — |
    | sv.timestamp | number | 【必須】 | — |
    | sv.result | string | 【必須】 | — |
    | sv.message | string | 【任意】 | — |