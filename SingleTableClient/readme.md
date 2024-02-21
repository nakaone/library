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
    * [.detail()](#SingleTableClient+detail)

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
      - thead : ヘッダ
      - tbody : 明細
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
- 「いずれかの項目をクリックで当該行の詳細画面に遷移」は仕様として固定

**Kind**: instance method of [<code>SingleTableClient</code>](#SingleTableClient)  
**Returns**: <code>HTMLObjectElement</code> \| <code>Error</code> - 'click':g.tips.detail はNG。無名関数で覆う必要あり
- [JSのクラスメソッドをonclickに設定するときにつまずいたこと]
(https://zenn.dev/ihashiguchi/articles/d1506331996d76)  

| Param | Type |
| --- | --- |
|  | <code>void</code> | 

<a name="SingleTableClient+detail"></a>

### singleTableClient.detail()
詳細・編集画面の表示

**Kind**: instance method of [<code>SingleTableClient</code>](#SingleTableClient)  


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
   *       - thead : ヘッダ
   *       - tbody : 明細
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
      wrapper: null, // {HTMLElement} - 親要素直下、一番外側の枠組みDOM
      getData: {func:'',args:[]}, // {Object} - データ取得を行うlist内のdoGASに渡す引数
      primaryKey: null, // {string} - プライマリーキー。data-idにセットする項目名。
      data: [], // {Object[]} - シート上のデータ全件
      population: () => true, // {Function} - 一覧に掲載するitemを取捨選択する関数
      frame: {attr:{name:'wrapper',class:'SingleTableClient'},children:[ // 各画面の枠組み定義
        {attr:{name:'list',class:'screen'},children:[
          {attr:{name:'header'},children:[
            {attr:{name:'items'},children:[]},
            {attr:{name:'control'},children:[]},
          ]},
          {attr:{name:'table'},children:[]}, // thead,tbodyに分かれると幅に差が発生するので一元化
          {attr:{name:'footer'},children:[
            {attr:{name:'items'},children:[]},
            {attr:{name:'control'},children:[]},
          ]},
        ]},
        {attr:{name:'detail',class:'screen'},children:[
          {attr:{name:'header'},children:[
            {attr:{name:'items'},children:[]},
            {attr:{name:'control'},children:[]},
          ]},
          {attr:{name:'table'},children:[]},
          {attr:{name:'footer'},children:[
            {attr:{name:'items'},children:[]},
            {attr:{name:'control'},children:[]},
          ]},
        ]},
      ]},
      listControl: { // 一覧画面に表示するボタンの定義
        keyword: {tag:'input',attr:{type:'text'},style:{gridColumn:'1/5'}},
        search: {tag:'button',text:'search',style:{gridColumn:'5/7'},event:{click:()=>this.search()}},
        clear: {tag:'button',text:'clear',style:{gridColumn:'7/9'},event:{click:()=>this.clear()}},
        append: {tag:'button',text:'append',style:{gridColumn:'11/13'},event:{click:()=>this.append()}},
      },
      detailControl: { // 詳細画面に表示するボタンの定義
        list: {tag:'button',text:'list',style:{gridColumn:'1/4'},event:{click:()=>this.list()}},
        detail: {tag:'button',text:'detail',style:{gridColumn:'4/7'},event:{click:()=>this.detail()}},
        edit: {tag:'button',text:'edit',style:{gridColumn:'4/7'},event:{click:()=>this.edit()}},
        update: {tag:'button',text:'update',style:{gridColumn:'7/10'},event:{click:()=>this.update()}},
        delete: {tag:'button',text:'delete',style:{gridColumn:'10/13'},event:{click:()=>this.delete()}},
      },
    }};
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
    try {
  
      v.step = 1; // 既定値の設定
      v.opt = mergeDeeply(arg,v.default);
      if( v.opt instanceof Error ) throw v.opt;
      // arg.name/dataが両方とも無指定ならエラー
  
      v.step = 2; // 適用値の設定
      for( v.key in v.opt ) this[v.key] = v.opt[v.key];
      if( typeof v.opt.parent === 'string' ){
        this.parent = document.querySelector(v.opt.parent);
      }
  
      v.step = 3; // 枠組み定義
      if( !document.querySelector('body > div[name="loading"]') ){
        v.r = createElement({attr:{name:'loading',class:'loader screen'},text:'loading...'},'body');
      }
      createElement(this.frame,this.parent);
      this.wrapper = this.parent.querySelector('.SingleTableClient[name="wrapper"]');
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    }
  }

  /** 一覧の表示
   * - 「いずれかの項目をクリックで当該行の詳細画面に遷移」は仕様として固定
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
      v.r = await doGAS(this.getData.func, ...this.getData.args);
      if( v.r instanceof Error ) throw v.r;
      this.data = [];
      v.r.forEach(x => {if(this.population(x)) this.data.push(x)});
  
      v.step = 2; // 表の作成
      v.table = this.wrapper.querySelector('[name="list"] [name="table"]');
      v.step = 2.1; // thead
      for( v.c=0 ; v.c<Object.keys(this.listCols).length ; v.c++ ){
        // name属性を追加
        v.th = mergeDeeply(this.listCols[v.c].th,{attr:{name:this.listCols[v.c].col}});
        createElement(v.th,v.table);
      }
      v.step = 2.2; // tbody
      for( v.r=0 ; v.r<this.data.length ; v.r++ ){
        for( v.c=0 ; v.c<Object.keys(this.listCols).length ; v.c++ ){
          // name属性を追加
          v.td = mergeDeeply(this.listCols[v.c].td,{attr:{name:this.listCols[v.c].col},event:{}});
          // 関数を使用していれば実数化
          v.td = this.realize(v.td,this.data[v.r]);
          // 一行のいずれかの項目をクリックしたら、当該項目の詳細表示画面に遷移するよう定義
          v.td.event.click = ()=>this.detail();
          createElement(v.td,v.table);
        }
      }
  
      v.step = 3; // 終了処理
      changeScreen('list');
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

  /** 詳細・編集画面の表示 */
  detail(id=undefined,mode='view'){
    const v = {whois:this.className+'.detail',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1; // 事前準備：表示・編集対象およびモードの判定
      v.event = event || null
      if( id === undefined ){
        // 一覧表からクリックされて遷移してきた場合、対象をdata-idタグから特定
        v.id = JSON.parse(event.target.getAttribute('data-id'));
        // モードの判定。「更新」なら遷移元がbutton,aタグのはず。
        // 遷移元がDIVなら一覧表等で表示対象として選ばれて遷移してきたと解釈
        v.mode = whichType(event.target) === 'HTMLDivElement' ? 'view' : 'edit';
      } else {
        // 更新結果の表示等、呼び出されて処理を行う場合は引数を設定
        v.id = id;
        v.mode = mode;
      }
      v.step = 1.1; // 対象行オブジェクトをv.dataに取得
      v.data = this.data.find(x => x[this.primaryKey] === v.id);
      v.step = 1.2; // 操作対象のDOMを特定
      v.table = this.wrapper.querySelector('[name="detail"] [name="table"]');
      //console.log(`l.380 ${v.whois}: id=${id}, mode=${mode}, v.id=${v.id}\nv.data=${stringify(v.data)}`);
  
      v.step = 2; // 詳細画面に表示する項目を順次追加
      for( v.i=0 ; v.i<this.detailCols.length ; v.i++ ){
        v.col = this.detailCols[v.i];
        v.step = 2.1; // 表示不要項目はスキップ
        if( !v.col.hasOwnProperty('view') && !v.col.hasOwnProperty('edit') )
          continue;
        v.step = 2.2; // 項目の作成と既定値の設定
        v.proto = {style:{gridColumn:v.col.col||'1/13'}};
        if( v.col.hasOwnProperty('name') ) v.proto.attr = {name:v.col.name};
        v.step = 2.3; // データに項目が無い場合、空文字列をセット(例：任意入力の備考欄が空白)
        if( !v.data.hasOwnProperty(v.col.name) ) v.data[v.col.name] = '';
        v.step = 2.3; // 参照か編集かを判断し、指定値と既定値をマージ
        if( v.col.hasOwnProperty('edit') && v.mode === 'edit' ){
          v.step = 2.31; // 編集指定の場合、detailCols.editのcreateElementオブジェクトを出力
          v.td = mergeDeeply(v.col.edit, v.proto);
        } else {
          v.step = 2.32; // 参照指定の場合、または編集指定だがeditのcreateElementが無指定の場合、
          // detailCols.viewのcreateElementオブジェクトを出力
          v.td = mergeDeeply(v.col.view, v.proto);
        }
        v.step = 2.4; // 関数で指定されている項目を実数化
        v.td = this.realize(v.td,v.data);
        console.log(`l.424 v.td=${stringify(v.td,true)}`)
        v.step = 2.5; // table領域に項目を追加
        createElement(v.td,v.table);
      }
  
      v.step = 3; // 終了処理
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
