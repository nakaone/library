# グローバル関数・クラス一覧

| クラス/関数名 | 概要 |
| :-- | :-- |
| [class01](class01.md) | テスト用クラス(desc) |
| [func01](func01.md) | func01: 関数テスト |

# <span id="typedefList">データ型定義一覧</span>

| No | データ型名 | 概要 |
| --: | :-- | :-- |
| 1 | [arrowDef](#arrowDef) | JSDocの関数・メソッド単位のオブジェクト |
| 2 | [funcDef](#funcDef) | JSDocの関数・メソッド単位のオブジェクト |
| 3 | [globalDef](#globalDef) | globalDef: テスト用定義① |
| 4 | [typeDef](#typeDef) | JSDocのデータ型定義単位のオブジェクト |
| 5 | [User](#User) | User |

# 個別データ型定義


## <a href="#typedefList"><span id="arrowDef">"arrowDef" データ型定義</span></a>

JSDocの関数・メソッド単位のオブジェクト

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 関数・メソッド名 |  |
| list | <a href="index.md#arrowDef">arrowDef</a>[] \| <a href="index.md#typeDef">typeDef</a>[] \| columnDef[] | 必須 | 関数・メソッド内のJSDoc |  |


## <a href="#typedefList"><span id="funcDef">"funcDef" データ型定義</span></a>

JSDocの関数・メソッド単位のオブジェクト

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 関数・メソッド名 |  |
| list | <a href="index.md#funcDef">funcDef</a>[] \| <a href="index.md#typeDef">typeDef</a>[] \| columnDef[] | 必須 | 関数・メソッド内のJSDoc |  |


## <a href="#typedefList"><span id="globalDef">"globalDef" データ型定義</span></a>

- 末尾にある補足説明

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| main | <a href="index.md#typeDef">typeDef</a>[] \| columnDef[] | [] | グローバル領域にあるJSDoc |  |
| class | Object | 必須 | クラス定義にかかるJSDoc |  |
| class.method | columnDef[] | 任意 | 任意項目確認用 |  |


## <a href="#typedefList"><span id="typeDef">"typeDef" データ型定義</span></a>

JSDocのデータ型定義単位のオブジェクト

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | データ型の定義名 |  |
| list | columnDef[] | 必須 | 項目(メンバ)のリスト |  |


## <a href="#typedefList"><span id="User">"User" データ型定義</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 |  |  |
| age | number | 必須 |  |  |
| isAdmin | boolean | 必須 |  |  |