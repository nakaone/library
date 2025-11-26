<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

authClient専用の設定値

[authConfig](authConfig.md)を継承

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| api | string | <span style="color:red">必須</span> | サーバ側WebアプリURLのID | `https://script.google.com/macros/s/(この部分)/exec` |
| timeout | number | 300,000 | サーバからの応答待機時間 | これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分 |
| CPkeyGraceTime | number | 600,000 | CPkey期限切れまでの猶予時間 | CPkey有効期間がこれを切ったら更新処理実行。既定値は10分 |

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authclientconfig_constructor) | private | コンストラクタ |  |

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | Object | {} |  | ユーザ指定の設定値 |

- [authClientConfig](#authclientconfig_members)インスタンス