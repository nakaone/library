/**
 * @classdesc コンポーネント一覧の表示
 */
class Readme {
  /**
   * @constructor
   * @param {string} api - スプレッドシートのAPI
   * @returns {null|Error}
   */
  constructor(api){
    const v = {whois:'Readme.constructor',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // APIのURLをthis.apiに保存
      this.api = api;
      v.rv = this.api;

      v.step = 2; // wrapper配下にテンプレートを用意
      this.wrapper = document.querySelector('body');
      v.rv = createElement([
        {attr:{name:'waiting'},text:'しばらくお待ちください...'},
        {attr:{name:'ctrl',class:'hide'},children:[
          {tag:'button',text:'編集',event:{click:this.edit}},
        ]},
        {attr:{name:'list',class:'hide'},children:[
          {tag:'h1',text:'コンポーネント一覧'},
          {tag:'table',children:[
            {tag:'thead',children:[
              {tag:'tr',children:[
                {tag:'th',text:'ID'},
                {tag:'th',text:'型'},
                {tag:'th',text:'名称'},
                {tag:'th',text:'概要'},
                //{tag:'th',text:'備考'},
              ]},
            ]},
            {tag:'tbody'},
          ]},
        ]},
      ],this.wrapper);
      this.waiting = this.wrapper.querySelector('div[name="waiting"]');
      this.ctrl = this.wrapper.querySelector('div[name="ctrl"]');
      this.list = this.wrapper.querySelector('div[name="list"]');
      this.tbody = this.wrapper.querySelector('tbody');
      console.log(this.tbody)

      v.step = 3;
      console.log(v.whois+' normal end.\n',v.rv);

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** スプレッドシートからデータを取得、メンバに格納
   * @param {void}
   * @returns {null|Error}
   */
  async build(){
    const v = {whois:'Readme.build',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // シートからデータを取得
      v.res = await fetch(this.api);

      v.step = 2; // 取得したデータをオブジェクト化してthis.dataに保存
      this.data = await v.res.json();
      v.rv = this.data; // ログ出力用にデータセット

      v.step = 3; // 一覧を表示
      v.rv = this.drawList();
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 4; // 隠蔽していた画面を表示
      this.waiting.classList.add('hide');
      this.ctrl.classList.remove('hide');
      this.list.classList.remove('hide');

      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** Readme一覧表示
   * @param {Object} [list=null] - 一覧表示するReadmeデータ
   * @returns {null|Error}
   */
  drawList(list=null){
    const v = {whois:'Readme.drawList',rv:null,step:0};
    console.log(v.whois+' start.');
    try {
      v.step = 1; // 前処理
      this.tbody.innerHTML = ''; // 表示領域のクリア

      v.step = 2; // 表示対象となるReadmeをv.listに格納
      v.list = list === null ? this.data.components : list;
      v.list = alasql('select *'
      + ' from ?'
      + ' where EOD=false'  // EOD(End of Development)=true -> 開発中止
      + ' order by project, type, name'
      ,[v.list]);
      console.log(v.list);

      v.step = 3; // v.listのtipを一行ずつ表示
      v.list.forEach(x => {
        createElement({tag:'tr',children:[
          {tag:'td',style:{'text-align':'right'},text:x.id},
          {tag:'td',html:x.type},
          {tag:'td',html:( x.project.length > 0
            ? '<span>' + x.project + '/</span><br>'
            : '' ) + x.name
          },
          {tag:'td',text:x.summary},
          //{tag:'td',text:x.note},
        ]},this.tbody)
      });

      v.step = 4; // 終了処理
      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 選択されたtipを表示
   * @param {PointerEvent|Object} e - 選択されたtip
   * @returns {null|Error}
   */
  /*drawItem = (e) => {
    const v = {whois:'Readme.drawItem',rv:null,step:0,
      wrapper:document.querySelector('[name="article"]')};
    console.log(v.whois+' start.',e);
    try {

      v.step = 1; // 前処理
      this.toggle();

      v.step = 2; // tipのデータをv.tipに格納
      if( e instanceof PointerEvent ){
        v.step = 2.1; // リストから選択された場合
        v.step = 1;
        v.tip = alasql('select'
        + ' * from ? where id=' + e.target.getAttribute('name')
        ,[this.data.Readme])[0];
      } else {
        v.step = 2.2; // searchの結果、記事が一つだけヒット
        v.tip = e;
      }

      v.step = 3; // 記事の表示
      v.wrapper.innerHTML = '';
      createElement([
        {tag:'button',text:'戻る',event:{click:this.toggle}},
        {tag:'h1',text:v.tip.title},
        {html:marked.parse(v.tip.article)},
      ],v.wrapper);

      v.step = 4; // 終了処理
      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }*/

  /** キーワード検索
   * 表題またはタグの一部にキーワードがあればヒットと判定。
   * @param {void}
   * @returns {null|Error}
   */
  /*search = () => {
    const v = {whois:'Readme.search',rv:null,step:0,list:[]};
    console.log(v.whois+' start.');
    try {
      v.step = 1; // 入力欄からキーワードを取得
      v.keyword = document.querySelector('input').value.toLowerCase();

      v.step = 2; // Readmeからキーワードを検索
      this.data.Readme.forEach(x => {
        // 検索対象はタイトルとタグとする
        v.keyString = (x.title + x.tag).toLowerCase();
        if( v.keyString.indexOf(v.keyword) >= 0 ){
          v.list.push(x);
        }
      });

      v.step = 3; // 結果により処理分岐
      if( v.list.length === 0 ){
        alert('該当記事がありません');
      } else if( v.list.length === 1 ){
        this.drawItem(v.list[0]);
      } else {
        this.drawList(v.list);
      }

      v.step = 4; // 入力欄をクリアして終了
      this.clear();
      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }*/

  /** 一覧画面・個別tip表示画面の切替
   * @param {void}
   * @returns {void}
   */
  /*toggle = () => {
    document.querySelector('[name="ctrl"]').classList.toggle('hide');
    document.querySelector('[name="list"]').classList.toggle('hide');
    document.querySelector('[name="article"]').classList.toggle('hide');
  }*/

  /** 入力欄をクリア */
  /*clear = () => {
    document.querySelector('input').value='';
  }*/

  /** Readmeを格納しているスプレッドシートを表示 */
  edit = () => {
    window.open('https://docs.google.com/spreadsheets/d/1er15xJiYIxCVolp6H1V3Ka38m0-pzi3914o5TEJL-i8/edit#gid=1385342604'
    ,'_blank');
  }
}