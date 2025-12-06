<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

# <span id="encryptedresponse">encryptedResponse クラス仕様書</span>

暗号化された処理結果

authServerからauthClientに返される、暗号化された処理結果オブジェクト<br>
      ciphertextはauthResponseをJSON化、RSA-OAEP暗号化＋署名付与した文字列

## <span id="encryptedresponse_members">🔢 encryptedResponse メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| ciphertext | string | <span style="color:red">必須</span> | 暗号化した文字列 |  |

## <span id="encryptedresponse_methods">🧱 encryptedResponse メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#encryptedresponse_constructor) | private | コンストラクタ |  |

### <span id="encryptedresponse_constructor"><a href="#encryptedresponse_methods">🧱 encryptedResponse.constructor()</a></span>

#### <span id="encryptedresponse_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| response | [authResponse](authResponse.md#authresponse_members) | <span style="color:red">必須</span> |  | 平文の処理結果 |

#### <span id="encryptedresponse_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="encryptedresponse_constructor_returns">📤 戻り値</span>

- [encryptedRequest](encryptedRequest.md#encryptedrequest_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
  | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 |  |
  | ciphertext | string | <span style="color:red">必須</span> | 暗号化した文字列 |  |