# Authクラス処理概要

<!--::全体の流れ::$doc/displayControl.md::-->

## 前提

### 公開鍵・秘密鍵

窃取したIDでの操作を防止するため、clientで有効期間付きの鍵ペアを生成し、依頼元の信頼性を確保する(CSkey, CPkey : clientの秘密鍵・公開鍵)。

また何らかの手段でCPkeyが窃取されて操作要求が行われた場合、処理結果の暗号化で結果受領を阻止するため、server側も鍵ペアを使用する(SSkey, SPkey : serverの秘密鍵・公開鍵)。

以降の図中で`(XSkey/YPkey)`は「X側の秘密鍵で署名、Y側の公開鍵で暗号化する」の意味。

### シート操作オブジェクト

シートの操作(CRUD)は権限と有効期間の確認が必要なため、以下のようなオブジェクト(ハッシュ)を管理者がソースに埋め込む(configとして定義する)ことで行う。

```
config.operations = {
  lookup : {  // {string} 操作名
    auth : 0, // {number} 操作を許可する権限フラグの論理和
    from : null, // {string} 有効期間を設定する場合、開始日時文字列
    to : null, // {string} 同、終了日時文字列
    func: // {Arrow|Function} 操作を定義する関数
      (data,id) => data.find(x => x.id === id),
  },
  list : {...},
  update : {...},
  ...
}
```

<!--::onload時処理::$doc/overview.onload.md::-->
<!--::新規登録::$doc/overview.entry.md::-->
<!--::ログイン要求::$doc/overview.login.md::-->
<!--::権限設定(変更)::$doc/overview.permit.md::-->
<!--::検索・編集・更新::$doc/overview.crud.md::-->

<!--::GAS/htmlでの暗号化::$doc/crypto.md::-->
