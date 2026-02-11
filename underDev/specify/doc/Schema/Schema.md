# 🧩 Schemaクラス仕様書

Schema

## 🧾 概説

DB構造定義オブジェクト

## 🔢 メンバ一覧

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | Schemaの論理名 |  |
| version | string | '0.0.0' | Schemaのバージョン識別子(例:'1.2.0') |  |
| dbName | string | 任意 | 物理DB名。省略時はnameを流用 |  |
| desc | string | '' | Schema全体に関する概要説明 |  |
| note | string | '' | Schema全体に関する備考 |  |
| types | Object.<string, TypeDef> | 必須 | 論理テーブル名をキーとするテーブル定義 |  |
| original | string | 必須 | Schemaインスタンス生成時の引数(JSON)。自動生成、設定不可 |  |
| allowedColumnTypes | string[] | 必須 | 許容するColumnのデータ型のリスト。自動生成、設定不可 | - 'string' | 'number' | 'boolean' | 'object' | 'array' | 'datetime' | 'function'

- 各種アプリで使用するテーブル・データ型を宣言
- 各種アプリでは本クラスを拡張し、configとすることを想定 |

## 📥 引数

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Schema[] | [{} | 設定情報集。後順位優先。共通設定を先頭に特有設定の追加を想定 |  |

## 📤 戻り値

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| Schema \| Error |  |  |