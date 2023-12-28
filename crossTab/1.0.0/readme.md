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

<p class="header">function crossTab</p>

[JSDoc](#JSDoc) | [動作イメージ](#OperationImage) | [source](#source) | [改版履歴](#history)

<a name="JSDoc"></a>

# JSDoc

<a name="crossTab"></a>

## crossTab(data, yCols, xCol, val) ⇒ <code>Array.&lt;Array.&lt;any&gt;&gt;</code> \| <code>Error</code>
単純テーブルをクロス集計に変換する

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;Object&gt;</code> | 集計の基となるデータ |
| yCols | <code>Array.&lt;string&gt;</code> | 縦軸となる項目名の配列 |
| xCol | <code>string</code> | 横軸となる項目名 |
| val | <code>string</code> \| <code>Array.&lt;string&gt;</code> | 値としてほしい項目名の配列。 |



<a name="OperationImage"></a>

# 動作イメージ

## サンプルデータ

項目名・表示順を縦軸に、年度を横軸にしてクロス集計を実行。

年度 | 項目名 | 表示順 | 本体
:-- | :-- | --: | --:
2011 | 流動資産 | 2 | 11,000
2011 | 現金 | 3 | 1,000
2011 | 普通預金 | 4 | 10,000
2012 | 流動資産 | 2 | 6,000
2012 | 現金 | 3 | -2,000
2012 | 普通預金 | 4 | 8,000

<div class="triDown"></div>

項目名 | 表示順 | 2011 | 2012
:-- | --: | --: | --:
流動資産 | 2 | 11,000 | 6,000
現金 | 3 | 1,000 | -2,000
普通預金 | 4 | 10,000 | 8,000

---







年度 | 項目名 | 表示順 | 本体 | 税額 | 合計
:-- | :-- | --: | --: | --: | --:
2011 | 流動資産 | 2 | 11,000 | 0 | 11,000
2011 | 現金 | 3 | 1,000 | 0 | 1,000
2011 | 普通預金 | 4 | 10,000 | 0 | 10,000
2012 | 流動資産 | 2 | 6,000 | 0 | 6,000
2012 | 現金 | 3 | -2,000 | 0 | -2,000
2012 | 普通預金 | 4 | 8,000 | 0 | 8,000

```
arg = [
  {"年度":2011,"項目名":"流動資産","表示順":2,"本体":11000,"税額":0,"合計":11000},
  {"年度":2011,"項目名":"現金","表示順":3,"本体":1000,"税額":0,"合計":1000},
  {"年度":2011,"項目名":"普通預金","表示順":4,"本体":10000,"税額":0,"合計":10000},
  {"年度":2012,"項目名":"流動資産","表示順":2,"本体":6000,"税額":0,"合計":6000},
  {"年度":2012,"項目名":"現金","表示順":3,"本体":-2000,"税額":0,"合計":-2000},
  {"年度":2012,"項目名":"普通預金","表示順":4,"本体":8000,"税額":0,"合計":8000},
]
```

<div class="triDown"></div>

```
v.r=[
  {
    "項目名":"流動資産",
    "年度":{
      "2011":{"本体":11000,"税額":0,"合計":11000},
      "2012":{"本体":6000,"税額":0,"合計":6000}
    }
  },
  {
    "項目名":"現金",
    "年度":{
      "2011":{"本体":1000,"税額":0,"合計":1000},
      "2012":{"本体":-2000,"税額":0,"合計":-2000}
    }
  },
  {
    "項目名":"普通預金",
    "年度":{
      "2011":{"本体":10000,"税額":0,"合計":10000},
      "2012":{"本体":8000,"税額":0,"合計":8000}
    }
  }
]
```

## 動作結果

### パターン①

<div class="triDown"></div>

<a name="source"></a>

# source

<details><summary>core.js</summary>

```
/** 単純テーブルをクロス集計に変換する
 * @param {Object[]} data - 集計の基となるデータ
 * @param {string[]} yCols - 縦軸となる項目名の配列
 * @param {string} xCol - 横軸となる項目名
 * @param {string|string[]} val - 値としてほしい項目名の配列。
 * @returns {any[][]|Error}
 */
function crossTab(data,yCols,xCol,val){
  const v = {whois:'crossTab',rv:[],step:0};
  //console.log(`${v.whois} start.`);
  try {

    for( v.i=0 ; v.i<data.length ; v.i++ ){
      v.step = 1.1; // 縦軸となる項目名を持つ行が登録済か検索
      v.obj = v.rv.find(x => {
        let rv = true;
        yCols.forEach(y => {if(x[y] !== data[v.i][y]) rv=false});
        return rv;
      });

      if( !v.obj ){
        v.step = 1.2; // 未登録の場合は新規登録
        v.obj = {};
        // 縦軸となる項目名
        yCols.forEach(y => v.obj[y] = data[v.i][y]);
        // 横軸となる項目名をオブジェクトとして登録
        v.obj[xCol] = {};
        v.rv.push(v.obj);
      }

      v.step = 2; // 登録する値を作成
      if( typeof val === 'string' ){
        v.step = 2.1; // 項目が一つだけの場合
        v.obj[xCol][data[v.i][xCol]] = data[v.i][val];
      } else {
        v.step = 2.2; // 複数項目の場合
        v.val = {};
        val.forEach(x => v.val[x] = data[v.i][x] || 0)
        v.obj[xCol][data[v.i][xCol]] = v.val;
      }
    }

    v.step = 3; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\ndata=${JSON.stringify(data.slice(0,5))}`
    + `\nyCols=${JSON.stringify(yCols)}`
    + `\nxCol=${xCol}`
    + `\nval=${JSON.stringify(val)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
```

</details>

<details><summary>test.js</summary>

```
function crossTabTest(){
  const v = {};
  const tData = [
    {"年度":2011,"項目名":"流動資産","表示順":2,"本体":11000,"税額":0,"合計":11000},
    {"年度":2011,"項目名":"現金","表示順":3,"本体":1000,"税額":0,"合計":1000},
    {"年度":2011,"項目名":"普通預金","表示順":4,"本体":10000,"税額":0,"合計":10000},
    {"年度":2012,"項目名":"流動資産","表示順":2,"本体":6000,"税額":0,"合計":6000},
    {"年度":2012,"項目名":"現金","表示順":3,"本体":-2000,"税額":0,"合計":-2000},
    {"年度":2012,"項目名":"普通預金","表示順":4,"本体":8000,"税額":0,"合計":8000},
  ];
  v.r = crossTab(tData,['項目名'],'年度',['本体','税額','合計']);
  console.log(`v.r=${JSON.stringify(v.r)}`)
}
```

</details>

<a name="history"></a>

# 改版履歴

- rev.1.0.0 : 2023/12/27 初版
