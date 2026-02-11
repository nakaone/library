# グローバル関数・クラス一覧

| path | name | label |
| :-- | :-- | :-- |
| client/ | authClient | authClient |
| client/ | cryptoClient | cryptoClient |
| client/ | localFunc | localFunc |
| client/ | clearAuthEnvironment | clearAuthEnvironment: IndexedDBの"Auth"データベースを削除し、環境をリセットする |

# データ型定義一覧

| path | name | label |
| :-- | :-- | :-- |
| client/ | authIndexedDB | authIndexedDB: IndexedDBに保存する内容(=this.idb) |
| client/ | authClientConfig | authClientConfig: 共通設定情報にauthClient特有項目を追加 |

# データ型

## authIndexedDB

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | 'dummyMemberID' | メンバ識別子(メールアドレス。初期値は固定文字列) |  |
| memberName | string | 'dummyMemberName' | メンバの氏名(初期値は固定文字列) |  |
| deviceId | string | 'dummyDeviceID' | サーバ側で生成(UUIDv4。初期値は固定文字列) |  |
| CSkeySign | CryptoKey | 必須 | 署名用秘密鍵 |  |
| CPkeySign | CryptoKey | 必須 | 署名用公開鍵 |  |
| CSkeyEnc | CryptoKey | 必須 | 暗号化用秘密鍵 |  |
| CPkeyEnc | CryptoKey | 必須 | 暗号化用公開鍵 |  |
| keyGeneratedDateTime | string | 必須 | 鍵ペア生成日時(UNIX時刻) |  |
| SPkeySign | string |  | サーバ側署名用公開鍵 |  |
| SPkeyEnc | string |  | サーバ側暗号化用公開鍵 |  |

## authClientConfig

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| api | string | 必須 | サーバ側WebアプリURLのID | https://script.google.com/macros/s/(この部分)/exec |
| timeout | number | 300000 | サーバからの応答待機時間 | これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分 |
| storeName | string | "config" | IndexedDBのストア名 |  |
| dbVersion | number | 1 | IndexedDBのバージョン |  |