<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>
<style>
  td {white-space:nowrap;}
</style>

# <span id="encryptedrequest">encryptedRequest クラス仕様書</span>

暗号化された処理要求

authClientからauthServerに送られる、暗号化された処理要求オブジェクト。<br>
      ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列。<br>
      memberId,deviceIdは平文

## <span id="encryptedrequest_members">🔢 encryptedRequest メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス |
| deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 |  |
| ciphertext | string | <span style="color:red">必須</span> | 暗号化した文字列 |  |

## <span id="encryptedrequest_methods">🧱 encryptedRequest メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#encryptedrequest_constructor) | private | コンストラクタ |  |

### <span id="encryptedrequest_constructor"><a href="#encryptedrequest_methods">🧱 encryptedRequest.constructor()</a></span>

#### <span id="encryptedrequest_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [authRequest](authRequest.md#authrequest_members) | <span style="color:red">必須</span> | 平文の処理要求 |  |

#### <span id="encryptedrequest_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="encryptedrequest_constructor_returns">📤 戻り値</span>

- [encryptedRequest](#encryptedrequest_members)インスタンス