/**
 * @classdesc Tipsの表示
 */
class Tips {
  /**
   * @constructor
   * @param {string} api - スプレッドシートのAPI
   * @returns {null|Error}
   */
  constructor(api){
    const v = {whois:'Tips.constructor',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // APIのURLをthis.apiに保存
      this.api = api;
      v.rv = this.api;

      v.step = 2;
      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;

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
    const v = {whois:'Tips.build',rv:null,step:0};
    console.log(v.whois+' start.');
    try {
      v.step = 1; // 画面を隠蔽
      //document.querySelector('body').style.display = 'none';

      v.step = 2; // シートからデータを取得
      v.res = await fetch(this.api);
      //console.log("%s step.%s\n%s",v.whois,v.step,JSON.stringify(v.res));
      v.step = 3; // 取得したデータをオブジェクト化してthis.dataに保存
      this.data = await v.res.json();
      v.rv = this.data; // ログ出力用にデータセット

      v.step = 4; // 隠蔽していた画面を表示
      document.querySelector('[name="waiting"]').classList.add('hide');
      document.querySelector('[name="main"]').classList.remove('hide');

      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** tips一覧表示
   * @param {Object} [list=null] - 一覧表示するTipsデータ
   * @returns {null|Error}
   */
  drawList(list=null){
    const v = {whois:'Tips.drawList',rv:null,step:0,
      tbody: document.querySelector('[name="list"] tbody'),
    };
    console.log(v.whois+' start.');
    try {
      v.step = 1; // 前処理
      v.tbody.innerHTML = ''; // 表示領域のクリア
      
      v.step = 2; // 表示対象となるTipsをv.listに格納
      v.list = list === null ? this.data.tips : list;

      v.step = 3; // v.listのtipを一行ずつ表示
      v.list.forEach(x => {
        createElement({tag:'tr',children:[
          {tag:'td',text:x.id},
          {tag:'td',text:x.title,attr:{name:x.id},event:{click:this.drawItem}},
        ]},v.tbody)
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
  drawItem = (e) => {
    const v = {whois:'Tips.drawItem',rv:null,step:0,
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
        ,[this.data.tips])[0];
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
  }

  /** キーワード検索
   * 表題またはタグの一部にキーワードがあればヒットと判定。
   * @param {void}
   * @returns {null|Error}
   */
  search = () => {
    const v = {whois:'Tips.search',rv:null,step:0,list:[]};
    console.log(v.whois+' start.');
    try {
      v.step = 1; // 入力欄からキーワードを取得
      v.keyword = document.querySelector('input').value.toLowerCase();

      v.step = 2; // tipsからキーワードを検索
      this.data.tips.forEach(x => {
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
  }

  /** 一覧画面・個別tip表示画面の切替
   * @param {void}
   * @returns {void}
   */
  toggle = () => {
    document.querySelector('[name="ctrl"]').classList.toggle('hide');
    document.querySelector('[name="list"]').classList.toggle('hide');
    document.querySelector('[name="article"]').classList.toggle('hide');
  }

  /** 入力欄をクリア */
  clear = () => {
    document.querySelector('input').value='';
  }

  /** tipsを格納しているスプレッドシートを表示 */
  edit = () => {
    window.open('https://docs.google.com/spreadsheets/d/1er15xJiYIxCVolp6H1V3Ka38m0-pzi3914o5TEJL-i8/edit#gid=0'
    ,'_blank');
  }
}