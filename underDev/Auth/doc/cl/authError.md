<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

<!--
[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)
-->
</div>

# <span id="autherror">authError クラス仕様書</span>

auth専用エラーオブジェクト

## <span id="autherror_members">🔢 authError メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| responseTime | number | Date.now() | エラー発生日時 |  |
| errorType | string | Error.name | エラーの型(ex."ReferenceError") |  |
| function | string | v.whois | エラーが起きたクラス・メソッド名 |  |
| step | string | v.step | エラーが起きたメソッド内の位置 |  |
| variable | string | JSON.stringify(v) | エラー時のメソッド内汎用変数(JSON文字列) |  |
| message | string | Error.message | エラーメッセージ |  |
| stack | string | Error.stack | エラー時のスタックトレース |  |

## <span id="autherror_methods">🧱 authError メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#autherror_constructor) | private | コンストラクタ |  |

### <span id="autherror_constructor">🧱 authError.constructor()</span>

#### <span id="autherror_constructor_caller">📞 呼出元</span>

#### <span id="autherror_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| e | Error | 任意 |  | エラーオブジェクト |
| v | Object | {} |  | 関数・メソッド内汎用変数 |

#### <span id="autherror_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定
- variableはv.whois,v.stepを削除した上で、JSON化時150文字以上になる場合、以下のように処理
  - 配列は"{length:v.xxx.length,sample:v.xxx.slice(0,3)}"に変換

#### <span id="autherror_constructor_returns">📤 戻り値</span>

- [authError](#autherror_members)インスタンス