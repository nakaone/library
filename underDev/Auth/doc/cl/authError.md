<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

auth専用エラーオブジェクト

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| responseTime | number | Date.now() | エラー発生日時 |  |
| errorType | string | Error.name | エラーの型(ex."ReferenceError") |  |
| function | string | v.whois | エラーが起きたクラス・メソッド名 |  |
| step | string | v.step | エラーが起きたメソッド内の位置 |  |
| variable | string | JSON.stringify(v) | エラー時のメソッド内汎用変数(JSON文字列) |  |
| message | string | Error.message | エラーメッセージ |  |
| stack | string | Error.stack | エラー時のスタックトレース |  |

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#autherror_constructor) | private | コンストラクタ |  |

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| e | Error | <span style="color:red">必須</span> |  | エラーオブジェクト |
| v | Object | {} |  | 関数・メソッド内汎用変数 |

- [authError](#autherror_members)インスタンス