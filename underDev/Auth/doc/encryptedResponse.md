<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="encryptedresponse">encryptedResponse クラス仕様書</span>

## <span id="encryptedresponse_summary">🧭 概要</span>



### 🧩 <span id="encryptedresponse_internal">内部構成</span>

🔢 encryptedResponse メンバ一覧

| 項目名 | データ型 | 要否 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | string | <span style="color:red">必須</span> |  |  |

🧱 <span id="encryptedresponse_method">encryptedResponse メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#encryptedresponse_constructor) | private |  |

## <span id="encryptedresponse_constructor">🧱 <a href="#encryptedresponse_method">encryptedResponse.constructor()</a></span>



### <span id="encryptedresponse_constructor_param">📥 引数</span>

| 項目名 | データ型 | 要否 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

### <span id="encryptedresponse_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

### <span id="encryptedresponse_constructor_returns">📤 戻り値</span>

| [encryptedResponse](encryptedResponse.md#encryptedresponse_internal) | データ型 | 説明 | 備考 |
| :-- | :-- | :-- | :-- |
|  | string |  |  |