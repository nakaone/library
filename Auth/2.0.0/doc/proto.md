<style>
/*::標準CSS::$lib/CSS/1.3.0/core.css::*/
</style>
<p class="title"><a name="Auth_top">class Auth</a></p>

イベントサイトにおける募集用・参加者用・スタッフ用メニューの表示制御等、認証に関する処理を行う。

クライアント(ブラウザ)側の"class authClient"とサーバ(GAS)側の"class authServer"に分かれるが、一体管理のためソースは一元管理する。

# 初期化処理

<!--::初期化処理::$doc/initial.md::-->

# 機能別処理フロー

窃取したIDでの操作を防止するため、clientで有効期間付きの鍵ペアを生成し、依頼元の信頼性を確保する(CSkey, CPkey : clientの秘密鍵・公開鍵)。

また何らかの手段でCPkeyが窃取されて操作要求が行われた場合、処理結果の暗号化で結果受領を阻止するため、server側も鍵ペアを使用する(SSkey, SPkey : serverの秘密鍵・公開鍵)。

以降の図中で`(XSkey/YPkey)`は「X側の秘密鍵で署名、Y側の公開鍵で暗号化する」の意味。

## onload時処理

<!--::onload時処理::$doc/onload.md::-->

## 新規登録

<!--::新規登録::$doc/entry.md::-->

## ログイン要求

<!--::ログイン要求::$doc/login.md::-->

## ユーザ情報の参照・編集

<!--::検索・編集・更新::$doc/crud.md::-->

## 権限設定、変更

<!--::権限設定(変更)::$doc/permit.md::-->

# 設定情報とオブジェクト定義

<!--::$doc/typedef.md::-->

# フォルダ構成

<!--::フォルダ構成::$doc/folder.md::-->

# 仕様(JSDoc)

<!--::$tmp/client.md::-->

<!--::$tmp/server.md::-->

# プログラムソース

<!--::$tmp/client.js::-->

<!--::$tmp/server.js::-->

# 備忘

## GAS/htmlでの暗号化

<!--::$doc/crypto.md::-->

# 改版履歴

- rev.2.0.0 : class Authと統合
- rev.1.1.0 : 2024/03/14
  - setupInstanceをmergeDeeplyに置換(setupInstanceは廃番)
  - arg.funcの取り扱いを`new Function()`から直接関数を渡す形に修正
  - changeメソッドを廃止、changeScreenで代替
- rev.1.0.0 : 2024/01/03 初版