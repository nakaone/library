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

# <span id="TableDef_top">🧩 TableDefクラス仕様書</span>

<p class="source">source: lib/Schema.2_2_0.mjs line.122</p>論理テーブル構造定義

## <a href="#TableDef_top"><span id="TableDef_prop">🔢 TableDef メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| name | string | 必須 | 論理的な識別名（TableDef のキー） | - クラス・API・ログで使用。例: 'Member', 'AuthAuditLog'<br>  - constructorに渡す定義オブジェクトでは省略(メンバ名を引用) |
| desc | string | '' | テーブルに関する概要説明 |  |
| note | string | '' | テーブルに関する備考 |  |
| primaryKey | string[] | [] | 主キー項目名 |  |
| unique | string[] | [] | 主キー以外の一意制約 |  |
| cols | ColumnDef[] | 必須 | 項目定義（順序を考慮するため配列） |  |
| header | string[] | 必須 | 項目名の一覧(引数不可、自動生成) |  |
| map | Object.<string, ColumnDef> | 必須 | 項目名をキーとする項目定義集(引数不可、自動生成) |  |

## <a href="#TableDef_top"><span id="TableDef_func">🧱 TableDef メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#TableDef-constructor_top">constructor</a> | TableDef.constructor |
| 2 | <a href="#TableDef-factory_top">factory</a> | 論理テーブル構造定義を基に実オブジェクトを生成 |

## <a href="#TableDef_top"><span id="TableDef_desc">🧾 TableDef 概説</span></a>

- name~colsはインスタンス生成時に指定、header以下は自動生成

## <span id="TableDef-constructor_top">🧩 constructor()</span>

TableDef.constructor

### <a href="#TableDef-constructor_top"><span id="TableDef-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| name | string | 必須 | オブジェクト名(TableDef.name設定値) |
| obj | Object | 必須 | 初期設定値のオブジェクト(TableDef型の値指定) |

### <a href="#TableDef-constructor_top"><span id="TableDef-constructor_return">◀️ constructor 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| TableDef \| Error |  |

## <span id="TableDef-factory_top">🧩 factory()</span>

論理テーブル構造定義を基に実オブジェクトを生成

### <a href="#TableDef-factory_top"><span id="TableDef-factory_param">▶️ factory 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | Object.<string, any> | {} | 各メンバの設定値 |

### <a href="#TableDef-factory_top"><span id="TableDef-factory_return">◀️ factory 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| Object | TableDefで指定したデータ型のオブジェクト |