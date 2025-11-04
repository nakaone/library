<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md) | [JSLib](JSLib.md)

</div>

<p style="text-align:right;"><a href="classList.md">クラス一覧</a></p>

# <span id="authserver">authServer クラス仕様書</span>

## <span id="authserver_summary">🧭 概要</span>

サーバ側auth中核クラス

### 🧩 <span id="authserver_internal">内部構成</span>

🔢 authServer メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
|  | ❌ | string | — |  |  | 


🧱 <span id="authserver_method">authServer メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authserver_constructor) | private | コンストラクタ |

## <span id="authserver_constructor">🧱 <a href="#authserver_method">authServer.constructor()</a></span>

コンストラクタ

### <span id="authserver_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserver_constructor_returns">📤 戻り値</span>

- [authServer](authServer.md#internal): サーバ側auth中核クラス
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  |  | string | [必須] | — |

### <span id="authserver_constructor_process">🧾 処理手順</span>

