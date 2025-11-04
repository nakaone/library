<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="encryptedrequest">encryptedRequest クラス仕様書</span>

## <span id="encryptedrequest_summary">🧭 概要</span>

暗号化された処理要求

authClientからauthServerに送られる、暗号化された処理要求オブジェクト。<br>ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列。<br>memberId,deviceIdは平文

### 🧩 <span id="encryptedrequest_internal">内部構成</span>

🔢 encryptedRequest メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| memberId | ❌ | string | — | メンバの識別子 | =メールアドレス | 
| deviceId | ❌ | string | — | デバイスの識別子 |  | 
| ciphertext | ❌ | string | — | 暗号化した文字列 |  | 


🧱 <span id="encryptedrequest_method">encryptedRequest メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#encryptedrequest_constructor) | private | コンストラクタ |

## <span id="encryptedrequest_constructor">🧱 <a href="#encryptedrequest_method">encryptedRequest.constructor()</a></span>

コンストラクタ

### <span id="encryptedrequest_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="encryptedrequest_constructor_process">🧾 処理手順</span>



### <span id="encryptedrequest_constructor_returns">📤 戻り値</span>

  - [encryptedRequest](encryptedRequest.md#encryptedrequest_internal): 暗号化された処理要求
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | memberId | string | 【必須】 | — |
    | deviceId | string | 【必須】 | — |
    | ciphertext | string | 【必須】 | — |