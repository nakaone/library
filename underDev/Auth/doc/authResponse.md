<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authresponse">authResponse クラス仕様書</span>

## <span id="authresponse_summary">🧭 概要</span>

暗号化前の処理結果

authServerからauthClientに返される、暗号化前の処理結果オブジェクト

### 🧩 <span id="authresponse_internal">内部構成</span>

🔢 authResponse メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| timestamp | ⭕ | number | Date.now() | サーバ側処理日時 | UNIX時刻 | 
| result | ⭕ | string | normal | サーバ側処理結果 | fatal/warning/normal | 
| message | ⭕ | string | — | サーバ側からの(エラー)メッセージ |  | 
| request | ⭕ | [authRequest](authRequest.md#authrequest_internal) | — | 処理要求オブジェクト |  | 
| response | ⭕ | any | — | 要求されたサーバ側関数の戻り値 | fatal/warning時は`undefined` | 


🧱 <span id="authresponse_method">authResponse メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authresponse_constructor) | private | コンストラクタ |

## <span id="authresponse_constructor">🧱 <a href="#authresponse_method">authResponse.constructor()</a></span>

コンストラクタ

### <span id="authresponse_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authresponse_constructor_returns">📤 戻り値</span>

- [authResponse](authResponse.md#internal): 暗号化前の処理結果
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | timestamp | number | Date.now() | — |
  | result | string | normal | — |
  | message | string | [任意] | — |
  | request | authRequest | [任意] | — |
  | response | any | [任意] | — |

### <span id="authresponse_constructor_process">🧾 処理手順</span>

