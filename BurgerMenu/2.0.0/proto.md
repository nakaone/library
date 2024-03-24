<p class="title">class BurgerMenu</p>

htmlソースからdata-BurgerMenu属性を持つ要素を抽出、表示内容の権限の存否に従ってハンバーガーメニューを作成

![](summary.svg)

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