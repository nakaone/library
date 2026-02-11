# 🧩 createSpec()

createSpec: JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成

## 🧾 概説

createSpec: JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成

## 🧾 概説

createSpec: JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成

## 🔢 メンバ一覧

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| pv | Object | 必須 | createSpec内の共有変数(public variables。class定義のメンバに相当) |  |
| cf | Object | 必須 | createSpec動作設定情報(config) |  |
| sourceFile | sourceFile[] | 必須 | 入力ファイル情報 |  |
| doclet | Doclet[] | 必須 | Doclet型にしたオブジェクトを保存 |  |

## 📥 引数

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| opt | Object | {} | オプション設定 |  |

## 📤 戻り値

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| void |  |  |