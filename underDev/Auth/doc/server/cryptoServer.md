<style>
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
  .submenu {  /* MD内のサブメニュー。右寄せ＋文字サイズ小 */
    text-align: right;
    font-size: 0.8rem;
  }
  .nowrap td {white-space:nowrap;} /* 横長な表を横スクロール */
  .nowrap b {background:yellow;}

.popup {color:#084} /* titleに文字列を設定した項目 */
  td {white-space:nowrap;}
</style>
<div style="text-align: right;">

[総説](../readme.md) | [共通仕様](../common/index.md) | [クライアント側仕様](../client/index.md) | [サーバ側仕様](../server/index.md) | [開発仕様](../dev.md)

</div>

# <span id="/server/cryptoServer.mjs::cryptoServer_top">🧩 cryptoServerクラス仕様書</span>

cryptoServer: サーバ側の暗号化・署名検証

## <a href="#/server/cryptoServer.mjs::cryptoServer_top"><span id="/server/cryptoServer.mjs::cryptoServer_prop">🔢 cryptoServer メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authServerConfig | 必須 | authServer設定情報 |  |
| prop | ScriptProperties | 必須 | PropertiesService.getScriptProperties() |  |
| keys | authScriptProperties | 必須 | ScriptPropertiesに保存された鍵ペア情報 |  |
| keyList | string[] | 必須 | ScriptPropertiesに保存された項目名の一覧 |  |

## <a href="#/server/cryptoServer.mjs::cryptoServer_top"><span id="/server/cryptoServer.mjs::cryptoServer_func">🧱 cryptoServer メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_top">constructor</a> | constructor |
| 2 | <a href="#/server/cryptoServer.mjs::cryptoServer#encrypt_top">encrypt</a> | encrypt: 処理結果を暗号化＋署名 |
| 3 | <a href="#/server/cryptoServer.mjs::cryptoServer#decrypt_top">decrypt</a> | decrypt: 暗号化された処理要求を復号・署名検証 |
| 4 | <a href="#/server/cryptoServer.mjs::cryptoServer#generateKeys_top">generateKeys</a> | generateKeys: PEM形式のRSA鍵ペアを生成 |
| 5 | <a href="#/server/cryptoServer.mjs::cryptoServer#generateAndSave_top">generateAndSave</a> | generateAndSave: 鍵を生成し、直ちにScriptPropertiesに保存する |
| 6 | <a href="#/server/cryptoServer.mjs::cryptoServer.initialize_top">initialize</a> | initialize: cryptoServerインスタンス作成 |

## <a href="#/server/cryptoServer.mjs::cryptoServer_top"><span id="/server/cryptoServer.mjs::cryptoServer_desc">🧾 cryptoServer 概説</span></a>

cryptoServer: サーバ側の暗号化・署名検証<br>

サーバ側の暗号化・署名検証<br>
## <span id="/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_top">🧩 constructor()</span>

constructor

### <a href="#/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_top"><span id="/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_desc">🧾 constructor 概説</span></a>

constructor<br>

### <a href="#/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_top"><span id="/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authServerConfig | 必須 | authServer設定値 |  |
## <span id="/server/cryptoServer.mjs::cryptoServer#encrypt_top">🧩 encrypt()</span>

encrypt: 処理結果を暗号化＋署名

### <a href="#/server/cryptoServer.mjs::cryptoServer#encrypt_top"><span id="/server/cryptoServer.mjs::cryptoServer#encrypt_desc">🧾 encrypt 概説</span></a>

encrypt: 処理結果を暗号化＋署名<br>

### <a href="#/server/cryptoServer.mjs::cryptoServer#encrypt_top"><span id="/server/cryptoServer.mjs::cryptoServer#encrypt_param">▶️ encrypt 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| response | authResponse | 必須 | 処理結果 |  |
| CPkeySign | string | 必須 | クライアント側署名用公開鍵 |  |

### <a href="#/server/cryptoServer.mjs::cryptoServer#encrypt_top"><span id="/server/cryptoServer.mjs::cryptoServer#encrypt_return">◀️ encrypt 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| encryptedResponse |  |  |
## <span id="/server/cryptoServer.mjs::cryptoServer#decrypt_top">🧩 decrypt()</span>

decrypt: 暗号化された処理要求を復号・署名検証

### <a href="#/server/cryptoServer.mjs::cryptoServer#decrypt_top"><span id="/server/cryptoServer.mjs::cryptoServer#decrypt_desc">🧾 decrypt 概説</span></a>

decrypt: 暗号化された処理要求を復号・署名検証<br>

### <a href="#/server/cryptoServer.mjs::cryptoServer#decrypt_top"><span id="/server/cryptoServer.mjs::cryptoServer#decrypt_param">▶️ decrypt 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | encryptedRequest | 必須 | 暗号化されたサーバ側処理結果 |  |
| CPkeySign | string | 必須 | クライアント側署名用公開鍵 |  |

### <a href="#/server/cryptoServer.mjs::cryptoServer#decrypt_top"><span id="/server/cryptoServer.mjs::cryptoServer#decrypt_return">◀️ decrypt 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| authRequest |  |  |
## <span id="/server/cryptoServer.mjs::cryptoServer#generateKeys_top">🧩 generateKeys()</span>

generateKeys: PEM形式のRSA鍵ペアを生成

### <a href="#/server/cryptoServer.mjs::cryptoServer#generateKeys_top"><span id="/server/cryptoServer.mjs::cryptoServer#generateKeys_desc">🧾 generateKeys 概説</span></a>

generateKeys: PEM形式のRSA鍵ペアを生成
- 生成のみ、ScriptPropertiesやメンバ変数への格納は行わない<br>

### <a href="#/server/cryptoServer.mjs::cryptoServer#generateKeys_top"><span id="/server/cryptoServer.mjs::cryptoServer#generateKeys_param">▶️ generateKeys 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | void | 必須 |  |  |

### <a href="#/server/cryptoServer.mjs::cryptoServer#generateKeys_top"><span id="/server/cryptoServer.mjs::cryptoServer#generateKeys_return">◀️ generateKeys 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| Object | 生成された鍵ペア |  |
## <span id="/server/cryptoServer.mjs::cryptoServer#generateAndSave_top">🧩 generateAndSave()</span>

generateAndSave: 鍵を生成し、直ちにScriptPropertiesに保存する

### <a href="#/server/cryptoServer.mjs::cryptoServer#generateAndSave_top"><span id="/server/cryptoServer.mjs::cryptoServer#generateAndSave_desc">🧾 generateAndSave 概説</span></a>

generateAndSave: 鍵を生成し、直ちにScriptPropertiesに保存する<br>
## <span id="/server/cryptoServer.mjs::cryptoServer.initialize_top">🧩 initialize()</span>

initialize: cryptoServerインスタンス作成

### <a href="#/server/cryptoServer.mjs::cryptoServer.initialize_top"><span id="/server/cryptoServer.mjs::cryptoServer.initialize_desc">🧾 initialize 概説</span></a>

initialize: cryptoServerインスタンス作成
- インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
- staticではない一般のメンバへの値セットができないため別途constructorを呼び出す<br>

### <a href="#/server/cryptoServer.mjs::cryptoServer.initialize_top"><span id="/server/cryptoServer.mjs::cryptoServer.initialize_param">▶️ initialize 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authServerConfig | 必須 | authServer設定値 |  |

### <a href="#/server/cryptoServer.mjs::cryptoServer.initialize_top"><span id="/server/cryptoServer.mjs::cryptoServer.initialize_return">◀️ initialize 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| cryptoServer \| Error |  |  |