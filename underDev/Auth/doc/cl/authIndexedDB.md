<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>
<style>
  td {white-space:nowrap;}
</style>

# <span id="authindexeddb">authIndexedDB クラス仕様書</span>

クライアントのIndexedDB

IndexedDBの作成・入出力は[authClient](authClient.md)で行うため、ここでは格納する値の定義にとどめる。

## <span id="authindexeddb_members">🔢 authIndexedDB メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | <span style="color:red">必須</span> | メンバの識別子 | メールアドレス。仮登録時はUUID |
| memberName | string | <span style="color:red">必須</span> | メンバ(ユーザ)の氏名 | 例："田中　太郎"。加入要求確認時に管理者が申請者を識別する他で使用。 |
| deviceId | string | UUID | デバイスの識別子 |  |
| keyGeneratedDateTime | number | Date.now() | 鍵ペア生成日時 | サーバ側でCPkey更新中にクライアント側で新たなCPkeyが生成されるのを避けるため、鍵ペア生成は30分以上の間隔を置く |
| SPkey | string | <span style="color:red">必須</span> | サーバ公開鍵 | Base64 |
| expireCPkey | number | <span style="color:red">必須</span> | CPkeyの有効期限(無効になる日時) | 未ログイン時は0 |

## <span id="authindexeddb_methods">🧱 authIndexedDB メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authindexeddb_constructor) | public | private | コンストラクタ |

### <span id="authindexeddb_constructor"><a href="#authindexeddb_methods">🧱 authIndexedDB.constructor()</a></span>

#### <span id="authindexeddb_constructor_referrer">📞 呼出元</span>

- [authClient.initialize](authClient.md#authClient_members)

#### <span id="authindexeddb_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | [authClientConfig](authClientConfig.md#authclientconfig_members) | <span style="color:red">必須</span> |  | 設定情報 |

#### <span id="authindexeddb_constructor_process">🧾 処理手順</span>

- IndexedDBに[authClientConfig](authClientConfig.md#authclientconfig_internal).systemNameを持つキーがあれば取得、メンバ変数に格納。
- 無ければ新規に生成し、IndexedDBに格納。
- 引数の内、authIndexedDBと同一メンバ名があればthisに設定
- 引数にnoteがあればthis.noteに設定
- timestampに現在日時を設定

#### <span id="authindexeddb_constructor_returns">📤 戻り値</span>

- [authIndexedDB](#authindexeddb_members)インスタンス