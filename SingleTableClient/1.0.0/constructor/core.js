/**
 * @constructor
 * @param {Object} arg - 内容は「SingleTableClientメンバ一覧」を参照
 * @returns {null|Error}
 */
constructor(arg={}){
  const v = {whois:'SingleTableClient.constructor',rv:null,step:0,
    default:{ // メンバの既定値
      className: 'SingleTableClient',
      parent: 'body', // {string|HTMLElement} - 親要素
      wrapper: null, // {HTMLElement} - 親要素直下、一番外側の枠組みDOM
      sourceCode: false,  // {boolean} 詳細・編集画面のcodeタグ内をクリック時にクリップボードに内容をコピーするならtrue
      source:{ // データソース(シートの読込 or 行Objの配列)に関する定義
        list:null,  // {string[]} listメソッド内でのシートデータ読み込み時のdoGAS引数の配列
        update:null,  // {string[]} updateメソッド内でのシートデータ更新時のdoGAS引数の配列
        delete: null, // {string[]} deleteメソッド内でのシートデータ削除時のdoGAS引数の配列
        // 【参考：doGAS引数】
        // 0:サーバ側関数名。"tipsServer"固定
        // 1:操作対象シート名。"tips","log"等
        // 2:tipsServer()内部での処理分岐フラグ。list or update or delete
        // 3〜:分岐先処理への引数
        //   list  -> 不要
        //   update-> 3:pKey項目名,4:データObj,5:採番関数※
        //   delete-> 3:pKey項目名,4:pKey値
        //   ※採番関数を省略し、primaryKey項目=nullの場合、tipsServer側で
        //    primaryKey項目(数値)の最大値＋1を自動的に採番する
        filter: x => true, // {Function|Arrow} 一覧に掲載する行オブジェクトの判定関数
        primaryKey: null, // {string} プライマリーキー。data-idにセットする項目名。
        sortKey: [], // {string} 一覧表示時の並べ替えキー。既定値primaryKeyをconstructorでセット
        // [{col:(項目名文字列),dir:(true:昇順、false:降順)},{..},..]
        raw: [], // {Object[]} 行オブジェクト全件
        data: [], // {Object[]} 一覧に表示する行オブジェクト。rawの部分集合
        reload: false, // {boolean} シートデータを強制再読込するならtrue
      },
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
      list: { // 一覧表表示領域に関する定義
        cols: null, // {Object[]} 一覧表に表示する項目。既定値の無い指定必須項目なのでnullで仮置き
        def: {  // 一覧画面に表示するボタンの定義
          header: true, // 一覧表のヘッダにボタンを置く
          footer: true, // フッタにボタンを置く
          elements:[    // 配置される要素のcreateElementオブジェクトの配列
            {event:'append',tag:'button',text:'append',style:{gridRow:'1/2',gridColumn:'1/3'}},
          ]
        },
        dom: {}, // {Object} ボタン名：一覧表に配置するボタンのHTMLElement
      },
      detail: { // 詳細画面表示領域に関する定義
        cols: null, // {Object[]} 詳細・編集画面に表示する項目。既定値の無い指定必須項目なのでnullで仮置き
        def: { // 詳細画面に表示するボタンの定義
          header: true, // 詳細画面のヘッダにボタンを置く
          footer: true, // フッタにボタンを置く
          elements:[    // 配置される要素のcreateElementオブジェクトの配列
            // detail,editのようにフリップフロップで表示されるボタンの場合、
            // grid-columnの他grid-rowも同一内容を指定。
            // 表示される方を後から定義する(detail->editの順に定義するとeditが表示される)
            {event:'list',tag:'button',text:'list',style:{gridColumn:'1/5'}},
            {event:'view',tag:'button',text:'view',style:{gridRow:'1/2',gridColumn:'5/9'}},
            {event:'edit',tag:'button',text:'edit',style:{gridRow:'1/2',gridColumn:'5/9'}},
            {event:'delete',tag:'button',text:'delete',style:{gridRow:'1/2',gridColumn:'9/13'}},
            {event:'update',tag:'button',text:'update',style:{gridRow:'1/2',gridColumn:'9/13'}},
          ]
        },
        dom: {}, // {Object} ボタン名：詳細・編集画面に配置するボタンのHTMLElement
      },
      current: null, // 現在表示・編集している行のID
      css:
`div.SingleTableClient, .SingleTableClient div {
display: grid;
width: 100%;
grid-column: 1/13;
}

.SingleTableClient {
--buttonMargin: 0.5rem;
--buttonPaddingTB: 0.15rem;
--buttonPaddingLR: 0.5rem;
}
.SingleTableClient input {
margin: 0.5rem;
font-size: 1rem;
height: calc(var(--buttonMargin) * 2 + var(--buttonPaddingTB) * 2 + 1rem + 1px * 2);
/* height = button margin*2 + padding*2 + font-size + border*2 */
grid-column: 1/13;
}
.SingleTableClient button {
display: inline-block;
margin: var(--buttonMargin);
padding: var(--buttonPaddingTB) var(--buttonPaddingLR);
width: calc(100% - 0.5rem * 2);
color: #444;
background: #fff;
text-decoration: none;
user-select: none;
border: 1px #444 solid;
border-radius: 3px;
transition: 0.4s ease;
}
.SingleTableClient button:hover {
color: #fff;
background: #444;
}

.SingleTableClient textarea {
grid-column: 1/13;
}

.SingleTableClient code {
white-space: pre-wrap;
}`,
    },
  };
  console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
  try {

    v.step = 1; // 既定値の設定
    v.opt = mergeDeeply(arg,v.default);
    if( v.opt instanceof Error ) throw v.opt;

    v.step = 2; // 適用値の設定
    for( v.key in v.opt ) this[v.key] = v.opt[v.key];
    if( typeof v.opt.parent === 'string' ){ // 親要素指定が文字列ならDOMに変更
      this.parent = document.querySelector(v.opt.parent);
    }
    // 一覧表示時の並べ替えキーが未指定ならprimaryKeyをセット
    if( this.source.sortKey.length === 0 )
      this.source.sortKey[0] = {col:this.source.primaryKey,dir:true};
    // SingleTable用のスタイルシートが未定義なら追加
    if( !document.querySelector('style.SingleTableClient') ){
      v.styleTag = document.createElement('style');
      v.styleTag.classList.add('SingleTableClient');
      v.styleTag.textContent = this.css;
      document.head.appendChild(v.styleTag);
    }

    v.step = 3; // 枠組み定義
    if( !document.querySelector('body > div[name="loading"]') ){
      v.step = 3.1; // 待機画面が未設定ならbody直下に追加
      v.r = createElement({attr:{name:'loading',class:'loader screen'},text:'loading...'},'body');
    }
    v.step = 3.2; // 一覧画面、詳細・編集画面をparent以下に追加
    createElement(this.frame,this.parent);
    v.step = 3.3; // wrapperをメンバとして追加(以降のquerySelectorで使用)
    this.wrapper = this.parent.querySelector('.SingleTableClient[name="wrapper"]');

    v.step = 4; // 一覧画面、詳細・編集画面のボタンを追加
    v.step = 4.1; // ボタンの動作定義
    v.event = {
      search: {click: () => this.search()},
      clear : {click: () => this.clear()},
      append: {click: () => this.append()},
      list  : {click: () => this.listView()},
      view  : {click: () => this.detailView()},
      edit  : {click: () => this.detailView(this.current,'edit')},
      update: {click: async () => await this.update()},
      delete: {click: async () => await this.delete()},
    };
    v.step = 4.2; // 一覧表のボタン
    v.step = 4.21;
    this.list.def.elements.forEach(x => {
      if( !x.hasOwnProperty('attr') ) x.attr = {};
      // クリック時の動作にメソッドを割り当て
      if( x.hasOwnProperty('event') && typeof x.event === 'string' ){
        // name属性を追加
        x.attr.name = x.event;
        // 既定のイベントを文字列で指定された場合、v.eventからアサイン
        x.event = v.event[x.event];
      }
    });
    v.step = 4.22; // ヘッダ・フッタにボタンを追加
    ['header','footer'].forEach(x => {
      if( this.list.def[x] === true ){
        createElement(this.list.def.elements,
        this.wrapper.querySelector(`[name="list"] [name="${x}"] [name="control"]`));
      }
    });
    v.step = 4.3; // 詳細画面のボタン
    v.step = 4.31;
    this.detail.def.elements.forEach(x => {
      // name属性を追加
      if( !x.hasOwnProperty('attr') ) x.attr = {};
      x.attr.name = x.event;
      // クリック時の動作にメソッドを割り当て
      if( x.hasOwnProperty('event') )
        x.event = v.event[x.event];
    });
    v.step = 4.32; // ヘッダ・フッタにボタンを追加
    ['header','footer'].forEach(x => {
      if( this.detail.def[x] === true ){
        createElement(this.detail.def.elements,
        this.wrapper.querySelector(`[name="detail"] [name="${x}"] [name="control"]`));
      }
    });
    v.step = 4.4; // edit・detailボタンはthis.detail.domに登録
    ['edit','view','update','delete'].forEach(fc => { // fc=FunCtion
      this.detail.dom[fc] = [];
      ['header','footer'].forEach(hf => { // hf=Header and Footer
        this.detail.dom[fc].push(this.wrapper.querySelector(
          `[name="detail"] [name="${hf}"] [name="control"] [name="${fc}"]`
        ));
      });
    });

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    alert(e.message);
  }
}