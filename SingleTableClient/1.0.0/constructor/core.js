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
