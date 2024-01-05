<style>
.triDown { /* 下向き矢印 */
  --bw: 50px;
  width: 0px;
  height: 0px;
  border-top: calc(var(--bw) * 0.7) solid #aaa;
  border-right: var(--bw) solid transparent;
  border-left: var(--bw) solid transparent;
  border-bottom: calc(var(--bw) * 0.2) solid transparent;
}
.header {
  font-size: 2.4rem;
  text-shadow: 2px 2px 5px #888;
}
</style>

<p class="header">SingleTable</p>

# JSDoc

<!--:: JSDoc.md ::-->

<details><summary>source</summary>

```
// -:: source ::-
```

</details>

# 更新履歴

- rev.1.0.0 2023/11/29
- rev.1.0.1 2023/12/08 引数のシート名について、シート名文字列に加え範囲指定文字列でも指定可能に変更
- rev.1.1.0 2024/01/05 ファイル構成の変更