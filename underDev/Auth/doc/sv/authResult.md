<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

auth内メソッドの標準的な戻り値

authServer内の処理等、"warning"(処理継続)時の使用を想定。

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| responseTime | number | Date.now() | 処理終了日時 |  |
| status | string | "normal" | 終了状態 | "normal"or"fatal"or警告メッセージ(warning) |
| response | any\|[authError](authError.md#autherror_members) | 任意 | 処理結果 | @returns {void}ならundefined。fatal時はauthError |

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authresult_constructor) | private | コンストラクタ |  |

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

- [authResult](#authresult_members)インスタンス