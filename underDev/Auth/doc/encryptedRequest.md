<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="encryptedrequest">encryptedRequest クラス仕様書</span>

## <span id="encryptedrequest_summary">🧭 概要</span>



### 🧩 <span id="encryptedrequest_internal">内部構成</span>

🔢 encryptedRequest メンバ一覧

| 項目名 | データ型 | 要否 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | string | <span style="color:red">必須</span> |  |  |

🧱 <span id="encryptedrequest_method">encryptedRequest メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#encryptedrequest_constructor) | private |  |

## <span id="encryptedrequest_constructor">🧱 <a href="#encryptedrequest_method">encryptedRequest.constructor()</a></span>



### <span id="encryptedrequest_constructor_param">📥 引数</span>

| 項目名 | データ型 | 要否 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

### <span id="encryptedrequest_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

### <span id="encryptedrequest_constructor_returns">📤 戻り値</span>

| [encryptedRequest](encryptedRequest.md#encryptedrequest_internal) | データ型 | 説明 | 備考 |
| :-- | :-- | :-- | :-- |
|  | string |  |  |