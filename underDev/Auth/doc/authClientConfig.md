<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authclientconfig">authClientConfig クラス仕様書</span>

## <span id="authclientconfig_summary">🧭 概要</span>



### 🧩 <span id="authclientconfig_internal">内部構成</span>

🔢 authClientConfig メンバ一覧

| 項目名 | データ型 | 要否 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | string | <span style="color:red">必須</span> |  |  |

🧱 <span id="authclientconfig_method">authClientConfig メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authclientconfig_constructor) | private |  |

## <span id="authclientconfig_constructor">🧱 <a href="#authclientconfig_method">authClientConfig.constructor()</a></span>



### <span id="authclientconfig_constructor_param">📥 引数</span>

| 項目名 | データ型 | 要否 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

### <span id="authclientconfig_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

### <span id="authclientconfig_constructor_returns">📤 戻り値</span>

| [authClientConfig](authClientConfig.md#authclientconfig_internal) | データ型 | 説明 | 備考 |
| :-- | :-- | :-- | :-- |
|  | string |  |  |