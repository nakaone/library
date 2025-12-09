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

# <span id="localresponse">LocalResponse クラス仕様書</span>

ローカル関数への処理結果

authClientからクライアント側関数に返される処理結果オブジェクト

## <span id="localresponse_members">🔢 LocalResponse メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| result | string | <span style="color:red">必須</span> | 処理結果。fatal/warning/normal |  |
| message | string | 任意 | エラーメッセージ | normal時は`undefined` |
| response | any | 任意 | 要求された関数の戻り値 | fatal/warning時は`undefined`。`JSON.parse(authResponse.response)` |

## <span id="localresponse_methods">🧱 LocalResponse メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#localresponse_constructor) | private | コンストラクタ |  |

### <span id="localresponse_constructor"><a href="#localresponse_methods">🧱 LocalResponse.constructor()</a></span>

#### <span id="localresponse_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| response | [authResponse](authResponse.md#authresponse_members)\|Error | <span style="color:red">必須</span> | サーバ側処理結果 | ErrorはauthClient.[exec](authClient.md#authclient_exec)で設定 |

#### <span id="localresponse_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="localresponse_constructor_returns">📤 戻り値</span>

- [LocalResponse](#localresponse_members)インスタンス
- Error : 正常時の戻り値(messageはauthClientで設定)