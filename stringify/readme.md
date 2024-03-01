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

## stringify(variable, opt) ⇒ <code>string</code>
関数他を含め、変数を文字列化
- JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
- 関数はtoString()で文字列化
- シンボルは`Symbol(xxx)`という文字列とする
- undefinedは'undefined'(文字列)とする

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| variable | <code>Object</code> |  | 文字列化対象変数 |
| opt | <code>Object</code> \| <code>boolean</code> |  | booleanの場合、opt.addTypeの値とする |
| opt.addType | <code>boolean</code> | <code>false</code> | 文字列化の際、元のデータ型を追記 |

**Example**  
```
console.log(`l.424 v.td=${stringify(v.td,true)}`)
⇒ l.424 v.td={
  "children":[{
    "attr":{"class":"[String]th"}, // opt.addType=trueなら[データ型名]がつく
    "text":"[String]タグ"
  },{
    "attr":{"class":"[String]td"},
    "text":"[String]#md"
  }],
  "style":{"gridColumn":"[String]1/13"},
  "attr":{"name":"[String]tag"}
}
```


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
 * @param {Object|boolean} opt - booleanの場合、opt.addTypeの値とする
 * @param {boolean} opt.addType=false - 文字列化の際、元のデータ型を追記
 * @returns {string}
 * @example
 *
 * ```
 * console.log(`l.424 v.td=${stringify(v.td,true)}`)
 * ⇒ l.424 v.td={
 *   "children":[{
 *     "attr":{"class":"[String]th"}, // opt.addType=trueなら[データ型名]がつく
 *     "text":"[String]タグ"
 *   },{
 *     "attr":{"class":"[String]td"},
 *     "text":"[String]#md"
 *   }],
 *   "style":{"gridColumn":"[String]1/13"},
 *   "attr":{"name":"[String]tag"}
 * }
 * ```
 */
function stringify(variable,opt={addType:false}){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {type:whichType(arg)};
    w.pre = opt.addType ? `[${w.type}]` : '';
    switch( w.type ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = w.pre + arg.toString(); break;
      case 'BigInt':
        w.rv = w.pre + parseInt(arg); break;
      case 'Undefined':
        w.rv = w.pre + 'undefined'; break;
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
        w.rv = w.pre + arg;
    }
    return w.rv;
  };
  //console.log(`${v.whois} start.\nvariable=${variable}\nopt=${JSON.stringify(opt)}`);
  try {

    v.step = 1; // 事前準備
    if( typeof opt === 'boolean' ) opt={addType:opt};

    v.step = 2; // 終了処理
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

- rev.1.1.1 : 2024/03/01 opt.addType指定をオブジェクトの他、真偽値でも指定可能に変更
- rev.1.1.0 : 2024/02/21 元のデータ型を追記するオプション opt.addType を追加
- rev.1.0.0 : 2024/02/17 初版
