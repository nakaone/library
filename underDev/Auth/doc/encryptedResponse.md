<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="encryptedresponse">encryptedResponse クラス仕様書</span>

## <span id="encryptedresponse_summary">🧭 概要</span>

暗号化された処理結果

authServerからauthClientに返される、暗号化された処理結果オブジェクト<br>ciphertextはauthResponseをJSON化、RSA-OAEP暗号化＋署名付与した文字列

### 🧩 <span id="encryptedresponse_internal">内部構成</span>

🔢 encryptedResponse メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| ciphertext | ❌ | string | — | 暗号化した文字列 |  | 


🧱 <span id="encryptedresponse_method">encryptedResponse メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#encryptedresponse_constructor) | private | コンストラクタ |

## <span id="encryptedresponse_constructor">🧱 <a href="#encryptedresponse_method">encryptedResponse.constructor()</a></span>

コンストラクタ

### <span id="encryptedresponse_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="encryptedresponse_constructor_process">🧾 処理手順</span>



### <span id="encryptedresponse_constructor_returns">📤 戻り値</span>

  - [encryptedResponse](encryptedResponse.md#encryptedresponse_internal): 暗号化された処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | ciphertext | string | 【必須】 | — |