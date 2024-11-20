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

<p class="title">function isEqual</p>

[JSDoc](#JSDoc) | [動作イメージ](#OperationImage) | [source](#source) | [改版履歴](#history)

<a name="JSDoc"></a>

# JSDoc

<a name="isEqual"></a>

## isEqual(v1, v2) ⇒ <code>boolean</code> \| <code>Error</code>
二つの引数が同値か判断する
- [等価性の比較と同一性](https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- データ型が一致していないと、内容的に一致していても同値では無いと判断(Ex.Number 1 != BigInt 1)。
- 配列は、①長さが一致、かつ②順番に比較した個々の値が同値の場合のみ同値と看做す

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| v1 | <code>any</code> | 変数1 |
| v2 | <code>any</code> | 変数2 |



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
/** 二つの引数が同値か判断する
 * - [等価性の比較と同一性](https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness)
 * - データ型が一致していないと、内容的に一致していても同値では無いと判断(Ex.Number 1 != BigInt 1)。
 * - 配列は、①長さが一致、かつ②順番に比較した個々の値が同値の場合のみ同値と看做す
 *
 * @param {any} v1 - 変数1
 * @param {any} v2 - 変数2
 * @returns {boolean|Error}
 */
function isEqual(v1,v2){
  const v = {whois:'isEqual',rv:true,step:0};
  //console.log(`${v.whois} start.`);
  try {

    v.step = 1; // データ型が異なる ⇒ 同値では無い
    v.type = whichType(v1);
    if( v.type !== whichType(v2) )
      return false;

    v.step = 2;
    switch( v.type ){
      case 'Date':
        v.step = 2.1;
        v.rv = v1.getTime() === v2.getTime();
        break;
      case 'Function': case 'Arrow':
        v.step = 2.2;
        v.rv = v1.toString() === v2.toString();
        break;
      case 'Undefined': case 'Null': case 'NaN':
        v.step = 2.3;
        v.rv = true;
        break;
      case 'Object':
        v.step = 2.4;
        new Set([...Object.keys(v1), ...Object.keys(v2)]).forEach(key => {
          v.rv = v.rv && isEqual(v1[key],v2[key]);
        });
        break;
      case 'Array':
        v.step = 2.5;
        if( v1.length !== v2.length ){
          v.rv = false;
        } else {
          for( v.i=0 ; v.i<v1.length ; v.i++ ){
            v.rv = v.rv && isEqual(v1[v.i],v2[v.i])
          }
        }
        break;
      default:
        v.step = 2.6;
        v.rv = v1 === v2;
    }

    v.step = 3; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nv1=${v1}\nv2=${v2}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
```

</details>

<details><summary>test.js</summary>

```
function isEqualTest(){
  const v = {};
  const data = [
    {
      // プリミティブ型(文字列, 数値, 長整数, 論理値, undefined, シンボル, null)
      p1:'abc',p2:123,p3:BigInt(9007199254740991),p4:true,
      p5:undefined,p6:Symbol('a'),p7:null,
      // 関数、既存オブジェクト
      t1:()=>true,t2:new Date(),
      // オブジェクト
      o1:{a:10,b:20},
      o2:{a:10,b:{a:1,b:'abc'},c:[true,null,undefined,()=>false]},
    },
    [{c:true,a:10,d:()=>true,b:20},{d:()=>true,b:20,a:10,c:true}],  // true
    [{c:true,a:10,d:()=>true,b:20},{d:()=>false,b:20,a:10,c:true}], // false
    [{a:new Date('1965/9/5')},{a:new Date('1965/9/5')}],  // true
    [{a:[1,2,[3,4,{a:5},()=>true,[new Date('1965/9/5')]]]},
    {a:[1,2,[3,4,{a:5},()=>true,[new Date('1965/9/5')]]]}],  // true
  ]
  //for( v.i in data[0] ) console.log(`${v.i}=${stringify(data[0][v.i])} -> ${isEqual(data[0][v.i],data[0][v.i])}`);
  for( v.i=1 ; v.i<data.length ; v.i++ )
    console.log(`${JSON.stringify(data[v.i])} -> ${isEqual(data[v.i][0],data[v.i][1])}`);
}

```

</details>

<a name="history"></a>

# 改版履歴

- rev.1.0.0 : 2024/02/17 初版
