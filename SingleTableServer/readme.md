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

<p class="title">function SingleTableServer</p>

[JSDoc](#JSDoc) | [動作イメージ](#OperationImage) | [source](#source) | [改版履歴](#history)

<a name="JSDoc"></a>

# JSDoc

<a name="SingleTableServer"></a>

## SingleTableServer(name, func, ...arg)
SingleTableClientの指示を受け、サーバ側(GAS)の単一スプレッドシートのCRUDを行う

- 機能的にはSingleTableの拡張だが、クラスではなく関数として定義することでSingleTableインスタンスを処理
- 「更新対象が不存在なら追加」等、select/update/insert/delete以外の操作はSingleTableClient側で実装すること

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 参照先シート名またはA1形式の範囲指定文字列 |
| func | <code>string</code> | 実行する機能。select/update/insert/delete |
| ...arg | <code>Object</code> | 機能を実行するに当たり必要なデータ |



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
/** SingleTableClientの指示を受け、サーバ側(GAS)の単一スプレッドシートのCRUDを行う
 * 
 * - 機能的にはSingleTableの拡張だが、クラスではなく関数として定義することでSingleTableインスタンスを処理
 * - 「更新対象が不存在なら追加」等、select/update/insert/delete以外の操作はSingleTableClient側で実装すること
 * 
 * @param {string} name - 参照先シート名またはA1形式の範囲指定文字列
 * @param {string} func - 実行する機能。select/update/insert/delete
 * @param {Object} arg  - 機能を実行するに当たり必要なデータ
 */
function SingleTableServer(name,func, ...arg){
  const v = {whois:'SingleTableServer',rv:null,step:0};
  console.log(`${v.whois} start. arguments.length=${arguments.length}`);
  try {

    v.step = 1; // SingleTableオブジェクトの作成
    v.table = new SingleTable(name);
    if( v.table instanceof Error ) throw v.sheet;

    v.step = 2; // 指定機能の実行
    switch( func ){
      case 'select': v.rv = v.table.select(...arg); break;
      case 'update': v.rv = v.table.update(...arg); break;
      case 'insert': v.rv = v.table.insert(...arg); break;
      case 'delete': v.rv = v.table.delete(...arg); break;
      default:
        throw new Error('Error: Invalid function');
    }
    if( v.rv instanceof Error ) throw v.rv;

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nname=${name}, func=${func}`
    + `\narg=${JSON.stringify(arg)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e.message;
  }
}

```

</details>

<details><summary>test.js</summary>

```
function SingleTableServerDeleteTest(){
  const v = {table:'test!J1:N',func:'delete'};
  [
    {label:'単一',arg:{where:x => x.id === 11}},
    {label:'複数(2件)',arg:{where:x => x.pId === 6}},
  ].forEach(x => {
    v.r = SingleTableServer(v.table,v.func,x.arg);
    console.log(`${x.label} : ${JSON.stringify(v.r)}`);
  });
}

function SingleTableServerSelectTest(){
  const v = {table:'test!J1:N',func:'select'};
  [
    {label:'単一',opt:{where:x => x.id === 11}},
    {label:'複数(2件)',opt:{where:x => x.pId === 6}},
    {label:'複数で降順',opt:{where:x => x.id < 6,orderBy:[['date','desc']]}},
  ].forEach(x => {
    v.r = SingleTableServer(v.table,v.func,x.opt);
    console.log(`${x.label} : ${JSON.stringify(v.r)}`);
  });
}

function SingleTableServerUpdateTest(){
  const v = {table:'test!J1:N',func:'update'};
  [
    {label:'単一',set:{date:new Date()},opt:{where:x => x.id === 11}},
    {label:'複数(2件)',set:x => {return {desc:'hoge'+x.id}},opt:{where:x => x.pId === 6}},
  ].forEach(x => {
    v.r = SingleTableServer(v.table,v.func,x.set,x.opt);
    console.log(`${x.label} : ${JSON.stringify(v.r)}`);
  });
}

function SingleTableServerInsertTest(){
  const v = {table:'test!J1:N',func:'insert'};
  [
    {label:'単一',arg:{date:new Date()}},
    {label:'複数(2件)',arg:[
      {date:new Date(),desc:'fuga'},{id:12,column:'hoge'}]},
  ].forEach(x => {
    v.r = SingleTableServer(v.table,v.func,x.arg);
    console.log(`${x.label} : ${JSON.stringify(v.r)}`);
  });
}

```

</details>

<a name="history"></a>

# 改版履歴

- rev.1.0.0 : 2024/02/17 初版
