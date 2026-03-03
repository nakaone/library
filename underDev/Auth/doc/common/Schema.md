<style>
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
  .submenu {  /* MD内のサブメニュー。右寄せ＋文字サイズ小 */
    text-align: right;
    font-size: 0.8rem;
  }
  .nowrap td {white-space:nowrap;} /* 横長な表を横スクロール */
  .nowrap b {background:yellow;}

.popup {color:#084} /* titleに文字列を設定した項目 */
  td {white-space:nowrap;}
</style>
<div style="text-align: right;">

[総説](../readme.md) | [共通仕様](../common/index.md) | [クライアント側仕様](../client/index.md) | [サーバ側仕様](../server/index.md) | [開発仕様](../dev.md)

</div>

# <span id="Schema_top">🧩 Schemaクラス仕様書</span>

Schema: DB・データ型構造定義オブジェクト

## <a href="#Schema_top"><span id="Schema_prop">🔢 Schema メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | Schemaの論理名 |  |
| version | string | '0.0.0' | Schemaのバージョン識別子(例:'1.2.0') |  |
| dbName | string | 任意 | 物理DB名。省略時はnameを流用 |  |
| desc | string | '' | Schema全体に関する概要説明 |  |
| note | string | '' | Schema全体に関する備考 |  |
| types | Object.<string, TypeDef> | 必須 | 論理テーブル名をキーとするテーブル定義 |  |
| original | string | 必須 | Schemaインスタンス生成時の引数(JSON)。自動生成、設定不可 |  |
| allowedColumnTypes | string[] | 必須 | 許容するColumnのデータ型のリスト。自動生成、設定不可<br> | - 'string' \| 'number' \| 'boolean' \| 'object' \| 'array' \| 'datetime' \| 'function' |

## <a href="#Schema_top"><span id="Schema_func">🧱 Schema メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#Schema-constructor_top">constructor</a> |  |
| 2 | <a href="#Schema-isObject_top">isObject</a> | isObject: 引数がオブジェクトであるか判定 |
| 3 | <a href="#Schema-TypeDef_top">TypeDef</a> | TypeDef: 論理テーブル構造定義 |
| 4 | <a href="#Schema-typedef_top">typedef</a> | typedef: TypeDef型オブジェクトを生成 |
| 5 | <a href="#Schema-columndef_top">columndef</a> | columndef: ColumnDef型オブジェクトを生成 |
| 6 | <a href="#Schema-factory_top">factory</a> | factory: 指定TypeDef型のオブジェクトを生成 |
| 7 | <a href="#Schema-sanitizeArg_top">sanitizeArg</a> | sanitizeArg: プリミティブ型のみで構成されるよう無毒化 |

## <a href="#Schema_top"><span id="Schema_desc">🧾 Schema 概説</span></a>

Schema: DB・データ型構造定義オブジェクト
- 各種アプリで使用するテーブル・データ型を宣言
- 各種アプリでは本クラスを拡張し、configとすることを想定<br>

```
{
  name: 'camp2025',
  types: {
    master: {
      cols:[
        {name:'タイムスタンプ',type:'string'},
        {name:'メールアドレス',type:'string'},
        // (中略)
      ],
    },
  },
},
```
## <span id="Schema-constructor_top">🧩 constructor()</span>

### <a href="#Schema-constructor_top"><span id="Schema-constructor_desc">🧾 constructor 概説</span></a>

<br>

### <a href="#Schema-constructor_top"><span id="Schema-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Schema[] | [{} | 設定情報集。後順位優先。共通設定を先頭に特有設定の追加を想定 |  |

### <a href="#Schema-constructor_top"><span id="Schema-constructor_return">◀️ constructor 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| Schema \| Error |  |  |
## <span id="Schema-isObject_top">🧩 isObject()</span>

isObject: 引数がオブジェクトであるか判定

### <a href="#Schema-isObject_top"><span id="Schema-isObject_desc">🧾 isObject 概説</span></a>

isObject: 引数がオブジェクトであるか判定<br>

### <a href="#Schema-isObject_top"><span id="Schema-isObject_param">▶️ isObject 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | any | 必須 | 判定対象 |  |

### <a href="#Schema-isObject_top"><span id="Schema-isObject_return">◀️ isObject 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| boolean | オブジェクトならtrue |  |
## <span id="Schema-TypeDef_top">🧩 TypeDefデータ型定義</span>

TypeDef: 論理テーブル構造定義

### <a href="#Schema-TypeDef_top"><span id="Schema-TypeDef_prop">🔢 TypeDef メンバ一覧</span></a>

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

### <a href="#Schema-TypeDef_top"><span id="Schema-TypeDef_desc">🧾 TypeDef 概説</span></a>

TypeDef: 論理テーブル構造定義<br>
## <span id="Schema-typedef_top">🧩 typedef()</span>

typedef: TypeDef型オブジェクトを生成

### <a href="#Schema-typedef_top"><span id="Schema-typedef_desc">🧾 typedef 概説</span></a>

typedef: TypeDef型オブジェクトを生成<br>

### <a href="#Schema-typedef_top"><span id="Schema-typedef_param">▶️ typedef 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | オブジェクト名(TypeDef.name設定値) |  |
| obj | Object | 必須 | 生成するオブジェクトに設定される値(値指定) |  |

### <a href="#Schema-typedef_top"><span id="Schema-typedef_return">◀️ typedef 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| TypeDef \| Error |  |  |
## <span id="Schema-columndef_top">🧩 columndef()</span>

columndef: ColumnDef型オブジェクトを生成

### <a href="#Schema-columndef_top"><span id="Schema-columndef_desc">🧾 columndef 概説</span></a>

columndef: ColumnDef型オブジェクトを生成<br>

### <a href="#Schema-columndef_top"><span id="Schema-columndef_param">▶️ columndef 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| obj | Object | 必須 | 生成するオブジェクトに設定される値(値指定) |  |

### <a href="#Schema-columndef_top"><span id="Schema-columndef_return">◀️ columndef 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| ColumnDef \| Error |  |  |
## <span id="Schema-factory_top">🧩 factory()</span>

factory: 指定TypeDef型のオブジェクトを生成

### <a href="#Schema-factory_top"><span id="Schema-factory_desc">🧾 factory 概説</span></a>

factory: 指定TypeDef型のオブジェクトを生成<br>

### <a href="#Schema-factory_top"><span id="Schema-factory_param">▶️ factory 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | データ型名。TypeDef.name |  |
| arg | Object.<string, any> | {} | 各メンバの設定値 |  |

### <a href="#Schema-factory_top"><span id="Schema-factory_return">◀️ factory 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| Object | TypeDefで指定したデータ型のオブジェクト |  |
## <span id="Schema-sanitizeArg_top">🧩 sanitizeArg()</span>

sanitizeArg: プリミティブ型のみで構成されるよう無毒化

### <a href="#Schema-sanitizeArg_top"><span id="Schema-sanitizeArg_desc">🧾 sanitizeArg 概説</span></a>

sanitizeArg: プリミティブ型のみで構成されるよう無毒化<br>

### <a href="#Schema-sanitizeArg_top"><span id="Schema-sanitizeArg_param">▶️ sanitizeArg 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| value | * | 必須 | チェック対象の変数 |  |
| path | string | '$' | エラーメッセージ用にオブジェクト内の階層を保持 |  |

### <a href="#Schema-sanitizeArg_top"><span id="Schema-sanitizeArg_return">◀️ sanitizeArg 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| Object \| Error |  |  |