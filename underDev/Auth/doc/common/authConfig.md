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

# <span id="authConfig_top">🧩 authConfigクラス仕様書</span>

継承元：<a href="../lib/Schema.md">Schema</a><br><p class="source">source: common/authConfig.mjs line.17</p>クライアント・サーバ共通設定情報

## <a href="#authConfig_top"><span id="authConfig_prop">🔢 authConfig メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| systemName | string | "auth" | システム名 |
| adminMail | string | 必須 | 管理者のメールアドレス |
| adminName | string | 必須 | 管理者氏名 |
| allowableTimeDifference | number | 120000 | クライアント・サーバ間通信時の許容時差既定値は2分 |
| RSAbits | string | 2048 | 鍵ペアの鍵長 |
| maxDepth | number | 10 | 再帰呼出時の最大階層 |
| underDev | Object | 必須 | テスト時の設定 |
| underDev.isTest | boolean | false | 開発モードならtrue |

## <a href="#authConfig_top"><span id="authConfig_func">🧱 authConfig メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#authConfig-constructor_top">constructor</a> | authConfig.constructor |

## <a href="#authConfig_top"><span id="authConfig_desc">🧾 authConfig 概説</span></a>

クライアント・サーバ共通設定情報

## <span id="authConfig-constructor_top">🧩 constructor()</span>

authConfig.constructor

### <a href="#authConfig-constructor_top"><span id="authConfig-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | authConfig | 必須 | 設定情報(既定値からの変更部分) |