# グローバル関数・クラス一覧

| path | name | label |
| :-- | :-- | :-- |
| / | Schema | Schema |

# データ型定義一覧

| path | name | label |
| :-- | :-- | :-- |
| / | TypeDef | TypeDef: 論理テーブル構造定義 |
| / | ColumnDef | ColumnDef: 項目定義 |

# データ型

## TypeDef

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 論理的な識別名（TypeDef のキー） | - クラス・API・ログで使用。例: 'Member', 'AuthAuditLog'
  - constructorに渡す定義オブジェクトでは省略(メンバ名を引用) |
| typeName | string | 'TypeDef' | データ型名 | - 同一データ型のテーブル・インスタンスを複数使用する場合、instanceofの代わりに使用 |
| desc | string | '' | テーブルに関する概要説明 |  |
| note | string | '' | テーブルに関する備考 |  |
| primaryKey | string[] | [] | 主キー項目名 |  |
| unique | string[] | [] | 主キー以外の一意制約 |  |
| cols | ColumnDef[] | 必須 | 項目定義（順序を考慮するため配列） |  |
| header | string[] | 必須 | 項目名の一覧(引数不可、自動生成) |  |
| map | Object.<string, ColumnDef> | 必須 | 項目名をキーとする項目定義集(引数不可、自動生成) |  |

## ColumnDef

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 項目名（英数字・システム用） |  |
| label | string | 任意 | 表示用ラベル（省略時は name) |  |
| desc | string | '' | 項目に関する概要説明 |  |
| note | string | '' | 項目に関する備考・意味説明 |  |
| type | string | 'string' | 論理データ型 | - 'string' | 'number' | 'boolean' | 'object' | 'array' | 'datetime' | 'function' |
| nullable | boolean | true | null を許可するか |  |
| default | any |  | 既定値 | - データ型が関数の場合、引数はfactoryメソッドに渡されるargと看做す

【datetimeが固定値ではない場合の記述方法】
ex. factoryメソッドで生成するオブジェクトに生成日時を設定したい
  ColumnDef.default = "Date.now()"
ex. 有効期間として1日(24時間)後を設定したい
  ColumnDef.default = "new Date(Date.now()+24*3600*1000)"
- 【注意】引数は使用不可
- factoryメソッドではこれを new Function('x',`return ${default}`) として関数化し、実行結果を返す |