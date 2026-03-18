<style> /* 仕様書用共通スタイル定義 */
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
  .source { /* 出典元のソースファイル名(リンクは無し) */
    text-align:right; font-size:0.8rem;}
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

[総説](../readme.md) | [CL/SV共通](../common/index.md) | [CL側](../client/index.md) | [SV側](../server/index.md) | [暗号化](../crypto.md) | [メンバ](../Member.md) | [独自Lib](../lib/index.md) | [開発](../dev.md)

</div>

# <span id="createSpec_top">🧩 createSpec()</span>

<p class="source">source: lib/createSpec.1_0_0.mjs line.48</p>JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成

## <a href="#createSpec_top"><span id="createSpec_prop">🔢 createSpec メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| pv | Object | 必須 | createSpec内の共有変数(public variables。class定義のメンバに相当)<br>  `whois, arg, rv`はdevTools用、`r`他汎用変数は割愛 |
| pv.argv | string[] | 必須 | `node createSpec`実行時の引数 |
| pv.tree | DocletTree | 必須 | DocletTreeインスタンス |
| cf | Object | 必須 | createSpec動作設定情報(config)<br>  command, useageの他、optのメンバを持つ(encode, jsdocJson, dummyDir) |
| cf.command | string | 必須 | jsdocコマンドへのパス文字列 |
| cf.useage | string | 必須 | createSpec使用方法。起動時引数無しまたは'-h'指定時に表示 |

## <a href="#createSpec_top"><span id="createSpec_func">🧱 createSpec メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#createSpec-Development process and remaining issues_top">Development process and remaining issues</a> | 開発工程・残課題 |
| 2 | <a href="#createSpec-DocletColRow_top">DocletColRow</a> | データ項目一覧作成用追加情報 |
| 3 | <a href="#createSpec-DocletColDef_top">DocletColDef</a> | Doclet.properties/params/returnsの要素(メンバ)定義情報 |
| 4 | <a href="#createSpec-Doclet_top">Doclet</a> | `jsdoc -X`で配列で返されるオブジェクト |
| 5 | <a href="#createSpec-decision logic of docletType_top">decision logic of docletType</a> | docletTypeの判定ロジック |
| 6 | <a href="#createSpec-"longname" naming rules_top">"longname" naming rules</a> | docletType毎のlongname命名規則 |
| 7 | <a href="#createSpec-DocletEx_top">DocletEx</a> | jsdocから出力されるDocletに情報を付加したもの |
| 8 | <a href="#createSpec-DocletTreeFile_top">DocletTreeFile</a> | 個別入力ファイル情報 |
| 9 | <a href="#createSpec-DocletTreeSource_top">DocletTreeSource</a> | 統合版入力ファイル(JSソース)情報 |

## <a href="#createSpec_top"><span id="createSpec_desc">🧾 createSpec 概説</span></a>

- 使用方法はcf.useageに記載(オプション無し起動時にコンソール表示)

### 用語集

- Doclet : JSDoc上「／** 〜 *／」までの部分。通常一つのファイルに複数存在。
  `jsdoc -X`の出力はArray.<Doclet>形式のJSONとなる。
- シンボル : クラス・関数・データ型定義。Markdownの仕様書上、最上位の分類

### 参考資料

