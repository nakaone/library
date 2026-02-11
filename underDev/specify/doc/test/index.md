# グローバル関数・クラス一覧

| path | name | label |
| :-- | :-- | :-- |
| / | func01 | func01: 関数テスト |
| / | class01 | class01 |

# データ型定義一覧

| path | name | label |
| :-- | :-- | :-- |
| / | globalDef | - 末尾にある補足説明 |
| / | User | User |
| / | funcDef | JSDocの関数・メソッド単位のオブジェクト |
| / | typeDef | JSDocのデータ型定義単位のオブジェクト |

# データ型

## globalDef

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| main | typeDef[] \| columnDef[] | [] | グローバル領域にあるJSDoc |  |
| class | Object | 必須 | クラス定義にかかるJSDoc |  |
| class.method | columnDef[] | 任意 | 任意項目確認用 |  |

## User

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 |  |  |
| age | number | 必須 |  |  |
| isAdmin | boolean | 必須 |  |  |

## funcDef

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 関数・メソッド名 |  |
| list | funcDef[] \| typeDef[] \| columnDef[] | 必須 | 関数・メソッド内のJSDoc |  |

## typeDef

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | データ型の定義名 |  |
| list | columnDef[] | 必須 | 項目(メンバ)のリスト |  |