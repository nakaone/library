<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

<!--
[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)
-->
</div>

# <span id="authclientconfig">authClientConfig クラス仕様書</span>

authClient専用の設定値

[authConfig](authConfig.md)を継承

## <span id="authclientconfig_members">🔢 authClientConfig メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| api | string | 任意 | サーバ側WebアプリURLのID | `https://script.google.com/macros/s/(この部分)/exec` |
| timeout | number | 300,000 | サーバからの応答待機時間 | これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分 |
| CPkeyGraceTime | number | 600,000 | CPkey期限切れまでの猶予時間 | CPkey有効期間がこれを切ったら更新処理実行。既定値は10分 |

## <span id="authclientconfig_methods">🧱 authClientConfig メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authclientconfig_constructor) | private | コンストラクタ |  |

### <span id="authclientconfig_constructor">🧱 authClientConfig.constructor()</span>

#### <span id="authclientconfig_constructor_caller">📞 呼出元</span>

#### <span id="authclientconfig_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="authclientconfig_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authclientconfig_constructor_returns">📤 戻り値</span>

- [authClientConfig](#authclientconfig_members)インスタンス