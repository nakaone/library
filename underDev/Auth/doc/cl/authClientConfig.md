<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

# <span id="authclientconfig">authClientConfig クラス仕様書</span>

authClient専用の設定値

[authConfig](authConfig.md)を継承

## <span id="authclientconfig_members">🔢 authClientConfig メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| api | string | <span style="color:red">必須</span> | サーバ側WebアプリURLのID | `https://script.google.com/macros/s/(この部分)/exec` |
| timeout | number | 300,000 | サーバからの応答待機時間 | これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分 |
| CPkeyGraceTime | number | 600,000 | CPkey期限切れまでの猶予時間 | CPkey有効期間がこれを切ったら更新処理実行。既定値は10分 |

## <span id="authclientconfig_methods">🧱 authClientConfig メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authclientconfig_constructor) | private | コンストラクタ |  |

### <span id="authclientconfig_constructor"><a href="#authclientconfig_methods">🧱 authClientConfig.constructor()</a></span>

#### <span id="authclientconfig_constructor_referrer">📞 呼出元</span>

- [authClient.initialize](authClient.md#authClient_members)

#### <span id="authclientconfig_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | Object | {} |  | ユーザ指定の設定値 |

#### <span id="authclientconfig_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authclientconfig_constructor_returns">📤 戻り値</span>

- [authClientConfig](#authclientconfig_members)インスタンス