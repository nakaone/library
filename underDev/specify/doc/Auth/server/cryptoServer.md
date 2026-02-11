# 🧩 cryptoServerクラス仕様書

cryptoServer

## 🧾 概説

constructor

## 🧾 概説

constructor
サーバ側の暗号化・署名検証

## 🔢 メンバ一覧

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authServerConfig | 必須 | authServer設定情報 |  |
| prop | ScriptProperties | 必須 | PropertiesService.getScriptProperties() |  |
| keys | authScriptProperties | 必須 | ScriptPropertiesに保存された鍵ペア情報 |  |
| keyList | string[] | 必須 | ScriptPropertiesに保存された項目名の一覧 |  |

## 📥 引数

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authServerConfig | 必須 | authServer設定値 |  |