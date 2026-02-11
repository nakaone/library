# 🧩 cryptoClientクラス仕様書

cryptoClient

## 🧾 概説

constructor

## 🧾 概説

constructor
クライアント側の暗号化・署名検証

## 🔢 メンバ一覧

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| idb | authIndexedDB | 必須 | authClient.idb(IndexedDB)のコピー |  |
| RSAbits | string | 必須 | RSA鍵長(=authConfig.RSAbits) |  |

## 📥 引数

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| idb | authIndexedDB | 必須 | IndexedDBの内容を保持するauthClientのメンバ変数 | CPkeySign, CSkeySign, CPkeyEnc, CSkeyEncはこの下にCryptoKey形式で存在 |
| RSAbits | number | 必須 | RSA鍵長 |  |