# グローバル関数・クラス一覧

| path | name | label |
| :-- | :-- | :-- |
| common/ | authConfig | authConfig |

# データ型定義一覧

| path | name | label |
| :-- | :-- | :-- |
| common/ | authRequest | authRequest: authClientからauthServerへの処理要求(平文) |
| common/ | authResponse | authResponse: authServerからauthClientへの処理結果(平文) |
| common/ | encryptedRequest | encryptedRequest: 暗号化された処理要求 |
| common/ | encryptedResponse | encryptedResponse: 暗号化された処理結果 |

# データ型

## authRequest

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | this.idb.memberId | メンバの識別子 |  |
| deviceId | string | this.idb.deviceId | デバイスの識別子(UUIDv4) |  |
| memberName | string | this.idb.memberName | メンバの氏名。管理者が加入認否判断のため使用 |  |
| CPkeySign | string | this.idb.CPkeySign | クライアント側署名用公開鍵 |  |
| requestTime | number | Date.now() | 要求日時UNIX時刻 |  |
| func | string | 必須 | サーバ側関数名 |  |
| arg | any[] | [ | サーバ側関数に渡す引数の配列 |  |
| nonce | string | UUIDv4 | 要求の識別子UUIDv4 |  |

## authResponse

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | 必須 | メンバの識別子 |  |
| deviceId | string | 必須 | デバイスの識別子。UUIDv4 |  |
| memberName | string | 必須 | メンバの氏名 |  |
| CPkeySign | CryptoKey | this.idb.CPkeySign | クライアント側署名用公開鍵 |  |
| requestTime | number | 必須 | 要求日時UNIX時刻 |  |
| func | string | 必須 | サーバ側関数名 |  |
| arg | any[] | 必須 | サーバ側関数に渡す引数の配列 |  |
| nonce | string | 必須 | 要求の識別子UUIDv4 | == authServer内での追加項目 |
| SPkeySign | string | this.keys.SPkeySign | サーバ側署名用公開鍵 |  |
| SPkeyEnc | string | this.keys.SPkeyEnc | サーバ側暗号化用公開鍵 |  |
| response | any |  | サーバ側関数の戻り値 |  |
| receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  |
| responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 |
| status | string | "success" | サーバ側処理結果 | 正常終了時は"success"(文字列)、警告終了の場合はエラーメッセージ、
  致命的エラーの場合はErrorオブジェクト |
| message | string | "" | メッセージ(statusの補足) | == authClient設定項目(authServerからの返信を受け、authClient内で追加) |
| decrypt | string | "success" | クライアント側での復号処理結果 | "success":正常、それ以外はエラーメッセージ |

## encryptedRequest

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| payload | string |  | 平文のauthRequest | cipherと排他。SPkey要求時(meta.keyProvisioning===true)のみ設定 |
| cipher | string |  | AES-256-GCMで暗号化されたauthRequest。payloadと排他 |  |
| iv | string |  | AES-GCM 初期化ベクトル |  |
| signature | string | 必須 | authRequestに対するRSA-PSS署名 |  |
| encryptedKey | string |  | RSA-OAEPで暗号化されたAES共通鍵 |  |
| meta | Object | 必須 | メタ情報 |  |
| meta.signOnly | boolean | false | 暗号化せず署名のみで送信する場合true |  |
| meta.sym | string |  | 使用した共通鍵方式"AES-256-GCM" |  |
| meta.rsabits | number | 必須 | 暗号化に使用したRSA鍵長 |  |
| meta.keyProvisioning | boolean | false | 鍵配布・鍵更新目的ならtrue | 「通常業務」ではなく、「鍵を配る／更新するための通信」であることの宣言。
  通常signOnlyと一致するが、運用時の利用目的が異なるため別項目とする。 |

## encryptedResponse

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cipher | string | 必須 | 暗号化した文字列 |  |
| signature | string | 必須 | authResponseに対するRSA-PSS署名 |  |
| encryptedKey | string | 必須 | RSA-OAEPで暗号化されたAES共通鍵 |  |
| iv | string | 必須 | AES-GCM 初期化ベクトル |  |
| tag | string | 必須 | AES-GCM 認証タグ |  |
| meta | Object | 必須 | メタ情報 |  |
| meta.rsabits | number | 必須 | 暗号化に使用したRSA鍵長 |  |