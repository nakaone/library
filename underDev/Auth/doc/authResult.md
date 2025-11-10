<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authresult">authResult クラス仕様書</span>

## <span id="authresult_summary">🧭 概要</span>

auth内メソッドの標準的な戻り値

### 🧩 <span id="authresult_internal">内部構成</span>

🔢 authResult メンバ一覧

| 項目名 | データ型 | 要否 | 説明 |
| :-- | :-- | :-- | :-- |
| responseTime | number | Date.now() | 処理終了日時 |
| status | string | "normal" | 終了状態 |
| response | any \| [authError](authError.md#autherror_internal) | 任意 | 処理結果 |

🧱 <span id="authresult_method">authResult メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authresult_constructor) | private | コンストラクタ |

## <span id="authresult_constructor">🧱 <a href="#authresult_method">authResult.constructor()</a></span>

コンストラクタ

### <span id="authresult_constructor_param">📥 引数</span>

| 項目名 | データ型 | 要否 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | Object | {} |  |

### <span id="authresult_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

### <span id="authresult_constructor_returns">📤 戻り値</span>

  - [authResult](authResult.md#authresult_internal): auth内メソッドの標準的な戻り値
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | responseTime | number | Date.now() | — |
    | status | string | "normal" | — |
    | response | any|authError | 【任意】 | — |