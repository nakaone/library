<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="autherrorlog">authErrorLog クラス仕様書</span>

## <span id="autherrorlog_summary">🧭 概要</span>



### 🧩 <span id="autherrorlog_internal">内部構成</span>

 🔢 authErrorLog メンバ一覧

| 項目名 | データ型 | 要否 | 説明 |
| :-- | :-- | :-- | :-- |
|  | string | **必須** |  |

🧱 <span id="autherrorlog_method">authErrorLog メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#autherrorlog_constructor) | private |  |

## <span id="autherrorlog_constructor">🧱 <a href="#autherrorlog_method">authErrorLog.constructor()</a></span>



### <span id="autherrorlog_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="autherrorlog_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

### <span id="autherrorlog_constructor_returns">📤 戻り値</span>

  - [authErrorLog](authErrorLog.md#autherrorlog_internal): 
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    |  | string | 【必須】 | — |