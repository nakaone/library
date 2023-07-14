## Functions

<dl>
<dt><a href="#Date_calc">Date_calc(arg)</a> ⇒ <code>string</code></dt>
<dd><p>指定日に年/月/日/時/分/秒/ミリ秒数を加減した日時を計算する&quot;calc()&quot;メソッドをDate型に追加する。</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#DateCalcArg">DateCalcArg</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="Date_calc"></a>

## Date\_calc(arg) ⇒ <code>string</code>
指定日に年/月/日/時/分/秒/ミリ秒数を加減した日時を計算する"calc()"メソッドをDate型に追加する。

**Kind**: global function  
**Returns**: <code>string</code> - 加減したDateオブジェクト(新規、非破壊)。無効な指定ならNull

arg = string -> "+1M"(1ヶ月後)のように、加減する値＋単位で指定
arg = number[] -> [年,月,日,時,分,秒,ミリ秒]で複数単位での加減を一括指定
arg = DateCalcArg -> 単位を指定した複数単位での加減。例：1時間10分後なら{h:1,m:10}  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>string</code> \| <code>Array.&lt;number&gt;</code> \| [<code>DateCalcArg</code>](#DateCalcArg) | 加減する年/月/日/時/分/秒/ミリ秒数の指定 |

**Example**  
```
base: 2001/01/01 00:00:00.000
"+3y" ⇒ 2004/01/01 00:00:00.000
"2M" ⇒ 2001/03/01 00:00:00.000
"1d" ⇒ 2001/01/02 00:00:00.000
"-1h" ⇒ 2000/12/31 23:00:00.000
"-2m" ⇒ 2000/12/31 23:58:00.000
"-3s" ⇒ 2000/12/31 23:59:57.000
"-4n" ⇒ 2000/12/31 23:59:59.996
[3,2,1,-1,-2,-3,-4] ⇒ 2004/03/01 22:57:56.996
[3,2,1] ⇒ 2004/03/02 00:00:00.000
{"y":3,"M":2,"d":1} ⇒ 2004/03/02 00:00:00.000
```


<details><summary>作成中：日付が存在しない場合の対処案</summary>

- 参考：[CSSで三角形を作ろう！](https://spicaweblog.com/2022/05/triangle/)

# 日付が存在しない場合の対処案

## 問題点と対処案

**問題点**

「2022年12月29日の2ヶ月後(⇒2/29)」「5月31日の1ヶ月前(⇒4/31)」等、日付をそのまま適用すると存在しない日付になる場合、何日にすべきか？

**対処案**

1. 単純に加減算(算出日ベース)
    2022/12/29 + 2M = 2022/14/29 = 2023/02/29 = 2023/03/01
1. 存在しない日は月末日と解釈(月末日ベース)
    2022/12/29 + 2M = 2022/14/29 = 2023/02/29 = 2023/03/00 = 2023/02/28
1. 月末日から逆算(逆算日ベース)
    2022/12/29 = 2023/01/-2 + 2M = 2023/03/-2 = 2023/02/26

**前提、注意事項**

- JavaScriptでの日付は自然数(1〜31)だけでなく、0や負数も受け付ける。
- "0"は前月末日、"-1"は前月末日の前日、以降遡及して考える。
  ```
  new Date(2023,6,0) ⇒ 2023/06/30
  new Date(2023,6,-1) ⇒ 2023/06/29
  new Date(2023,6,-2) ⇒ 2023/06/28
  ```

なおこの問題は「開始月の日数＞終了月の日数」の場合のみ発生する(開始月の全ての日が終了月に存在場合は発生しない)。

<details><summary>計算手順</summary>

1. Dateオブジェクトに単純に指定期間を加減算した日付を作成
    - ex. 2023/01/29 + 1M = 2023/02/29(a) ⇒ 2023/03/01(b)
1. 単純に加減算した月(a)と、算出された月(b)を比較、一致した場合は終了
1. a≠bの場合、対処案により以下のように分岐させる
    - ①算出日 ⇒ そのまま2023/03/01
    - ②月末日 ⇒ 有り得ない日付は「翌月0日」と解釈 ⇒ 2023/03/00 ⇒ 2023/02/28
    - ③月末からの逆算日 ⇒ 1月29日は2月-2日なので、+1Mで3月-2日 ⇒ 2023/02/26

</details>

# 引数が日付型

Dateオブジェクトから引数までの期間を返す

```
typedef {object} DateCalc
prop {boolean} sign=true - Dateオブジェクト≦引数ならtrue
prop {number} y=null - 年
prop {number} M=null - 月
prop {number} d=null - 日
prop {number} h=null - 時
prop {number} m=null - 分
prop {number} s=null - 秒
prop {number} n=null - ミリ秒
```

## 開始(S)≦終了(E)

注：以降、以下の変数を使用する。

| 変数名 | 意味 | 備考 |
| :-- | :-- | :-- |
| S | 開始日 | 算出の基点となる日付 |
| E | 終了日 | 算出の終点となる日付 |
| Sy | 開始年 | 開始日の年 |
| Ey | 終了年 | 終了日の年 |
| Sm | 開始月 |
| Em | 終了月 |
| Sd | 開始日 | 開始日の日付(Start | date) |
| Ed | 終了日 | 終了日の日付(End | date) |
| Sym | 開始年月 | 開始月のシリアル値(serial number of Start Year and Month) |
| Eym | 終了年月 | 終了月のシリアル値(serial number of End Year and Month) |

### 開始(S)≦終了(E) and 開始日(Sd)≦終了日(Ed)

Sd<Ed例：「2022/12/21(Sd=21) -> 2023/02/28(Ed=28)」 ⇒ `{sign:true,M:2,d:8}`

<div class="axis" style="grid-template-columns:1fr 2rem">
  <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
    <div class="col"><div>12/21</div><div>[1M]</div><div>1/20</div></div>
    <div class="col"><div>1/21</div><div>[1M]</div><div>2/20</div></div>
    <div class="col"><div>2/21</div><div>[8D]</div><div>2/28</div></div>
  </div>
  <div class="arrow" style="border-left: 2rem solid #aaa;"></div>
</div>

- 上図は時刻指定無しのサンプル。灰色矢印は「開始日▶️終了日」を示す
- 「1ヶ月後」は翌月同日同時刻

Sd=Ed例：「2022/12/28(Sd=28) -> 2023/02/28(Ed=28)」 ⇒ `{sign:true,M:2,d:1}`

<div class="axis" style="grid-template-columns:1fr 2rem">
  <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
    <div class="col"><div>12/28</div><div>[1M]</div><div>1/27</div></div>
    <div class="col"><div>1/28</div><div>[1M]</div><div>2/27</div></div>
    <div class="col"><div>2/28</div><div>[1D]</div><div>2/28</div></div>
  </div>
  <div class="arrow" style="border-left: 2rem solid #aaa;"></div>
</div>

```
diffM = Eym - Sym = 2
diffD = Ed - (Sd - 1)
```

### 開始(S)≦終了(E) and 開始日(Sd)＞終了日(Ed)

Sd>Ed例：「2022/12/31(Sd=31) -> 2023/02/26(Ed=26)」 ⇒ `{sign:true,M:1,d:27}`

  <div class="axis" style="grid-template-columns:1fr 2rem">
    <div class="cols" style="grid-template-columns:1fr 1fr">
      <div class="col"><div>12/31</div><div>[1M]</div><div>1/30</div></div>
      <div class="col"><div>1/31</div><div>[1+26D]</div><div>2/26</div></div>
    </div>
    <div class="arrow" style="border-left: 2rem solid #aaa;"></div>
  </div>

```
diffM = Eym - Sym - 1
diffD = (Smの日数 - Sd + 1) + Ed
```

## 開始(S)＞終了(E)

### 開始(S)＞終了(E) and 開始日(Sd)＜終了日(Ed)

Sd<Ed例：「2023/02/28(Sd=28) -> 2022/12/30(Ed=30)」

**2/28から逆算する場合** ⇒ `{sign:false,M:1,d:30}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:1fr 2fr">
    <div class="col"><div>12/30</div><div>[2+28D]</div><div>1/28</div></div>
    <div class="col"><div>1/29</div><div>[1M]</div><div>2/28</div></div>
  </div>
</div>

**12/30から算出する場合** ⇒ `{sign:false,M:1,d:30}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:2fr 1fr">
    <div class="col"><div>12/30</div><div>[1M]</div><div>1/29</div></div>
    <div class="col"><div>1/30</div><div>[2+28D]</div><div>2/28</div></div>
  </div>
</div>

```
diffM = Sym - Eym - 1
diffD = ( Emの日数 - Ed + 1 ) + Sd
```

### 開始(S)＞終了(E) and 開始日(Sd)＝終了日(Ed)

Sd=Ed例：「2022/12/28(Sd=28) -> 2023/02/28(Ed=28)」 ⇒ `{sign:false,M:2,d:1}`

**2/28から逆算する場合** ⇒ `{sign:false,M:2,d:1}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:1fr 2fr 2fr">
    <div class="col"><div>12/28</div><div>[1D]</div><div>12/28</div></div>
    <div class="col"><div>12/29</div><div>[1M]</div><div>1/28</div></div>
    <div class="col"><div>1/29</div><div>[1M]</div><div>2/28</div></div>
  </div>
</div>

**12/28から算出する場合** ⇒ `{sign:false,M:2,d:1}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
    <div class="col"><div>12/28</div><div>[1M]</div><div>1/27</div></div>
    <div class="col"><div>1/28</div><div>[1M]</div><div>2/27</div></div>
    <div class="col"><div>2/28</div><div>[1D]</div><div>2/28</div></div>
  </div>
</div>

```
diffM = Sym - Eym
diffD = 1
```

### 開始(S)＞終了(E) and 開始日(Sd)＞終了日(Ed)

Sd=Ed例：「2023/02/28(Sd=28) -> 2022/12/21(Ed=21) -> 」 ⇒ `{sign:false,M:2,d:1}`

**2/28から逆算する場合** ⇒ `{sign:false,M:2,d:8}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:1fr 2fr 2fr">
    <div class="col"><div>12/21</div><div>[8D]</div><div>12/28</div></div>
    <div class="col"><div>12/29</div><div>[1M]</div><div>1/28</div></div>
    <div class="col"><div>1/29</div><div>[1M]</div><div>2/28</div></div>
  </div>
</div>

**12/28から算出する場合** ⇒ `{sign:false,M:2,d:8}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
    <div class="col"><div>12/21</div><div>[1M]</div><div>1/20</div></div>
    <div class="col"><div>1/21</div><div>[1M]</div><div>2/20</div></div>
    <div class="col"><div>2/21</div><div>[8D]</div><div>2/28</div></div>
  </div>
</div>

```
diffM = Sym - Eym
diffD = 1
```

Sd>Ed例：「2023/04/30(Sd=30) -> 2023/02/28(Ed=28) -> 」 ⇒ `{sign:false,M:2,d:1}`

**4/30から逆算する場合** ⇒ `{sign:true,M:2,d:8}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:1fr 2fr 2fr">
    <div class="col"><div>12/21</div><div>[8D]</div><div>12/28</div></div>
    <div class="col"><div>2/31</div><div>[1M]</div><div>3/30</div></div>
    <div class="col"><div>3/31</div><div>[1M]</div><div>4/30</div></div>
  </div>
</div>

**いまここ：2/28から算出する場合** ⇒ `{sign:false,M:2,d:8}`

<div class="axis" style="grid-template-columns:2rem 1fr">
  <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
  <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
    <div class="col"><div>2/28</div><div>[1M]</div><div>3/27</div></div>
    <div class="col"><div>3/28</div><div>[1M]</div><div>4/27</div></div>
    <div class="col"><div>4/28</div><div>[3D]</div><div>4/30</div></div>
  </div>
</div>

開始月の日数>終了月の日数 となるパターンはある？

```
diffM = Sym - Eym
diffD = 1
```

# 引数が非日付型

Dateオブジェクトに指定期間を加減算したDateオブジェクトを返す

# 注意事項

1. 時刻が指定されていない場合、開始日・終了日とも終日範囲内と見做す
    ex. 「2023/01/01 -> 2023/12/31」 ⇒ 2023/01/01 00:00:00 ≦ n ＜ 2023/12/31 24:00:00
    - 「時刻が指定されていない」とは、開始日・終了日とも時刻が00:00:00であることを示す
    - 時刻指定があれば、それに従って計算する(終日範囲内とは見做さない)

1. 「1ヶ月＋1日」後と「1ヶ月後」の「1日後」とは結果が異なる場合がある

# Date.serial: 内部用シリアル月・シリアル日の計算

```
typedef {object} DateSerial
prop {number} month - シリアル月の値
prop {number} date - シリアル日の値
prop {number} fam - シリアル月朔日0:00以降の経過ミリ秒数(fraction after month)
prop {number} fad - シリアル日0:00以降の経過ミリ秒数(fraction after date)

desc 2つの日付の間隔を算出するための一連番号を計算する。シリアル月は`(Date.getFullYear()-1970)×12ヶ月＋Date.getMonth()`、シリアル日は`Math.floor(Date.getTime()÷(24×60×60×1000))`で計算する。

なお内部用を念頭に開発し、かつ互換性確保のロジックが煩雑なため、Excelで使用されるシリアル日との互換性はない。

param {any} [arg=this] - 計算対象となる日付情報(ex."2023/07/02")。Date型に変換できないならエラー。指定無しなら本体
returns {DateSerial} シリアル化された日付情報
```

# Date.numberOfDays: 指定月の日数を取得

```
param {any} [arg=this] - 計算対象となる日付情報(ex."2023/07/02")。Date型に変換できないならエラー。指定無しなら本体
returns {number} 指定月の日数(1〜31)
```

<style type="text/css">
  .axis, .cols, .col {display:grid;}
  .axis {
    width:80%;
    margin: 0.5rem 2rem;
  }
  .cols {
    padding: 0.5rem;
    background-color:#aaa;
  }
  .col {
    padding: 0.1rem;
    border: solid 1px #000;
    background-color:#fff;
    grid-template-columns:repeat(3, 1fr);
  }
  .col div:nth-child(1) {text-align:left;}
  .col div:nth-child(2) {text-align:center;}
  .col div:nth-child(3) {text-align:right;}
  .arrow {
    width:0; height:0;
    border-top: 1.4rem solid transparent;
    border-bottom: 1.4rem solid transparent;
  }
</style>

</details>
<a name="DateCalcArg"></a>

## DateCalcArg : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [y] | <code>number</code> | 年 |
| [M] | <code>number</code> | 月 |
| [d] | <code>number</code> | 日 |
| [h] | <code>number</code> | 時 |
| [m] | <code>number</code> | 分 |
| [s] | <code>number</code> | 秒 |
| [n] | <code>number</code> | ミリ秒 |

