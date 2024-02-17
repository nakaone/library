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

<p class="title">function writeClipboard</p>

[JSDoc](#JSDoc) | [動作イメージ](#OperationImage) | [source](#source) | [改版履歴](#history)

<a name="JSDoc"></a>

# JSDoc

<a name="writeClipboard"></a>

## writeClipboard() ⇒ <code>void</code>
クリックされたcode要素の内容をクリップボードにコピー

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>void</code> | event.targetでクリックされたcode要素を特定 |



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
/** クリックされたcode要素の内容をクリップボードにコピー
 * @param {void} - event.targetでクリックされたcode要素を特定
 * @returns {void}
 */
function writeClipboard(){
  const v = {whois:'writeClipboard',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {
    v.step = 1; // ソースの内容を取得
    v.source = event.target.innerText;
    console.log(v.source);

    v.step = 2; // クリップボードへのコピー
    navigator.clipboard.writeText(v.source).then(
      () => alert('ソースをクリップボードへのコピーに成功しました'),
      () => alert('ソースのクリップボードへのコピーに失敗しました')
    );

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    console.error(`${v.whois} abnormal end(step.${v.step})\n`,e,v);
    return e;
  }
}

```

</details>

<!--
<details><summary>test.js</summary>

```

```

</details>
-->

<a name="history"></a>

# 改版履歴

- rev.1.0.0 : 2024/02/17 初版
