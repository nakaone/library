<style>
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
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

[総説](../readme.md) | [CL/SV共通](../common/index.md) | [CL側](../client/index.md) | [SV側](../server/index.md) | [暗号化](../crypto.md) | [メンバ](../Member.md) | [開発](../dev.md)

</div>

# グローバル関数・クラス一覧

| クラス/関数名 | 概要 |
| :-- | :-- |
| [authClient](authClient.md) | authClient: クライアント側中核クラス |
| [clearAuthEnvironment](clearAuthEnvironment.md) | clearAuthEnvironment: IndexedDBの"Auth"データベースを削除し、環境をリセットする |
| [cryptoClient](cryptoClient.md) | cryptoClient: クライアント側の暗号化・署名検証 |
| [localFunc](localFunc.md) | localFunc: テスト用：処理要求発行 |

# <span id="typedefList">データ型定義一覧</span>

| No | データ型名 | 概要 |
| --: | :-- | :-- |
| 1 | [authClientConfig](#authClientConfig) | authClientConfig: 共通設定情報にauthClient特有項目を追加 |
| 2 | [authIndexedDB](#authIndexedDB) | authIndexedDB: IndexedDBに保存する内容(=this.idb) |

# 個別データ型定義


## <a href="#typedefList"><span id="authClientConfig">"authClientConfig" データ型定義</span></a>

authClientConfig: 共通設定情報にauthClient特有項目を追加

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| api | string | 必須 | サーバ側WebアプリURLのID | https://script.google.com/macros/s/(この部分)/exec |
| timeout | number | 300000 | サーバからの応答待機時間 | これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分 |
| storeName | string | "config" | IndexedDBのストア名 |  |
| dbVersion | number | 1 | IndexedDBのバージョン |  |


## <a href="#typedefList"><span id="authIndexedDB">"authIndexedDB" データ型定義</span></a>

authIndexedDB: IndexedDBに保存する内容(=this.idb)

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