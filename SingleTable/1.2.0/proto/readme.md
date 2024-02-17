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
.title {
  font-size: 2.4rem;
  text-shadow: 2px 2px 5px #888;
}
</style>

<p class="title">class SingleTable</p>

[JSDoc](#JSDoc) | [動作イメージ](#OperationImage) | [source](#source) | [改版履歴](#history)

<a name="JSDoc"></a>

# JSDoc

__JSDoc

<a name="OperationImage"></a>

# 動作イメージ

## サンプルデータ

## 動作結果

### パターン①

<div class="triDown"></div>

<a name="source"></a>

# source

<details><summary>core.js</summary>

```
__source
```

</details>

<!--
<details><summary>test.js</summary>

```
__test
```

</details>
-->

<a name="history"></a>

# 改版履歴

- rev.1.2.0 : 2024/02/17
  - 元データとしてシート以外にオブジェクトの配列に対応
  - ライブラリ関数を使用、不要なメンバを削除(clog, deepcopy, convertNotation)
- rev.1.1.0 : 2024/01/05 ファイル構成の変更
- rev.1.0.1 : 2023/12/08 引数のシート名について、シート名文字列に加え範囲指定文字列でも指定可能に変更
- rev.1.0.0 : 2023/11/29