<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="cryptoserver">cryptoServer クラス仕様書</span>

## <span id="cryptoserver_summary">🧭 概要</span>

サーバ側の暗号化・復号処理

### 🧩 <span id="cryptoserver_internal">内部構成</span>

🔢 cryptoServer メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
|  | ❌ | string | — |  |  | 


🧱 <span id="cryptoserver_method">cryptoServer メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#cryptoserver_constructor) | private | コンストラクタ |

## <span id="cryptoserver_constructor">🧱 <a href="#cryptoserver_method">cryptoServer.constructor()</a></span>

コンストラクタ

### <span id="cryptoserver_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="cryptoserver_constructor_process">🧾 処理手順</span>



### <span id="cryptoserver_constructor_returns">📤 戻り値</span>

  - [cryptoServer](cryptoServer.md#cryptoserver_internal): サーバ側の暗号化・復号処理
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    |  | string | 【必須】 | — |