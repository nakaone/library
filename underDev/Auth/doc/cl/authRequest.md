<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

# <span id="authrequest">authRequest クラス仕様書</span>

暗号化前の処理要求

authClientからauthServerに送られる、暗号化前の処理要求オブジェクト

## <span id="authrequest_members">🔢 authRequest メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | idb.memberId |  | =メールアドレス |
| deviceId | string | idb.deviceId |  | UUID |
| signature | string | idb.CPkey |  |  |
| requestId | string | UUID |  | UUID |
| timestamp | number | Date.now() |  | UNIX時刻 |
| func | string | <span style="color:red">必須</span> |  |  |
| arguments | any[] | [] |  |  |

## <span id="authrequest_methods">🧱 authRequest メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authrequest_constructor) | private | コンストラクタ |  |

### <span id="authrequest_constructor"><a href="#authrequest_methods">🧱 authRequest.constructor()</a></span>

#### <span id="authrequest_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [LocalRequest](LocalRequest.md#localrequest_members) | <span style="color:red">必須</span> |  | ローカル関数からの処理要求 |

#### <span id="authrequest_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authrequest_constructor_returns">📤 戻り値</span>

- [authRequest](#authrequest_members)インスタンス