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

# <span id="encryptedrequest">encryptedRequest クラス仕様書</span>

暗号化された処理要求

authClientからauthServerに送られる、暗号化された処理要求オブジェクト。<br>
      cipherはauthRequestをJSON化し、AES-256-GCMで暗号化したもの。<br>
      AES鍵はRSA-OAEPで暗号化し encryptedKey に格納

## <span id="encryptedrequest_members">🔢 encryptedRequest メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cipher | string | <span style="color:red">必須</span> | AES-256-GCMで暗号化されたauthRequest |  |
| signature | string | <span style="color:red">必須</span> | authRequestに対するRSA-PSS署名 |  |
| encryptedKey | string | <span style="color:red">必須</span> | RSA-OAEPで暗号化されたAES共通鍵 |  |
| iv | string | <span style="color:red">必須</span> | AES-GCM 初期化ベクトル |  |
| tag | string | <span style="color:red">必須</span> | AES-GCM 認証タグ |  |
| meta | Object | <span style="color:red">必須</span> | メタ情報 |  |
| meta.rsabits | number | <span style="color:red">必須</span> | 暗号化に使用したRSA鍵長 |  |
| meta.sym | string | <span style="color:red">必須</span> | 使用した共通鍵方式 | "AES-256-GCM" |

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