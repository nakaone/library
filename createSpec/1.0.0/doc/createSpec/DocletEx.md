# <span id="/core.mjs::createSpec.DocletEx_top">🧩 DocletExクラス仕様書</span>

DocletEx: jsdocから出力されるDocletに情報を付加したもの

## <a href="#/core.mjs::createSpec.DocletEx_top"><span id="/core.mjs::createSpec.DocletEx_prop">🔢 DocletEx メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 【書換】constructorの場合のみ固定値"constructor"に変更 |  |
| longname | string | 必須 | 【書換】constructorの場合のみ"#constructor"を追加 |  |
| opt | Object | 必須 | DocletExインスタンス作成時のオプション | 現状未使用 |
| uuid | string | 必須 | DocletExを一意に識別するためのUUID |  |
| docletType | string | 必須 | Docletの種類。下記「docletTypeの判定ロジック」参照 |  |
| parsed | Object.<string, string> | 必須 | Doclet内で定義されたタグの値 | 例： parsed: {
    label:"method01: メソッドテスト", // string
    ＠description:"method01: メソッドテスト", // string
    ＠memberof:"class01", // string
    ＠param:"{number} arg - method01の引数", // string
    ＠returns:"{{qId:number,name:string}} NG: qId,name指定無しのObjectになる", // string
  } |
