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

<p id="top" class="l1">独自ライブラリ仕様書</p>
<div class="submenu">

[関数・クラス](#funclassList) | [データ型](#typedefList)

</div>

# <a href="#top"><span id="funclassList">グローバル関数・クラス一覧</span></a>

| クラス/関数名 | 概要 |
| :-- | :-- |
| [ColumnDef](ColumnDef.md) | 論理テーブルに於ける項目定義 |
| [createSpec](createSpec.md) | JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成 |
| [devTools](devTools.md) | 開発支援関係メソッド集 |
| [DocletEx](DocletEx.md) | jsdocから出力されるDocletに情報を付加したもの |
| [Schema](Schema.md) | DB・データ型構造定義オブジェクト |
| [TableDef](TableDef.md) | 論理テーブル構造定義 |

# <a href="#top"><span id="typedefList">データ型定義一覧</span></a>

| No | データ型名 | 概要 |
| --: | :-- | :-- |
| 1 | [devToolsOpt](#devToolsOpt) | オプション設定値 |
| 2 | [Doclet](#Doclet) | `jsdoc -X`で配列で返されるオブジェクト |
| 3 | [DocletColDef](#DocletColDef) | Doclet.properties/params/returnsの要素(メンバ)定義情報 |
| 4 | [DocletColRow](#DocletColRow) | データ項目一覧作成用追加情報 |
| 5 | [DocletTreeFile](#DocletTreeFile) | 個別入力ファイル情報 |
| 6 | [DocletTreeOpt](#DocletTreeOpt) | オプション設定値 |
| 7 | [DocletTreeSource](#DocletTreeSource) | 統合版入力ファイル(JSソース)情報 |
| 8 | [DocletTreeSymbol](#DocletTreeSymbol) | クラス・グローバル関数名・データ型定義名から参照先URLへの変換情報 |

# 個別データ型定義

## <a href="#typedefList"><span id="devToolsOpt">"devToolsOpt" データ型定義</span></a>

<p class="source">source: lib/devTools.3_2_0.mjs line.1</p>

オプション設定値

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| mode | string | 'pipe' | <p>出力モード</p><table><thead><tr><th align="left">mode</th><th align="center">エラー</th><th align="center">開始・終了</th><th align="center">step</th><th align="left">用途・備考</th></tr></thead><tbody><tr><td align="left">&quot;none&quot;</td><td align="center">❌</td><td align="center">❌</td><td align="center">❌</td><td align="left">出力無し</td></tr><tr><td align="left">&quot;error&quot;</td><td align="center">⭕</td><td align="center">❌</td><td align="center">❌</td><td align="left">エラーのみ出力</td></tr><tr><td align="left">&quot;normal&quot;</td><td align="center">⭕</td><td align="center">⭕</td><td align="center">❌</td><td align="left">本番用</td></tr><tr><td align="left">&quot;dev&quot;</td><td align="center">⭕</td><td align="center">⭕</td><td align="center">⭕</td><td align="left">開発用</td></tr><tr><td align="left">&quot;pipe&quot;</td><td align="center">⭕</td><td align="center">❌</td><td align="center">⭕</td><td align="left">パイプ処理用</td></tr></tbody></table> |
| digit | number | 4 | 処理順(seq)をログ出力する際の桁数 |
| footer | boolean | false | 実行結果(startTime,endTime,elaps)を出力するならtrue |
| maxDepth | number | 10 | 再帰呼出時の最深階層数 |

## <a href="#typedefList"><span id="Doclet">"Doclet" データ型定義</span></a>

<p class="source">source: lib/createSpec.1_0_0.mjs line.176</p>

`jsdoc -X`で配列で返されるオブジェクト

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

## <a href="#typedefList"><span id="DocletColDef">"DocletColDef" データ型定義</span></a>

<p class="source">source: lib/createSpec.1_0_0.mjs line.154</p>

Doclet.properties/params/returnsの要素(メンバ)定義情報

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

## <a href="#typedefList"><span id="DocletColRow">"DocletColRow" データ型定義</span></a>

<p class="source">source: lib/createSpec.1_0_0.mjs line.145</p>

データ項目一覧作成用追加情報

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| name | string | 必須 | 項目名 |
| type | string | 必須 | データ型 |
| value | string | 必須 | 要否/既定値 |
| desc | string | 必須 | 説明 |
| note | string | 必須 | 備考 |

## <a href="#typedefList"><span id="DocletTreeFile">"DocletTreeFile" データ型定義</span></a>

<p class="source">source: lib/createSpec.1_0_0.mjs line.677</p>

個別入力ファイル情報

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| full | string | 必須 | フルパス＋ファイル名 |
| unique | string | 必須 | 固有パス(フルパス−共通部分)<br>  ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/") |
| basename | string | 必須 | ファイル名 |
| content | string | 必須 | ファイルの内容 |
| jsdoc | <a href="../lib/index.md#Doclet">Doclet</a>[] | 必須 | `jsdoc -X`の実行結果オブジェクト |

## <a href="#typedefList"><span id="DocletTreeOpt">"DocletTreeOpt" データ型定義</span></a>

<p class="source">source: lib/createSpec.1_0_0.mjs line.712</p>

オプション設定値

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

## <a href="#typedefList"><span id="DocletTreeSource">"DocletTreeSource" データ型定義</span></a>

<p class="source">source: lib/createSpec.1_0_0.mjs line.687</p>

統合版入力ファイル(JSソース)情報

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| common | string | '' | フルパスの共通部分 |
| outDir | string | '' | 出力先フォルダ名(フルパス) |
| num | number | 0 | 対象ファイルの個数 |
| files | <a href="../lib/index.md#DocletTreeFile">DocletTreeFile</a>[] | [] | 対象ファイルの情報 |
| research | string | 任意 | 調査結果ファイル名(=DocletTreeのJSON) |

## <a href="#typedefList"><span id="DocletTreeSymbol">"DocletTreeSymbol" データ型定義</span></a>

<p class="source">source: lib/createSpec.1_0_0.mjs line.704</p>

クラス・グローバル関数名・データ型定義名から参照先URLへの変換情報

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| name | string | 必須 | クラス・グローバル関数名・データ型定義名 |
| rex | RegExp | 必須 | 名称を含むかを判定する正規表現 |
| link | string | 必須 | 参照先URL(aタグ)を付けた名称 |
