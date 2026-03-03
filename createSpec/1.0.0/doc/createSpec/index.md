# グローバル関数・クラス一覧

| クラス/関数名 | 概要 |
| :-- | :-- |
| [DocletEx](DocletEx.md) | DocletEx: jsdocから出力されるDocletに情報を付加したもの |

# <span id="typedefList">データ型定義一覧</span>

| No | データ型名 | 概要 |
| --: | :-- | :-- |
| 1 | [Doclet](#Doclet) | Doclet: `jsdoc -X`で配列で返されるオブジェクト |
| 2 | [DocletColDef](#DocletColDef) | DocletColDef: Doclet.properties/params/returnsの要素(メンバ)定義情報 |
| 3 | [DocletColRow](#DocletColRow) | DocletColRow: データ項目一覧作成用追加情報 |
| 4 | [DocletTreeFile](#DocletTreeFile) | DocletTreeFile: 個別入力ファイル情報 |
| 5 | [DocletTreeOpt](#DocletTreeOpt) | DocletTreeOpt: オプション設定値 |
| 6 | [DocletTreeSource](#DocletTreeSource) | DocletTreeSource: 統合版入力ファイル(JSソース)情報 |

# 個別データ型定義


## <a href="#typedefList"><span id="Doclet">"Doclet" データ型定義</span></a>

Doclet: `jsdoc -X`で配列で返されるオブジェクト

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| augments | string[] | 必須 | ＠augments/＠extendsによる継承元情報 | 親クラスや継承対象の一覧 |
| classdesc | string | 必須 | ＠classdescタグで指定されたクラス専用の説明文 | description とは別枠で保持される |
| comment | string | 必須 | ソース上に記載されたDocletの原文 |  |
| description | string | 必須 | 説明文。タグ以外のcomment内の自由記述部分 |  |
| examples | string[] | 必須 | ＠exampleタグの内容。使用例コードを配列で保持 |  |
| kind | string | 必須 | Docletの対象種別 | 例：function, class, member, typedef, module など |
| longname | string | 必須 | 完全修飾名 | `module:foo~bar#baz`のように、モジュール・クラス・スコープを含む一意名 |
| memberof | string | 必須 | 所属先（親）を示す完全修飾名 | どのクラス・モジュール・名前空間に属するかを示す |
| meta | Object | 必須 | Docletが生成されたソース位置情報 |  |
| meta.range | number[] | 必須 | ソースコード内での文字位置範囲 | 桁数単位で、2要素ずつ組み合わせた開始・終了インデックス。 |
| meta.filename | string | 必須 | 対象が定義されているソースファイル名 |  |
| meta.lineno | number | 必須 | 対象定義の開始行番号 |  |
| meta.columnno | number | 必須 | 対象定義の開始列番号 |  |
| meta.path | string | 必須 | ソースファイルが存在するディレクトリパス |  |
| meta.code | Object | 必須 | Doclet対象となったコード要素の構造情報 |  |
| meta.code.id | string | 必須 | コード要素の内部識別子(AST由来、存在しない場合あり) |  |
| meta.code.name | string | 必須 | コード要素の名前（関数名・クラス名・変数名など） |  |
| meta.code.type | string | 必須 | コード要素の種別 |  |
| meta.code.value | string | 必須 | コード要素のソース表現（代入値や関数本体の文字列表現） |  |
| meta.code.paramnames | string[] | 必須 | 関数・メソッドの引数名一覧 |  |
| meta.vars | Object.<string, string> | 必須 | スコープ内で参照される変数名とその値（簡易マップ） |  |
| name | string | 必須 | 対象の短い名前(関数名・クラス名・プロパティ名など) |  |
| params | <a href="index.md#<a href="index.md#Doclet">Doclet</a>ColDef"><a href="index.md#Doclet">Doclet</a>ColDef</a>[] | 必須 | ＠paramタグから生成された引数情報の配列 |  |
| properties | <a href="index.md#<a href="index.md#Doclet">Doclet</a>ColDef"><a href="index.md#Doclet">Doclet</a>ColDef</a>[] | 必須 | ＠propertyタグから生成されたメンバ定義情報 |  |
| returns | <a href="index.md#<a href="index.md#Doclet">Doclet</a>ColDef"><a href="index.md#Doclet">Doclet</a>ColDef</a>[] | 必須 | ＠returns/＠returnタグから生成された戻り値情報 | returnsはparams/propertiesと以下の点で異なる。
  1. 配列だが単一
  2. name/optional/defaultvalueは無い
  3. nullable,nullableTypeが付くことがある |
| scope | string | 必須 | スコープ種別 | global,static,instance,innerなど、メンバの可視性・所属を示す |
| tags | Object[] | 必須 | JSDoc上に記述されたタグのうち、専用フィールドに変換されなかった生タグ情報 | 独自タグ、JSDocが意味解釈しないタグ、情報落ちしないよう保持された生情報 |
| tags.meta | Object | 必須 | タグが記述されているソース位置情報 |  |
| tags.originalTitle | string | 必須 | ソース上に記述されたタグ名（＠を除いた元の表記） |  |
| tags.title | string | 必須 | 正規化されたタグ名(＠returns->return,＠History->history) |  |
| tags.text | string | 必須 | タグ行の生テキスト（タグ名を除いた部分） |  |
| tags.value | string | 必須 | タグ内容をJSDocが解釈・分解した結果の文字列表現 | 単純タグではtextと同じになることが多い |
| type | Object | 必須 | ＠type/＠param/＠returns/＠property等から得られた型情報 | プリミティブ・Union・配列・オブジェクトなど |
| type.names | string[] | 必須 | データ型名の配列 | `{number\|string}`等、'\|'で区切られたUnion型の場合は複数になる
  {typeDef[]\|columnDef[]} ⇒ "names": ["Array.<typeDef>","Array.<columnDef>"] |
| undocumented | boolean | 必須 | JSDoc コメントが存在しない要素かどうか | true の場合、自動抽出されたがコメント未記述 |
| type | Object | 必須 | ＠type/＠param/＠returns/＠property等から得られた型情報 | プリミティブ・Union・配列・オブジェクトなど |
| type.names | string[] | 必須 | データ型名の配列 | `{number\|string}`等、'\|'で区切られたUnion型の場合は複数になる


# "meta.code.type"の内容

- 関数・メソッド系
  - FunctionDeclaration : `function foo() {}`形式の関数宣言。名前付き・巻き上げ対象
  - FunctionExpression : `const f = function() {}`のような関数式。無名／名前付きどちらもあり得る
  - ArrowFunctionExpression : `() => {}`形式のアロー関数。this を持たない
  - MethodDefinition : クラス内メソッド。`class A { foo() {} }`
- クラス系
  - ClassDeclaration : `class Foo {}`の宣言。トップレベルで定義されたクラス
  - ClassExpression : `const A = class {}`のようなクラス式
- 変数・メンバ系
  - VariableDeclaration : `var/let/const`による宣言全体。実体は VariableDeclarator に分かれる
  - VariableDeclarator : `const a = 10`の`a = 10`部分。JSDoc が member として拾うことが多い
  - Property : オブジェクトリテラルのプロパティ。`{ a: 10 }`
  - MemberExpression : `obj.prop`や`obj['prop']`。直接 Doclet になることは少ない（解析補助）
- オブジェクト・構造系
  - ObjectExpression : `{a:10,b:20}`。＠typedef の元になることがある
  - ArrayExpression : `[1,2,3]`。型推論や ＠type 補助に使用される
- モジュール・エクスポート系（ESM）
  - ImportDeclaration : `import x from 'y'`。Doclet 化されることは稀
  - ExportNamedDeclaration : `export { foo }`,`export const a = 1`
  - ExportDefaultDeclaration : `export default function () {}`,`export default class {}`
- その他　※出現頻度低め
  - AssignmentExpression : `a = 10`。グローバル代入や static メンバ検出に使用
  - Literal : 数値・���字列・真偽値などの即値
  - Identifier : 変数名・関数名そのもの。単体で Doclet になることはない


# 「完全修飾名」の構造

## 基本構造

`[トップレベル] (区切り記号 [子要素])*`

例：
- `User#test`
- `module:auth~Config#timeout`
- `foo.age`

## 主な区切り記号と意味

\| 記号 \| 意味 \| 用途 \|
\| :-- \| :-- \| :-- \|
\| . \| 名前空間 / 静的・構造的所属 \| オブジェクト・typedef \|
\| # \| インスタンスメンバ \| クラスの instance \|
\| ~ \| 内部（inner）要素 \| クロージャ・内部関数 \|
\| : \| モジュール修飾子 \| module 指定 \| |


## <a href="#typedefList"><span id="DocletColDef">"DocletColDef" データ型定義</span></a>

DocletColDef: Doclet.properties/params/returnsの要素(メンバ)定義情報

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| type | Object | 必須 | データ型情報オブジェクト |  |
| type.names | string[] | 必須 | データ型名の配列 | `{number\|string}`等、'\|'で区切られたUnion型の場合は複数になる
  {typeDef[]\|columnDef[]} ⇒ "names": ["Array.<typeDef>","Array.<columnDef>"] |
| longname | string | 必須 | 対象要素の完全修飾名（所属関係・スコープを含む一意な識別子） |  |
| scope | string | 必須 | 対象要素のスコープ種別 | - global : グローバル
  - static : クラス静的メンバ
  - instance : インスタンスメンバ
  - inner : 内部要素 |
| memberof | string | 必須 |  |  |
| description | string | 必須 | 説明文 |  |
| name | string | 必須 | プロパティ名。階層化されている場合`parent.child`形式になる |  |
| meta | Object | 必須 | プロパティ定義が存在するソース位置情報 | param/returnsには出ないがpropertiesには出ることがある |
| defaultvalue | string | 必須 | 既定値(文字列表現。ex.'[]') |  |
| optional | boolean | 必須 | trueの場合は任意項目 |  |
| row | <a href="index.md#<a href="index.md#Doclet">Doclet</a>ColRow"><a href="index.md#Doclet">Doclet</a>ColRow</a> | 必須 | DocletEx.addRowToColumnで追加される項目情報 |  |


## <a href="#typedefList"><span id="DocletColRow">"DocletColRow" データ型定義</span></a>

DocletColRow: データ項目一覧作成用追加情報

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 項目名 |  |
| type | string | 必須 | データ型 |  |
| value | string | 必須 | 要否/既定値 |  |
| desc | string | 必須 | 説明 |  |
| note | string | 必須 | 備考 |  |


## <a href="#typedefList"><span id="DocletTreeFile">"DocletTreeFile" データ型定義</span></a>

DocletTreeFile: 個別入力ファイル情報

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| full | string | 必須 | フルパス＋ファイル名 |  |
| unique | string | 必須 | 固有パス(フルパス−共通部分) | ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/") |
| basename | string | 必須 | ファイル名 |  |
| content | string | 必須 | ファイルの内容 |  |
| jsdoc | <a href="index.md#Doclet">Doclet</a>[] | 必須 | `jsdoc -X`の実行結果オブジェクト |  |


## <a href="#typedefList"><span id="DocletTreeOpt">"DocletTreeOpt" データ型定義</span></a>

DocletTreeOpt: オプション設定値

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| title | Object.<string, string> | 必須 | Markdown文書のタイトル行 |  |
| lang | string | 'ja-JP' | 使用言語 |  |
| indexMd | string | 'index.md' | フォルダ直下の管理ファイル名 |  |
| propHeader | Object.<string, Array.<Object>> | 任意 | 項目一覧テーブルのヘッダ定義 | Object = {key,label,align} |
| returnHeader | Object.<string, Array.<Object>> | 任意 | 戻り値テーブルのヘッダ定義 | Object = {key,label,align} |
| jsdocJson | string | "jsdoc.json" | jsdoc設定ファイル名 |  |
| dummyDir | string | "./dummy" | ダミーディレクトリ名 |  |
| jsdocTarget | string | ".+\\.(js|mjs|gs|txt)$" | jsdoc処理対象ファイル名の正規表現 |  |


## <a href="#typedefList"><span id="DocletTreeSource">"DocletTreeSource" データ型定義</span></a>

DocletTreeSource: 統合版入力ファイル(JSソース)情報

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| common | string | '' | フルパスの共通部分 |  |
| outDir | string | '' | 出力先フォルダ名(フルパス) |  |
| num | number | 0 | 対象ファイルの個数 |  |
| files | <a href="index.md#Doclet">Doclet</a>TreeFile[] | [] | 対象ファイルの情報 |  |
| research | string | 任意 | 調査結果ファイル名(=DocletTreeのJSON) |  |