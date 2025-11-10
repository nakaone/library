<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="localrequest">LocalRequest クラス仕様書</span>

## <span id="localrequest_summary">🧭 概要</span>

ローカル関数からの処理要求

クライアント側関数からauthClientに渡す内容を確認、オブジェクト化する

### 🧩 <span id="localrequest_internal">内部構成</span>

🔢 LocalRequest メンバ一覧

| 項目名 | データ型 | 要否 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | string | **必須** |  |  |

🧱 <span id="localrequest_method">LocalRequest メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#localrequest_constructor) | private |  |

## <span id="localrequest_constructor">🧱 <a href="#localrequest_method">LocalRequest.constructor()</a></span>



### <span id="localrequest_constructor_param">📥 引数</span>

| 項目名 | データ型 | 要否 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

### <span id="localrequest_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

### <span id="localrequest_constructor_returns">📤 戻り値</span>

| [LocalRequest](LocalRequest.md#localrequest_internal) | データ型 | 説明 | 備考 |
| :-- | :-- | :-- | :-- |
|  | string |  |  |