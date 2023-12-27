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

動作イメージ | [JSDoc](#JSDoc) | [source](#source) | [改版履歴](#history)

オブジェクトの配列から指定項目でグルーピング、指定関数で処理した結果を返す。

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

<a name="JSDoc"></a>

# JSDoc

<a name="groupBy"></a>

## groupBy(data, cols, [opt]) ⇒ <code>Object</code> \| <code>Error</code>
オブジェクトの配列から指定項目でグルーピング、指定関数で処理した結果を返す

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>Error</code> - - 集計用関数に関する補足
  - 未指定の場合、rv.arrには分類項目(引数colsに指定した項目)のみセットして返す
  - rv.arr/treeとも分類項目はシステム側で自動的に追加される
    - 集計用関数の戻り値には、原則として分類項目を含めない
    - 例外的に指定した場合、戻り値では集計用関数で設定した値が優先される
- 戻り値の構造
  - opt {Object} 実際に適用されたオプションの値
  - tree {Object} 分析結果のオブジェクト
    - 分類項目の値(ex.BS)
      - level {number} 分類行を出力する場合、そのレベル(最高位0、引数colsの添字)
      - cols {Object.<string,any>} 分類項目名：その値
      - raw {Object[]} 該当する行オブジェクトの配列
      - children {Object} 下位分類のオブジェクト
      - value {Object.<string,any>} 集計関数が指定された場合、その結果
  - arr {Object[]} シートイメージ
  - level {Symbol} arr内オブジェクトのlevelメンバの名称を指定するシンボル  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Array.Object.&lt;string, any&gt;</code> |  | オブジェクトの配列。SingleTable.dataを想定 |
| cols | <code>Array.&lt;string&gt;</code> |  | 分類項目(グルーピングする項目の配列) |
| [opt] | <code>Object</code> | <code>{}</code> | オプション |
| [opt.empty] | <code>any</code> | <code></code> | 分類項目の値が空欄(ex.科目が空欄)の場合に設定する値 |
| [opt.func] | <code>function</code> | <code></code> | 集計用の関数。詳細は補足参照 |
| [opt.classify] | <code>boolean</code> | <code>false</code> | trueなら結果の配列(v.rv.arr)に分類行を含める |
| [opt.level] | <code>Symbol</code> | <code>Symbol(&#x27;level&#x27;)</code> | arr内オブジェクトのlevelメンバの名称を指定するシンボル。 |



<a name="source"></a>

# source

<details><summary>core.js</summary>

```
/** オブジェクトの配列から指定項目でグルーピング、指定関数で処理した結果を返す
 * @param {Array.Object.<string, any>} data - オブジェクトの配列。SingleTable.dataを想定
 * @param {string[]} cols - 分類項目(グルーピングする項目の配列)
 * @param {Object} [opt={}] - オプション
 * @param {any} [opt.empty=null] - 分類項目の値が空欄(ex.科目が空欄)の場合に設定する値
 * @param {Function} [opt.func=null] - 集計用の関数。詳細は補足参照
 * @param {boolean} [opt.classify=false] - trueなら結果の配列(v.rv.arr)に分類行を含める
 * @param {Symbol} [opt.level=Symbol('level')] - arr内オブジェクトのlevelメンバの名称を指定するシンボル。
 * @return {Object|Error} 
 * 
 * - 集計用関数に関する補足
 *   - 未指定の場合、rv.arrには分類項目(引数colsに指定した項目)のみセットして返す
 *   - rv.arr/treeとも分類項目はシステム側で自動的に追加される
 *     - 集計用関数の戻り値には、原則として分類項目を含めない
 *     - 例外的に指定した場合、戻り値では集計用関数で設定した値が優先される
 * - 戻り値の構造
 *   - opt {Object} 実際に適用されたオプションの値
 *   - tree {Object} 分析結果のオブジェクト
 *     - 分類項目の値(ex.BS)
 *       - level {number} 分類行を出力する場合、そのレベル(最高位0、引数colsの添字)
 *       - cols {Object.<string,any>} 分類項目名：その値
 *       - raw {Object[]} 該当する行オブジェクトの配列
 *       - children {Object} 下位分類のオブジェクト
 *       - value {Object.<string,any>} 集計関数が指定された場合、その結果
 *   - arr {Object[]} シートイメージ
 *   - level {Symbol} arr内オブジェクトのlevelメンバの名称を指定するシンボル
 */
function groupBy(data,cols,opt={}){
  const v = {whois:'groupBy',step:0,rv:{tree:{},arr:[]},
    target:[],  // 集計処理を行うオブジェクトのリスト
    empty:null, // 空欄の場合に設定する値
    makeSheet:(obj) => {  // ツリー構造のグルーピング結果を配列に変換
      let rv = [];
      // 分類行出力指定あり、または出力指定なしだが分類行ではない場合
      if( opt.classify || !opt.classify && obj.level === (cols.length-1)){
        const o = {...obj.cols, ...obj.value};
        if( Object.keys(o).length > 0 ){
          o[v.rv.level] = obj.level; // Symbolなので要別途追加
          rv.push(o);
        }
      }
      // 子要素があれば再帰呼出
      if( obj.hasOwnProperty('children') ){
        for( let key in obj.children ){
          rv = [...rv, ...v.makeSheet(obj.children[key])];
        }
      }
      return rv;
    },
  };
  try {

    v.step = 1; // オプションの既定値を設定
    opt.empty = opt.empty || null;
    opt.func = opt.func || null;
    opt.classify = opt.classify || false;
    opt.tree = opt.tree || false;
    opt.hasLevel = opt.level ? true : false;  // opt.levelが存在したか
    v.rv.level = opt.level || Symbol('level');
    v.rv.opt = opt;
    console.log(`l.289 opt=${JSON.stringify(opt)}`);

    v.step = 2; // グルーピング
    for( v.i=0 ; v.i<data.length ; v.i++ ){
      v.line = data[v.i]; // 処理対象とする一行分のデータ
      v.model = v.rv.tree; // データを格納するオブジェクト
      v.cols = {};
      for( v.j=0 ; v.j<cols.length ; v.j++ ){
        v.col = cols[v.j];  // グルーピングする項目名
        if( !v.line[v.col] ) v.line[v.col] = opt.empty; // 値未定の場合
        v.cols[cols[v.j]] = v.line[v.col];  // グルーピング項目のオブジェクト
        if( !v.model.hasOwnProperty(v.line[v.col])){
          // 格納するオブジェクトが未定義なら追加定義＋計算対象リスト(v.target)に追加
          v.model[v.line[v.col]]
          = {level:v.j,cols:{...v.cols},raw:[],children:{}};
          v.target.push(v.model[v.line[v.col]]);
        }
        // rawに単一オブジェクトを追加
        v.model[v.line[v.col]].raw.push(v.line);
        // [重要]格納先を子要素に変更
        v.model = v.model[v.line[v.col]].children;
      }
    }

    v.step = 3; // 指定関数で処理結果を計算
    if( typeof opt.func === 'function' ){
      for( v.i=0 ; v.i<v.target.length ; v.i++ ){
        v.target[v.i].value = opt.func(v.target[v.i].raw);
      }
    }

    v.step = 4; // グルーピング結果をシートに変換
    v.rv.arr = v.makeSheet({children:v.rv.tree});

    v.step = 5; // 終了処理
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\ncols=${JSON.stringify(cols)}`  // 引数
    + `\ndata.length=${data.length}, opt=${JSON.stringify(opt)}`
    + `\ndata(Max.10)=${JSON.stringify(data.slice(0,10))}`
    + `\nopt=${JSON.stringify(opt)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
```

</details>

<details><summary>test.js</summary>

```
function groupByTest(){
  const v = {};
  const tData = [[
    {"表":"BS","科目":"現金","本体":50000000,"合計":50000000},
    {"表":"BS","科目":"資本金","本体":50000000,"合計":50000000},
    {"表":"CF","科目":"資本金","本体":50000000,"合計":50000000},
    {"表":"PL","科目":"旅費交通費","本体":340,"合計":340},
    {"表":"BS","科目":"現金","本体":-340,"合計":-340}
  ],['表','科目']];
  v.lv = Symbol('level');
  v.fc = arr=>{
    let rv = {'本体':0,'合計':0};
    for( let i=0 ; i<arr.length ; i++ ){
      rv['本体'] += arr[i]['本体'];
      rv['合計'] += arr[i]['合計'];
    }
    return rv;
  };
  // オプション無指定(中間分類行も集計も無し)
  //v.r = groupBy(...tData);
  // 中間分類行を含める(集計は無し)
  //v.r = groupBy(...tData,{classify:true});
  // 中間分類行なしで集計
  //v.r = groupBy(...tData,{func:v.fc});
  // 中間分類行ありで集計
  v.r = groupBy(...tData,{classify:true,func:v.fc});
  v.r.arr.forEach(x => x.level = x[v.r.level]); // levelはシンボルなので個別対応
  console.log(`groupByTest result:\n${JSON.stringify(v.r)}`);

}
```

</details>

<a name="history"></a>

# 改版履歴

- rev.1.0.0 : 2023/12/06 初版
- rev.1.1.0 : 2023/12/19 オプション指定を追加
- rev.1.2.0 : 2023/12/25 戻り値の内容を見直し
- rev.1.3.0 : 2023/12/27
  - 指定関数の結果がnullのレコードはrv.arrに追加しない
  - opt.levelの指定内容をsymbolからstringに変更、Symbol.for(opt.level)として共有を容易に
  - 指定関数もtry〜catch文使用を前提に、instanceofを追加
  - 指定関数に渡すレコードオブジェクトをtarget.arrからtarget全体に変更(指定関数内でtarget.level他を参照可能に)