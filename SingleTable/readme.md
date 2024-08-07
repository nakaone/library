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
<dt><a href="#UpdateResult">UpdateResult</a> : <code>Object</code></dt>
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

* [SingleTable](#SingleTable)
    * [new SingleTable(arg1, arg2)](#new_SingleTable_new)
    * [.prepSheet()](#SingleTable+prepSheet) ⇒ <code>void</code>
    * [.prepData()](#SingleTable+prepData) ⇒ <code>void</code>
    * [.dump()](#SingleTable+dump)
    * [.select([opt])](#SingleTable+select) ⇒ <code>Array.Object.&lt;string, any&gt;</code> \| <code>Error</code>
    * [.update(set, [opt])](#SingleTable+update) ⇒ [<code>Array.&lt;UpdateResult&gt;</code>](#UpdateResult) \| <code>Error</code>
    * [.insert(records)](#SingleTable+insert) ⇒ <code>number</code> \| <code>Error</code>

<a name="new_SingleTable_new"></a>

### new SingleTable(arg1, arg2)
SingleTableオブジェクトの生成
- 引数が二つの場合、name＋optと解釈。一つの場合はoptのみと解釈する。
- optで指定可能なメンバは以下の通り
  - name : 参照先シート名またはA1形式の範囲指定文字列
  - raw : シートイメージ(二次元配列)
  - data : オブジェクトの配列
- クラスのメンバについては[SingleTableObj](#SingleTableObj)参照


| Param | Type | Description |
| --- | --- | --- |
| arg1 | <code>string</code> \| <code>Object</code> | 参照先シート名またはA1形式の範囲指定文字列(name)、またはオプション(opt) |
| arg2 | <code>Object</code> | オプション(opt) |

<a name="SingleTable+prepSheet"></a>

### singleTable.prepSheet() ⇒ <code>void</code>
シートから指定有効範囲内のデータを取得
- 「指定有効範囲」とは、指定範囲かつデータが存在する範囲を指す。<br>
  例：指定範囲=C2:F ⇒ top=3, bottom=7, left=3(C列), right=6(F列)

  | | A | B | C | D | E | F | G | H |
  | :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | 1 | |  | タイトル |  |  |  |  |  |  |
  | 2 | |  |  |  |  |  |  |  |  |
  | 3 | |  | (Col1) | D3 | E3 | (Col2) |  |  |  |
  | 4 | |  |  |  |  |  |  |  |  |
  | 5 | |  | 5 | 4 |  |  |  |  |  |
  | 6 | |  | 5 | 6 | 7 | 8 |  |  |  |
  | 7 | |  | 4 | 3 | hoge | fuga |  |  |  |
  | 8 | |  |  |  |  |  |  |  |  |
  | 9 | |  |  |  |  |  |  | dummy |  |
  | 10 | |  |  |  |  |  |  |  |  |

  - 有効範囲とはデータが存在する範囲(datarange=C1:H9)
  - 「タイトル(C1)」「dummy(H9)」は有効範囲だが、指定範囲(C2:F)から外れるので除外
  - 指定範囲にデータが存在しない場合、指定有効範囲はデータが存在する範囲とする<br>
    ex.C2:Fだが2行目は空なのでtop=3、C列はタイトルはないがデータが存在するのでleft=3
  - ヘッダ行(3行目)の空白セル(C3,F3)には自動採番したコラム名を設定(Col1,Col2)
  - データ範囲はヘッダ行(3行目)の次の行(4行目)から始まると看做す
  - データ範囲内の空行(4行目)もraw/data共に入れる<br>
    ∵ シート上の行位置とオブジェクトの位置を対応可能にするため
  - 空白セルはdataには入れない(undefinedになる)<br>
    ex.5行目={C3:5,D3:4}(Col1,2はundef)、6行目={C3:5,D3:6,Col1:7,Col2:8}
  - 有効範囲は9行目(dummy)までだが、指定範囲内だと7行目までなので、bottom=7

**Kind**: instance method of [<code>SingleTable</code>](#SingleTable)  

| Param | Type |
| --- | --- |
|  | <code>void</code> | 

<a name="SingleTable+prepData"></a>

### singleTable.prepData() ⇒ <code>void</code>
オブジェクトの配列からシートイメージを作成
- シートイメージで渡された場合(raw)
  - headerは指定の有無に拘わらず先頭行で置換<br>
    ∵ rawとheaderで内容に齟齬が有った場合、dataが適切に作成されない
  - 先頭行に空欄が有った場合、ColNで自動的に命名
- オブジェクトの配列が渡された場合(data)
  - headerの指定なし：メンバ名を抽出してheaderを作成
  - headerの指定あり：データとしてのオブジェクトにheaderに無いメンバが有っても無視
- rawとdata両方が渡された場合、いずれも変更しない(齟齬の有無はノーチェック)
- 以下の条件をすべて満たす場合、新規にシートを作成
  - シート名がthis.nameのシートが存在しない
  - 操作対象がシートではない(this.type === 'data')
  - シート名(this.name)が指定されている
- シートはthis.nameで指定された名前になるが、左上のセル位置も併せて指定可能<br>
  ex. 'testsheet'!B2<br>
  なおセル位置は左上の単一セル指定のみ有効、他は有っても無視(ex.B2:C5ならC5は無視)

1. オブジェクトの配列(this.data.length > 0) ※択一
   1. headerの作成
   1. rawの作成
1. シートイメージ(this.raw.length > 0) ※択一
   1. headerの作成 : 1行目をヘッダと看做す(添字:0)
   1. dataの作成
1. シートの作成(this.type=='data' && this.name!=null)
   1. 既存のシートがないか確認(存在すればエラー)
   1. this.rawをシートに出力

**Kind**: instance method of [<code>SingleTable</code>](#SingleTable)  

| Param | Type |
| --- | --- |
|  | <code>void</code> | 

<a name="SingleTable+dump"></a>

### singleTable.dump()
SingleTableクラスメンバの値をダンプ表示

**Kind**: instance method of [<code>SingleTable</code>](#SingleTable)  
<a name="SingleTable+select"></a>

### singleTable.select([opt]) ⇒ <code>Array.Object.&lt;string, any&gt;</code> \| <code>Error</code>
条件に該当するレコード(オブジェクト)を抽出

**Kind**: instance method of [<code>SingleTable</code>](#SingleTable)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opt] | <code>Object</code> | <code>{}</code> | オプション |
| [opt.where] | <code>function</code> | <code>()&#x3D;&gt;true</code> | レコードを引数として、条件に合致する場合trueを返す関数 |
| [opt.orderBy] | <code>Array.&lt;Array.&lt;string&gt;&gt;</code> | <code>[]</code> | 並べ替えのキーと昇順/降順指定  [['key1'(,'desc')],['key2'(,'desc')],...] |

**Example**  
```
v.table = new SingleTable('test',{top:3});
v.r = v.table.select({
  where: x => x.B3 && 1<x.B3 && x.B3<9,
  orderBy:[['B3'],['C3','desc']]
});
console.log(JSON.stringify(v.r));
// -> [
  {"B3":4,"C3":3,"Col1":"hoge","E3":"fuga"},
  {"B3":5,"C3":6,"Col1":7,"E3":8},
  {"B3":5,"C3":4}
]
```

「Col1に'g'が含まれる」という場合
```
where: x => {return x.Col1 && String(x.Col1).indexOf('g') > -1}
```
<a name="SingleTable+update"></a>

### singleTable.update(set, [opt]) ⇒ [<code>Array.&lt;UpdateResult&gt;</code>](#UpdateResult) \| <code>Error</code>
条件に該当するレコード(オブジェクト)を更新

**Kind**: instance method of [<code>SingleTable</code>](#SingleTable)  
**Returns**: [<code>Array.&lt;UpdateResult&gt;</code>](#UpdateResult) \| <code>Error</code> - 更新結果を格納した配列  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| set | <code>Object</code> \| <code>function</code> |  | セットする{項目名:値}、または行オブジェクトを引数にセットする{項目名:値}を返す関数 |
| [opt] | <code>Object</code> | <code>{}</code> | オプション |
| [opt.where] | <code>function</code> | <code>()&#x3D;&gt;true</code> | レコードを引数として、条件に合致する場合trueを返す関数 |

**Example**  
```
v.table = new SingleTable('test!B3:E');
// B3欄が4のレコードについて、Col1に'hoge'・E3に'fuga'をセットする
v.table.update({Col1:'hoge',E3:'fuga'},{where:o=>o.B3&&o.B3==4});  // 戻り値 -> [{
  "old":{"B3":4,"C3":3,"Col1":"a","E3":"b"},
  "new":{"B3":4,"C3":3,"Col1":"hoge","E3":"fuga"},
  "diff":{"Col1":["a","hoge"],"E3":["b","fuga"]},
  "row":7,
  "left":4,"right":5
}]
```

更新対象データを直接指定、また同一行の他の項目から導出してセットすることも可能。

```
// E3欄に'a'をセットする
v.table.update(
  {E3:'a'},  // 更新対象データを直接指定
  {where:o=>o.B3==5&&o.C3==4}
)
// Col1欄にB3+C3の値をセットする
v.table.update(
  o=>{return {Col1:(o.B3||0)+(o.C3||0)}},  // 他項目から導出
  {where:o=>o.B3==5&&o.C3==4}
)
```
<a name="SingleTable+insert"></a>

### singleTable.insert(records) ⇒ <code>number</code> \| <code>Error</code>
レコード(オブジェクト)を追加

- 複数行の一括追加も可

**Kind**: instance method of [<code>SingleTable</code>](#SingleTable)  
**Returns**: <code>number</code> \| <code>Error</code> - 追加した行数  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| records | <code>Object</code> \| <code>Array.&lt;Object&gt;</code> | <code>[</code> | 追加するオブジェクトの配列 |

**Example**  
```
v.table = new SingleTable('test',{top:3});
v.table.insert({B3:3,E3:1});
  // -> 一行追加
v.table.insert([{B3:2,E3:2},{C3:1,Col1:'hoge'}]);
  // -> 複数行追加
```
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

<a name="UpdateResult"></a>

## UpdateResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| row | <code>number</code> | 変更対象の行番号(自然数) |
| old | <code>Object</code> | 変更前の行オブジェクト |
| new | <code>Object</code> | 変更後の行オブジェクト |
| diff | <code>Object.&lt;string, Array.&lt;any&gt;&gt;</code> | {変更した項目名：[変更前,変更後]}形式のオブジェクト |
| row | <code>number</code> | 更新対象行番号(自然数) |
| left | <code>number</code> | 更新対象領域左端列番号(自然数) |
| right | <code>number</code> | 更新対象領域右端列番号(自然数) |



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

  /** SingleTableオブジェクトの生成
   * - 引数が二つの場合、name＋optと解釈。一つの場合はoptのみと解釈する。
   * - optで指定可能なメンバは以下の通り
   *   - name : 参照先シート名またはA1形式の範囲指定文字列
   *   - raw : シートイメージ(二次元配列)
   *   - data : オブジェクトの配列
   * - クラスのメンバについては[SingleTableObj](#SingleTableObj)参照
   * 
   * @param {string|Object} arg1 - 参照先シート名またはA1形式の範囲指定文字列(name)、またはオプション(opt)
   * @param {Object} arg2 - オプション(opt)
   * @returns {SingleTableObj|Error}
   */
  constructor(arg1,arg2){
    const v = {whois:'SingleTable.constructor',rv:null,step:0,arg:{}};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1.1; // 全引数のオブジェクト化＋既定値の設定
      if( typeof arg1 === 'string' ){ // name指定あり
        v.arg = Object.assign({name:arg1},(arg2 || {}));
      } else { // name指定なしでopt指定、または引数無し
        v.arg = arg1;
      }
      v.arg = Object.assign({name:'',raw:[],data:[],header:[]},v.arg);
  
      v.step = 1.2; // メンバの初期値を設定
      this.sheet = null;
      this.className = 'SingleTable';
      this.name = v.arg.name || '';
      ['header','raw','data'].forEach(x => this[x] = (v.arg[x] || []));
  
      v.step = 1.3; // nameから指定範囲を特定、メンバに保存
      v.m = this.name.match(/^'?(.+?)'?!([A-Za-z]*)([0-9]*):?([A-Za-z]*)([0-9]*)$/);
      //old v.m = this.name.match(/^'*(.+?)'*!([A-Za-z]+)([0-9]*):([A-Za-z]+)([0-9]*)$/);
      if( v.m ){
        // シート名がA1形式の範囲指定文字列ならname,left/top/right/bottomを書き換え
        this.name = v.m[1];
        this.left = convertNotation(v.m[2]);
        if( v.m[3] ) this.top = Number(v.m[3]);
        this.right = convertNotation(v.m[4]);
        if( v.m[5] ) this.bottom = Number(v.m[5]);
      } else {
        this.top = this.left = 1;
        this.bottom = this.right = Infinity;
      }
      //console.log(`l.65 this.top=${this.top}, bottom=${this.bottom}, left=${this.left}, right=${this.right}\ndata=${JSON.stringify(this.data)}\nraw=${JSON.stringify(this.raw)}`);
  
      v.step = 2; // sheetかdataかで処理を分岐
      this.type = (this.data.length > 0 || this.raw.length > 0 ) ? 'data' : 'sheet';
      if( this.type === 'sheet' ){
        v.r = this.prepSheet();
      } else {
        v.r = this.prepData();
      }
      if( v.r instanceof Error ) throw v.r;
  
      v.step = 3; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\narg1=${JSON.stringify(arg1)}\narg2=${JSON.stringify(arg2)}`;  // 引数
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }  

  /** シートから指定有効範囲内のデータを取得
   * - 「指定有効範囲」とは、指定範囲かつデータが存在する範囲を指す。<br>
   *   例：指定範囲=C2:F ⇒ top=3, bottom=7, left=3(C列), right=6(F列)
   * 
   *   | | A | B | C | D | E | F | G | H |
   *   | :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
   *   | 1 | |  | タイトル |  |  |  |  |  |  |
   *   | 2 | |  |  |  |  |  |  |  |  |
   *   | 3 | |  | (Col1) | D3 | E3 | (Col2) |  |  |  |
   *   | 4 | |  |  |  |  |  |  |  |  |
   *   | 5 | |  | 5 | 4 |  |  |  |  |  |
   *   | 6 | |  | 5 | 6 | 7 | 8 |  |  |  |
   *   | 7 | |  | 4 | 3 | hoge | fuga |  |  |  |
   *   | 8 | |  |  |  |  |  |  |  |  |
   *   | 9 | |  |  |  |  |  |  | dummy |  |
   *   | 10 | |  |  |  |  |  |  |  |  |
   * 
   *   - 有効範囲とはデータが存在する範囲(datarange=C1:H9)
   *   - 「タイトル(C1)」「dummy(H9)」は有効範囲だが、指定範囲(C2:F)から外れるので除外
   *   - 指定範囲にデータが存在しない場合、指定有効範囲はデータが存在する範囲とする<br>
   *     ex.C2:Fだが2行目は空なのでtop=3、C列はタイトルはないがデータが存在するのでleft=3
   *   - ヘッダ行(3行目)の空白セル(C3,F3)には自動採番したコラム名を設定(Col1,Col2)
   *   - データ範囲はヘッダ行(3行目)の次の行(4行目)から始まると看做す
   *   - データ範囲内の空行(4行目)もraw/data共に入れる<br>
   *     ∵ シート上の行位置とオブジェクトの位置を対応可能にするため
   *   - 空白セルはdataには入れない(undefinedになる)<br>
   *     ex.5行目={C3:5,D3:4}(Col1,2はundef)、6行目={C3:5,D3:6,Col1:7,Col2:8}
   *   - 有効範囲は9行目(dummy)までだが、指定範囲内だと7行目までなので、bottom=7
   * 
   * @param {void}
   * @returns {void}
   */
  prepSheet(){
    const v = {whois:this.className+'.prepSheet',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1; // シートからデータを取得、初期値設定
      this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.name);
      if( this.sheet instanceof Error ) throw this.sheet;
  
      v.step = 2; // 範囲行・列番号がデータの存在する範囲外だった場合、存在範囲内に変更
      v.dataRange = this.sheet.getDataRange();
      v.top = v.dataRange.getRow();
      v.bottom = v.dataRange.getLastRow();
      v.left = v.dataRange.getColumn();
      v.right = v.dataRange.getLastColumn();
      //console.log(`l.185 v.top=${v.top}, bottom=${v.bottom}, left=${v.left}, right=${v.right}`+`\nthis.top=${this.top}, bottom=${this.bottom}, left=${this.left}, right=${this.right}`);
      this.top = this.top < v.top ? v.top : this.top;
      // 最終行が先頭行以上、または範囲外の場合は存在範囲に変更
      this.bottom = this.bottom > v.bottom ? v.bottom : this.bottom;
      this.left = this.left < v.left ? v.left : this.left;
      this.right = this.right > v.right ? v.right : this.right;
      //console.log(`l.191 this.top=${this.top}, bottom=${this.bottom}, left=${this.left}, right=${this.right}`);
  
      v.step = 3; // ヘッダ行番号以下の有効範囲(行)をv.rawに取得
      v.range = [this.top, this.left, this.bottom - this.top + 1, this.right - this.left + 1];
      v.raw = this.sheet.getRange(...v.range).getValues();
      //console.log(`l.196 v.raw=${JSON.stringify(v.raw.slice(0,10))}`);
  
      v.step = 4; // ヘッダ行の空白セルに'ColN'を補完
      v.colNo = 1;
      for( v.i=0 ; v.i<v.raw[0].length ; v.i++ ){
        this.header.push( v.raw[0][v.i] === '' ? 'Col' + v.colNo : v.raw[0][v.i] );
        v.colNo++;
      }
  
      v.step = 5; // 指定有効範囲の末端行を検索(中間の空行は残すが、末尾の空行は削除)
      for( v.r=(this.bottom-this.top) ; v.r>=0 ; v.r-- ){
        if( v.raw[v.r].join('').length > 0 ){
          this.bottom = this.top + v.r;
          break;
        }
      }
  
      v.step = 6; // this.raw/dataにデータをセット
      this.raw[0] = v.raw[0]; // ヘッダ行
      for( v.r=1 ; v.r<=(this.bottom-this.top) ; v.r++ ){
        this.raw.push(v.raw[v.r]);
        v.o = {};
        for( v.c=0 ; v.c<this.header.length ; v.c++ ){
          if( v.raw[v.r][v.c] !== '' ){
            v.o[this.header[v.c]] = v.raw[v.r][v.c];
          }
        }
        this.data.push(v.o);
      }
  
      v.step = 7; // 終了処理
      this.dump();
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }
  /** オブジェクトの配列からシートイメージを作成
    * - シートイメージで渡された場合(raw)
    *   - headerは指定の有無に拘わらず先頭行で置換<br>
    *     ∵ rawとheaderで内容に齟齬が有った場合、dataが適切に作成されない
    *   - 先頭行に空欄が有った場合、ColNで自動的に命名
    * - オブジェクトの配列が渡された場合(data)
    *   - headerの指定なし：メンバ名を抽出してheaderを作成
    *   - headerの指定あり：データとしてのオブジェクトにheaderに無いメンバが有っても無視
    * - rawとdata両方が渡された場合、いずれも変更しない(齟齬の有無はノーチェック)
    * - 以下の条件をすべて満たす場合、新規にシートを作成
    *   - シート名がthis.nameのシートが存在しない
    *   - 操作対象がシートではない(this.type === 'data')
    *   - シート名(this.name)が指定されている
    * - シートはthis.nameで指定された名前になるが、左上のセル位置も併せて指定可能<br>
    *   ex. 'testsheet'!B2<br>
    *   なおセル位置は左上の単一セル指定のみ有効、他は有っても無視(ex.B2:C5ならC5は無視)
    * 
    * 1. オブジェクトの配列(this.data.length > 0) ※択一
    *    1. headerの作成
    *    1. rawの作成
    * 1. シートイメージ(this.raw.length > 0) ※択一
    *    1. headerの作成 : 1行目をヘッダと看做す(添字:0)
    *    1. dataの作成
    * 1. シートの作成(this.type=='data' && this.name!=null)
    *    1. 既存のシートがないか確認(存在すればエラー)
    *    1. this.rawをシートに出力
    * 
    * @param {void}
    * @returns {void}
    */
  prepData(){
    const v = {whois:this.className+'.prepData',rv:null,step:0,colNo:1};
    console.log(`${v.whois} start.`);
    try {
  
      if( this.data.length > 0 ){
        v.step = 1; // オブジェクトの配列でデータを渡された場合
        v.step = 1.1; // headerの作成
        if( this.header.length === 0 ){
          v.members = new Set();
          this.data.forEach(x => {
            Object.keys(x).forEach(y => v.members.add(y));
          });
          this.header = Array.from(v.members);
        }
        v.step = 1.2; // rawの作成
        this.raw[0] = this.header;
        for( v.r=0 ; v.r<this.data.length ; v.r++ ){
          this.raw[v.r+1] = [];
          for( v.c=0 ; v.c<this.header.length ; v.c++ ){
            v.val = this.data[v.r][this.header[v.c]];
            this.raw[v.r+1][v.c] = v.val ? v.val : '';
          }
        }
      } else {
        v.step = 2; // シートイメージでデータを渡された場合
        v.step = 2.1; // headerの作成
        this.header = JSON.parse(JSON.stringify(this.raw[0]));
        for( v.c=0 ; v.c<this.header.length ; v.c++ ){
          if( this.header[v.c] === '' ) this.header[v.c] = 'Col' + v.colNo++;
        }
        v.step = 2.2; // dataの作成
        if( this.data.length === 0 ){
          for( v.r=1 ; v.r<this.raw.length ; v.r++ ){
            v.o = {};
            for( v.c=0 ; v.c<this.header.length ; v.c++ ){
              v.o[this.header[v.c]] = this.raw[v.r][v.c];
            }
            this.data.push(v.o);
          }
        }
      }
  
      v.step = 3; // raw/data以外のメンバの設定
      this.bottom = this.top + this.raw.length - 1;
      this.right = this.left + this.raw[0].length - 1;
  
      v.step = 4; // シートの作成
      v.ass = SpreadsheetApp.getActiveSpreadsheet();
      if( this.type==='data' && this.name!=='' && v.ass.getSheetByName(this.name)===null ){
        this.sheet = v.ass.insertSheet();
        this.sheet.setName(this.name);
        this.sheet.getRange(this.top,this.left,this.raw.length,this.raw[0].length)
        .setValues(this.raw);
      }
  
      v.step = 5; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

    /** SingleTableクラスメンバの値をダンプ表示 */
    dump(av=null){
      const v = {whois:this.className+'.dump',rv:null,step:0,colNo:1};
      console.log(`${v.whois} start.`);
      try {
  
        v.step = 1; // メンバの値
        v.msg = `member's value ----------`
        + `\nclassName=${this.className}, name=${this.name}, type=${this.type}`
        + `\ntop=${this.top}, left=${this.left}, bottom=${this.bottom}, right=${this.right}`
        + `\nheader=${JSON.stringify(this.header)}`
        + `\ndata=${JSON.stringify(this.data)}`
        + `\nraw=${JSON.stringify(this.raw)}`;
  
        v.step = 2; // vの値
        if( av !== null ){
          v.msg += `\n\nvariable's value ----------`
          + `\ntop=${av.top}, left=${av.left}, bottom=${av.bottom}, right=${av.right}`;
        }
  
        v.step = 3; // ダンプ
        console.log(v.msg);
  
        v.step = 2; // 終了処理
        console.log(`${v.whois} normal end.`);
        return v.rv;
  
      } catch(e) {
        e.message = `\n${v.whois} abnormal end at step.${v.step}\n${e.message}`;
        console.error(`${e.message}\nv=${JSON.stringify(v)}`);
        return e;
      }
    }

  /** 条件に該当するレコード(オブジェクト)を抽出
    * @param {Object} [opt={}] - オプション
    * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
    * @param {string[][]} [opt.orderBy=[]] - 並べ替えのキーと昇順/降順指定
    *  [['key1'(,'desc')],['key2'(,'desc')],...]
    * @returns {Array.Object.<string, any>|Error}
    * 
    * @example
    * 
    * ```
    * v.table = new SingleTable('test',{top:3});
    * v.r = v.table.select({
    *   where: x => x.B3 && 1<x.B3 && x.B3<9,
    *   orderBy:[['B3'],['C3','desc']]
    * });
    * console.log(JSON.stringify(v.r));
    * // -> [
    *   {"B3":4,"C3":3,"Col1":"hoge","E3":"fuga"},
    *   {"B3":5,"C3":6,"Col1":7,"E3":8},
    *   {"B3":5,"C3":4}
    * ]
    * ```
    * 
    * 「Col1に'g'が含まれる」という場合
    * ```
    * where: x => {return x.Col1 && String(x.Col1).indexOf('g') > -1}
    * ```
    */
  select(opt={}){
    const v = {whois:this.className+'.select',rv:[],step:0};
    console.log(`${v.whois} start.`); //\nopt.where=${opt.where.toString()}\nopt.orderBy=${JSON.stringify(opt.orderBy)}`);
    try {
  
      v.step = 1; // 既定値の設定
      if( opt.hasOwnProperty('where') ){
        if( typeof opt.where === 'string' )
          opt.where = new Function(opt.where);
      } else {
        opt.where = () => true;
      }
      if( !opt.hasOwnProperty('orderBy') )
        opt.orderBy = [];
  
      v.step = 2; // 対象となるレコードを抽出
      for( v.i=0 ; v.i<this.data.length ; v.i++ ){
        if( Object.keys(this.data[v.i]).length > 0 // 空Objではない
            && opt.where(this.data[v.i]) ) // 対象判定結果がtrue
          v.rv.push(this.data[v.i]);
      }
  
      v.step = 3; // 並べ替え
      v.rv.sort((a,b) => {
        for( v.i=0 ; v.i<opt.orderBy.length ; v.i++ ){
          [v.p, v.q] = opt.orderBy[v.i][1]
          && opt.orderBy[v.i][1].toLowerCase() === 'desc' ? [1,-1] : [-1,1];
          if( a[opt.orderBy[v.i][0]] < b[opt.orderBy[v.i][0]] ) return v.p;
          if( a[opt.orderBy[v.i][0]] > b[opt.orderBy[v.i][0]] ) return v.q;
        }
        return 0;
      });
  
      v.step = 4; // 終了処理
      console.log(`${v.whois} normal end. num=${v.rv.length}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\nopt=${JSON.stringify(opt)}`;  // 引数
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  
  }

  /**
    * @typedef {Object} UpdateResult
    * @prop {number} row - 変更対象の行番号(自然数)
    * @prop {Object} old - 変更前の行オブジェクト
    * @prop {Object} new - 変更後の行オブジェクト
    * @prop {Object.<string, any[]>} diff - {変更した項目名：[変更前,変更後]}形式のオブジェクト
    * @prop {number} row - 更新対象行番号(自然数)
    * @prop {number} left - 更新対象領域左端列番号(自然数)
    * @prop {number} right - 更新対象領域右端列番号(自然数)
    */
  /** 条件に該当するレコード(オブジェクト)を更新
    * 
    * @param {Object|Function} set - セットする{項目名:値}、または行オブジェクトを引数にセットする{項目名:値}を返す関数
    * @param {Object} [opt={}] - オプション
    * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
    * @returns {UpdateResult[]|Error} 更新結果を格納した配列
    * 
    * @example
    * 
    * ```
    * v.table = new SingleTable('test!B3:E');
    * // B3欄が4のレコードについて、Col1に'hoge'・E3に'fuga'をセットする
    * v.table.update({Col1:'hoge',E3:'fuga'},{where:o=>o.B3&&o.B3==4});  // 戻り値 -> [{
    *   "old":{"B3":4,"C3":3,"Col1":"a","E3":"b"},
    *   "new":{"B3":4,"C3":3,"Col1":"hoge","E3":"fuga"},
    *   "diff":{"Col1":["a","hoge"],"E3":["b","fuga"]},
    *   "row":7,
    *   "left":4,"right":5
    * }]
    * ```
    * 
    * 更新対象データを直接指定、また同一行の他の項目から導出してセットすることも可能。
    * 
    * ```
    * // E3欄に'a'をセットする
    * v.table.update(
    *   {E3:'a'},  // 更新対象データを直接指定
    *   {where:o=>o.B3==5&&o.C3==4}
    * )
    * // Col1欄にB3+C3の値をセットする
    * v.table.update(
    *   o=>{return {Col1:(o.B3||0)+(o.C3||0)}},  // 他項目から導出
    *   {where:o=>o.B3==5&&o.C3==4}
    * )
    * ```
    */
  update(set,opt={}){
    const v = {whois:this.className+'.update',step:0,rv:[],
      // top〜rightは更新する場合の対象領域(行/列番号。自然数)
      top:Infinity, left:Infinity, bottom:-Infinity, right:-Infinity};
    console.log(`${v.whois} start.\nset=${typeof set === 'function' ? set.toString() : stringify(set)}\nopt=${stringify(opt)}`);
    try {
  
      v.step = 1; // 既定値の設定
      if( !opt.hasOwnProperty('where') )
        opt.where = () => true;
  
      v.step = 2; // 1行ずつ差分をチェックしながら処理結果を保存
      for( v.i=0 ; v.i<this.data.length ; v.i++ ){
        if( Object.keys(this.data[v.i]).length > 0 && opt.where(this.data[v.i]) ){
          v.step = 2.1; // 「空Objではない かつ 対象判定結果がtrue」なら更新対象
          v.r = { // {UpdateResult} - 更新結果オブジェクトを作成
            old: Object.assign({},this.data[v.i]),
            new: this.data[v.i],
            diff: {},
            row: this.top + 1 + v.i,
            left: Infinity, right: -Infinity,  // 変更があった列番号の範囲
          };
  
          v.step = 2.2; // 更新後の値をv.diffに格納
          v.diff = whichType(set) === 'Object' ? set : set(this.data[v.i]);
  
          v.step = 2.3; // 差分が存在する項目の洗い出し
          v.exist = false;  // 差分が存在したらtrue
          this.header.forEach(x => {
            v.step = 2.4; // 項目毎に差分判定
            if( v.diff.hasOwnProperty(x) && v.r.old[x] !== v.diff[x] ){
              v.step = 2.5; // 更新後に値が変わる場合
              v.exist = true; // 値が変わった旨、フラグを立てる
              v.r.new[x] = v.diff[x];
              v.r.diff[x] = [v.r.old[x]||'', v.r.new[x]];
              v.col = this.left + this.header.findIndex(i=>i==x); // 変更があった列番号
              // 一行内で、更新があった範囲(左端列・右端列)の値を書き換え
              v.r.left = v.r.left > v.col ? v.col : v.r.left;
              v.r.right = v.r.right < v.col ? v.col : v.r.right;
            }
          });
  
          v.step = 3; // いずれかの項目で更新後に値が変わった場合
          if( v.exist ){
            v.step = 3.1; // 更新対象領域を書き換え
            v.top = v.top > v.r.row ? v.r.row : v.top;
            v.bottom = v.bottom < v.r.row ? v.r.row : v.bottom;
            v.left = v.left > v.r.left ? v.r.left : v.left;
            v.right = v.right < v.r.right ? v.r.right : v.right;
  
            v.step = 3.2; // this.raw上のデータを更新
            this.raw[v.r.row-this.top] = (o=>{
              const rv = [];
              this.header.forEach(x => rv.push(o[x]||''));
              return rv;
            })(v.r.new);
  
            v.step = 3.3; // ログ(戻り値)に追加
            v.rv.push(v.r);
          }
        }
      }
  
      v.step = 4; // 更新が有ったら、シート上の更新対象領域をthis.rawで書き換え
      if( v.rv.length > 0 ){
        v.step = 4.1; // 更新対象領域のみthis.rawから矩形に切り出し
        v.data = (()=>{
          let rv = [];
          this.raw.slice(v.top-this.top,v.bottom-this.top+1).forEach(l => {
            rv.push(l.slice(v.left-this.left,v.right-this.left+1));
          });
          return rv;
        })();
        v.step = 4.2; // データ渡しかつシート作成指示無しを除き、シートを更新
        if( this.sheet !== null ){
          this.sheet.getRange(
            v.top,
            v.left,
            v.bottom-v.top+1,
            v.right-v.left+1
          ).setValues(v.data);
        }
      }
  
      v.step = 5; // 終了処理
      console.log(`${v.whois} normal end. num=${v.rv.length}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`
      console.error(`${e.message}\nv=${JSON.stringify(v)}`,set,opt);
      return e;
    }
  }

  /** レコード(オブジェクト)を追加
    * 
    * - 複数行の一括追加も可
    * 
    * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
    * @returns {number|Error} 追加した行数
    * 
    * @example
    * 
    * ```
    * v.table = new SingleTable('test',{top:3});
    * v.table.insert({B3:3,E3:1});
    *   // -> 一行追加
    * v.table.insert([{B3:2,E3:2},{C3:1,Col1:'hoge'}]);
    *   // -> 複数行追加
    * ```
    */
  insert(records=[]){
    const v = {whois:this.className+'.insert',step:0,rv:[],
      r:[],left:Infinity,right:-Infinity};
    console.log(`${v.whois} start.\nrecords=${JSON.stringify(records)}`);
    try {
  
      v.step = 1; // 引数がオブジェクトなら配列に変換
      if( !Array.isArray(records) ) records = [records];
      // 追加対象が0件なら処理終了
      if( records.length === 0 ) return 0;
  
      for( v.i=0 ; v.i<records.length ; v.i++ ){
        v.step = 2; // 挿入するレコード(オブジェクト)を配列化してthis.rawに追加
        v.arr = [];
        for( v.j=0 ; v.j<this.header.length ; v.j++ ){
          v.step = 3; // 空欄なら空文字列をセット
          v.cVal = records[v.i][this.header[v.j]] || '';
  
          if( v.cVal !== '' ){
            v.step = 4; // 追加する範囲を見直し
            v.left = v.left > v.j ? v.j : v.left;
            v.right = v.right < v.j ? v.j : v.right;
          }
  
          v.step = 5; // 一行分のデータ(配列)に項目の値を追加
          v.arr.push(v.cVal);
        }
        v.step = 6; // 一行分のデータをthis.raw/dataに追加
        this.raw.push(v.arr);
        this.data.push(records[v.i]);
        v.rv.push(v.arr);
      }
  
      v.step = 7; // 更新範囲(矩形)のみv.rv -> v.rにコピー
      v.rv.forEach(x => v.r.push(x.slice(v.left,v.right+1)));
  
      v.step = 8; // データ渡しかつシート作成指示無しを除き、シートに追加
      if( this.sheet !== null ){
        this.sheet.getRange(
          this.bottom+1,
          this.left+v.left,
          v.r.length,
          v.r[0].length
        ).setValues(v.r);
        this.bottom += v.r.length;
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end. num=${v.rv.length}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\nrecords=${JSON.stringify(records)}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

  /** 条件に該当するレコード(オブジェクト)を削除
    * @param {Object} [opt={}] - オプション
    * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
    * @returns {Object|Error} 削除されたthis.data行のオブジェクト
    * 
    * @example
    * 
    * ```
    * v.table = new SingleTable('test',{top:3});
    * v.table.delete({where:o=>o.Col1&&o.Col1==7});
    *   // -> Col1==7の行を削除。判定用変数(Col1)の存否、要確認
    * v.table.delete({where:o=>o.val&&o.val==5});
    *   // -> val==5の行を全て削除。
    * ```
    */
  /* 将来的に対応を検討する項目
    - 引数をwhereのみとし、Object->Functionに変更
    - "top 3"等、先頭・末尾n行の削除
  */
  delete(opt={}){
    const v = {whois:this.className+'.delete',step:0,rv:[]};
    console.log(`${v.whois} start.\nopt.where=${opt.where.toString()}`);
    try {
  
      v.step = 1; // 既定値の設定
      if( !opt.hasOwnProperty('where') )
        opt.where = () => true;
  
      v.step = 2; // 下の行から判定し、削除による行ズレの影響を回避
      for( v.i=this.data.length-1 ; v.i>=0 ; v.i-- ){
        v.step = 3; // 削除対象(空Objではない and 対象判定結果がtrue)
        if( Object.keys(this.data[v.i]).length === 0
          || !opt.where(this.data[v.i]) ) continue;
        v.step = 4; // this.dataからの削除
        v.rv.push(this.data.splice(v.i,1)[0]);
        v.step = 5; // this.rawからの削除
        this.raw.splice(v.i,1)[0];
        v.step = 6; // (シートが存在すれば)シートからの削除
        if( this.sheet === null ) continue;
        v.rowNum = this.top + v.i + 1;
        // 1シート複数テーブルの場合を考慮し、headerの列範囲のみ削除して上にシフト
        this.sheet.getRange(v.rowNum,this.left,1,this.right-this.left+1)
        .deleteCells(SpreadsheetApp.Dimension.ROWS);
      }
  
      v.step = 7; // 終了処理
      console.log(`${v.whois} normal end. num=${v.rv.length}`);
      return v.rv;
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\nopt=${JSON.stringify(opt)}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

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

- rev.1.2.1 : 2024/08/06
  - update().optにkey,valueを追加し、where(関数)ではできない「クライアント側から呼び出して処理」を可能に
- rev.1.2.0 : 2024/02/17
  - 元データとしてシート以外にオブジェクトの配列に対応
  - ライブラリ関数を使用、不要なメンバを削除(clog, deepcopy, convertNotation)
- rev.1.1.0 : 2024/01/05 ファイル構成の変更
- rev.1.0.1 : 2023/12/08 引数のシート名について、シート名文字列に加え範囲指定文字列でも指定可能に変更
- rev.1.0.0 : 2023/11/29
