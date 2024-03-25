<p class="title">class BurgerMenu</p>

htmlソースからdata-BurgerMenu属性を持つ要素を抽出、表示内容の権限の存否に従ってハンバーガーメニューを作成

![](summary.svg)

「参加者一覧」等、スタッフには必要だが参加者に公開したくないメニューが存在する。これの表示制御を行うため、スタッフと参加者では「権限(auth)」を分ける。

閲覧者が権限を持つかはGoogle Spread上に保存し、適宜「認証」を行って「利便性を確保しつつ、役割に応じた最低限の情報に限定」する。具体的な方法は「[認証の手順](#認証の手順)」の項を参照。

<!--::articles::-->

<!--::MenuBar::-->
<a name="jsdoc"></a>
# 仕様(JSDoc)

<!--::JSDoc::-->

<!--::MenuBar::-->
<a name="program_source"></a>
# プログラムソース

<!--::source::-->

<!--::MenuBar::-->
<a name="revision_history"></a>
# 改版履歴

- rev.2.0.0 : class Authと統合
- rev.1.1.0 : 2024/03/14
  - setupInstanceをmergeDeeplyに置換(setupInstanceは廃番)
  - arg.funcの取り扱いを`new Function()`から直接関数を渡す形に修正
  - changeメソッドを廃止、changeScreenで代替
- rev.1.0.0 : 2024/01/03 初版