- [データ型判定](https://docs.google.com/spreadsheets/d/1X_1u2xpCOHV2oeZxSvFVAxUNx2ast1JWLWOIT0sQpuU/edit?gid=0#gid=0)(Google Spread)

## <a href="#createSpec_top"><span id="Development process and remaining issues">🧾 開発工程・残課題</span></a>

- 開発用スクリプトサンプル(test.sh等)
  ```
  node $createSpec $src/(client|common|server|lib)/**／*.(js|mjs) \
                             最後のスラッシュは半角に戻す ^
  -o $tmp/createSpec -r $tmp/DocletTree.json \
  1> $tmp/createSpec/result.log 2> $tmp/createSpec/error.log
  ```
- 埋込指示子対応：<!--::command::{JSON}::-->
  - setvalue: オブジェクトに設定する値の一覧
    {type:データ型名, value:{キー:値,...}}
    戻り値への値設定を想定。指定無しならdefaultvalueを表示
  - embed: 他ファイルの内容を埋め込み
    {file:パス＋ファイル名}
- commentをdetailsタグで表示

- undocumentedチェックを追加
- 和文の他、英文のテンプレートも追加
- 文法チェック
  - ＠class の後に余計な文字列があればエラー
- createSpecはシェルの起動時パラメータを引数とする関数に変更
- 独自タグ「history」対応

## <a href="#createSpec_top"><span id="createSpec_param">▶️ createSpec 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| opt | Object | {} | オプション設定 |
| opt.encode | string | "utf-8" | 入力ファイルのエンコード |
| opt.jsdocJson | string | "jsdoc.json" | jsdocコマンド設定ファイル名<br>  jsdoc.jsonとdummyフォルダはプログラム中で作成・削除される作業用。<br>  詳細はDocletTree.execJSDoc参照 |
| opt.dummyDir | string | "./dummy" | jsdoc用の空フォルダ |

## <a href="#createSpec_top"><span id="createSpec_return">◀️ createSpec 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| void |  |

## <span id="createSpec-DocletColRow_top">🧩 DocletColRowデータ型定義</span>

<p class="source">source: lib/createSpec.1_0_0.mjs line.145</p>データ項目一覧作成用追加情報

### <a href="#createSpec-DocletColRow_top"><span id="createSpec-DocletColRow_prop">🔢 DocletColRow メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| name | string | 必須 | 項目名 |
| type | string | 必須 | データ型 |
| value | string | 必須 | 要否/既定値 |
| desc | string | 必須 | 説明 |
| note | string | 必須 | 備考 |

## <span id="createSpec-DocletColDef_top">🧩 DocletColDefデータ型定義</span>

<p class="source">source: lib/createSpec.1_0_0.mjs line.154</p>Doclet.properties/params/returnsの要素(メンバ)定義情報

### <a href="#createSpec-DocletColDef_top"><span id="createSpec-DocletColDef_prop">🔢 DocletColDef メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| type | Object | 必須 | データ型情報オブジェクト |
| type.names | string[] | 必須 | データ型名の配列<br>  `{number\|string}`等、'\|'で区切られたUnion型の場合は複数になる<br>  {typeDef[]\|columnDef[]} ⇒ "names": ["Array.<typeDef>","Array.<columnDef>"] |
| longname | string | 必須 | 対象要素の完全修飾名（所属関係・スコープを含む一意な識別子） |
| scope | string | 必須 | 対象要素のスコープ種別<br>  - global : グローバル<br>  - static : クラス静的メンバ<br>  - instance : インスタンスメンバ<br>  - inner : 内部要素 |
| memberof | string | 必須 |  |
| description | string | 必須 | 説明文 |
| name | string | 必須 | プロパティ名。階層化されている場合`parent.child`形式になる |
| meta | Object | 必須 | プロパティ定義が存在するソース位置情報<br>  param/returnsには出ないがpropertiesには出ることがある |
| defaultvalue | string | 必須 | 既定値(文字列表現。ex.'[]') |
| optional | boolean | 必須 | trueの場合は任意項目 |
| row | <a href="../lib/index.md#DocletColRow">DocletColRow</a> | 必須 | DocletEx.addRowToColumnで追加される項目情報 |

## <span id="createSpec-Doclet_top">🧩 Docletデータ型定義</span>

<p class="source">source: lib/createSpec.1_0_0.mjs line.176</p>`jsdoc -X`で配列で返されるオブジェクト

### <a href="#createSpec-Doclet_top"><span id="createSpec-Doclet_prop">🔢 Doclet メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| augments | string[] | 必須 | ＠augments/＠extendsによる継承元情報<br>  親クラスや継承対象の一覧 |
| classdesc | string | 必須 | ＠classdescタグで指定されたクラス専用の説明文<br>  description とは別枠で保持される |
| comment | string | 必須 | ソース上に記載されたDocletの原文 |
| description | string | 必須 | 説明文。タグ以外のcomment内の自由記述部分 |
| examples | string[] | 必須 | ＠exampleタグの内容。使用例コードを配列で保持 |
| kind | string | 必須 | Docletの対象種別<br>  例：function, class, member, typedef, module など |
| longname | string | 必須 | 完全修飾名<br>  `module:foo~bar#baz`のように、モジュール・クラス・スコープを含む一意名 |
| memberof | string | 必須 | 所属先（親）を示す完全修飾名<br>  どのクラス・モジュール・名前空間に属するかを示す |
| meta | Object | 必須 | Docletが生成されたソース位置情報 |
| meta.range | number[] | 必須 | ソースコード内での文字位置範囲<br>  桁数単位で、2要素ずつ組み合わせた開始・終了インデックス。 |
| meta.filename | string | 必須 | 対象が定義されているソースファイル名 |
| meta.lineno | number | 必須 | 対象定義の開始行番号 |
| meta.columnno | number | 必須 | 対象定義の開始列番号 |
| meta.path | string | 必須 | ソースファイルが存在するディレクトリパス |
| meta.code | Object | 必須 | Doclet対象となったコード要素の構造情報 |
| meta.code.id | string | 必須 | コード要素の内部識別子(AST由来、存在しない場合あり) |
| meta.code.name | string | 必須 | コード要素の名前（関数名・クラス名・変数名など） |
| meta.code.type | string | 必須 | コード要素の種別 |
| meta.code.value | string | 必須 | コード要素のソース表現（代入値や関数本体の文字列表現） |
| meta.code.paramnames | string[] | 必須 | 関数・メソッドの引数名一覧 |
| meta.vars | Object.<string, string> | 必須 | スコープ内で参照される変数名とその値（簡易マップ） |
| name | string | 必須 | 対象の短い名前(関数名・クラス名・プロパティ名など) |
| params | <a href="../lib/index.md#DocletColDef">DocletColDef</a>[] | 必須 | ＠paramタグから生成された引数情報の配列 |
| properties | <a href="../lib/index.md#DocletColDef">DocletColDef</a>[] | 必須 | ＠propertyタグから生成されたメンバ定義情報 |
| returns | <a href="../lib/index.md#DocletColDef">DocletColDef</a>[] | 必須 | ＠returns/＠returnタグから生成された戻り値情報<br>  returnsはparams/propertiesと以下の点で異なる。<br>  1. 配列だが単一<br>  2. name/optional/defaultvalueは無い<br>  3. nullable,nullableTypeが付くことがある |
| scope | string | 必須 | スコープ種別<br>  global,static,instance,innerなど、メンバの可視性・所属を示す |
| tags | Object[] | 必須 | JSDoc上に記述されたタグのうち、専用フィールドに変換されなかった生タグ情報<br>  独自タグ、JSDocが意味解釈しないタグ、情報落ちしないよう保持された生情報 |
| tags.meta | Object | 必須 | タグが記述されているソース位置情報 |
| tags.originalTitle | string | 必須 | ソース上に記述されたタグ名（＠を除いた元の表記） |
| tags.title | string | 必須 | 正規化されたタグ名(＠returns->return,＠History->history) |
| tags.text | string | 必須 | タグ行の生テキスト（タグ名を除いた部分） |
| tags.value | string | 必須 | タグ内容をJSDocが解釈・分解した結果の文字列表現<br>  単純タグではtextと同じになることが多い |
| type | Object | 必須 | ＠type/＠param/＠returns/＠property等から得られた型情報<br>  プリミティブ・Union・配列・オブジェクトなど |
| type.names | string[] | 必須 | データ型名の配列<br>  `{number\|string}`等、'\|'で区切られたUnion型の場合は複数になる<br>  {typeDef[]\|columnDef[]} ⇒ "names": ["Array.<typeDef>","Array.<columnDef>"] |
| undocumented | boolean | 必須 | JSDoc コメントが存在しない要素かどうか<br>  true の場合、自動抽出されたがコメント未記述 |
| type | Object | 必須 | ＠type/＠param/＠returns/＠property等から得られた型情報<br>  プリミティブ・Union・配列・オブジェクトなど |
| type.names | string[] | 必須 | データ型名の配列<br>  `{number\|string}`等、'\|'で区切られたUnion型の場合は複数になる |

### <a href="#createSpec-Doclet_top"><span id="structure of fully qualified name">🧾 「完全修飾名」の構造</span></a>

#### 基本構造

`[トップレベル] (区切り記号 [子要素])*`

例：
- `User#test`
- `module:auth~Config#timeout`
- `foo.age`

#### 主な区切り記号と意味

| 記号 | 意味 | 用途 |
| :-- | :-- | :-- |
| . | 名前空間 / 静的・構造的所属 | オブジェクト・typedef |
| # | インスタンスメンバ | クラスの instance |
| ~ | 内部（inner）要素 | クロージャ・内部関数 |
| : | モジュール修飾子 | module 指定 |

## <span id="createSpec-DocletEx_top">🧩 DocletExクラス仕様書</span>

<p class="source">source: lib/createSpec.1_0_0.mjs line.427</p>jsdocから出力されるDocletに情報を付加したもの

### <a href="#createSpec-DocletEx_top"><span id="createSpec-DocletEx_prop">🔢 DocletEx メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| name | string | 必須 | 【書換】constructorの場合のみ固定値"constructor"に変更 |
| longname | string | 必須 | 【書換】constructorの場合のみ"#constructor"を追加 |
| opt | Object | 必須 | DocletExインスタンス作成時のオプション<br>  現状未使用 |
| uuid | string | 必須 | DocletExを一意に識別するためのUUID |
| docletType | string | 必須 | Docletの種類。下記「docletTypeの判定ロジック」参照 |
| parsed | Object.<string, string> | 必須 | Doclet内で定義されたタグの値<br>  例： parsed: {<br>    description:"method01: メソッドテスト", // string<br>    memberof:"class01", // string<br>    param:"{number} arg - method01の引数", // string<br>    returns:"{{qId:number,name:string}} NG: qId,name指定無しのObjectになる", // string<br>  } |
| label | string | 必須 | 1行で簡潔に記述された概要説明<br>  ① JSDoc先頭の「/**」に続く文字列<br>  ② constructorは「(memberof.)constructor」<br>  ③ "＠name"に続く文字列<br>  ④ typdef, interface<br>  ⑤ description, classdescの先頭行(=concatenatedの先頭行)<br>  ⑥ v.doclet.longname<br>  ※ 上記に該当が無い場合、「(ラベル未設定)」 |
| concatenated | string | 必須 | description,classdesc,exmapleを出現順に結合。MD出力用 |
| properties | <a href="../lib/index.md#DocletColDef">DocletColDef</a>[] | 任意 | メンバ一覧 |
| params | <a href="../lib/index.md#DocletColDef">DocletColDef</a>[] | 任意 | 引数。クラスの場合はconstructorの引数(※同上) |
| returns | <a href="../lib/index.md#DocletColDef">DocletColDef</a>[] | [] | 戻り値(※同上) |
| parent | string | null | 親要素のDocletEx.uuid |
| children | string[] | [] | 子要素(メソッド・内部関数)のDocletEx.uuid |
| familyTree | string | 必須 | DocletEx.nameを連結した系図(親子関係) |
| unique | string | 任意 | 固有パス<br>  ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/") |
| basename | string | 任意 | ファイル名 |
| prefix | string | 任意 | 固有パス＋ファイル名<br>  以下の各種IDの共通部分(固有パスの先頭・末尾の'/'有無処理済) |
| rangeId | string | 任意 | 固有パス＋ファイル名＋':R'＋meta.range[0]<br>  ※ Doclet以外のファイル情報が必要なため、DocletTree側で追加される項目 |
| linenoId | string | 任意 | 固有パス＋ファイル名＋':N'＋meta.lineno ※同上 |
| commentId | string | 任意 | 「固有パス＋ファイル名＋comment」のSHA256<br>  同一commentが同一ファイル内に複数有った場合は設定しない |

### <a href="#createSpec-DocletEx_top"><span id="createSpec-DocletEx_func">🧱 DocletEx メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#createSpec-DocletEx-constructor_top">constructor</a> | DocletEx.constructor |
| 2 | <a href="#createSpec-DocletEx-addRowToColumn_top">addRowToColumn</a> | データ項目情報から一覧作成用情報を作成 |
| 3 | <a href="#createSpec-DocletEx-determineType_top">determineType</a> | Docletの型を判定 |

### <a href="#createSpec-DocletEx_top"><span id="createSpec-DocletEx_desc">🧾 DocletEx 概説</span></a>

メンバ各値の設定箇所は以下の通り。
- opt    ~ returns   : DocletEx.constructor()
- parent ~ familyTree: DocletTree.linkage()
- unique ~ commentId : DocletTree.registration()

### <span id="createSpec-DocletEx-constructor_top">🧩 constructor()</span>

DocletEx.constructor

#### <a href="#createSpec-DocletEx-constructor_top"><span id="createSpec-DocletEx-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| doclet | <a href="../lib/index.md#Doclet">Doclet</a> | 必須 |  |
| opt | Object | {} | オプション設定値 |

### <span id="createSpec-DocletEx-addRowToColumn_top">🧩 addRowToColumn()</span>

データ項目情報から一覧作成用情報を作成

#### <a href="#createSpec-DocletEx-addRowToColumn_top"><span id="createSpec-DocletEx-addRowToColumn_desc">🧾 addRowToColumn 概説</span></a>

データ項目情報：Doclet.properties/params/returnsの各要素。配列では無くオブジェクト

#### <a href="#createSpec-DocletEx-addRowToColumn_top"><span id="createSpec-DocletEx-addRowToColumn_param">▶️ addRowToColumn 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| prop | <a href="../lib/index.md#DocletColDef">DocletColDef</a> | 必須 | データ項目情報 |

#### <a href="#createSpec-DocletEx-addRowToColumn_top"><span id="createSpec-DocletEx-addRowToColumn_return">◀️ addRowToColumn 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| <a href="../lib/index.md#DocletColRow">DocletColRow</a> \| Error |  |

### <span id="createSpec-DocletEx-determineType_top">🧩 determineType()</span>

Docletの型を判定

#### <a href="#createSpec-DocletEx-determineType_top"><span id="createSpec-DocletEx-determineType_func">🧱 determineType メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#createSpec-DocletEx-determineType-dummyFunc_top">dummyFunc</a> | テスト用ダミー関数 |

#### <a href="#createSpec-DocletEx-determineType_top"><span id="createSpec-DocletEx-determineType_param">▶️ determineType 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| doclet | Object | 必須 |  |

#### <a href="#createSpec-DocletEx-determineType_top"><span id="createSpec-DocletEx-determineType_return">◀️ determineType 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| string \| Error | 「docletTypeの判定ロジック」参照 |

#### <span id="createSpec-DocletEx-determineType-dummyFunc_top">🧩 dummyFunc()</span>

テスト用ダミー関数

##### <a href="#createSpec-DocletEx-determineType-dummyFunc_top"><span id="createSpec-DocletEx-determineType-dummyFunc_param">▶️ dummyFunc 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| a | number | 必須 |  |
| b | number | 必須 |  |

##### <a href="#createSpec-DocletEx-determineType-dummyFunc_top"><span id="createSpec-DocletEx-determineType-dummyFunc_return">◀️ dummyFunc 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| number |  |

## <span id="createSpec-DocletTreeFile_top">🧩 DocletTreeFileデータ型定義</span>

<p class="source">source: lib/createSpec.1_0_0.mjs line.677</p>個別入力ファイル情報

### <a href="#createSpec-DocletTreeFile_top"><span id="createSpec-DocletTreeFile_prop">🔢 DocletTreeFile メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| full | string | 必須 | フルパス＋ファイル名 |
| unique | string | 必須 | 固有パス(フルパス−共通部分)<br>  ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/") |
| basename | string | 必須 | ファイル名 |
| content | string | 必須 | ファイルの内容 |
| jsdoc | <a href="../lib/index.md#Doclet">Doclet</a>[] | 必須 | `jsdoc -X`の実行結果オブジェクト |

## <span id="createSpec-DocletTreeSource_top">🧩 DocletTreeSourceデータ型定義</span>

<p class="source">source: lib/createSpec.1_0_0.mjs line.687</p>統合版入力ファイル(JSソース)情報

### <a href="#createSpec-DocletTreeSource_top"><span id="createSpec-DocletTreeSource_prop">🔢 DocletTreeSource メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| common | string | '' | フルパスの共通部分 |
| outDir | string | '' | 出力先フォルダ名(フルパス) |
| num | number | 0 | 対象ファイルの個数 |
| files | <a href="../lib/index.md#DocletTreeFile">DocletTreeFile</a>[] | [] | 対象ファイルの情報 |
| research | string | 任意 | 調査結果ファイル名(=DocletTreeのJSON) |

## <span id="createSpec-DocletTreeSymbol_top">🧩 DocletTreeSymbolデータ型定義</span>

<p class="source">source: lib/createSpec.1_0_0.mjs line.704</p>クラス・グローバル関数名・データ型定義名から参照先URLへの変換情報

### <a href="#createSpec-DocletTreeSymbol_top"><span id="createSpec-DocletTreeSymbol_prop">🔢 DocletTreeSymbol メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| name | string | 必須 | クラス・グローバル関数名・データ型定義名 |
| rex | RegExp | 必須 | 名称を含むかを判定する正規表現 |
| link | string | 必須 | 参照先URL(aタグ)を付けた名称 |

### <a href="#createSpec-DocletTreeSymbol_top"><span id="createSpec-DocletTreeSymbol_desc">🧾 DocletTreeSymbol 概説</span></a>

- 作成はDocletTree.registration内で行う

## <span id="createSpec-DocletTreeOpt_top">🧩 DocletTreeOptデータ型定義</span>

<p class="source">source: lib/createSpec.1_0_0.mjs line.712</p>オプション設定値

### <a href="#createSpec-DocletTreeOpt_top"><span id="createSpec-DocletTreeOpt_prop">🔢 DocletTreeOpt メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| title | Object.<string, string> | 必須 | Markdown文書のタイトル行 |
| lang | string | 'ja-JP' | 使用言語 |
| indexMd | string | 'index.md' | フォルダ直下の管理ファイル名 |
| propHeader | Object.<string, Array.<Object>> | 任意 | 項目一覧テーブルのヘッダ定義<br>  Object = {key,label,align} |
| returnHeader | Object.<string, Array.<Object>> | 任意 | 戻り値テーブルのヘッダ定義<br>  Object = {key,label,align} |
| jsdocJson | string | "jsdoc.json" | jsdoc設定ファイル名 |
| dummyDir | string | "./dummy" | ダミーディレクトリ名 |
| jsdocTarget | string | ".+\\.(js|mjs|gs|txt)$" | jsdoc処理対象ファイル名の正規表現 |

## <span id="createSpec-listSource_top">🧩 listSource()</span>

事前準備、対象ファイルリスト作成

### <a href="#createSpec-listSource_top"><span id="createSpec-listSource_desc">🧾 listSource 概説</span></a>

jsdoc動作環境整備後、シェルの起動時引数から対象となるJSソースファイルのリストを作成。

### <a href="#createSpec-listSource_top"><span id="入力・出力・除外リスト作成">🧾 入力・出力・除外リスト作成</span></a>

起動時パラメータは以下の通り。
`node createSpec.mjs [入力ファイル...] -o 出力フォルダ [-x 除外パターン ...] [-r 調査結果ファイル]`

シェル側でワイルドカードを展開して配列が渡されるので、以下のように判断する。
①最初の2つはnodeとコマンド名(createSpec)、不要なので削除
②3番目以降'-o'までは入力ファイル
③'-o'の次は出力フォルダ名
④'-x'の次からは除外ファイル
⑤'-r'の次は調査結果ファイル名

### <a href="#createSpec-listSource_top"><span id="createSpec-listSource_param">▶️ listSource 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| argv | void | 必須 |  |

### <a href="#createSpec-listSource_top"><span id="createSpec-listSource_return">◀️ listSource 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| <a href="../lib/index.md#DocletTreeSource">DocletTreeSource</a> \| string \| Error | 入力0件なら文字列"No input file" |