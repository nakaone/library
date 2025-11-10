<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authresponse">authResponse クラス仕様書</span>

## <span id="authresponse_summary">🧭 概要</span>

クライアント側で復号されたサーバからの処理結果

### 🧩 <span id="authresponse_internal">内部構成</span>

🔢 authResponse メンバ一覧

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | string | <span style="color:red">必須</span> |  |  |

🧱 <span id="authresponse_method">authResponse メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authresponse_constructor) | private |  |

## <span id="authresponse_constructor">🧱 <a href="#authresponse_method">authResponse.constructor()</a></span>



### <span id="authresponse_constructor_param">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

### <span id="authresponse_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

### <span id="authresponse_constructor_returns">📤 戻り値</span>

- authResponseインスタンス