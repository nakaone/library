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

<p class="title">function stringify</p>

[JSDoc](#JSDoc) | [動作イメージ](#OperationImage) | [source](#source) | [改版履歴](#history)

<a name="JSDoc"></a>

# JSDoc

<a name="stringify"></a>

## stringify(variable) ⇒ <code>string</code>
関数他を含め、変数を文字列化
- JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
- 関数はtoString()で文字列化
- シンボルは`Symbol(xxx)`という文字列とする
- undefinedは'undefined'(文字列)とする

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| variable | <code>Object</code> | 文字列化対象変数 |



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
/** 関数他を含め、変数を文字列化
 * - JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
 * - 関数はtoString()で文字列化
 * - シンボルは`Symbol(xxx)`という文字列とする
 * - undefinedは'undefined'(文字列)とする
 * 
 * @param {Object} variable - 文字列化対象変数
 * @returns {string}
 */
function stringify(variable){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {};
    switch( whichType(arg) ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = arg.toString(); break;
      case 'BigInt':
        w.rv = parseInt(arg); break;
      case 'Undefined':
        w.rv = 'undefined'; break;
      case 'Object':
        w.rv = {};
        for( w.i in arg ){
          // 自分自身(stringify)は出力対象外
          if( w.i === 'stringify' ) continue;
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      case 'Array':
        w.rv = [];
        for( w.i=0 ; w.i<arg.length ; w.i++ ){
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      default:
        w.rv = arg;
    }
    return w.rv;
  };
  //console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return JSON.stringify(conv(variable));

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}

```

</details>

<details><summary>test.js</summary>

```
function stringifyTest(){
  const v = {};
  const data = {
    // プリミティブ型(文字列, 数値, 長整数, 論理値, undefined, シンボル, null)
    p1:'abc',p2:123,p3:BigInt(9007199254740991),p4:true,
    p5:undefined,p6:Symbol('a'),p7:null,
    // 関数、既存オブジェクト
    t1:()=>true,t2:new Date(),
    // オブジェクト、配列
    o1:{a:10,b:20},
    o2:{a:10,b:{a:1,b:'abc'},c:[true,null,undefined,()=>false]},
    a1:[1,2,3],
    a2:['abc',false,{a:'a',b:{c:10}}],
  }
  console.log(`stringify: ${stringify(data)}`);
}

```

</details>

<a name="history"></a>

# 改版履歴

- rev.1.0.0 : 2024/02/17 初版
