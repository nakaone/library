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

<p class="title">class SingleTableClient</p>

[JSDoc](#JSDoc) | [動作イメージ](#OperationImage) | [source](#source) | [改版履歴](#history)

<a name="JSDoc"></a>

# JSDoc

<a name="SingleTableClient"></a>

## SingleTableClient
**Kind**: global class  

* [SingleTableClient](#SingleTableClient)
    * [new SingleTableClient(arg)](#new_SingleTableClient_new)
    * [.list()](#SingleTableClient+list) ⇒ <code>HTMLObjectElement</code> \| <code>Error</code>

<a name="new_SingleTableClient_new"></a>

### new SingleTableClient(arg)
Google Spreadの単一シート(テーブル)の内容をhtml(SPA)でCRUD
- シートをCRUDする場合はarg.nameを、シート無しの場合はarg.dataを指定

#### クラスのメンバ一覧

- className
- sheetName {string} 操作対象シート名
- parent {HTMLElement} list/detail他の包摂要素
- listDef
- detailDef

#### divの構造

- loading ※不存在ならbody直下に追加
- parent
  - wrapper
    - list
      - header
        - items ※ : 一覧表名称等
        - control : 検索(窓、ボタン、クリア)、新規
      - table ※ : ヘッダと項目の定義
      - footer
        - items ※
        - control
    - detail
      - header
        - items ※ : 詳細画面名称等
        - control : 一覧、編集 or 更新、削除
      - table ※ : 1アイテムを構成する項目の集合
      - footer
        - items　※
        - control

#### itemオブジェクト

```
id:{
  head:{},
  body:{},
}
```

- プロパティ名はname属性にセットされる

```
table:{
  id:{
    view:{
      text: x=>('0000'+x.id).slice(-4),
      style:{
        textAlign:'right',
        gridRow:'1/2',gridColumn:'1/2'
      }
    }
  },
  label:{
    edit:{},
    view:{},
  },
}
```

- view/editが不在の場合、当該モード時には表示しない
- 関数の引数は当該オブジェクト


| Param | Type | Description |
| --- | --- | --- |
| arg | <code>Object</code> | 内容はv.default定義を参照 |

<a name="SingleTableClient+list"></a>

### singleTableClient.list() ⇒ <code>HTMLObjectElement</code> \| <code>Error</code>
一覧の表示

**Kind**: instance method of [<code>SingleTableClient</code>](#SingleTableClient)  
**Returns**: <code>HTMLObjectElement</code> \| <code>Error</code> - 'click':g.tips.detail はNG。無名関数で覆う必要あり
- [JSのクラスメソッドをonclickに設定するときにつまずいたこと]
(https://zenn.dev/ihashiguchi/articles/d1506331996d76)  

| Param | Type |
| --- | --- |
|  | <code>void</code> | 



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
class SingleTableClient {

  /** Google Spreadの単一シート(テーブル)の内容をhtml(SPA)でCRUD
   * - シートをCRUDする場合はarg.nameを、シート無しの場合はarg.dataを指定
   * 
   * #### クラスのメンバ一覧
   * 
   * - className
   * - sheetName {string} 操作対象シート名
   * - parent {HTMLElement} list/detail他の包摂要素
   * - listDef
   * - detailDef
   * 
   * #### divの構造
   * 
   * - loading ※不存在ならbody直下に追加
   * - parent
   *   - wrapper
   *     - list
   *       - header
   *         - items ※ : 一覧表名称等
   *         - control : 検索(窓、ボタン、クリア)、新規
   *       - table ※ : ヘッダと項目の定義
   *       - footer
   *         - items ※
   *         - control
   *     - detail
   *       - header
   *         - items ※ : 詳細画面名称等
   *         - control : 一覧、編集 or 更新、削除
   *       - table ※ : 1アイテムを構成する項目の集合
   *       - footer
   *         - items　※
   *         - control
   * 
   * #### itemオブジェクト
   * 
   * ```
   * id:{
   *   head:{},
   *   body:{},
   * }
   * ```
   * 
   * - プロパティ名はname属性にセットされる
   * 
   * ```
   * table:{
   *   id:{
   *     view:{
   *       text: x=>('0000'+x.id).slice(-4),
   *       style:{
   *         textAlign:'right',
   *         gridRow:'1/2',gridColumn:'1/2'
   *       }
   *     }
   *   },
   *   label:{
   *     edit:{},
   *     view:{},
   *   },
   * }
   * ```
   * 
   * - view/editが不在の場合、当該モード時には表示しない
   * - 関数の引数は当該オブジェクト
   * 
   * @param {Object} arg - 内容はv.default定義を参照
   * @returns {null|Error}
   */
  constructor(arg={}){
  
    const v = {whois:'SingleTableClient.constructor',rv:null,step:0,default:{
      className: 'SingleTableClient',
      sheetName: null, // {string} sheetName - 参照先シート名またはA1形式の範囲指定文字列。sheetDataと択一
      sheetData: [], // {Object[]} sheetData - 処理対象となるオブジェクトの配列。sheetNameと択一
      parent: 'body', // {string|HTMLElement} - 親要素
      div: {display:'grid',gridTemplateColumns:'repeat(12,1fr)',width:'100%',gridColumn:'1/13'},
      wrapper: {
        list:{
          header: { // style = this.def.div
            items: {},
            control: {
              keyword: {tag:'input',attr:{type:'text'},style:{gridColumn:'1/5'}},
              search: {tag:'button',text:'search',style:{gridColumn:'5/7'},event:{click:()=>this.search()}},
              clear: {tag:'button',text:'clear',style:{gridColumn:'7/9'},event:{click:()=>this.clear()}},
              append: {tag:'button',text:'append',style:{gridColumn:'11/13'},event:{click:()=>this.append()}},
            },
          },
          table: {},
          footer: { // style = this.def.div
            items: {},
            control: true, // true:headerと同じ false:非表示 object:個別に定義
          },
        },
        detail:{ // header,table,footerは縦に3つ並べる
          header: { // style = this.def.div
            items: {},
            control: {
              list: {tag:'button',text:'list',style:{gridColumn:'1/4'},event:{click:()=>this.list()}},
              detail: {tag:'button',text:'detail',style:{gridColumn:'4/7'},event:{click:()=>this.detail()}},
              edit: {tag:'button',text:'edit',style:{gridColumn:'4/7'},event:{click:()=>this.edit()}},
              update: {tag:'button',text:'update',style:{gridColumn:'7/10'},event:{click:()=>this.update()}},
              delete: {tag:'button',text:'delete',style:{gridColumn:'10/13'},event:{click:()=>this.delete()}},
            },
          },
          table: {},
          footer: {
            items: {},
            control: true, // true:headerと同じ false:非表示 object:個別に定義
          },
        },
      },
    }};
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
    try {
  
      v.step = 1; // 既定値の設定
      console.log(v.default);
      v.opt = mergeDeeply(arg,v.default);
      console.log(`l.134 v.opt=${stringify(v.opt)}`);
      //for( v.key in v.default ) this[v.key] = v.default[v.key];
  
      v.step = 2; // 適用値の設定
  
      // arg.name/dataが両方とも無指定ならエラー
  
      /*
      v.step = 1; // メンバの初期値設定
      // 親要素の特定。未指定ならbodyを親とする。
      if( opt.parent ){
        this.parent = typeof opt.parent === 'string'
          ? document.querySelector(opt.parent) : opt.parent;
      } else {
        this.parent = document.querySelector('body');
      }
  
      v.step = 2; // 画面の初期化
      this.parent.innerHTML = '';
      if( document.querySelector('.screen[name="loading"]') === null ){
        // body直下に待機画面が無ければ追加
        v.r = createElement({attr:{name:'loading',class:'screen'},text:'loading...'},document.querySelector('body'));
        if( v.r instanceof Error ) throw v.r;
      }
  
      v.r = createElement([
        {attr:{name:'list',class:'screen'},children:[
          {attr:{name:'header'},children:[
            {attr:{name:'title'}},
            {attr:{name:'control'}},
          ]},
          {attr:{class:'table'},style:{gridTemplateColumns: '1fr 11fr'}},
          {attr:{name:'footer'},children:[{attr:{name:'control'}}]},
        ]},
        {attr:{name:'detail',class:'screen'},children:[
          {attr:{name:'header'},children:[
            {attr:{name:'title'}},
            {attr:{name:'control'}},
          ]},
          {attr:{class:'table'},style:{gridTemplateColumns: '1fr 11fr'}},
          {attr:{name:'footer'},children:[{attr:{name:'control'}}]},
        ]},
        {attr:{name:'edit',class:'screen'},children:[
          {attr:{name:'header'},children:[
            {attr:{name:'title'}},
            {attr:{name:'control'}},
          ]},
          {attr:{class:'table'},style:{gridTemplateColumns: '2fr 10fr'}},
          {attr:{name:'footer'},children:[{attr:{name:'control'}}]},
        ]},
      ],this.parent);
      if( v.r instanceof Error ) throw v.r;
  
      ['header','footer'].forEach(x => {
        v.r = createElement([
          {tag:'input',attr:{type:'text'},style:{gridColumn:'1/5'}},
          {tag:'button',text:'search',style:{gridColumn:'5/7'},event:{click:()=>this.search()}},
          {tag:'button',text:'clear',style:{gridColumn:'7/9'},event:{click:()=>this.clear()}},
          {tag:'button',text:'append',style:{gridColumn:'11/13'},event:{click:()=>this.append()}},
        ],this.parent.querySelector(`[name="list"] [name="${x}"] [name="control"]`));
        if( v.r instanceof Error ) throw v.r;
  
        v.r = createElement([
          {tag:'button',text:'list',style:{gridColumn:'1/4'},event:{click:()=>this.list()}},
          {tag:'button',text:'edit',style:{gridColumn:'4/7'},event:{click:()=>this.edit()}},
          {tag:'button',text:'update',style:{gridColumn:'7/10'},event:{click:()=>this.update()}},
          {tag:'button',text:'delete',style:{gridColumn:'10/13'},event:{click:()=>this.delete()}},
        ],this.parent.querySelector(`[name="detail"] [name="${x}"] [name="control"]`));
        if( v.r instanceof Error ) throw v.r;
  
        v.r = createElement([
          {tag:'button',text:'list',style:{gridColumn:'1/4'},event:{click:()=>this.list()}},
          {tag:'button',text:'detail',style:{gridColumn:'4/7'},event:{click:()=>this.detail()}},
          {tag:'button',text:'update',style:{gridColumn:'7/10'},event:{click:()=>this.update()}},
          {tag:'button',text:'delete',style:{gridColumn:'10/13'},event:{click:()=>this.delete()}},
        ],this.parent.querySelector(`[name="edit"] [name="${x}"] [name="control"]`));
        if( v.r instanceof Error ) throw v.r;
      });
      */
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    }
  }

  /** 一覧の表示
   * @param {void}
   * @returns {HTMLObjectElement|Error}
   * 
   * 'click':g.tips.detail はNG。無名関数で覆う必要あり
   * - [JSのクラスメソッドをonclickに設定するときにつまずいたこと]
   * (https://zenn.dev/ihashiguchi/articles/d1506331996d76)
   */
  async list(){
    const v = {whois:this.className+'.list',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1; // 一覧表示対象の取得
      changeScreen('loading');
      this.data = await doGAS('tipsServer','tips','list');
      if( this.data instanceof Error ) throw this.data;
  
      v.step = 2; // 表の作成
      for( v.i=0 ; v.i<this.data.length ; v.i++ ){
        createElement({
          attr:{class:'th num','data-item':JSON.stringify(this.data[v.i])},
          text:this.data[v.i].id,
          event:{'click':()=>this.detail()}
        },this.parent.querySelector('[name="list"] .table'));
        createElement({
          attr:{class:'td','data-item':JSON.stringify(this.data[v.i])},
          text:this.data[v.i].title,
          event:{'click':()=>this.detail()}
        },this.parent.querySelector('[name="list"] .table'));
      }
  
      v.step = 3;
      changeScreen('list');
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

  detail(){
    const v = {whois:this.className+'.detail',rv:null,step:0,
      item:JSON.parse(event.target.getAttribute('data-item'))};
    console.log(`${v.whois} start. item=${JSON.stringify(v.item)}`);
    try {
  
      v.step = 1;
      this.detailArea = this.parent.querySelector('.screen[name="detail"] .table');
      this.detailArea.innerHTML = '';
      //v.r = createElement(,this.detailArea);
  
      v.step = 2;
      for( v.col in v.item){        
        createElement({
          attr:{class:'th'},
          text:v.col,
        },this.detailArea);
        createElement({
          attr:{class:'td'},
          text:v.item[v.col],
        },this.detailArea);
      }
  
      v.step = 9; // 終了処理
      changeScreen('detail');
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

  search(){
    const v = {whois:this.className+'.search',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

  clear(){
    const v = {whois:this.className+'.clear',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

  append(){
    const v = {whois:this.className+'.append',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

  edit(){
    const v = {whois:this.className+'.edit',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1;
      this.editArea = this.parent.querySelector('.screen[name="edit"] .table');
      this.editArea.innerHTML = '';
  
      v.step = 2;
      for( v.col in v.item){        
        createElement({
          attr:{class:'th'},
          text:v.col,
        },this.editArea);
        createElement({
          attr:{class:'td'},
          text:v.item[v.col],
        },this.editArea);
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

  update(){
    const v = {whois:this.className+'.update',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

  delete(){
    const v = {whois:this.className+'.delete',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
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

- rev.1.2.0 : 2024/02/17 初版
