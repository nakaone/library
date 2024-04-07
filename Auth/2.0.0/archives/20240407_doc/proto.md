<style>
/*::標準CSS::$lib/CSS/1.3.0/core.css::*/
</style>
<p class="title"><a name="Auth_top">class Auth</a></p>

イベントサイトにおける募集用・参加者用・スタッフ用メニューの表示制御等、認証に関する処理を行う。

クライアント(ブラウザ)側の"class authClient"とサーバ(GAS)側の"class authServer"に分かれるが、一体管理のためソースは一元管理する。

# 機能別処理フロー

<!--::初期化処理::$doc/overview.initial.md::-->
<!--::onload時処理::$doc/overview.onload.md::-->
<!--::新規登録::$doc/overview.entry.md::-->
<!--::ログイン要求::$doc/overview.login.md::-->
<!--::権限設定(変更)::$doc/overview.permit.md::-->
<!--::検索・編集・更新::$doc/overview.crud.md::-->

# 設定情報とオブジェクト定義

- client/server共通設定情報(config.common)
  > クラスメンバ
- authClient固有設定情報(config.client)
  > 保持するデータ構造を含む
- authServer固有設定情報(config.server)
- 引数・戻り値となるオブジェクトの定義(typedef)
- ID, RSA鍵(crypto)
  > client/serverで表にする。使用するライブラリcrypticoの使用方法を含む

# フォルダ構成

<!--::フォルダ構成::$doc/folder.md::-->

# 仕様(JSDoc)

<!--::$tmp/jsdoc.md::-->

# プログラムソース

<!--::$tmp/source.md::-->

# 改版履歴

- rev.2.0.0 : class Authと統合
- rev.1.1.0 : 2024/03/14
  - setupInstanceをmergeDeeplyに置換(setupInstanceは廃番)
  - arg.funcの取り扱いを`new Function()`から直接関数を渡す形に修正
  - changeメソッドを廃止、changeScreenで代替
- rev.1.0.0 : 2024/01/03 初版