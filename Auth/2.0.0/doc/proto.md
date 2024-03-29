<p class="title"><a name="Auth_top">class Auth</a></p>

[仕様(JSDoc)](#jsdoc) | [プログラムソース](#program_source) | [改版履歴](#revision_history)

<!--::MenuBar::-->

「参加者一覧」等、スタッフには必要だが参加者に公開したくないメニューが存在する。これの表示制御を行うため、スタッフと参加者では「権限(auth)」を分ける。

閲覧者が権限を持つかはGoogle Spread上に保存し、適宜「認証」を行って「利便性を確保しつつ、役割に応じた最低限の情報に限定」する。具体的な方法は「[認証の手順](#認証の手順)」の項を参照。

<!--::articles::-->

# <a name="jsdoc" href="#Auth_top">仕様(JSDoc)</a>

<!--::JSDoc::-->

1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test

# <a name="program_source" href="#Auth_top">プログラムソース</a>

<!--::source::-->

1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test
1. test

# <a name="revision_history" href="#Auth_top">改版履歴</a>

- rev.2.0.0 : class Authと統合
- rev.1.1.0 : 2024/03/14
  - setupInstanceをmergeDeeplyに置換(setupInstanceは廃番)
  - arg.funcの取り扱いを`new Function()`から直接関数を渡す形に修正
  - changeメソッドを廃止、changeScreenで代替
- rev.1.0.0 : 2024/01/03 初版