# 🧩 authClientクラス仕様書

authClient

## 🧾 概説

constructor

## 🧾 概説

constructor
クライアント側中核クラス
- 初期化の際に非同期処理が必要なため、インスタンス作成は
  `new authClient()`ではなく`authClient.initialize()`で行う

## 🔢 メンバ一覧

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authClientConfig | 必須 | authClient設定情報 |  |
| idb | Object | 必須 | IndexedDBと同期、authClient内で共有 |  |
| crypto | cryptoClient | 必須 | 暗号化・署名検証 |  |

## 📥 引数

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | Object | 必須 | authClient/Server共通設定情報 |  |