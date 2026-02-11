# 🧩 createSpec()

# 用語集

## 🧾 概説

# 用語集

- Doclet : JSDoc上「／** 〜 *／」までの部分。通常一つのファイルに複数存在。
  `jsdoc -X`の出力はArray.<Doclet>形式のJSONとなる。
- シンボル : クラス・関数・データ型定義。Markdownの仕様書上、最上位の分類

# 参考資料

- [データ型判定](https://docs.google.com/spreadsheets/d/1X_1u2xpCOHV2oeZxSvFVAxUNx2ast1JWLWOIT0sQpuU/edit?gid=0#gid=0)(Google Spread)

## 🧾 概説

# 用語集

- Doclet : JSDoc上「／** 〜 *／」までの部分。通常一つのファイルに複数存在。
  `jsdoc -X`の出力はArray.<Doclet>形式のJSONとなる。
- シンボル : クラス・関数・データ型定義。Markdownの仕様書上、最上位の分類

# 参考資料

- [データ型判定](https://docs.google.com/spreadsheets/d/1X_1u2xpCOHV2oeZxSvFVAxUNx2ast1JWLWOIT0sQpuU/edit?gid=0#gid=0)(Google Spread)

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