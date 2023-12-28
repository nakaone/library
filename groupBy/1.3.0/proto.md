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

<p class="header">function groupBy</p>

[JSDoc](#JSDoc) | [動作イメージ](#OperationImage) | [集計用関数に関する補足](#func) | [source](#source) | [改版履歴](#history)

<a name="JSDoc"></a>

# JSDoc

__JSDoc

<a name="OperationImage"></a>

# 動作イメージ

## サンプル

表 | 科目 | 本体 | 合計
:-- | :-- | --: | --:
BS | 現金 | 50000000 | 50000000
BS | 資本金 | 50000000 | 50000000
CF | 資本金 | 50000000 | 50000000
PL | 旅費交通費 | 340 | 340
BS | 現金 | -340 | -340

<div class="triDown"></div>

```
tData = [
  {"表":"BS","科目":"現金","本体":50000000,"合計":50000000},
  {"表":"BS","科目":"資本金","本体":50000000,"合計":50000000},
  {"表":"CF","科目":"資本金","本体":50000000,"合計":50000000},
  {"表":"PL","科目":"旅費交通費","本体":340,"合計":340},
  {"表":"BS","科目":"現金","本体":-340,"合計":-340}
]
```
## パターン別動作結果

### オプション無指定(中間分類行も集計も無し)

```
v.r = groupBy(tData,['表','科目'])
```

<div class="triDown"></div>

メンバarrに集計対象項目の一覧を出力

```
{
  "tree":{
    "BS":{
      "level":0,
      "cols":{"表":"BS"},
      "raw":[
        {"表":"BS","科目":"現金","本体":50000000,"合計":50000000},
        {"表":"BS","科目":"資本金","本体":50000000,"合計":50000000},
        {"表":"BS","科目":"現金","本体":-340,"合計":-340}
      ],
      "children":{
        "現金":{
          "level":1,
          "cols":{"表":"BS","科目":"現金"},
          "raw":[
            {"表":"BS","科目":"現金","本体":50000000,"合計":50000000},
            {"表":"BS","科目":"現金","本体":-340,"合計":-340}
          ],
          "children":{},
          "value":{"表":"BS","科目":"現金"}
        },
        "資本金":{
          "level":1,
          "cols":{"表":"BS","科目":"資本金"},
          "raw":[
            {"表":"BS","科目":"資本金","本体":50000000,"合計":50000000}
          ],
          "children":{},
          "value":{"表":"BS","科目":"資本金"}
        }
      },
      "value":{"表":"BS"}
    },
    "CF":{
      "level":0,
      "cols":{"表":"CF"},
      "raw":[
        {"表":"CF","科目":"資本金","本体":50000000,"合計":50000000}
      ],
      "children":{
        "資本金":{
          "level":1,
          "cols":{"表":"CF","科目":"資本金"},
          "raw":[
            {"表":"CF","科目":"資本金","本体":50000000,"合計":50000000}
          ],
          "children":{},
          "value":{"表":"CF","科目":"資本金"}
        }
      },
      "value":{"表":"CF"}
    },
    "PL":{
      "level":0,
      "cols":{"表":"PL"},
      "raw":[
        {"表":"PL","科目":"旅費交通費","本体":340,"合計":340}
      ],
      "children":{
        "旅費交通費":{
          "level":1,
          "cols":{"表":"PL","科目":"旅費交通費"},
          "raw":[
            {"表":"PL","科目":"旅費交通費","本体":340,"合計":340}
          ],
          "children":{},
          "value":{"表":"PL","科目":"旅費交通費"}
        }
      },
      "value":{"表":"PL"}
    }
  },
  "arr":[
    {"表":"BS","科目":"現金"},
    {"表":"BS","科目":"資本金"},
    {"表":"CF","科目":"資本金"},
    {"表":"PL","科目":"旅費交通費"}
  ],
  "opt":{"empty":null,"func":null,"classify":false,"tree":false,"hasLevel":false}
}
```

### 中間分類行を含める(集計は無し)

```
v.r = groupBy(tData,['表','科目'],{classify:true})
```

<div class="triDown"></div>

オプション無指定からの変更点：中間分類行が追加される

以降、差分のみ記載。

```
{
  "arr":[
    {"表":"BS"},  // 中間分類行として追加された行
    {"表":"BS","科目":"現金"},
    {"表":"BS","科目":"資本金"},
    {"表":"CF"},  // 中間分類行として追加された行
    {"表":"CF","科目":"資本金"},
    {"表":"PL"},  // 中間分類行として追加された行
    {"表":"PL","科目":"旅費交通費"}
  ],
```

### 中間分類行なしで集計

```
v.fc = arr=>{
  let rv = {'本体':0,'合計':0};
  for( let i=0 ; i<arr.length ; i++ ){
    rv['本体'] += arr[i]['本体'];
    rv['合計'] += arr[i]['合計'];
  }
  return rv;
};
v.r = groupBy(tData,['表','科目'],{func:v.fc})
```

<div class="triDown"></div>

オプション無指定からの変更点：①集計結果(value)が追加される、②arrにも集計結果が追加される

```
{
  "tree":{
    "BS":{
      "children":{
        "現金":{
          "value":{"本体":49999660,"合計":49999660}
        },
        "資本金":{
          "value":{"本体":50000000,"合計":50000000}
        }
      },
      "value":{"本体":99999660,"合計":99999660}
    },
    "CF":{
      "children":{
        "資本金":{
          "value":{"本体":50000000,"合計":50000000}
        }
      },
      "value":{"本体":50000000,"合計":50000000}
    },
    "PL":{
      "children":{
        "旅費交通費":{
          "value":{"本体":340,"合計":340}
        }
      },
      "value":{"本体":340,"合計":340}
    }
  },
  "arr":[
    {"表":"BS","科目":"現金","本体":49999660,"合計":49999660},
    {"表":"BS","科目":"資本金","本体":50000000,"合計":50000000},
    {"表":"CF","科目":"資本金","本体":50000000,"合計":50000000},
    {"表":"PL","科目":"旅費交通費","本体":340,"合計":340}
  ],
}
```


### 中間分類行ありで集計

```
v.fc = arr=>{
  let rv = {'本体':0,'合計':0};
  for( let i=0 ; i<arr.length ; i++ ){
    rv['本体'] += arr[i]['本体'];
    rv['合計'] += arr[i]['合計'];
  }
  return rv;
};
v.r = groupBy(tData,['表','科目'],{classify:true,func:v.fc})
v.r.arr.forEach(x => x.level = x[v.r.level]); // levelはシンボルなので個別対応
```

<div class="triDown"></div>

中間分類行なしで集計からの変更点：①中間分類行が出力される、②有意な「level」が追加される

```
{
  "arr":[
    {"表":"BS",                  "本体":99999660,"合計":99999660,"level":0},  // 中間分類行
    {"表":"BS","科目":"現金",      "本体":49999660,"合計":49999660,"level":1},
    {"表":"BS","科目":"資本金",    "本体":50000000,"合計":50000000,"level":1},
    {"表":"CF",                  "本体":50000000,"合計":50000000,"level":0},  // 中間分類行
    {"表":"CF","科目":"資本金",    "本体":50000000,"合計":50000000,"level":1},
    {"表":"PL",                  "本体":340,"合計":340,"level":0},  // 中間分類行
    {"表":"PL","科目":"旅費交通費","本体":340,"合計":340,"level":1}
  ],
}
```

<a name="func"></a>

# 集計用関数に関する補足

集計用関数は「グループ化された結果の一行々々について行われる処理」を示す。

備考：要加筆。「こういうことをやりたい場合、呼出元でこういう関数を定義してこういうデータを渡す」という感じでまとめ直すこと。

以下はcalcBSでのサンプル。

## 集計用関数に渡される「グループ化された結果の一行分のオブジェクト」の形式

- obj {Object}
  - level {number} 分類行を出力する場合、そのレベル(最高位0、引数colsの添字)
  - cols {Object.<string,any>} 分類項目名：その値
  - raw {Object[]} 該当する行オブジェクトの配列
  - children {Object} 下位分類のオブジェクト

```
obj = {
  "level":4,
  "cols":{"年度":2011,"部門":"CO","L1":1,"L2":1,"L3":-1,"表示順":3},
  "raw":[
    {"表":"BS","科目":"現金","部門":"CO","年度":2011,"本体":50000000,..,"LV":0},
    {"表":"BS","科目":"現金","部門":"CO","年度":2011,"本体":-340,..,"LV":0},
    {"表":"BS","科目":"現金","部門":"CO","年度":2011,"本体":-460,..,"LV":0},
    ...
  ],
  "children":{
    .... // 子要素を再帰的に保持
  }
}
```

## 呼出元での処理定義

- 第一引数(obj)は「グループ化された結果の一行分のオブジェクト」、第二引数(ac)は集計用関数内で使用する勘定科目マスタオブジェクト。
- try 〜 catch文を使用
- 出力しないレコードはnullを返すようにする(`if( obj.level < 2 ) return null`)

```
func = (obj,ac)=>{ // 集計用関数の定義
  const v = {whois:'calcBS.func',rv:null,step:0};
  //console.log(`${v.whois} start.\nobj=${JSON.stringify(obj)}\nac=${JSON.stringify(ac.slice(0,3))}`)
  try {
    v.step = 1; // 年度のみ、または年度×部門のみのレコードは出力しない
    if( obj.level < 2 ) return null;
    obj.LV = obj.level === 5 ? 0 : obj.level - 1;
    obj.L1 = obj.raw[0].L1;
    obj.L2 = 0 < obj.LV && obj.LV < 2 ? -1 : obj.raw[0].L2;
    obj.L3 = 0 < obj.LV && obj.LV < 3 ? -1 : obj.raw[0].L3;
    obj.SQ = 0 < obj.LV               ? -1 : obj.raw[0].SQ;

    v.step = 2; // BS用勘定科目マスタの検索
    v.a = ac.find(x => obj.L1===x.L1 && obj.L2===x.L2 && obj.L3===x.L3 && obj.LV===x.LV && obj.SQ===x.SQ);
    //console.log(`l.37 obj=${JSON.stringify(obj)}\nv.a=${JSON.stringify(v.a)}`)

    if( v.a ){
      v.step = 3.1; // 当該レコードの勘定科目がBS用勘定科目マスタに存在した場合
      v.rv = {
        '表'    : 'BS',
        '項目名' : v.a.label,
        '表示順' : v.a['表示順'],
        // LVは、勘定科目は0、集計項目は1〜3を設定
        LV      : obj.level === 5 ? 0 : obj.level - 1,
        '本体':0,'税額':0,'合計':0
      };
      v.step = 3.2; // 金額を合計
      obj.raw.forEach(a => ['本体','税額','合計'].forEach(x => v.rv[x] += a[x]));
    }

    v.step = 4; // 終了処理
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\raw=${JSON.stringify(obj.raw)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
},
```

## 呼出処理

```
v.step = 4; // BS大福帳を勘定科目(表示順)×部門×年度で集計
v.r = groupBy(v.bs01,v.cols,{func:v.func,data:v.ac.arr,classify:true});
if( v.r instanceof Error ) throw v.r;
console.log(`l.144 v.r.arr=${JSON.stringify(v.r.arr.slice(0,10))}`)
```


<a name="source"></a>

# source

<details><summary>core.js</summary>

```
__source
```

</details>

<details><summary>test.js</summary>

```
__test
```

</details>

<a name="history"></a>

# 改版履歴

- rev.1.0.0 : 2023/12/06 初版
- rev.1.1.0 : 2023/12/19 オプション指定を追加
- rev.1.2.0 : 2023/12/25 戻り値の内容を見直し
- rev.1.3.0 : 2023/12/27 集計用関数関係を見直し
  - 集計用関数もtry〜catch文使用を前提に変更(結果判定instanceofを追加)
  - 集計用関数内でtarget.level他を参照可能にするため、集計用関数に渡すレコードオブジェクトをtarget.arrからtarget全体に変更
  - 集計用関数の結果がnullのレコードはrv.arrに追加しない
  - 集計用関数内で参照するマスタ等、groupByの呼出元からopt.dataとして集計用関数に渡せるよう変更
  - opt.levelの指定内容をsymbolからstringに変更、Symbol.for(opt.level)として共有を容易に
