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

# <span id="createSpec-DocletEx_top">🧩 DocletExクラス仕様書</span>

<p class="source">source: lib/createSpec.1_0_0.mjs line.424</p>jsdocから出力されるDocletに情報を付加したもの

## <a href="#createSpec-DocletEx_top"><span id="createSpec-DocletEx_prop">🔢 DocletEx メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 【書換】constructorの場合のみ固定値"constructor"に変更 |  |
| longname | string | 必須 | 【書換】constructorの場合のみ"#constructor"を追加 |  |
| opt | Object | 必須 | DocletExインスタンス作成時のオプション | 現状未使用 |
| uuid | string | 必須 | DocletExを一意に識別するためのUUID |  |
| docletType | string | 必須 | Docletの種類。下記「docletTypeの判定ロジック」参照 |  |
| parsed | Object.<string, string> | 必須 | Doclet内で定義されたタグの値 | 例： parsed: {<br>    description:"method01: メソッドテスト", // string<br>    memberof:"class01", // string<br>    param:"{number} arg - method01の引数", // string<br>    returns:"{{qId:number,name:string}} NG: qId,name指定無しのObjectになる", // string<br>  } |
| label | string | 必須 | 1行で簡潔に記述された概要説明 | ① JSDoc先頭の「/**」に続く文字列<br>  ② constructorは「(memberof.)constructor」<br>  ③ "＠name"に続く文字列<br>  ④ typdef, interface<br>  ⑤ description, classdescの先頭行(=concatenatedの先頭行)<br>  ⑥ v.doclet.longname<br>  ※ 上記に該当が無い場合、「(ラベル未設定)」 |
| concatenated | string | 必須 | description,classdesc,exmapleを出現順に結合。MD出力用 |  |
| properties | DocletColDef[] | 任意 | メンバ一覧 |  |
| params | DocletColDef[] | 任意 | 引数。クラスの場合はconstructorの引数(※同上) |  |
| returns | DocletColDef[] | [] | 戻り値(※同上) |  |
| parent | string | null | 親要素のDocletEx.uuid |  |
| children | string[] | [] | 子要素(メソッド・内部関数)のDocletEx.uuid |  |
| familyTree | string | 必須 | DocletEx.nameを連結した系図(親子関係) |  |
| unique | string | 任意 | 固有パス | ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/") |
| basename | string | 任意 | ファイル名 |  |
| prefix | string | 任意 | 固有パス＋ファイル名 | 以下の各種IDの共通部分(固有パスの先頭・末尾の'/'有無処理済) |
| rangeId | string | 任意 | 固有パス＋ファイル名＋':R'＋meta.range[0] | ※ Doclet以外のファイル情報が必要なため、DocletTree側で追加される項目 |
| linenoId | string | 任意 | 固有パス＋ファイル名＋':N'＋meta.lineno ※同上 |  |
| commentId | string | 任意 | 「固有パス＋ファイル名＋comment」のSHA256 | 同一commentが同一ファイル内に複数有った場合は設定しない |

## <a href="#createSpec-DocletEx_top"><span id="createSpec-DocletEx_func">🧱 DocletEx メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#createSpec-DocletEx-constructor_top">constructor</a> | DocletEx.constructor |
| 2 | <a href="#createSpec-DocletEx-addRowToColumn_top">addRowToColumn</a> | データ項目情報から一覧作成用情報を作成 |
| 3 | <a href="#createSpec-DocletEx-determineType_top">determineType</a> | Docletの型を判定 |

## <a href="#createSpec-DocletEx_top"><span id="createSpec-DocletEx_desc">🧾 DocletEx 概説</span></a>

メンバ各値の設定箇所は以下の通り。<br>- opt    ~ returns   : DocletEx.constructor()<br>- parent ~ familyTree: DocletTree.linkage()<br>- unique ~ commentId : DocletTree.registration()
## <span id="createSpec-DocletEx-constructor_top">🧩 constructor()</span>

DocletEx.constructor

### <a href="#createSpec-DocletEx-constructor_top"><span id="createSpec-DocletEx-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| doclet | Doclet | 必須 |  |
| opt | Object | {} | オプション設定値 |
## <span id="createSpec-DocletEx-addRowToColumn_top">🧩 addRowToColumn()</span>

データ項目情報から一覧作成用情報を作成

### <a href="#createSpec-DocletEx-addRowToColumn_top"><span id="createSpec-DocletEx-addRowToColumn_desc">🧾 addRowToColumn 概説</span></a>

データ項目情報：Doclet.properties/params/returnsの各要素。配列では無くオブジェクト

### <a href="#createSpec-DocletEx-addRowToColumn_top"><span id="createSpec-DocletEx-addRowToColumn_param">▶️ addRowToColumn 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| prop | DocletColDef | 必須 | データ項目情報 |

### <a href="#createSpec-DocletEx-addRowToColumn_top"><span id="createSpec-DocletEx-addRowToColumn_return">◀️ addRowToColumn 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| DocletColRow \| Error |  |
## <span id="createSpec-DocletEx-determineType_top">🧩 determineType()</span>

Docletの型を判定

### <a href="#createSpec-DocletEx-determineType_top"><span id="createSpec-DocletEx-determineType_func">🧱 determineType メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#createSpec-DocletEx-determineType-dummyFunc_top">dummyFunc</a> | テスト用ダミー関数 |

### <a href="#createSpec-DocletEx-determineType_top"><span id="createSpec-DocletEx-determineType_param">▶️ determineType 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| doclet | Object | 必須 |  |

### <a href="#createSpec-DocletEx-determineType_top"><span id="createSpec-DocletEx-determineType_return">◀️ determineType 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| string \| Error | 「docletTypeの判定ロジック」参照 |
### <span id="createSpec-DocletEx-determineType-dummyFunc_top">🧩 dummyFunc()</span>

テスト用ダミー関数

#### <a href="#createSpec-DocletEx-determineType-dummyFunc_top"><span id="createSpec-DocletEx-determineType-dummyFunc_param">▶️ dummyFunc 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| a | number | 必須 |  |
| b | number | 必須 |  |

#### <a href="#createSpec-DocletEx-determineType-dummyFunc_top"><span id="createSpec-DocletEx-determineType-dummyFunc_return">◀️ dummyFunc 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| number |  |