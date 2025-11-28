<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

# <span id="cryptoclient">cryptoClient クラス仕様書</span>

クライアント側の暗号化・復号処理

## <span id="cryptoclient_summary">🧭 cryptoClient クラス 概要</span>

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

## <span id="cryptoclient_members">🔢 cryptoClient メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| CSkeySign | CryptoKey | <span style="color:red">必須</span> | 署名用秘密鍵 |  |
| CPkeySign | CryptoKey | <span style="color:red">必須</span> | 署名用公開鍵 |  |
| CSkeyEnc | CryptoKey | <span style="color:red">必須</span> | 暗号化用秘密鍵 |  |
| CPkeyEnc | CryptoKey | <span style="color:red">必須</span> | 暗号化用公開鍵 |  |
| SPkey | string | <span style="color:red">必須</span> | サーバ側公開鍵 |  |

## <span id="cryptoclient_methods">🧱 cryptoClient メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#cryptoclient_constructor) | private | コンストラクタ |  |
| [decrypt()](#cryptoclient_decrypt) | public | authServer->authClientのメッセージを復号＋署名検証 |  |
| [encrypt()](#cryptoclient_encrypt) | public | authClient->authServerのメッセージを暗号化＋署名 |  |
| [generateKeys()](#cryptoclient_generatekeys) | public | 新たなクライアント側RSA鍵ペアを作成 |  |

### <span id="cryptoclient_constructor"><a href="#cryptoclient_methods">🧱 cryptoClient.constructor()</a></span>

#### <span id="cryptoclient_constructor_referrer">📞 呼出元</span>

- [authClient.initialize](authClient.md#authClient_members)

#### <span id="cryptoclient_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | [authClientConfig](authClientConfig.md#authclientconfig_members) | <span style="color:red">必須</span> |  | authClientの動作設定変数 |

#### <span id="cryptoclient_constructor_process">🧾 処理手順</span>

#### <span id="cryptoclient_constructor_returns">📤 戻り値</span>

- [cryptoClient](#cryptoclient_members)インスタンス
### <span id="cryptoclient_decrypt"><a href="#cryptoclient_methods">🧱 cryptoClient.decrypt()</a></span>

#### <span id="cryptoclient_decrypt_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| response | encryptedResponse | <span style="color:red">必須</span> | 暗号化された処理結果 |  |

#### <span id="cryptoclient_decrypt_process">🧾 処理手順</span>

#### <span id="cryptoclient_decrypt_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members) : 復号された処理結果

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
  | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  |
  | SPkey | string | SPkey | サーバ側公開鍵 |  |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない |
### <span id="cryptoclient_encrypt"><a href="#cryptoclient_methods">🧱 cryptoClient.encrypt()</a></span>

#### <span id="cryptoclient_encrypt_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [authRequest](authRequest.md#authrequest_members) | <span style="color:red">必須</span> | 平文の処理要求 |  |

#### <span id="cryptoclient_encrypt_process">🧾 処理手順</span>

#### <span id="cryptoclient_encrypt_returns">📤 戻り値</span>

- [encryptedRequest](encryptedRequest.md#encryptedrequest_members) : 暗号化された処理要求

Error: Error: not fixed: "encryptedRequest"
### <span id="cryptoclient_generatekeys"><a href="#cryptoclient_methods">🧱 cryptoClient.generateKeys()</a></span>

#### <span id="cryptoclient_generatekeys_params">📥 引数</span>

- 引数無し(void)

#### <span id="cryptoclient_generatekeys_process">🧾 処理手順</span>

- [createPassword](JSLib.md#createpassword)でパスワード生成
- [cf.RSAbits](authConfig.md#authconfig_internal)を参照、新たな鍵ペア生成しメンバに保存

#### <span id="cryptoclient_generatekeys_returns">📤 戻り値</span>

- null : 正常終了時

- Error : 異常終了時(messageはシステムメッセージ)