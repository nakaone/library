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

# <span id="authrequest">authRequest クラス仕様書</span>

暗号化前の処理要求

- authClientからauthServerに送られる、暗号化前の処理要求オブジェクト
- cryptoClient.[encrypt](cryptoClient.md#cryptoclient_encrypt)で暗号化し、authServerに送られる
- サーバ側で受信後、cryptoServer.[decrypt](cryptoServer.md#cryptoserver_decrypt)でauthRequestに戻る

## <span id="authrequest_members">🔢 authRequest メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | idb.memberId | メンバの識別子 | =メールアドレス |
| deviceId | string | idb.deviceId | デバイスの識別子 | UUID |
| memberName | string | idb.memberName | メンバの氏名 | 管理者が加入認否判断のため使用 |
| CPkey | string | idb.CPkey | クライアント側署名 |  |
| requestTime | number | Date.now() | 要求日時 | UNIX時刻 |
| func | string | <span style="color:red">必須</span> | サーバ側関数名 |  |
| arguments | any[] | [] | サーバ側関数に渡す引数の配列 |  |
| requestId | string | UUID | 要求の識別子 | UUID |

## <span id="authrequest_methods">🧱 authRequest メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authrequest_constructor) | private | コンストラクタ |  |

### <span id="authrequest_constructor"><a href="#authrequest_methods">🧱 authRequest.constructor()</a></span>

#### <span id="authrequest_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [LocalRequest](LocalRequest.md#localrequest_members) | <span style="color:red">必須</span> |  | ローカル関数からの処理要求 |

#### <span id="authrequest_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authrequest_constructor_returns">📤 戻り値</span>

- [authRequest](#authrequest_members)インスタンス