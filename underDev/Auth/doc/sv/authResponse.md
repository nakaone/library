<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

# <span id="authresponse">authResponse クラス仕様書</span>

サーバ側で復号された処理要求

クライアントからの処理要求(encryptedRequest)を復号して作成されるインスタンス。
    サーバ側は本インスタンスに対して各種処理を行うと共に結果を付加する。

## <span id="authresponse_members">🔢 authResponse メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス |
| deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID |
| CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  |
| requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID |
| requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 |
| func | string | <span style="color:red">必須</span> | サーバ側関数名 |  |
| arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  |
| SPkey | string | SPkey | サーバ側公開鍵 |  |
| response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む |
| receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  |
| responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 |
| status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない |

## <span id="authresponse_methods">🧱 authResponse メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authresponse_constructor) | private | コンストラクタ |  |

### <span id="authresponse_constructor"><a href="#authresponse_methods">🧱 authResponse.constructor()</a></span>

#### <span id="authresponse_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | string | <span style="color:red">必須</span> |  | 暗号化された処理要求(encryptedRequest) |

#### <span id="authresponse_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authresponse_constructor_returns">📤 戻り値</span>

- [authResponse](#authresponse_members)インスタンス