# 2.生成されるナビ

- 通常の画面(校内探検)<br>
  ソースに付与されたIDに対応する文字列をname属性として持ち、
  クリックすると`<div class="(name属性の値)">`を持つ要素(該当画面)を開くイベントを付与
- func指定があった場合(受付業務)<br>
  name属性として「ID＋実行する関数名」を持ち、
  クリックすると該当画面を開き、指定された関数を実行するイベントを付与
- href指定があった場合(Tips)<br>
  href属性を持ち、クリックすると遷移先画面を開くイベントを付与

```
<nav>
  <ul>
    <li name="c1001">スタッフ
      <ul>
        <li><a name="c1002\trecept">受付業務</a></li>
        <li><a name="c1003">校内探検</a></li>
      </ul>
    </li>
    <li><a name="c1004" href="https://〜/tips.html">Tips</a></li>
  </ul>
</nav>
```

<!-- 画像イメージを追加 -->
