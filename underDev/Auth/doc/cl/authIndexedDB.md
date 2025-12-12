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

## <span id="authindexeddb_methods">🧱 authIndexedDB メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |