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

[総説](../readme.md) | [CL/SV共通](../common/index.md) | [CL側](../client/index.md) | [SV側](../server/index.md) | [暗号化](../crypto.md) | [メンバ](../Member.md) | [開発](../dev.md)

</div>

# <span id="clearAuthEnvironment_top">🧩 clearAuthEnvironment()</span>

<p class="source">source: client/localFunc.mjs line.26</p>clearAuthEnvironment: 【開発用】IndexedDBの"Auth"データベースを削除し、環境をリセットする

## <a href="#clearAuthEnvironment_top"><span id="clearAuthEnvironment_param">▶️ clearAuthEnvironment 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
|  | void | 必須 |  |

## <a href="#clearAuthEnvironment_top"><span id="clearAuthEnvironment_return">◀️ clearAuthEnvironment 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| Promise.<void> |  |