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

| name | type | value | desc | note |
| :-- | :-- | :-- | :-- | :-- |
| name | string | required | 関数・メソッド名 |  |
| list | arrowDef[] \| typeDef[] \| columnDef[] | required | 関数・メソッド内のJSDoc |  |

## <span id="funcDef">"funcDef" データ型定義</span>

| name | type | value | desc | note |
| :-- | :-- | :-- | :-- | :-- |
| name | string | required | 関数・メソッド名 |  |
| list | funcDef[] \| typeDef[] \| columnDef[] | required | 関数・メソッド内のJSDoc |  |

## <span id="globalDef">"globalDef" データ型定義</span>

| name | type | value | desc | note |
| :-- | :-- | :-- | :-- | :-- |
| main | typeDef[] \| columnDef[] | [] | グローバル領域にあるJSDoc |  |
| class | Object | required | クラス定義にかかるJSDoc |  |
| class.method | columnDef[] | optional | 任意項目確認用 |  |

## <span id="typeDef">"typeDef" データ型定義</span>

| name | type | value | desc | note |
| :-- | :-- | :-- | :-- | :-- |
| name | string | required | データ型の定義名 |  |
| list | columnDef[] | required | 項目(メンバ)のリスト |  |

## <span id="User">"User" データ型定義</span>

| name | type | value | desc | note |
| :-- | :-- | :-- | :-- | :-- |
| name | string | required |  |  |
| age | number | required |  |  |
| isAdmin | boolean | required |  |  |