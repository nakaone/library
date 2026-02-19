# グローバル関数・クラス一覧

| クラス/関数名 | 概要 |
| :-- | :-- |
| [class01](class01.md) | テスト用クラス(desc) |
| [func01](func01.md) | func01: 関数テスト |

# データ型定義一覧

| データ型名 | 概要 |
| :-- | :-- |
| [arrowDef](#arrowDef) | JSDocの関数・メソッド単位のオブジェクト |
| [funcDef](#funcDef) | JSDocの関数・メソッド単位のオブジェクト |
| [globalDef](#globalDef) | globalDef: テスト用定義① |
| [typeDef](#typeDef) | JSDocのデータ型定義単位のオブジェクト |
| [User](#User) | User |

# 個別データ型定義


## <span id="arrowDef">"arrowDef" データ型定義</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 関数・メソッド名 |  |
| list | arrowDef[] \| typeDef[] \| columnDef[] | 必須 | 関数・メソッド内のJSDoc |  |


## <span id="funcDef">"funcDef" データ型定義</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 関数・メソッド名 |  |
| list | funcDef[] \| typeDef[] \| columnDef[] | 必須 | 関数・メソッド内のJSDoc |  |


## <span id="globalDef">"globalDef" データ型定義</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| main | typeDef[] \| columnDef[] | [] | グローバル領域にあるJSDoc |  |
| class | Object | 必須 | クラス定義にかかるJSDoc |  |
| class.method | columnDef[] | 任意 | 任意項目確認用 |  |


## <span id="typeDef">"typeDef" データ型定義</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | データ型の定義名 |  |
| list | columnDef[] | 必須 | 項目(メンバ)のリスト |  |


## <span id="User">"User" データ型定義</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 |  |  |
| age | number | 必須 |  |  |
| isAdmin | boolean | 必須 |  |  |