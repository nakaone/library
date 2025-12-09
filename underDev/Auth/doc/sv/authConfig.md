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

# <span id="authconfig">authConfig クラス仕様書</span>

authClient/authServer共通設定値

[authClientConfig](authClientConfig.md), [authServerConfig](authServerConfig.md)の親クラス

## <span id="authconfig_members">🔢 authConfig メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| systemName | string | Auth | システム名 |  |
| adminMail | string | <span style="color:red">必須</span> | 管理者のメールアドレス |  |
| adminName | string | <span style="color:red">必須</span> | 管理者氏名 |  |
| allowableTimeDifference | number | 120,000 | クライアント・サーバ間通信時の許容時差 | 既定値は2分 |
| RSAbits | string | 2,048 | 鍵ペアの鍵長 |  |
| underDev | Object | 任意 | テスト時の設定 |  |
| underDev.isTest | boolean | false | 開発モードならtrue |  |

## <span id="authconfig_methods">🧱 authConfig メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authconfig_constructor) | private | コンストラクタ |  |

### <span id="authconfig_constructor"><a href="#authconfig_methods">🧱 authConfig.constructor()</a></span>

#### <span id="authconfig_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="authconfig_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authconfig_constructor_returns">📤 戻り値</span>

- [authConfig](#authconfig_members)インスタンス