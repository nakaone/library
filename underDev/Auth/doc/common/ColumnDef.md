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

# <span id="ColumnDef_top">🧩 ColumnDefクラス仕様書</span>

ColumnDef: 論理テーブルに於ける項目定義

## <a href="#ColumnDef_top"><span id="ColumnDef_prop">🔢 ColumnDef メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 項目名（英数字・システム用） |  |
| label | string | 任意 | 表示用ラベル（省略時は name) |  |
| desc | string | '' | 項目に関する概要説明 |  |
| note | string | '' | 項目に関する備考・意味説明 |  |
| type | string | 'string' | 論理データ型。allowedColumnTypesの何れか |  |
| nullable | boolean | true | null を許可するか |  |
| default | any |  | 既定値 | - データ型が関数の場合、引数はfactoryメソッドに渡されるargと看做す |
| allowedColumnTypes | string[] | 必須 | 許容するColumnのデータ型のリスト。自動生成、設定不可<br> | - 'string' \| 'number' \| 'boolean' \| 'object' \| 'array' \| 'datetime' \| 'function' |

## <a href="#ColumnDef_top"><span id="ColumnDef_func">🧱 ColumnDef メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#ColumnDef-constructor_top">constructor</a> |  |

## <a href="#ColumnDef_top"><span id="ColumnDef_desc">🧾 ColumnDef 概説</span></a>

ColumnDef: 論理テーブルに於ける項目定義
- name~defaultはインスタンス生成時に指定、allowedColumnTypes以下は自動生成<br>
## <span id="ColumnDef-constructor_top">🧩 constructor()</span>

### <a href="#ColumnDef-constructor_top"><span id="ColumnDef-constructor_desc">🧾 constructor 概説</span></a>

<br>

### <a href="#ColumnDef-constructor_top"><span id="ColumnDef-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| obj | Object | 必須 | 生成するオブジェクトに設定される値(値指定) |  |

### <a href="#ColumnDef-constructor_top"><span id="ColumnDef-constructor_return">◀️ constructor 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| ColumnDef \| Error |  |  |