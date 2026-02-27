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

# <span id="/common/authConfig.mjs::authConfig_top">🧩 authConfigクラス仕様書</span>

継承元：<a href="../common/Schema.md">Schema</a><br>authConfig: クライアント・サーバ共通設定情報

## <a href="#/common/authConfig.mjs::authConfig_top"><span id="/common/authConfig.mjs::authConfig_prop">🔢 authConfig メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| systemName | string | "auth" | システム名 |  |
| adminMail | string | 必須 | 管理者のメールアドレス |  |
| adminName | string | 必須 | 管理者氏名 |  |
| allowableTimeDifference | number | 120000 | クライアント・サーバ間通信時の許容時差既定値は2分 |  |
| RSAbits | string | 2048 | 鍵ペアの鍵長 |  |
| maxDepth | number | 10 | 再帰呼出時の最大階層 |  |
| underDev | Object | 必須 | テスト時の設定 |  |
| underDev.isTest | boolean | false | 開発モードならtrue |  |

## <a href="#/common/authConfig.mjs::authConfig_top"><span id="/common/authConfig.mjs::authConfig_func">🧱 authConfig メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/common/authConfig.mjs::authConfig.exports.authConfig#constructor_top">constructor</a> |  |

## <a href="#/common/authConfig.mjs::authConfig_top"><span id="/common/authConfig.mjs::authConfig_desc">🧾 authConfig 概説</span></a>

authConfig: クライアント・サーバ共通設定情報<br>
クライアント・サーバ共通設定情報<br>
## <span id="/common/authConfig.mjs::authConfig.exports.authConfig#constructor_top">🧩 constructor()</span>

### <a href="#/common/authConfig.mjs::authConfig.exports.authConfig#constructor_top"><span id="/common/authConfig.mjs::authConfig.exports.authConfig#constructor_desc">🧾 constructor 概説</span></a>

<br>

### <a href="#/common/authConfig.mjs::authConfig.exports.authConfig#constructor_top"><span id="/common/authConfig.mjs::authConfig.exports.authConfig#constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | authConfig | 必須 | 設定情報(既定値からの変更部分) |  |