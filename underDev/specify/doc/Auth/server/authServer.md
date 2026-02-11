# 🧩 authServerクラス仕様書

authServer

## 🧾 概説

サーバ側中核クラス

## 🔢 メンバ一覧

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authServerConfig | 必須 | authServer設定項目 |  |
| cryptoLib | cryptoServer | 必須 | 暗号化・署名検証 |  |

## 📥 引数

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | authConfig | 必須 | authClient/Server共通設定値オブジェクト |  |