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

# <span id="/client/cryptoClient.mjs::cryptoClient_top">🧩 cryptoClientクラス仕様書</span>

cryptoClient: クライアント側の暗号化・署名検証

## <a href="#/client/cryptoClient.mjs::cryptoClient_top"><span id="/client/cryptoClient.mjs::cryptoClient_prop">🔢 cryptoClient メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| idb | authIndexedDB | 必須 | authClient.idb(IndexedDB)のコピー |  |
| RSAbits | string | 必須 | RSA鍵長(=authConfig.RSAbits) |  |

## <a href="#/client/cryptoClient.mjs::cryptoClient_top"><span id="/client/cryptoClient.mjs::cryptoClient_func">🧱 cryptoClient メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/server/Member.mjs::Member#Member#constructor_top">constructor</a> | constructor: 該当メンバのMemberインスタンス作成 |

## <a href="#/client/cryptoClient.mjs::cryptoClient_top"><span id="/client/cryptoClient.mjs::cryptoClient_desc">🧾 cryptoClient 概説</span></a>

クライアント側の暗号化・署名検証
## <span id="/server/Member.mjs::Member#Member#constructor_top">🧩 constructor()</span>

constructor: 該当メンバのMemberインスタンス作成

### <a href="#/server/Member.mjs::Member#Member#constructor_top"><span id="/server/Member.mjs::Member#Member#constructor_func">🧱 constructor メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/client/cryptoClient.mjs::cryptoClient#encrypt_top">encrypt</a> | encrypt: 処理要求を暗号化＋署名 |
| 2 | <a href="#/client/localFunc.mjs::clearAuthEnvironment_top">clearAuthEnvironment</a> | clearAuthEnvironment: IndexedDBの"Auth"データベースを削除し、環境をリセットする |
| 3 | <a href="#/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_top">constructor</a> | constructor |

### <a href="#/server/Member.mjs::Member#Member#constructor_top"><span id="/server/Member.mjs::Member#Member#constructor_desc">🧾 constructor 概説</span></a>

constructor: 該当メンバのMemberインスタンス作成
- 新規メンバ(SPkey要求時)は新規作成

### <a href="#/server/Member.mjs::Member#Member#constructor_top"><span id="/server/Member.mjs::Member#Member#constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | authServerConfig | 必須 | authServerの設定値 |  |
| request | authRequest | 必須 | 処理要求 |  |
### <span id="/client/cryptoClient.mjs::cryptoClient#encrypt_top">🧩 encrypt()</span>

encrypt: 処理要求を暗号化＋署名

#### <a href="#/client/cryptoClient.mjs::cryptoClient#encrypt_top"><span id="/client/cryptoClient.mjs::cryptoClient#encrypt_func">🧱 encrypt メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/client/authClient.mjs::authClient#authClient#constructor_top">constructor</a> | constructor |

#### <a href="#/client/cryptoClient.mjs::cryptoClient#encrypt_top"><span id="/client/cryptoClient.mjs::cryptoClient#encrypt_desc">🧾 encrypt 概説</span></a>

encrypt: 処理要求を暗号化＋署名

#### <a href="#/client/cryptoClient.mjs::cryptoClient#encrypt_top"><span id="/client/cryptoClient.mjs::cryptoClient#encrypt_param">▶️ encrypt 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | authRequest | 必須 | 処理要求 |  |

#### <a href="#/client/cryptoClient.mjs::cryptoClient#encrypt_top"><span id="/client/cryptoClient.mjs::cryptoClient#encrypt_return">◀️ encrypt 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| encryptedRequest |  |  |
#### <span id="/client/authClient.mjs::authClient#authClient#constructor_top">🧩 constructor()</span>

constructor

##### <a href="#/client/authClient.mjs::authClient#authClient#constructor_top"><span id="/client/authClient.mjs::authClient#authClient#constructor_func">🧱 constructor メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/server/cryptoServer.mjs::cryptoServer#encrypt_top">encrypt</a> | encrypt: 処理結果を暗号化＋署名 |

##### <a href="#/client/authClient.mjs::authClient#authClient#constructor_top"><span id="/client/authClient.mjs::authClient#authClient#constructor_desc">🧾 constructor 概説</span></a>

constructor

##### <a href="#/client/authClient.mjs::authClient#authClient#constructor_top"><span id="/client/authClient.mjs::authClient#authClient#constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | Object | 必須 | authClient/Server共通設定情報 |  |
##### <span id="/server/cryptoServer.mjs::cryptoServer#encrypt_top">🧩 encrypt()</span>

encrypt: 処理結果を暗号化＋署名

###### <a href="#/server/cryptoServer.mjs::cryptoServer#encrypt_top"><span id="/server/cryptoServer.mjs::cryptoServer#encrypt_desc">🧾 encrypt 概説</span></a>

encrypt: 処理結果を暗号化＋署名

###### <a href="#/server/cryptoServer.mjs::cryptoServer#encrypt_top"><span id="/server/cryptoServer.mjs::cryptoServer#encrypt_param">▶️ encrypt 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| response | authResponse | 必須 | 処理結果 |  |
| CPkeySign | string | 必須 | クライアント側署名用公開鍵 |  |

###### <a href="#/server/cryptoServer.mjs::cryptoServer#encrypt_top"><span id="/server/cryptoServer.mjs::cryptoServer#encrypt_return">◀️ encrypt 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| encryptedResponse |  |  |
### <span id="/client/localFunc.mjs::clearAuthEnvironment_top">🧩 clearAuthEnvironment()</span>

clearAuthEnvironment: IndexedDBの"Auth"データベースを削除し、環境をリセットする
### <span id="/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_top">🧩 constructor()</span>

constructor

#### <a href="#/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_top"><span id="/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_func">🧱 constructor メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/client/cryptoClient.mjs::cryptoClient#cryptoClient#constructor_top">constructor</a> | constructor |

#### <a href="#/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_top"><span id="/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_desc">🧾 constructor 概説</span></a>

constructor

#### <a href="#/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_top"><span id="/server/cryptoServer.mjs::cryptoServer#cryptoServer#constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authServerConfig | 必須 | authServer設定値 |  |
#### <span id="/client/cryptoClient.mjs::cryptoClient#cryptoClient#constructor_top">🧩 constructor()</span>

constructor

##### <a href="#/client/cryptoClient.mjs::cryptoClient#cryptoClient#constructor_top"><span id="/client/cryptoClient.mjs::cryptoClient#cryptoClient#constructor_desc">🧾 constructor 概説</span></a>

constructor

##### <a href="#/client/cryptoClient.mjs::cryptoClient#cryptoClient#constructor_top"><span id="/client/cryptoClient.mjs::cryptoClient#cryptoClient#constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| idb | authIndexedDB | 必須 | IndexedDBの内容を保持するauthClientのメンバ変数 | CPkeySign, CSkeySign, CPkeyEnc, CSkeyEncはこの下にCryptoKey形式で存在 |
| RSAbits | number | 必須 | RSA鍵長 |  |