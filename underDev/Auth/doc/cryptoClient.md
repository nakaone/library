<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [cryptoClient](cryptoClient.md) | [cryptoServer](cryptoServer.md) | [Member](Member.md) | [データ型](typedef.md) | [内発処理](internalProcessing.md)

</div>

# cryptoClient クラス仕様書

## <a name="summary">🧭 概要</a>

- クライアント側でサーバへ安全に処理要求を送信するための復号・署名検証処理モジュール
- サーバ側仕様書(`cryptoServer`)と対になる設計であり、署名・暗号化・鍵管理を統一方針で運用する。
- 暗号化ライブラリは `jsrsasign` を使用。

### <a name="policy">設計方針</a>

- 暗号化・署名には **Web Crypto API** を使用。
- 鍵ペアは **署名用(RSA-PSS)** と **暗号化用(RSA-OAEP)**の2種類を生成し、それぞれ非エクスポータブル(`exportable: false`)として**IndexedDB** に保存。
- IndexedDB の store 名および keyPath は `authConfig.system.name`に基づく。
- クライアント側公開鍵(CPkey)は`authConfig.loginLifeTime`(既定：1日)で有効期限管理。
- 暗号化・署名時に利用するハッシュ関数は **SHA-256** 以上を使用。

### 🧩 <a name="internal">内部構成</a>

- 項目名末尾に「()」が付いているのはメソッド<br>
  (static:クラスメソッド、public:外部利用可、private:内部専用)

| 項目名 | データ型 | 内容 |
| :-- | :-- | :-- |
| cf | [authClientConfig](typedef.md#authclientconfig) | 動作設定変数(config) |
| idb | [authIndexedDB](typedef.md#authindexeddb) | IndexedDBの内容をauthClient内で共有 |
| [constructor()](#constructor) | private | コンストラクタ |
| [decrypt()](#decrypt) | public | authServer->authClientのメッセージを復号＋署名検証 |
| [encrypt()](#encrypt) | public | authClient->authServerのメッセージを暗号化＋署名 |
| [generateKeys()](#generateKeys) | public | 新たなクライアント側鍵ペアを作成 |
| [updateKeys()](#updateKeys) | public | 引数で渡された鍵ペアでIndexedDBの内容を更新 |

## <a name="constructor" href="#internal">🧱 constructor()</a>

### <a name="constructor-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | config | ❌ | [authClientConfig](typedef.md#authclientconfig) | — | authClientの動作設定変数 |
| 2 | idb | ❌ | [authIndexedDB](typedef.md#authindexeddb) | — | IndexedDBの内容 |

### <a name="constructor-returns">📤 戻り値</a>

- [cryptoClient](#internal)

### <a name="constructor-process">🧾 処理手順</a>

- IndexedDB を開く。鍵ペアが存在しない場合、RSA-PSS と RSA-OAEPを生成。
- 生成した鍵をメンバ変数に保持し、IndexedDB に保存。

## <a name="decrypt" href="#internal">🧱 decrypt()</a>

authServer->authClientのメッセージを復号＋署名検証

### <a name="decrypt-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | response | ❌ | [encryptedResponse](typedef.md#encryptedresponse) | — | authServerからのメッセージ |

### <a name="decrypt-returns">📤 戻り値</a>

- [decryptedResponse](typedef.md#decryptedresponse)

### <a name="decrypt-process">🧾 処理手順</a>

- サーバから送信された暗号文を安全に復号・検証し、結果を構造化オブジェクトとして返す。
- レスポンスのタイムスタンプをチェックし、許容誤差(authConfig.allowableTimeDifference)を超えていないか確認。<br>
  超過していれば`console.warn('[cryptoClient] Timestamp skew detected')` を出力。
- 本関数はauthClientから呼ばれるため、fatalエラーでも戻り値を返す

## <a name="encrypt" href="#internal">🧱 encrypt()</a>

authClient->authServerのメッセージを暗号化＋署名

### <a name="encrypt-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | request | ❌ | [authRequest](typedef.md#authrequest) | — | 処理要求オブジェクト |

### <a name="encrypt-returns">📤 戻り値</a>

- [encryptedRequest](typedef.md#encryptedrequest)

### <a name="encrypt-process">🧾 処理手順</a>

- `authRequest`をJSON化し、RSA-PSS署名を付与。
- 署名付きペイロードを RSA-OAEP により暗号化
- 暗号文は Base64 エンコードし、`encryptedRequest`形式にして返す

## <a name="generateKeys" href="#internal">🧱 generateKeys()</a>

新たなクライアント側鍵ペアを作成

### <a name="generateKeys-param">📥 引数</a>

無し

### <a name="generateKeys-returns">📤 戻り値</a>

- [authClientKeys](typedef.md#authclientkeys)

### <a name="generateKeys-process">🧾 処理手順</a>

## <a name="updateKeys" href="#internal">🧱 updateKeys()</a>

引数で渡された鍵ペアでIndexedDBの内容を更新

### <a name="updateKeys-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | keys | ❌ | [authClientKeys](typedef.md#authclientkeys) | — | 生成された鍵ペア |

### <a name="updateKeys-returns">📤 戻り値</a>

無し

### <a name="updateKeys-process">🧾 処理手順</a>

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

暗号化鍵は `name: "RSA-OAEP"`、`keyUsages: ["encrypt", "decrypt"]`とする。

### 暗号・署名パラメータ

| 区分 | アルゴリズム | ハッシュ | 鍵長 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| 署名 | RSA-PSS | SHA-256 | authConfig.RSAbits | 鍵用途:sign |
| 暗号化 | RSA-OAEP | SHA-256 | authConfig.RSAbits | 鍵用途:encrypt |
