/**
 * @classdesc タブ切り替えのHTMLページを作成する
 */
class Reception {
  /**
   * @constructor
   * @param {string} area - 表示領域となる要素のCSSセレクタ
   * @param {string} boot - スキャナ起動のトリガーとなる要素のCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * @returns {void}
   */
  constructor(area,boot,opt={}){
    const v = {whois:'Reception.constructor',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = '1'; // オプション未定義項目の既定値をプロパティにセット
      this.#setProperties(this,null,opt);
      this.area.selector = area;
      this.area.element = document.querySelector(area);
      this.boot.selector = boot;
      this.boot.element = document.querySelector(boot);
      console.log('step.'+v.step+' : ',this.area,this.boot);

      v.step = '2'; // 入力・検索・編集画面の生成
      this.wrapper.element = createElement(this.wrapper.design);
      ['entry','list','edit'].forEach(x => {
        this[x].element = createElement(this[x].design);
        this.wrapper.element.appendChild(this[x].element);
      });
      this.area.element.appendChild(this.wrapper.element);
      console.log('step.'+v.step+' : ',this.area.element);

      v.step = '3'; // スキャナ起動イベントの定義(「受付」タグのクリック)
      //this.boot.element.addEventListener('click',this.bootScanner);

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }

  /** 設定先のオブジェクトに起動時パラメータを優先して既定値を設定する
   * @param {Object} dest - 設定先のオブジェクト。初回呼出時はthis
   * @param {def} def - 既定値のオブジェクト。初回呼出時はnull(内部定義を使用)
   * @param {AuthOpt} opt - 起動時にオプションとして渡されたオブジェクト
   * @returns {void}
   */
  #setProperties(dest,def,opt){
    const v = {whois:'Reception.#setProperties',rv:true,def:{
      area:{  // 表示領域となる要素
        selector: '',     // {string} CSSセレクタ
        element : null,   // {HTMLElement} 要素本体
        design  : {},     // {Object} createElementに渡す定義
      },
      boot:{  // 受付タグ等、スキャナ起動のトリガーとなる要素
        selector: '',     // {string} CSSセレクタ
        element : null,   // {HTMLElement} 要素本体
      },
      wrapper: {  // 入力・選択・編集画面のラッパー
        element: null,   // {HTMLElement} 要素本体
        design: {attr:{class:'page'}},
      },
      entry: {  // 入力画面(スキャナ＋氏名)
        element: null,   // {HTMLElement} 要素本体
        design: {
          attr:{name:'entry'},children:[
            {attr:{class:'webScanner'}},  // スキャン画像表示領域
            {tag:'input',attr:{type:'text'}},
            {
              tag:'input',
              attr:{type:'button',value:'検索'},
              //event:{click: this.main},
            },
          ],
        },
      },
      list: {   // 複数候補選択画面
        element: null,   // {HTMLElement} 要素本体
        design: {
          attr:{name:'list'},
          style:{display:'none'},
          children:[],
        },
      },
      edit: {   // 編集画面
        element: null,   // {HTMLElement} 要素本体
        design: {
          attr:{name:'edit'},
          style:{display:'none'},
          children:[],
        },
      },
    }};

    //console.log(v.whois+' start.');
    try {
      if( def !== null ){ // 2回目以降の呼出(再起呼出)
        // 再起呼出の場合、呼出元から渡された定義Objを使用
        v.def = def;
      }

      for( let key in v.def ){
        if( whichType(v.def[key]) !== 'Object' ){
          dest[key] = opt[key] || v.def[key]; // 配列はマージしない
        } else {
          if( !dest.hasOwnProperty(key) ) dest[key] = {};
          this.#setProperties(dest[key],v.def[key],opt[key]||{});
        }
      }

      if( def === null ){ // 初回呼出(非再帰)
        // 親画面のHTML要素を保存
        this.parentWindow = document.querySelector(this.parentSelector);
      }

      //console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      v.msg = v.whois + ' abnormal end(step.'+v.step+').' + e.message;
      console.error(v.msg);
      return e;
    }
  }

  /** search, list, editを順次呼び出す(全体制御)
   * @param {string} [keyword=null] - 参加者の検索キー 
   * @returns {void}
   */
  main(keyword=null){
    const v = {whois:'Reception.main',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      v.keyword = keyword !== null ? keyword
      : this.entry.element.querySelector('input[type="text"]').value;

      console.log('keyword='+v.keyword);

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }

  async bootScanner(){
    const code = await scanQR(this.boot.selector+' [name="entry"] .webScanner');
    this.main(code);
  }

  /** 認証局経由で管理局に該当者情報を問合せ
   * @param {string} keyword - 参加者の検索キー
   * @returns {Object[]} 検索キーに該当する参加者情報の配列
   */
  #search(keyword){
    const v = {whois:'Reception.search',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }

  /** 該当者リストの表示、対象者の選択
   * @param {Object[]} applicables - 検索キーに該当する参加者情報の配列
   * @returns {Object} 対象者情報
   */
  #list(applicables){
    const v = {whois:'Reception.list',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }

  /** 対象となる参加者情報の表示と編集、結果を管理局に反映
   * @param {Object} participant - 対象者情報
   * @returns {Object} 管理局からの戻り値
   */
  #edit(participant){
    const v = {whois:'Reception.edit',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }
}