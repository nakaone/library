# 🔐 cryptoClient クラス 仕様書

## 🧭 概要

- クライアント側でサーバへ安全に処理要求を送信するための復号・署名検証処理モジュール
- サーバ側仕様書（`cryptoServer`）と対になる設計であり、署名・暗号化・鍵管理を統一方針で運用する。
- `cryptoClient.encrypt()`形式での使用を想定し、メソッドはstaticとする
- 暗号化ライブラリは `jsrsasign` を使用。

## ■ 設計方針

- 暗号化・署名には **Web Crypto API** を使用。
- 鍵ペアは **署名用（RSA-PSS）** と **暗号化用（RSA-OAEP）**の2種類を生成し、それぞれ非エクスポータブル（`exportable: false`）として**IndexedDB** に保存。
- IndexedDB の store 名および keyPath は `authConfig.system.name`に基づく。
- クライアント側公開鍵（CPkey）は`authConfig.loginLifeTime`（既定：1日）で有効期限管理。
- 暗号化・署名時に利用するハッシュ関数は **SHA-256** 以上を使用。

## 🧩 内部構成(クラス変数)

### authIndexedDB

<!--::$tmp/encryptedRequest.md::-->

## 🧱 constructor()

- IndexedDB を開く。鍵ペアが存在しない場合、RSA-PSS と RSA-OAEPを生成。
- 生成した鍵をメンバ変数に保持し、IndexedDB に保存。

## 🧱 decrypt()メソッド

- authServer->authClientのメッセージを復号＋署名検証
- サーバから送信された暗号文を安全に復号・検証し、結果を構造化オブジェクトとして返す。
- レスポンスのタイムスタンプをチェックし、許容誤差(authConfig.allowableTimeDifference)を超えていないか確認。<br>
  超過していれば`console.warn('[cryptoClient] Timestamp skew detected')` を出力。
- 本関数はauthClientから呼ばれるため、fatalエラーでも戻り値を返す

### 📤 入力項目

#### `encryptedResponse`

<!--::$tmp/encryptedResponse.md::-->

### 📥 出力項目

#### `decryptedResponse`

<!--::$tmp/decryptedResponse.md::-->

### 処理概要


## 🧱 encrypt()メソッド

- authClient->authServerのメッセージを暗号化＋署名
- `authRequest`をJSON化し、RSA-PSS署名を付与。
- 署名付きペイロードを RSA-OAEP により暗号化
- 暗号文は Base64 エンコードし、`encryptedRequest`形式にして返す

### 📤 入力項目

#### authRequest

<!--::$tmp/authRequest.md::-->

### 📥 出力項目

#### encryptedRequest

<!--::$tmp/encryptedRequest.md::-->

## 🧱 generateKeys()メソッド

- 新たなクライアント側鍵ペアを作成する
- 引数は無し、戻り値は`authClientKeys`

### authClientKeys

<!--::$tmp/authClientKeys.md::-->

## 🧱 updateKeys()メソッド

- 引数で渡された鍵ペアでIndexedDBの内容を更新する
- 引数は`authClientKeys`、戻り値はnullまたはError

## ⏰ メンテナンス処理

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

## 🧾 エラーハンドリング仕様
