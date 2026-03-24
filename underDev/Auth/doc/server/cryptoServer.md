<style> /* 仕様書用共通スタイル定義 */
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
  .source { /* 出典元のソースファイル名(リンクは無し) */
    text-align:right; font-size:0.8rem;}
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

[総説](../readme.md) | [CL/SV共通](../common/index.md) | [CL側](../client/index.md) | [SV側](../server/index.md) | [暗号化](../crypto.md) | [メンバ](../Member.md) | [独自Lib](../lib/index.md) | [開発](../dev.md)

</div>

# <span id="cryptoServer_top">🧩 cryptoServerクラス仕様書</span>

<p class="source">source: server/cryptoServer.mjs line.9</p>サーバ側の暗号化・署名検証

## <a href="#cryptoServer_top"><span id="cryptoServer_prop">🔢 cryptoServer メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| cf | <a href="../index.md#authServerConfig">authServerConfig</a> | 必須 | authServer設定情報 |
| prop | ScriptProperties | 必須 | PropertiesService.getScriptProperties() |
| keys | <a href="../index.md#authScriptProperties">authScriptProperties</a> | 必須 | ScriptPropertiesに保存された鍵ペア情報 |
| keyList | string[] | 必須 | ScriptPropertiesに保存された項目名の一覧 |

## <a href="#cryptoServer_top"><span id="cryptoServer_func">🧱 cryptoServer メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#cryptoServer-constructor_top">constructor</a> | constructor |
| 2 | <a href="#cryptoServer-encrypt_top">encrypt</a> | 処理結果を暗号化＋署名 |
| 3 | <a href="#cryptoServer-decrypt_top">decrypt</a> | 暗号化された処理要求を復号・署名検証 |
| 4 | <a href="#cryptoServer-generateKeys_top">generateKeys</a> | PEM形式のRSA鍵ペアを生成 |
| 5 | <a href="#cryptoServer-generateAndSave_top">generateAndSave</a> | 鍵を生成し、直ちにScriptPropertiesに保存する |
| 6 | <a href="#cryptoServer-initialize_top">initialize</a> | cryptoServerインスタンス作成 |

## <a href="#cryptoServer_top"><span id="cryptoServer_desc">🧾 cryptoServer 概説</span></a>

サーバ側の暗号化・署名検証

## <span id="cryptoServer-constructor_top">🧩 constructor()</span>

constructor

### <a href="#cryptoServer-constructor_top"><span id="cryptoServer-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| cf | <a href="../index.md#authServerConfig">authServerConfig</a> | 必須 | authServer設定値 |

## <span id="cryptoServer-encrypt_top">🧩 encrypt()</span>

処理結果を暗号化＋署名

### <a href="#cryptoServer-encrypt_top"><span id="cryptoServer-encrypt_param">▶️ encrypt 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| response | <a href="../index.<a href="../index.md#md">md</a>#authResponse">authResponse</a> | 必須 | 処理結果 |
| CPkeySign | string | 必須 | クライアント側署名用公開鍵 |

### <a href="#cryptoServer-encrypt_top"><span id="cryptoServer-encrypt_return">◀️ encrypt 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| <a href="../index.<a href="../index.md#md">md</a>#encryptedResponse">encryptedResponse</a> |  |

## <span id="cryptoServer-decrypt_top">🧩 decrypt()</span>

暗号化された処理要求を復号・署名検証

### <a href="#cryptoServer-decrypt_top"><span id="cryptoServer-decrypt_param">▶️ decrypt 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| request | <a href="../index.<a href="../index.md#md">md</a>#encryptedRequest">encryptedRequest</a> | 必須 | 暗号化されたサーバ側処理結果 |
| CPkeySign | string | 必須 | クライアント側署名用公開鍵 |

### <a href="#cryptoServer-decrypt_top"><span id="cryptoServer-decrypt_return">◀️ decrypt 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| <a href="../index.<a href="../index.md#md">md</a>#authRequest">authRequest</a> |  |

## <span id="cryptoServer-generateKeys_top">🧩 generateKeys()</span>

PEM形式のRSA鍵ペアを生成

### <a href="#cryptoServer-generateKeys_top"><span id="cryptoServer-generateKeys_desc">🧾 generateKeys 概説</span></a>

- 生成のみ、ScriptPropertiesやメンバ変数への格納は行わない

### <a href="#cryptoServer-generateKeys_top"><span id="cryptoServer-generateKeys_param">▶️ generateKeys 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
|  | void | 必須 |  |

### <a href="#cryptoServer-generateKeys_top"><span id="cryptoServer-generateKeys_return">◀️ generateKeys 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| Object | 生成された鍵ペア |

## <span id="cryptoServer-generateAndSave_top">🧩 generateAndSave()</span>

鍵を生成し、直ちにScriptPropertiesに保存する

## <span id="cryptoServer-initialize_top">🧩 initialize()</span>

cryptoServerインスタンス作成

### <a href="#cryptoServer-initialize_top"><span id="cryptoServer-initialize_desc">🧾 initialize 概説</span></a>

- インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
- staticではない一般のメンバへの値セットができないため別途constructorを呼び出す

### <a href="#cryptoServer-initialize_top"><span id="cryptoServer-initialize_param">▶️ initialize 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| cf | <a href="../index.md#authServerConfig">authServerConfig</a> | 必須 | authServer設定値 |

### <a href="#cryptoServer-initialize_top"><span id="cryptoServer-initialize_return">◀️ initialize 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| <a href="../cryptoServer.md">cryptoServer</a> \| Error |  |