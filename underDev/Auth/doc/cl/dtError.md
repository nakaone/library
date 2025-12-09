<style>
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

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

# <span id="dterror">dtError クラス仕様書</span>

標準Errorの独自拡張

- [devTools](JSLib.md#devtools)内で定義
- `devTools.error()`でインスタンス作成

## <span id="dterror_members">🔢 dtError メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| caller | string | <span style="color:red">必須</span> | 呼出元関数の足跡リスト |  |
| whois | string | <span style="color:red">必須</span> | 関数名またはクラス名.メソッド名 |  |
| step | string | <span style="color:red">必須</span> | 関数内の位置(step) |  |
| seq | number | <span style="color:red">必須</span> | 実行順序 |  |
| arg | string | <span style="color:red">必須</span> | 引数 |  |
| rv | string | <span style="color:red">必須</span> | 戻り値 |  |
| start | string | <span style="color:red">必須</span> | 開始日時 |  |
| end | string | <span style="color:red">必須</span> | 終了日時 |  |
| elaps | number | <span style="color:red">必須</span> | 所要時間(ミリ秒) |  |
| log | string | <span style="color:red">必須</span> | 実行順に並べたdev.step |  |

## <span id="dterror_methods">🧱 dtError メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#dterror_constructor) | private | コンストラクタ |  |

### <span id="dterror_constructor"><a href="#dterror_methods">🧱 dtError.constructor()</a></span>

#### <span id="dterror_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| e | Error | <span style="color:red">必須</span> | エラーオブジェクト |  |
| v | Object | {} | 関数・メソッド内汎用変数 |  |

#### <span id="dterror_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定
- variableはv.whois,v.stepを削除した上で、JSON化時150文字以上になる場合、以下のように処理
  - 配列は"{length:v.xxx.length,sample:v.xxx.slice(0,3)}"に変換

#### <span id="dterror_constructor_returns">📤 戻り値</span>

- [dtError](#dterror_members)インスタンス