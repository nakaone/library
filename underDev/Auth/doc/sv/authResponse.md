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

# <span id="authresponse">authResponse クラス仕様書</span>

サーバ側で復号された処理要求

- authResponseはサーバ側で復号・署名検証後に生成される処理結果オブジェクトであり、
  cryptoServer.encrypt により署名 → AES暗号化 → RSA鍵暗号化される。
- サーバ側でauthClientから送られた[encryptedRequest](encryptedRequest.md#encryptedrequest_members)を復号して作成
- サーバ側は本インスタンスに対して各種処理を行い、結果を付加していく
- サーバ側処理終了後、cryptoServer.[encrypt](cryptoServer.md#encrypt)で暗号化してauthClientに戻す
- authClientはcryptoClient.[decrypt](../cl/cryptoClient.md#cryptoclient_decrypt)で復号、後続処理を実行する

## <span id="authresponse_members">🔢 authResponse メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス |
| deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUIDv4 |
| memberName | string | <span style="color:red">必須</span> | メンバの氏名 |  |
| CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  |
| requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 |
| func | string | <span style="color:red">必須</span> | サーバ側関数名 |  |
| arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  |
| nonce | string | <span style="color:red">必須</span> | 要求の識別子 | UUIDv4 |
| SPkey | string | SPkey | サーバ側公開鍵 |  |
| response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む |
| receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  |
| responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 |
| status | string | "success" | サーバ側処理結果 | 正常終了時は"success"(文字列)、警告終了の場合はエラーメッセージ、致命的エラーの場合はErrorオブジェクト |
| message | string | <span style="color:red">必須</span> | メッセージ(statusの補足) |  |
| decrypt | string | "normal" | クライアント側での復号処理結果 | "success":正常、それ以外はエラーメッセージ |

## <span id="authresponse_methods">🧱 authResponse メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authresponse_constructor) | private | コンストラクタ |  |

### <span id="authresponse_constructor"><a href="#authresponse_methods">🧱 authResponse.constructor()</a></span>

#### <span id="authresponse_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [encryptedRequest](encryptedRequest.md#encryptedrequest_members) | <span style="color:red">必須</span> | 暗号化された処理要求 |  |

#### <span id="authresponse_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authresponse_constructor_returns">📤 戻り値</span>

- [authResponse](#authresponse_members)インスタンス