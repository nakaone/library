<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="localrequest">LocalRequest クラス仕様書</span>

## <span id="localrequest_summary">🧭 概要</span>

ローカル関数からの処理要求

クライアント側関数からauthClientに渡すオブジェクト。func,arg共、平文

### 🧩 <span id="localrequest_internal">内部構成</span>

🔢 LocalRequest メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| func | ❌ | string | — | サーバ側関数名 |  | 
| arguments | ⭕ | any[] | [](空配列) | サーバ側関数に渡す引数の配列 |  | 


🧱 <span id="localrequest_method">LocalRequest メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#localrequest_constructor) | private | コンストラクタ |

## <span id="localrequest_constructor">🧱 <a href="#localrequest_method">LocalRequest.constructor()</a></span>

コンストラクタ

### <span id="localrequest_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="localrequest_constructor_process">🧾 処理手順</span>



### <span id="localrequest_constructor_returns">📤 戻り値</span>

  - [LocalRequest](LocalRequest.md#localrequest_internal): ローカル関数からの処理要求
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | func | string | 【必須】 | — |
    | arguments | any[] | [](空配列) | — |