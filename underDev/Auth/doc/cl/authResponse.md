<div style="text-align: right;">

[総説](../spec.md) | [クライアント側クラス一覧](../cl/list.md) | [サーバ側クラス一覧](../sv/list.md)

<!--
[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)
-->
</div>

# <span id="authresponse">authResponse クラス仕様書</span>

クライアント側で復号されたサーバからの処理結果

## <span id="authresponse_members">🔢 authResponse メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | string | 任意 |  |  |

## <span id="authresponse_methods">🧱 authResponse メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authresponse_constructor) | private | コンストラクタ |  |

### <span id="authresponse_constructor">🧱 authResponse.constructor()</span>

#### <span id="authresponse_constructor_caller">📞 呼出元</span>

#### <span id="authresponse_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="authresponse_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authresponse_constructor_returns">📤 戻り値</span>

- [authResponse](#authresponse_members)インスタンス