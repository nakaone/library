<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="localresponse">LocalResponse クラス仕様書</span>

## <span id="localresponse_summary">🧭 概要</span>



### 🧩 <span id="localresponse_internal">内部構成</span>

 🔢 LocalResponse メンバ一覧

| 項目名 | データ型 | 要否 | 説明 |
| :-- | :-- | :-- | :-- |
|  | string | **必須** |  |

🧱 <span id="localresponse_method">LocalResponse メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#localresponse_constructor) | private |  |

## <span id="localresponse_constructor">🧱 <a href="#localresponse_method">LocalResponse.constructor()</a></span>



### <span id="localresponse_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="localresponse_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

### <span id="localresponse_constructor_returns">📤 戻り値</span>

  - [LocalResponse](LocalResponse.md#localresponse_internal): 
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    |  | string | 【必須】 | — |