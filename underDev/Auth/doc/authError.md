<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="autherror">authError クラス仕様書</span>

## <span id="autherror_summary">🧭 概要</span>

auth専用エラーオブジェクト

### 🧩 <span id="autherror_internal">内部構成</span>

 🔢 authError メンバ一覧

| 項目名 | データ型 | 要否 | 説明 |
| :-- | :-- | :-- | :-- |
| responseTime | number | Date.now() | エラー発生日時 |
| errorType | string | Error.name | エラーの型(ex."ReferenceError") |
| function | string | v.whoisの値 | エラーが起きたクラス・メソッド名 |
| step | string | v.step | エラーが起きたメソッド内の位置 |
| variable | string | JSON.stringify(v) | エラー時のメソッド内汎用変数(JSON文字列) |
| message | string | Error.message | エラーメッセージ |
| stack | string | Error.stack | エラー時のスタックトレース |

🧱 <span id="autherror_method">authError メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#autherror_constructor) | private | コンストラクタ |

## <span id="autherror_constructor">🧱 <a href="#autherror_method">authError.constructor()</a></span>

コンストラクタ

### <span id="autherror_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| e | ❌ | Error | — | エラーオブジェクト | 
| v | ⭕ | Object | {} | 関数・メソッド内汎用変数 | 

### <span id="autherror_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

### <span id="autherror_constructor_returns">📤 戻り値</span>

  - [authError](authError.md#autherror_internal): auth専用エラーオブジェクト
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | responseTime | number | Date.now() | — |
    | errorType | string | Error.name | — |
    | function | string | v.whoisの値 | — |
    | step | string | v.step | — |
    | variable | string | JSON.stringify(v) | — |
    | message | string | Error.message | — |
    | stack | string | Error.stack | — |