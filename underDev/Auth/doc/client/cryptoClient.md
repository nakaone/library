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

[総説](../readme.md) | [CL/SV共通](../common/index.md) | [CL側](../client/index.md) | [SV側](../server/index.md) | [暗号化](../crypto.md) | [メンバ](../Member.md) | [開発](../dev.md)

</div>

# <span id="cryptoClient_top">🧩 cryptoClientクラス仕様書</span>

<p class="source">source: client/cryptoClient.mjs line.7</p>cryptoClient: クライアント側の暗号化・署名検証

## <a href="#cryptoClient_top"><span id="cryptoClient_prop">🔢 cryptoClient メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| idb | authIndexedDB | 必須 | authClient.idb(IndexedDB)のコピー |
| RSAbits | string | 必須 | RSA鍵長(=authConfig.RSAbits) |

## <a href="#cryptoClient_top"><span id="cryptoClient_func">🧱 cryptoClient メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#cryptoClient-constructor_top">constructor</a> | constructor |
| 2 | <a href="#cryptoClient-encrypt_top">encrypt</a> | encrypt: 処理要求を暗号化＋署名 |
| 3 | <a href="#cryptoClient-decrypt_top">decrypt</a> | decrypt: 暗号化された処理結果を復号・署名検証 |
| 4 | <a href="#cryptoClient-generateKeys_top">generateKeys</a> | generateKeys: RSA鍵ペアを生成 |

## <a href="#cryptoClient_top"><span id="cryptoClient_desc">🧾 cryptoClient 概説</span></a>

クライアント側の暗号化・署名検証
## <span id="cryptoClient-constructor_top">🧩 constructor()</span>

constructor

### <a href="#cryptoClient-constructor_top"><span id="cryptoClient-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| idb | authIndexedDB | 必須 | IndexedDBの内容を保持するauthClientのメンバ変数<br>  CPkeySign, CSkeySign, CPkeyEnc, CSkeyEncはこの下にCryptoKey形式で存在 |
| RSAbits | number | 必須 | RSA鍵長 |
## <span id="cryptoClient-encrypt_top">🧩 encrypt()</span>

encrypt: 処理要求を暗号化＋署名

### <a href="#cryptoClient-encrypt_top"><span id="cryptoClient-encrypt_func">🧱 encrypt メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#cryptoClient-encrypt-dummyFunc_top">dummyFunc</a> | dummyFunc: テスト用ダミー |

### <a href="#cryptoClient-encrypt_top"><span id="cryptoClient-encrypt_param">▶️ encrypt 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| request | authRequest | 必須 | 処理要求 |

### <a href="#cryptoClient-encrypt_top"><span id="cryptoClient-encrypt_return">◀️ encrypt 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| encryptedRequest |  |
### <span id="cryptoClient-encrypt-dummyFunc_top">🧩 dummyFunc()</span>

dummyFunc: テスト用ダミー

#### <a href="#cryptoClient-encrypt-dummyFunc_top"><span id="cryptoClient-encrypt-dummyFunc_param">▶️ dummyFunc 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| a | number | 必須 |  |
| b | number | 必須 |  |

#### <a href="#cryptoClient-encrypt-dummyFunc_top"><span id="cryptoClient-encrypt-dummyFunc_return">◀️ dummyFunc 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| number |  |
## <span id="cryptoClient-decrypt_top">🧩 decrypt()</span>

decrypt: 暗号化された処理結果を復号・署名検証

### <a href="#cryptoClient-decrypt_top"><span id="cryptoClient-decrypt_param">▶️ decrypt 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| response | encryptedResponse | 必須 | 暗号化されたサーバ側処理結果 |

### <a href="#cryptoClient-decrypt_top"><span id="cryptoClient-decrypt_return">◀️ decrypt 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| authResponse |  |
## <span id="cryptoClient-generateKeys_top">🧩 generateKeys()</span>

generateKeys: RSA鍵ペアを生成

### <a href="#cryptoClient-generateKeys_top"><span id="cryptoClient-generateKeys_desc">🧾 generateKeys 概説</span></a>

- 生成のみ、IndexedDBやメンバ変数への格納は行わない

### <a href="#cryptoClient-generateKeys_top"><span id="cryptoClient-generateKeys_param">▶️ generateKeys 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
|  | void | 必須 |  |

### <a href="#cryptoClient-generateKeys_top"><span id="cryptoClient-generateKeys_return">◀️ generateKeys 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| Object | 生成された鍵ペア |