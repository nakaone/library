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

## Classes

<dl>
<dt><a href="#SingleTable">SingleTable</a></dt>
<dd><p>単一スプレッドシートまたはデータオブジェクト配列のCRUDを行う</p>
<ul>
<li>原則「1シート1テーブル」で運用する
∵「ヘッダ行として指定した行にデータが存在する範囲がテーブル」として看做されるので、
複数テーブルのつもりでヘッダ行が同じ行番号にあった場合、単一テーブルとして処理される</li>
<li>表の結合には対応しない(join機能は実装しない)</li>
<li>データ領域右端より左のヘッダ行の空欄は、Col1から連番で欄の名前を採番する</li>
<li>本クラスのメンバについては<a href="#SingleTableObj">SingleTableObj</a>参照</li>
</ul>
<h4 id="参考">参考</h4>
<ul>
<li>GAS公式 <a href="https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=ja">Class Spreadsheet</a></li>
</ul>
<h4 id="使用するライブラリ">使用するライブラリ</h4>
<ul>
<li>convertNotation</li>
</ul>
<h4 id="将来的検討課題">将来的検討課題</h4>
<ol>
<li>groupByメソッドの追加</li>
<li>ツリー構造であるシートをツリー構造オブジェクトとして出力(Objectizeメソッドの追加)</li>
</ol>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SingleTableObj">SingleTableObj</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="SingleTable"></a>

## SingleTable
単一スプレッドシートまたはデータオブジェクト配列のCRUDを行う

- 原則「1シート1テーブル」で運用する
  ∵「ヘッダ行として指定した行にデータが存在する範囲がテーブル」として看做されるので、
  複数テーブルのつもりでヘッダ行が同じ行番号にあった場合、単一テーブルとして処理される
- 表の結合には対応しない(join機能は実装しない)
- データ領域右端より左のヘッダ行の空欄は、Col1から連番で欄の名前を採番する
- 本クラスのメンバについては[SingleTableObj](#SingleTableObj)参照

#### 参考

- GAS公式 [Class Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=ja)

#### 使用するライブラリ

- convertNotation

#### 将来的検討課題

1. groupByメソッドの追加
1. ツリー構造であるシートをツリー構造オブジェクトとして出力(Objectizeメソッドの追加)

**Kind**: global class  
<a name="SingleTableObj"></a>

## SingleTableObj : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | クラス名(='SingleTable') |
| name | <code>string</code> | シート名。データを引数で渡し、シートを作成しない場合は空文字列 |
| type | <code>string</code> | 元データ。'sheet' or 'data' |
| header | <code>Array.&lt;string&gt;</code> | ヘッダ行(項目名欄の並び) |
| raw | <code>Array.&lt;Array.&lt;any&gt;&gt;</code> | 指定シート上の有効データ(二次元配列)。添字=0がヘッダ行になる |
| data | <code>Array.Object.&lt;string, any&gt;</code> | 項目名：値をメンバとするオブジェクトの配列 |
| top | <code>number</code> | ヘッダ行の行番号(自然数) |
| left | <code>number</code> | データ領域左端の列番号(自然数) |
| right | <code>number</code> | データ領域右端の列番号(自然数) |
| bottom | <code>number</code> | データ領域下端の行番号(自然数) |



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
/**
 * @typedef {Object} SingleTableObj
 * @prop {string} className - クラス名(='SingleTable')
 * @prop {string} name - シート名。データを引数で渡し、シートを作成しない場合は空文字列
 * @prop {string} type - 元データ。'sheet' or 'data'
 * @prop {string[]} header - ヘッダ行(項目名欄の並び)
 * @prop {any[][]} raw - 指定シート上の有効データ(二次元配列)。添字=0がヘッダ行になる
 * @prop {Array.Object.<string, any>} data - 項目名：値をメンバとするオブジェクトの配列
 * @prop {number} top - ヘッダ行の行番号(自然数)
 * @prop {number} left - データ領域左端の列番号(自然数)
 * @prop {number} right - データ領域右端の列番号(自然数)
 * @prop {number} bottom - データ領域下端の行番号(自然数)
 */

/** 単一スプレッドシートまたはデータオブジェクト配列のCRUDを行う
 * 
 * - 原則「1シート1テーブル」で運用する
 *   ∵「ヘッダ行として指定した行にデータが存在する範囲がテーブル」として看做されるので、
 *   複数テーブルのつもりでヘッダ行が同じ行番号にあった場合、単一テーブルとして処理される
 * - 表の結合には対応しない(join機能は実装しない)
 * - データ領域右端より左のヘッダ行の空欄は、Col1から連番で欄の名前を採番する
 * - 本クラスのメンバについては[SingleTableObj](#SingleTableObj)参照
 * 
 * #### 参考
 * 
 * - GAS公式 [Class Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=ja)
 * 
 * #### 使用するライブラリ
 * 
 * - convertNotation
 * 
 * #### 将来的検討課題
 * 
 * 1. groupByメソッドの追加
 * 1. ツリー構造であるシートをツリー構造オブジェクトとして出力(Objectizeメソッドの追加)
 */
class SingleTable {










}

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
