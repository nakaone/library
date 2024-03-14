<p class="title">class BurgerMenu</p>

# 概要

## 機能概要

htmlからdata-BurgerMenu属性を持つ要素を抽出、ハンバーガーメニューを作成

[BurgerMenu仕様](#burgermenu仕様) | [source](#source) | [改版履歴](#改版履歴)

![](summary.svg)


# BurgerMenu仕様

__JSDoc

# source

<a href="#top" class="right">先頭へ</a><details><summary>core.js</summary>

```
__source
```

</details>

<a href="#top" class="right">先頭へ</a><details><summary>test.js</summary>

```
__test
```

</details>

<a href="#top" class="right">先頭へ</a><details><summary>build.sh</summary>

```
__build
```

</details>

# 改版履歴

- rev.1.1.0 : 2024/03/14
  - setupInstanceをmergeDeeplyに置換(setupInstanceは廃番)
  - arg.funcの取り扱いを`new Function()`から直接関数を渡す形に修正
  - changeメソッドを廃止、changeScreenで代替
- rev.1.0.0 : 2024/01/03 初版