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

# <span id="Schema_top">🧩 Schemaクラス仕様書</span>

<p class="source">source: lib/Schema.2_2_0.mjs line.50</p>DB・データ型構造定義オブジェクト

## <a href="#Schema_top"><span id="Schema_prop">🔢 Schema メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| name | string | 必須 | Schemaの論理名 |
| version | string | '0.0.0' | Schemaのバージョン識別子(例:'1.2.0') |
| dbName | string | 任意 | 物理DB名。省略時はnameを流用 |
| desc | string | '' | Schema全体に関する概要説明 |
| note | string | '' | Schema全体に関する備考 |
| types | Object.<string, TableDef> | 必須 | 論理テーブル名をキーとするテーブル定義 |
| original | string | 必須 | Schemaインスタンス生成時の引数(JSON)。自動生成、設定不可 |

## <a href="#Schema_top"><span id="Schema_func">🧱 Schema メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#Schema-constructor_top">constructor</a> | Schema.constructor |

## <a href="#Schema_top"><span id="Schema_desc">🧾 Schema 概説</span></a>

- 各種アプリで使用するテーブル・データ型を宣言<br>- 各種アプリでは本クラスを拡張し、configとすることを想定<br><br>
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

Schema.constructor

### <a href="#Schema-constructor_top"><span id="Schema-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | Schema[] | [{} | 設定情報集。後順位優先。共通設定を先頭に特有設定の追加を想定 |

### <a href="#Schema-constructor_top"><span id="Schema-constructor_return">◀️ constructor 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| Schema \| Error |  |