<div style="text-align: right;">

[総説](../spec.md) | [クライアント側クラス一覧](../cl/list.md) | [サーバ側クラス一覧](../sv/list.md)

<!--
[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)
-->
</div>

# <span id="authrequest">authRequest クラス仕様書</span>

サーバ側で復号されたクライアントからの処理要求

## <span id="authrequest_members">🔢 authRequest メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | string | 任意 |  |  |

## <span id="authrequest_methods">🧱 authRequest メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authrequest_constructor) | private | コンストラクタ |  |

### <span id="authrequest_constructor">🧱 authRequest.constructor()</span>

#### <span id="authrequest_constructor_caller">📞 呼出元</span>

#### <span id="authrequest_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="authrequest_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authrequest_constructor_returns">📤 戻り値</span>

- [authRequest](authRequest.md#authrequest_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
  | :-- | :-- | :-- | :-- | :-- |
  |  | string | 任意 |  |  |