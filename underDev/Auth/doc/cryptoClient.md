<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="cryptoclient">cryptoClient クラス仕様書</span>

## <span id="cryptoclient_summary">🧭 概要</span>

クライアント側の暗号化・復号処理

### <span id="cryptoclient_policy">設計方針</span>

## 🔐 セキュリティ仕様

### 鍵種別と用途

| 鍵名 | アルゴリズム | 用途 | 保存先 |
| :-- | :-- | :-- | :-- |
| CPkey-sign | RSA-PSS | 署名 | IndexedDB |
| CPkey-enc | RSA-OAEP | 暗号化 | IndexedDB |

### 鍵生成時パラメータ

``` js
{
  name: "RSA-PSS",
  modulusLength: authConfig.RSAbits,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  hash: "SHA-256",
  extractable: false,
  keyUsages: ["sign", "verify"]
}
```

暗号化鍵は'name:"RSA-OAEP"'、'keyUsages: ["encrypt", "decrypt"]'とする。

### 暗号・署名パラメータ

| 区分 | アルゴリズム | ハッシュ | 鍵長 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| 署名 | RSA-PSS | SHA-256 | authConfig.RSAbits | 鍵用途:sign |
| 暗号化 | RSA-OAEP | SHA-256 | authConfig.RSAbits | 鍵用途:encrypt |

### 🧩 <span id="cryptoclient_internal">内部構成</span>

🔢 cryptoClient メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
|  | ❌ | string | — |  |  | 


🧱 <span id="cryptoclient_method">cryptoClient メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#cryptoclient_constructor) | private | コンストラクタ |
| [decrypt](#cryptoclient_decrypt) | public | authServer->authClientのメッセージを復号＋署名検証 |
| [encrypt](#cryptoclient_encrypt) | public | authClient->authServerのメッセージを暗号化＋署名 |
| [fetch](#cryptoclient_fetch) | public | 処理要求を署名・暗号化してサーバ側に問合せ、結果を復号・署名検証 |
| [generateKeys](#cryptoclient_generatekeys) | public | 新たなクライアント側鍵ペアを作成 |
| [updateKeys](#cryptoclient_updatekeys) | public | 引数で渡された鍵ペアでIndexedDBの内容を更新 |

## <span id="cryptoclient_constructor">🧱 <a href="#cryptoclient_method">cryptoClient.constructor()</a></span>

コンストラクタ

### <span id="cryptoclient_constructor_caller">📞 呼出元</span>

- [authClient.constructor()](authClient.md#cryptoclient_constructor)

### <span id="cryptoclient_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| config | ❌ | [authClientConfig](authClientConfig.md#authclientconfig_internal) | — | authClientの動作設定変数 | 

### <span id="cryptoclient_constructor_process">🧾 処理手順</span>



### <span id="cryptoclient_constructor_returns">📤 戻り値</span>

  - [cryptoClient](cryptoClient.md#cryptoclient_internal): クライアント側の暗号化・復号処理
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    |  | string | 【必須】 | — |

## <span id="cryptoclient_decrypt">🧱 <a href="#cryptoclient_method">cryptoClient.decrypt()</a></span>

authServer->authClientのメッセージを復号＋署名検証

### <span id="cryptoclient_decrypt_caller">📞 呼出元</span>

- [cryptoClient.fetch()](cryptoClient.md#cryptoclient_decrypt)

### <span id="cryptoclient_decrypt_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="cryptoclient_decrypt_process">🧾 処理手順</span>



### <span id="cryptoclient_decrypt_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="cryptoclient_encrypt">🧱 <a href="#cryptoclient_method">cryptoClient.encrypt()</a></span>

authClient->authServerのメッセージを暗号化＋署名

### <span id="cryptoclient_encrypt_caller">📞 呼出元</span>

- [cryptoClient.fetch()](cryptoClient.md#cryptoclient_encrypt)

### <span id="cryptoclient_encrypt_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="cryptoclient_encrypt_process">🧾 処理手順</span>



### <span id="cryptoclient_encrypt_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="cryptoclient_fetch">🧱 <a href="#cryptoclient_method">cryptoClient.fetch()</a></span>

処理要求を署名・暗号化してサーバ側に問合せ、結果を復号・署名検証

### <span id="cryptoclient_fetch_caller">📞 呼出元</span>

- [authClient.exec()](authClient.md#cryptoclient_fetch)

### <span id="cryptoclient_fetch_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ❌ | [authRequest](authRequest.md#authrequest_internal) | — | 処理要求 | 

### <span id="cryptoclient_fetch_process">🧾 処理手順</span>

- requestを[encryptメソッド](#cryptoclient_encrypt)で署名・暗号化
- サーバ側に問合せを実行
- 一定時間経っても無応答の場合、戻り値「無応答」を返して終了
- サーバ側からの応答が有った場合、[decryptメソッド](#cryptoclient_decrypt)で復号・署名検証
- 復号・署名検証の結果をそのまま戻り値として返して終了

### <span id="cryptoclient_fetch_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 無応答 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | **"fatal"** |
    | message | string | 【任意】 | **"no response"** |
    | request | authRequest | 【任意】 | **request** |
    | response | any | 【任意】 | — |

## <span id="cryptoclient_generatekeys">🧱 <a href="#cryptoclient_method">cryptoClient.generateKeys()</a></span>

新たなクライアント側鍵ペアを作成

### <span id="cryptoclient_generatekeys_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="cryptoclient_generatekeys_process">🧾 処理手順</span>



### <span id="cryptoclient_generatekeys_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="cryptoclient_updatekeys">🧱 <a href="#cryptoclient_method">cryptoClient.updateKeys()</a></span>

引数で渡された鍵ペアでIndexedDBの内容を更新

### <span id="cryptoclient_updatekeys_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="cryptoclient_updatekeys_process">🧾 処理手順</span>



### <span id="cryptoclient_updatekeys_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |