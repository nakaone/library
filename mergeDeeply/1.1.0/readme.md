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

<p class="title">function mergeDeeply</p>

[JSDoc](#JSDoc) | [動作イメージ](#OperationImage) | [source](#source) | [改版履歴](#history)

<a name="JSDoc"></a>

# JSDoc

<a name="mergeDeeply"></a>

## mergeDeeply(pri, sub, opt) ⇒ <code>any</code> \| <code>Error</code>
渡された変数内のオブジェクト・配列を再帰的にマージ
- pri,subともデータ型は不問。次項のデシジョンテーブルに基づき、結果を返す

**Kind**: global function  
**Returns**: <code>any</code> \| <code>Error</code> - #### デシジョンテーブル

| 優先(pri) | 劣後(sub) | 結果 | 備考 |
| :--: | :--: | :--: | :-- |
|  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
|  A  |  B  |  A  | |
|  A  | [B] |  A  | |
|  A  | {B} |  A  | |
| [A] |  -  | [A] | |
| [A] |  B  | [A] | |
| [A] | [B] | [X] | 配列はopt.arrayによる |
| [A] | {B} | [A] | |
| {A} |  -  | {A} | |
| {A} |  B  | {A} | |
| {A} | [B] | {A} | |
| {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
|  -  |  -  |  -  | |
|  -  |  B  |  B  | |
|  -  | [B] | [B] | |
|  -  | {B} | {B} | |

#### opt.array : pri,sub双方配列の場合の処理方法を指定

例 pri:[1,2,{x:'a'},{a:10,b:20}], sub:[1,3,{x:'a'},{a:30,c:40}]

- pri(priority): 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
- add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
- set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,3,{x:'a'},{x:'a'},{a:10,b:20},{a:30,c:40}]
  ※`{x:'a'}`は別オブジェクトなので、重複排除されない事に注意。関数、Date等のオブジェクトも同様。
- str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
  ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
- cmp(未実装): pri[n]とsub[n]を比較(comparison)。原則pri優先だが、例外として両方がObj or Arrならマージ<br>
  ⇒ [1,2,{x:'a'},{a:10,b:20,c:40}]  

| Param | Type | Description |
| --- | --- | --- |
| pri | <code>any</code> | 優先される変数(priority) |
| sub | <code>any</code> | 劣後する変数(subordinary) |
| opt | <code>Object</code> | オプション |



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
/** 渡された変数内のオブジェクト・配列を再帰的にマージ
 * - pri,subともデータ型は不問。次項のデシジョンテーブルに基づき、結果を返す
 *
 * @param {any} pri - 優先される変数(priority)
 * @param {any} sub - 劣後する変数(subordinary)
 * @param {Object} opt - オプション
 * @returns {any|Error}
 *
 * #### デシジョンテーブル
 *
 * | 優先(pri) | 劣後(sub) | 結果 | 備考 |
 * | :--: | :--: | :--: | :-- |
 * |  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
 * |  A  |  B  |  A  | |
 * |  A  | [B] |  A  | |
 * |  A  | {B} |  A  | |
 * | [A] |  -  | [A] | |
 * | [A] |  B  | [A] | |
 * | [A] | [B] | [X] | 配列はopt.arrayによる |
 * | [A] | {B} | [A] | |
 * | {A} |  -  | {A} | |
 * | {A} |  B  | {A} | |
 * | {A} | [B] | {A} | |
 * | {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
 * |  -  |  -  |  -  | |
 * |  -  |  B  |  B  | |
 * |  -  | [B] | [B] | |
 * |  -  | {B} | {B} | |
 *
 * #### opt.array : pri,sub双方配列の場合の処理方法を指定
 *
 * 例 pri:[1,2,{x:'a'},{a:10,b:20}], sub:[1,3,{x:'a'},{a:30,c:40}]
 *
 * - pri(priority): 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
 * - add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
 * - set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,3,{x:'a'},{x:'a'},{a:10,b:20},{a:30,c:40}]
 *   ※`{x:'a'}`は別オブジェクトなので、重複排除されない事に注意。関数、Date等のオブジェクトも同様。
 * - str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
 *   ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
 * - cmp(未実装): pri[n]とsub[n]を比較(comparison)。原則pri優先だが、例外として両方がObj or Arrならマージ<br>
 *   ⇒ [1,2,{x:'a'},{a:10,b:20,c:40}]
 */
function mergeDeeply(pri,sub,opt={}){
  const v = {whois:'mergeDeeply',rv:null,step:0,
    isObj: arg => arg && String(Object.prototype.toString.call(arg).slice(8,-1)) === 'Object',
    isArr: arg => arg && Array.isArray(arg),
  };
  //console.log(`${v.whois} start.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`);
  try {

    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('array') ) opt.array = 'set';

    if( v.isObj(pri) && v.isObj(sub) ){
      v.step = 2; // sub,pri共にハッシュの場合
      v.rv = {};
      v.step = 2.1; // 優先・劣後Obj両方のハッシュキー(文字列)を、重複しない形でv.keysに保存
      v.keys = new Set([...Object.keys(pri),...Object.keys(sub)]);
      for( v.key of v.keys ){
        if( pri.hasOwnProperty(v.key) && sub.hasOwnProperty(v.key) ){
          v.step = 2.2; // pri,sub両方がキーを持つ
          if( v.isObj(pri[v.key]) && v.isObj(sub[v.key]) || v.isArr(pri[v.key]) && v.isArr(sub[v.key]) ){
            v.step = 2.21; // 配列またはオブジェクトの場合は再帰呼出
            v.rv[v.key] = mergeDeeply(pri[v.key],sub[v.key],opt);
          } else {
            v.step = 2.22; // 配列でもオブジェクトでもない場合は優先変数の値をセット
            v.rv[v.key] = pri[v.key];
          }
        } else {
          v.step = 2.3; // pri,subいずれか片方しかキーを持っていない
          v.rv[v.key] = pri.hasOwnProperty(v.key) ? pri[v.key] : sub[v.key];
        }
      }
    } else if( v.isArr(pri) && v.isArr(sub) ){
      v.step = '3 '+opt.array; // sub,pri共に配列の場合
      switch( opt.array ){
        case 'pri':
          // pri: 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
          v.rv = pri;
          break;
        case 'add':
          // add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
          v.rv = [...pri, ...sub];
          break;
        case 'str':
          // str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
          // ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
          v.rv = [];
          pri.forEach(x => v.rv.push(x));
          sub.forEach(s => {
            v.flag = false;
            pri.forEach(p => v.flag = v.flag || isEqual(s,p));
            if( v.flag === false ) v.rv.push(s);
          });
          break;
        default:
          // set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,{x:'a'},{a:10,b:20},3,{x:'a'},{a:30,c:40}]
          v.rv = [...new Set([...pri,...sub])];
      }
    } else {
      v.step = 4; // subとpriのデータ型が異なる ⇒ priを優先してセット
      v.rv = whichType(pri,'Undefined') ? sub : pri;
      //console.log(`l.228 pri=${stringify(pri)}, sub=${stringify(sub)} -> rv=${stringify(v.rv)}`)
    }
    v.step = 5;
    //console.log(`${v.whois} normal end.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`+`\nv.rv=${stringify(v.rv)}`)
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\npri=${JSON.stringify(pri)}`
    + `\nsub=${JSON.stringify(sub)}`
    + `\nopt=${JSON.stringify(opt)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
```

</details>

<details><summary>test.js</summary>

```
function mergeDeeplyTest(){
  const v = {whois:'mergeDeeplyTest'};

  v.arg = {pri:{...v.proto},sub:{...v.proto},opt:undefined};
  const data = [
    {
      pri:{
        p1:'abc',p2:123,p3:BigInt(9007199254740991),p4:true,
      },
      sub:{
        // プリミティブ型(文字列, 数値, 長整数, 論理値, undefined, シンボル, null)
        p1:'def',p2:456,p3:BigInt(1234567890123456),p4:false,
        p5:undefined,p6:Symbol('a'),p7:null,
        // 関数、既存オブジェクト
        t1:()=>true,t2:new Date(),
        // オブジェクト
        o1:{a:10,b:20},
        o2:{a:10,b:{a:1,b:'abc'},c:[true,null,undefined,()=>false]},
      },
      opt:undefined
    },
    {
      pri:{a:['a',1,BigInt(123456),true,Symbol.for('a'),null,()=>true,new Date('1965/9/5'),{a:10},[1,2]]},
      sub:{a:['a',1,BigInt(123456),true,Symbol.for('a'),null,()=>true,new Date('1965/9/5'),{a:10},[1,2]]},
    },
    // 配列のマージパターンテスト
    {pri:[1,2,{x:'a'},{a:10,b:20}],sub:[1,3,{x:'a'},{a:30,c:40}],opt:{array:'pri'}},
    {pri:[1,2,{x:'a'},{a:10,b:20}],sub:[1,3,{x:'a'},{a:30,c:40}],opt:{array:'add'}},
    {pri:[1,2,{x:'a'},{a:10,b:20}],sub:[1,3,{x:'a'},{a:30,c:40}],opt:{array:'set'}},
    {pri:[1,2,{x:'a'},{a:10,b:20}],sub:[1,3,{x:'a'},{a:30,c:40}],opt:{array:'str'}},
  ];

  for( v.i=2 ; v.i<data.length ; v.i++ ){
    v.r = mergeDeeply(data[v.i].pri,data[v.i].sub,data[v.i].opt);
    console.log(`mergeDeeplyTest result.`
      + `\npri=${stringify(data[v.i].pri)}`
      + `\nsub=${stringify(data[v.i].sub)}`
      + `\nopt=${stringify(data[v.i].opt)}`
      + `\n⇒ ${stringify(v.r)}`
    );
  }
}

```

</details>

<a name="history"></a>

# 改版履歴

- rev.1.1.0 : 2024/02/17
  - deepcopyと統合
  - 配列の統合方法を整理、オプションとして指定可能に変更
- rev.1.0.0 : 2023/10/21 初版