| label | string | 必須 | 1行で簡潔に記述された概要説明 | ① JSDoc先頭の「/**」に続く文字列
  ② "＠name"に続く文字列
  ③ typdef, interface
  ④ description, classdescの先頭行
  ⑤ doclet.longname
  ※ 上記に該当が無い場合、「(ラベル未設定)」 |
| properties | <a href="index.md#<a href="index.md#Doclet">Doclet</a>ColDef"><a href="index.md#Doclet">Doclet</a>ColDef</a>[] | 任意 | メンバ一覧 |  |
| params | <a href="index.md#<a href="index.md#Doclet">Doclet</a>ColDef"><a href="index.md#Doclet">Doclet</a>ColDef</a>[] | 任意 | 引数。クラスの場合はconstructorの引数(※同上) |  |
| returns | <a href="index.md#<a href="index.md#Doclet">Doclet</a>ColDef"><a href="index.md#Doclet">Doclet</a>ColDef</a>[] | [] | 戻り値(※同上) |  |
| parent | string |  | 親要素のDocletEx.uuid |  |
| children | string[] | [] | 子要素(メソッド・内部関数)のDocletEx.uuid |  |
| familyTree | string | 必須 | DocletEx.nameを連結した系図(親子関係) |  |
| unique | string | 任意 | 固有パス | ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/") |
| basename | string | 任意 | ファイル名 |  |
| prefix | string | 任意 | 固有パス＋ファイル名 | 以下の各種IDの共通部分(固有パスの先頭・末尾の'/'有無処理済) |
| rangeId | string | 任意 | 固有パス＋ファイル名＋':R'＋meta.range[0] | ※ Doclet以外のファイル情報が必要なため、DocletTree側で追加される項目 |
| linenoId | string | 任意 | 固有パス＋ファイル名＋':N'＋meta.lineno ※同上 |  |
| commentId | string | 任意 | 「固有パス＋ファイル名＋comment」のSHA256 | 同一commentが同一ファイル内に複数有った場合は設定しない |
| longnameId | string | 任意 | 固有パス＋ファイル名＋'::'＋longname | なおlongnameIdはアンカーとしても使用するので、'::'後の英文字は付けない |

## <a href="#/core.mjs::createSpec.DocletEx_top"><span id="/core.mjs::createSpec.DocletEx_func">🧱 DocletEx メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/core.mjs::createSpec~DocletEx#constructor_top">constructor</a> |  |
| 2 | <a href="#/core.mjs::createSpec.DocletEx#addRowToColumn_top">addRowToColumn</a> | addRowToColumn: データ項目情報から一覧作成用情報を作成 |
| 3 | <a href="#/core.mjs::DocletEx#determineType_top">determineType</a> | determineType: Docletの型を判定 |

## <a href="#/core.mjs::createSpec.DocletEx_top"><span id="/core.mjs::createSpec.DocletEx_desc">🧾 DocletEx 概説</span></a>

DocletEx: jsdocから出力されるDocletに情報を付加したもの
メンバ各値の設定箇所は以下の通り。
- opt ~ returns:       DocletEx.constructor()
- parent ~ familyTree: DocletTree.linkage()
- unique ~ longnameId: DocletTree.registration()<br>
## <span id="/core.mjs::createSpec~DocletEx#constructor_top">🧩 constructor()</span>

### <a href="#/core.mjs::createSpec~DocletEx#constructor_top"><span id="/core.mjs::createSpec~DocletEx#constructor_desc">🧾 constructor 概説</span></a>

<br>

### <a href="#/core.mjs::createSpec~DocletEx#constructor_top"><span id="/core.mjs::createSpec~DocletEx#constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| doclet | <a href="index.md#Doclet">Doclet</a> | 必須 |  |  |
| opt | Object | {} | オプション設定値 |  |
## <span id="/core.mjs::createSpec.DocletEx#addRowToColumn_top">🧩 addRowToColumn()</span>

addRowToColumn: データ項目情報から一覧作成用情報を作成

### <a href="#/core.mjs::createSpec.DocletEx#addRowToColumn_top"><span id="/core.mjs::createSpec.DocletEx#addRowToColumn_desc">🧾 addRowToColumn 概説</span></a>

addRowToColumn: データ項目情報から一覧作成用情報を作成

データ項目情報：Doclet.properties/params/returnsの各要素。配列では無くオブジェクト<br>

### <a href="#/core.mjs::createSpec.DocletEx#addRowToColumn_top"><span id="/core.mjs::createSpec.DocletEx#addRowToColumn_param">▶️ addRowToColumn 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| prop | <a href="index.md#<a href="index.md#Doclet">Doclet</a>ColDef"><a href="index.md#Doclet">Doclet</a>ColDef</a> | 必須 | データ項目情報 |  |

### <a href="#/core.mjs::createSpec.DocletEx#addRowToColumn_top"><span id="/core.mjs::createSpec.DocletEx#addRowToColumn_return">◀️ addRowToColumn 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| <a href="index.md#<a href="index.md#Doclet">Doclet</a>ColRow"><a href="index.md#Doclet">Doclet</a>ColRow</a> \| Error |  |  |
## <span id="/core.mjs::DocletEx#determineType_top">🧩 determineType()</span>

determineType: Docletの型を判定

### <a href="#/core.mjs::DocletEx#determineType_top"><span id="/core.mjs::DocletEx#determineType_func">🧱 determineType メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/core.mjs::determineType.dummyFunc_top">dummyFunc</a> | dummyFunc: テスト用ダミー関数 |

### <a href="#/core.mjs::DocletEx#determineType_top"><span id="/core.mjs::DocletEx#determineType_desc">🧾 determineType 概説</span></a>

determineType: Docletの型を判定<br>

### <a href="#/core.mjs::DocletEx#determineType_top"><span id="/core.mjs::DocletEx#determineType_param">▶️ determineType 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| doclet | Object | 必須 |  |  |

### <a href="#/core.mjs::DocletEx#determineType_top"><span id="/core.mjs::DocletEx#determineType_return">◀️ determineType 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| string \| Error | 「docletTypeの判定ロジック」参照 |  |
### <span id="/core.mjs::determineType.dummyFunc_top">🧩 dummyFunc()</span>

dummyFunc: テスト用ダミー関数

#### <a href="#/core.mjs::determineType.dummyFunc_top"><span id="/core.mjs::determineType.dummyFunc_desc">🧾 dummyFunc 概説</span></a>

dummyFunc: テスト用ダミー関数<br>

#### <a href="#/core.mjs::determineType.dummyFunc_top"><span id="/core.mjs::determineType.dummyFunc_param">▶️ dummyFunc 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| a | number | 必須 |  |  |
| b | number | 必須 |  |  |

#### <a href="#/core.mjs::determineType.dummyFunc_top"><span id="/core.mjs::determineType.dummyFunc_return">◀️ dummyFunc 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| number |  |  |