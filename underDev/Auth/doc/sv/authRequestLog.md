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

# <span id="authrequestlog">authRequestLog クラス仕様書</span>

重複チェック用のリクエスト履歴

- ScriptPropertiesに保存

## <span id="authrequestlog_members">🔢 authRequestLog メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | number | Date.now() | リクエストを受けたサーバ側日時 |  |
| requestId | string | <span style="color:red">必須</span> | クライアント側で採番されたリクエスト識別子 | UUID |

## <span id="authrequestlog_methods">🧱 authRequestLog メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authrequestlog_constructor) | private | コンストラクタ |  |

### <span id="authrequestlog_constructor"><a href="#authrequestlog_methods">🧱 authRequestLog.constructor()</a></span>

#### <span id="authrequestlog_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} | ユーザ指定の設定値 |  |

#### <span id="authrequestlog_constructor_process">🧾 処理手順</span>

#### <span id="authrequestlog_constructor_returns">📤 戻り値</span>

- [authRequestLog](#authrequestlog_members)インスタンス