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

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md) | [開発](../dev.md)

</div>

# <span id="localrequest">LocalRequest クラス仕様書</span>

ローカル関数からの処理要求

クライアント側関数からauthClientに渡す内容を確認、オブジェクト化する

## <span id="localrequest_members">🔢 LocalRequest メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| func | string | <span style="color:red">必須</span> | サーバ側関数名 |  |
| arg | any[] | [] | サーバ側関数に渡す引数の配列 | プリミティブ値、及びプリミティブ値で構成された配列・オブジェクト |

## <span id="localrequest_methods">🧱 LocalRequest メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#localrequest_constructor) | private | コンストラクタ |  |

### <span id="localrequest_constructor"><a href="#localrequest_methods">🧱 LocalRequest.constructor()</a></span>

#### <span id="localrequest_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| func | string | <span style="color:red">必須</span> | サーバ側関数名 |  |
| arg | any[] | [] | サーバ側関数に渡す引数の配列 | 引数が一つでも配列として指定 |

#### <span id="localrequest_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定
- "func"は関数名として使用可能な文字種であることを確認<br>
  `^[A-Za-z_$][A-Za-z0-9_$]*$`<br>
  上記正規表現にマッチしなければ戻り値「func不正」を返して終了
- "arg"は関数を排除するため、一度JSON化してからオブジェクト化<br>
  `JSON.parse(JSON.stringify(arg))`

#### <span id="localrequest_constructor_returns">📤 戻り値</span>

- [LocalRequest](#localrequest_members)インスタンス
- エラー時の戻り値

  | 項目名 | データ型 | 要否/既定値 | 説明 | func不正 |
  | :-- | :-- | :-- | :-- | :-- |
  | caller | string | <span style="color:red">必須</span> | 呼出元関数の足跡リスト | — |
  | whois | string | <span style="color:red">必須</span> | 関数名またはクラス名.メソッド名 | — |
  | step | string | <span style="color:red">必須</span> | 関数内の位置(step) | — |
  | seq | number | <span style="color:red">必須</span> | 実行順序 | — |
  | arg | string | <span style="color:red">必須</span> | 引数 | — |
  | rv | string | <span style="color:red">必須</span> | 戻り値 | — |
  | start | string | <span style="color:red">必須</span> | 開始日時 | — |
  | end | string | <span style="color:red">必須</span> | 終了日時 | — |
  | elaps | number | <span style="color:red">必須</span> | 所要時間(ミリ秒) | — |
  | log | string | <span style="color:red">必須</span> | 実行順に並べたdev.step | — |