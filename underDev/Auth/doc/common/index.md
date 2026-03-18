<style> /* 仕様書用共通スタイル定義 */
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
  .source { /* 出典元のソースファイル名(リンクは無し) */
    text-align:right; font-size:0.8rem;}
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

[総説](../readme.md) | [CL/SV共通](../common/index.md) | [CL側](../client/index.md) | [SV側](../server/index.md) | [暗号化](../crypto.md) | [メンバ](../Member.md) | [独自Lib](../lib/index.md) | [開発](../dev.md)

</div>

# グローバル関数・クラス一覧

| クラス/関数名 | 概要 |
| :-- | :-- |
| [authConfig](authConfig.md) | クライアント・サーバ共通設定情報 |


# <span id="typedefList">データ型定義一覧</span>

| No | データ型名 | 概要 |
| --: | :-- | :-- |
| 1 | [authRequest](#authRequest) | authClientからauthServerへの処理要求(平文) |
| 2 | [authResponse](#authResponse) | authServerからauthClientへの処理結果(平文) |
| 3 | [encryptedRequest](#encryptedRequest) | 暗号化された処理要求 |
| 4 | [encryptedResponse](#encryptedResponse) | 暗号化された処理結果 |

# 個別データ型定義


## <a href="#typedefList"><span id="authRequest">"authRequest" データ型定義</span></a>

authRequest: authClientからauthServerへの処理要求(平文)

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| memberId | string | this.idb.memberId | メンバの識別子 |
| deviceId | string | this.idb.deviceId | デバイスの識別子(UUIDv4) |
| memberName | string | this.idb.memberName | メンバの氏名。管理者が加入認否判断のため使用 |
| CPkeySign | string | this.idb.CPkeySign | クライアント側署名用公開鍵 |
| requestTime | number | Date.now() | 要求日時UNIX時刻 |
| func | string | 必須 | サーバ側関数名 |
| arguments | any[] | [] | サーバ側関数に渡す引数の配列 |
| nonce | string | UUIDv4 | 要求の識別子UUIDv4 |


## <a href="#typedefList"><span id="authResponse">"authResponse" データ型定義</span></a>

authResponse: authServerからauthClientへの処理結果(平文)
- memberId〜nonce : authClient設定項目(authRequestからの転記項目) : 
- SPkeySign〜message : authServer内での追加項目
- decrypt〜 : authClient設定項目(authServerからの返信を受け、authClient内で追加)

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | 必須 | メンバの識別子 |  |
| deviceId | string | 必須 | デバイスの識別子。UUIDv4 |  |
| memberName | string | 必須 | メンバの氏名 |  |
| CPkeySign | CryptoKey | this.idb.CPkeySign | クライアント側署名用公開鍵 |  |
| requestTime | number | 必須 | 要求日時UNIX時刻 |  |
| func | string | 必須 | サーバ側関数名 |  |
| arg | any[] | 必須 | サーバ側関数に渡す引数の配列 |  |
| nonce | string | 必須 | 要求の識別子UUIDv4 |  |
| SPkeySign | string | this.keys.SPkeySign | サーバ側署名用公開鍵 |  |
| SPkeyEnc | string | this.keys.SPkeyEnc | サーバ側暗号化用公開鍵 |  |
| response | any | null | サーバ側関数の戻り値 |  |
| receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  |
| responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 |
| status | string | "success" | サーバ側処理結果 | 正常終了時は"success"(文字列)、警告終了の場合はエラーメッセージ、<br>  致命的エラーの場合はErrorオブジェクト |
| message | string | "" | メッセージ(statusの補足) |  |
| decrypt | string | "success" | クライアント側での復号処理結果 | "success":正常、それ以外はエラーメッセージ |


## <a href="#typedefList"><span id="encryptedRequest">"encryptedRequest" データ型定義</span></a>

encryptedRequest: 暗号化された処理要求

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| payload | string | null | 平文のauthRequest | cipherと排他。SPkey要求時(meta.keyProvisioning===true)のみ設定 |
| cipher | string | null | AES-256-GCMで暗号化されたauthRequest。payloadと排他 |  |
| iv | string | null | AES-GCM 初期化ベクトル |  |
| signature | string | 必須 | authRequestに対するRSA-PSS署名 |  |
| encryptedKey | string | null | RSA-OAEPで暗号化されたAES共通鍵 |  |
| meta | Object | 必須 | メタ情報 |  |
| meta.signOnly | boolean | false | 暗号化せず署名のみで送信する場合true |  |
| meta.sym | string | null | 使用した共通鍵方式"AES-256-GCM" |  |
| meta.rsabits | number | 必須 | 暗号化に使用したRSA鍵長 |  |
| meta.keyProvisioning | boolean | false | 鍵配布・鍵更新目的ならtrue | 「通常業務」ではなく、「鍵を配る／更新するための通信」であることの宣言。<br>  通常signOnlyと一致するが、運用時の利用目的が異なるため別項目とする。 |


## <a href="#typedefList"><span id="encryptedResponse">"encryptedResponse" データ型定義</span></a>

encryptedResponse: 暗号化された処理結果

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| cipher | string | 必須 | 暗号化した文字列 |
| signature | string | 必須 | authResponseに対するRSA-PSS署名 |
| encryptedKey | string | 必須 | RSA-OAEPで暗号化されたAES共通鍵 |
| iv | string | 必須 | AES-GCM 初期化ベクトル |
| tag | string | 必須 | AES-GCM 認証タグ |
| meta | Object | 必須 | メタ情報 |
| meta.rsabits | number | 必須 | 暗号化に使用したRSA鍵長 |