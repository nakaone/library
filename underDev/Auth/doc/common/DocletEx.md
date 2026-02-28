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

# <span id="/common/createSpec.1_0_0.mjs::DocletEx_top">🧩 DocletExクラス仕様書</span>

DocletEx: jsdocから出力されるDocletに情報を付加したもの

## <a href="#/common/createSpec.1_0_0.mjs::DocletEx_top"><span id="/common/createSpec.1_0_0.mjs::DocletEx_prop">🔢 DocletEx メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 【書換】constructorの場合のみ固定値"constructor"に変更 |  |
| longname | string | 必須 | 【書換】constructorの場合のみ"#constructor"を追加 |  |
| opt | Object | 必須 | DocletExインスタンス作成時のオプション | 現状未使用 |
| uuid | string | 必須 | DocletExを一意に識別するためのUUID |  |
| docletType | string | 必須 | Docletの種類。下記「docletTypeの判定ロジック」参照 |  |
| parsed | Object.<string, string> | 必須 | Doclet内で定義され��タグの値 | 例： parsed: {
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
| properties | <a href="../common/index.md#DocletColDef">DocletColDef</a>[] | 任意 | メンバ一覧 |  |
| params | <a href="../common/index.md#DocletColDef">DocletColDef</a>[] | 任意 | 引数。クラスの場合はconstructorの引数(※同上) |  |
| returns | <a href="../common/index.md#DocletColDef">DocletColDef</a>[] | [] | 戻り値(※同上) |  |
| parent | string |  | 親要素のDocletEx.uuid |  |
| children | string[] | [] | 子要素(メソッド・内部関数)のDocletEx.uuid |  |
| unique | string | 任意 | 固有パス | ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/") |
| basename | string | 任意 | ファイル名 |  |
| prefix | string | 任意 | 固有パス＋ファイル名 | 以下の各種IDの共通部分(固有パスの先頭・末尾の'/'有無処理済) |
| rangeId | string | 任意 | 固有パス＋ファイル名＋':R'＋meta.range[0] | ※ Doclet以外のファイル情報が必要なため、DocletTree側で追加される項目 |
| linenoId | string | 任意 | 固有パス＋ファイル名＋':N'＋meta.lineno ※同上 |  |
| commentId | string | 任意 | 「固有パス＋ファイル名＋comment」のSHA256 | 同一commentが同一ファイル内に複数有った場合は設定しない |
| longnameId | string | 任意 | 固有パス＋ファイル名＋'::'＋longname | なおlongnameIdはアンカーとしても使用するので、'::'後の英文字は付けない
  

# docletTypeの判定ロジック

以下第一レベルがdocletTypeとする文字列

- typedef
  kind === 'typedef'
- interface
  kind === 'interface'
- class
  kind === 'class'
  && (meta.code.type === "ClassDeclaration" \|\| "ClassExpression")
- constructor
  kind === 'class'
  && meta?.code?.type === "MethodDefinition"
  && /＠constructor\b/.test(doclet.comment \|\| "")
- method
  kind === "function"
  && meta?.code?.type === "MethodDefinition"
  && scope === "instance" または "static"
- function(グローバル関数) ※アロー関数を含む
  kind === 'function'
  && scope === 'global'
- innerFunc(関数内関数) ※アロー関数を含む
  kind === 'function'
  && scope === 'inner'
- description(説明文(＠name))
  meta.code が空
  && meta.code.nameがundefined(プラグインや拡張を考慮する場合には必要)
  && kindがtypedef/interface 以外
  && nameが存在
- objectFunc(interface内function定義)　※書き方に関しては冒頭の記述例参照<br>
  なおあくまでinterfaceなので、関数と同時にpropertiesも含む
  kind === 'function'
  && scope === 'instance'
- unknown(上記で判定不能) |

## <a href="#/common/createSpec.1_0_0.mjs::DocletEx_top"><span id="/common/createSpec.1_0_0.mjs::DocletEx_func">🧱 DocletEx メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/common/createSpec.1_0_0.mjs::DocletEx#constructor_top">constructor</a> |  |
| 2 | <a href="#/common/createSpec.1_0_0.mjs::DocletEx#addRowToColumn_top">addRowToColumn</a> | addRowToColumn: データ項目情報から一覧作成用情報を作成 |
| 3 | <a href="#/common/createSpec.1_0_0.mjs::DocletEx#determineType_top">determineType</a> | determineType: Docletの型を判定 |

## <a href="#/common/createSpec.1_0_0.mjs::DocletEx_top"><span id="/common/createSpec.1_0_0.mjs::DocletEx_desc">🧾 DocletEx 概説</span></a>

DocletEx: jsdocから出力されるDocletに情報を付加したもの
メンバ各値の設定箇所は以下の通り。
- opt ~ returns:       DocletEx.constructor()
- parent, children:    DocletTree.linkage()
- unique ~ longnameId: DocletTree.registration()<br>
## <span id="/common/createSpec.1_0_0.mjs::DocletEx#constructor_top">🧩 constructor()</span>

### <a href="#/common/createSpec.1_0_0.mjs::DocletEx#constructor_top"><span id="/common/createSpec.1_0_0.mjs::DocletEx#constructor_desc">🧾 constructor 概説</span></a>

<br>

### <a href="#/common/createSpec.1_0_0.mjs::DocletEx#constructor_top"><span id="/common/createSpec.1_0_0.mjs::DocletEx#constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| doclet | <a href="../common/index.md#Doclet">Doclet</a> | 必須 |  |  |
| opt | Object | {} | オプション設定値 |  |
## <span id="/common/createSpec.1_0_0.mjs::DocletEx#addRowToColumn_top">🧩 addRowToColumn()</span>

addRowToColumn: データ項目情報から一覧作成用情報を作成

### <a href="#/common/createSpec.1_0_0.mjs::DocletEx#addRowToColumn_top"><span id="/common/createSpec.1_0_0.mjs::DocletEx#addRowToColumn_desc">🧾 addRowToColumn 概説</span></a>

addRowToColumn: データ項目情報から一覧作成用情報を作成

データ項目情報：Doclet.properties/params/returnsの各要素。配列では無くオブジェクト<br>

### <a href="#/common/createSpec.1_0_0.mjs::DocletEx#addRowToColumn_top"><span id="/common/createSpec.1_0_0.mjs::DocletEx#addRowToColumn_param">▶️ addRowToColumn 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| prop | <a href="../common/index.md#DocletColDef">DocletColDef</a> | 必須 | データ項目情報 |  |

### <a href="#/common/createSpec.1_0_0.mjs::DocletEx#addRowToColumn_top"><span id="/common/createSpec.1_0_0.mjs::DocletEx#addRowToColumn_return">◀️ addRowToColumn 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| <a href="../common/index.md#DocletColRow">DocletColRow</a> \| Error |  |  |
## <span id="/common/createSpec.1_0_0.mjs::DocletEx#determineType_top">🧩 determineType()</span>

determineType: Docletの型を判定

### <a href="#/common/createSpec.1_0_0.mjs::DocletEx#determineType_top"><span id="/common/createSpec.1_0_0.mjs::DocletEx#determineType_desc">🧾 determineType 概説</span></a>

determineType: Docletの型を判定<br>

### <a href="#/common/createSpec.1_0_0.mjs::DocletEx#determineType_top"><span id="/common/createSpec.1_0_0.mjs::DocletEx#determineType_param">▶️ determineType 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| doclet | Object | 必須 |  |  |

### <a href="#/common/createSpec.1_0_0.mjs::DocletEx#determineType_top"><span id="/common/createSpec.1_0_0.mjs::DocletEx#determineType_return">◀️ determineType 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| string \| Error | 「docletTypeの判定ロジック」参照 |  |