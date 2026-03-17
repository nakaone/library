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

# <span id="ColumnDef_top">🧩 ColumnDefクラス仕様書</span>

<p class="source">source: lib/Schema.2_2_0.mjs line.280</p>論理テーブルに於ける項目定義

## <a href="#ColumnDef_top"><span id="ColumnDef_prop">🔢 ColumnDef メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| name | string | 必須 | 項目名（英数字・システム用） |
| label | string | 任意 | 表示用ラベル（省略時は name) |
| desc | string | '' | 項目に関する概要説明 |
| note | string | '' | 項目に関する備考・意味説明 |
| type | string | 'string' | 論理データ型。allowedColumnTypesの何れか |
| nullable | boolean | true | null を許可するか |
| default | any | null | 既定値<br>  - データ型が関数の場合、引数はfactoryメソッドに渡されるargと看做す |
| allowedColumnTypes | string[] | 必須 | 許容するColumnのデータ型のリスト。自動生成、設定不可<br><br>  - 'string' | 'number' | 'boolean' | 'object' | 'array' | 'datetime' | 'function' |

## <a href="#ColumnDef_top"><span id="ColumnDef_func">🧱 ColumnDef メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#ColumnDef-constructor_top">constructor</a> | ColumnDef.constructor |

## <a href="#ColumnDef_top"><span id="ColumnDef_desc">🧾 ColumnDef 概説</span></a>

- name~defaultはインスタンス生成時に指定、allowedColumnTypes以下は自動生成
## <span id="ColumnDef-constructor_top">🧩 constructor()</span>

ColumnDef.constructor

### <a href="#ColumnDef-constructor_top"><span id="ColumnDef-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| obj | Object | 必須 | 生成するオブジェクトに設定される値(値指定) |

### <a href="#ColumnDef-constructor_top"><span id="ColumnDef-constructor_return">◀️ constructor 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| ColumnDef \| Error |  |