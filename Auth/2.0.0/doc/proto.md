<style>
/*::標準CSS::$lib/CSS/1.3.0/core.css::*/
</style>
<p class="title"><a name="Auth_top">class Auth</a></p>

[仕様(JSDoc)](#jsdoc) | [プログラムソース](#program_source) | [改版履歴](#revision_history)

「参加者一覧」等、スタッフには必要だが参加者に公開したくないメニューが存在する。これの表示制御を行うため、スタッフと参加者では「権限(auth)」を分ける。

<!--::authClient/authServerとBurgerMenuの連携::$doc/cooperation.md::-->
<!--::SPAにおける表示制御::$doc/displayControl.md::-->
<!--::フォルダ構成::$doc/folder.md::-->
<!--::Authクラス処理概要::$doc/overview.md::-->

 

# <a name="jsdoc" href="#Auth_top">仕様(JSDoc)</a>

<!--::$tmp/jsdoc.md::-->

# <a name="program_source" href="#Auth_top">プログラムソース</a>

<!--::$tmp/source.md::-->

# <a name="revision_history" href="#Auth_top">改版履歴</a>

- rev.2.0.0 : class Authと統合
- rev.1.1.0 : 2024/03/14
  - setupInstanceをmergeDeeplyに置換(setupInstanceは廃番)
  - arg.funcの取り扱いを`new Function()`から直接関数を渡す形に修正
  - changeメソッドを廃止、changeScreenで代替
- rev.1.0.0 : 2024/01/03 初版