<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="cryptoclient">cryptoClient クラス仕様書</span>

## <span id="cryptoclient_summary">🧭 概要</span>

クライアント側の暗号化・復号処理

### 🧩 <span id="cryptoclient_internal">内部構成</span>

🔢 cryptoClient メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
|  | ❌ | string | — |  |  | 


🧱 <span id="cryptoclient_method">cryptoClient メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [cOnstructor](#cryptoclient_constructor) | private | コンストラクタ |

## <span id="cryptoclient_constructor">🧱 <a href="#cryptoclient_method">cryptoClient.cOnstructor()</a></span>

コンストラクタ

### <span id="cryptoclient_constructor_caller">📞 呼出元</span>

- [authClient.constructor()](authClient.md#cryptoclient_constructor)

### <span id="cryptoclient_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="cryptoclient_constructor_process">🧾 処理手順</span>



### <span id="cryptoclient_constructor_returns">📤 戻り値</span>

  - [cryptoClient](cryptoClient.md#cryptoclient_internal): クライアント側の暗号化・復号処理
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    |  | string | 【必須】 | — |