<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

authClient/authServer共通設定値

[authClientConfig](authClientConfig.md), [authServerConfig](authServerConfig.md)の親クラス

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| systemName | string | auth | システム名 |  |
| adminMail | string | <span style="color:red">必須</span> | 管理者のメールアドレス |  |
| adminName | string | <span style="color:red">必須</span> | 管理者氏名 |  |
| allowableTimeDifference | number | 120,000 | クライアント・サーバ間通信時の許容時差 | 既定値は2分 |
| RSAbits | string | 2,048 | 鍵ペアの鍵長 |  |
| underDev | Object | 任意 | テスト時の設定 |  |
| underDev.isTest | boolean | false | 開発モードならtrue |  |

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authconfig_constructor) | private | コンストラクタ |  |

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

- [authConfig](#authconfig_members)インスタンス