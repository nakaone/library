/**
 * @classdesc タブ切り替えのHTMLページを作成する
 */
class Reception {
  /**
   * @constructor
   * @param {Auth} auth - 認証局他のAuthインスタンス
   * @param {Object} area - 表示領域に関する定義
   * @param {string} area.selector - CSSセレクタ
   * @param {Object} boot - スキャナ起動のトリガーとなる要素に関する定義
   * @param {string} boot.selector - CSSセレクタ
   * @param {Object} loading - 待機画面
   * @param {string} loading.selector - CSSセレクタ
   * @returns {void}
   */
  constructor(opt){
    const v = {whois:'Reception.constructor',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = '1'; // オプション未定義項目の既定値をプロパティにセット
      this.#setProperties(this,null,opt);
      this.area.element = document.querySelector(this.area.selector);
      this.boot.element = document.querySelector(this.boot.selector);
      this.loading.element = document.querySelector(this.loading.selector);
      console.log('step.'+v.step+' : ',this.area,this.boot,this.loading);

      v.step = '2'; // 入力・検索・編集画面の生成
      ['entry','list','edit'].forEach(x => {
        this[x].element = createElement(this[x].design);
        this.area.element.appendChild(this[x].element);
      });
      console.log('step.'+v.step+' : ',this.area.element);

      v.step = '3'; // スキャナ起動イベントの定義(「受付」タグのクリック)
      this.boot.element.addEventListener('click',this.bootScanner);

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
      auth: null, // {Auth} 認証局他のAuthインスタンス
      area:{  // 表示領域となる要素
        selector: '',     // {string} CSSセレクタ
        element : null,   // {HTMLElement} 要素本体
        design  : {},     // {Object} createElementに渡す定義
      },
      boot:{  // 受付タグ等、スキャナ起動のトリガーとなる要素
        selector: '',     // {string} CSSセレクタ
        element : null,   // {HTMLElement} 要素本体
      },
      loading:{  // 待機画面
        selector: '',     // {string} CSSセレクタ
        element : null,   // {HTMLElement} 要素本体
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
              event:{click: this.main},
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
   * @param {string|Event} arg - 受付番号(スキャン結果文字列) or clickイベント
   * @returns {void}
   */
  main = async (arg) => {
    const v = {whois:'Reception.main',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = '1'; // スキャン結果でない場合、入力文字列を取得
      v.keyword = whichType(arg) === 'String' ? arg
      : arg.target.parentElement.querySelector('input[type="text"]').value;
      console.log('step.'+v.step+': keyword='+v.keyword);

      // 認証局経由で管理局に該当者情報を問合せ
      v.rv = await this.#search(v.keyword);
      console.log(v.rv);
      /*
      if( v.rv.isErr || v.rv.result.length === 0 ){
        // 検索画面でメッセージをポップアップ
        alert( v.rv.message );
      } else {
        v.target = v.rv.result[0];
        if( v.rv.result.length > 1 ){
          // 該当者一覧画面に遷移、編集対象者を特定
          v.target = await this.#list(v.rv.result);
        }
        // 編集画面を表示し、変更箇所を取得
        v.data = await this.#edit(v.target);
        // auth.fetchで変更箇所を管理局に送信
        v.rv = await this.#search(v.data);
        // 編集結果のメッセージを表示
        alert(v.rv.message);
      }
      // 検索画面を再表示(bootScanner)
      this.bootScanner();
      */

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;        
    }
  }

  /** スキャナを起動、読み込んだQRデータをsearchに渡す
   * @param {void}
   * @returns 
   */
  bootScanner = async () => {
    const v = {whois:'Reception.bootScanner',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      const sel = this.area.selector+' [name="entry"] .webScanner';
      const code = await scanQR(sel);
      if( code !== null ){
        v.rv = this.main(code); // 後続のmainにスキャン文字列を渡す
        // 文字入力された⇒スキャン結果無しでタイムアウト(code=null)の場合
        // mainを呼び出さずに終了する
      }

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }

  /** 認証局経由で管理局に該当者情報を問合せ
   * @param {string} keyword - 参加者の検索キー
   * @returns {Object[]} 検索キーに該当する参加者情報の配列
   */
  #search = async (keyword) => {
    const v = {whois:'Reception.search',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      // entry画面を閉じてloading表示
      this.loading.element.style.display = 'block';

      // Auth.fetchで認証局に問い合わせ
      console.log(this.auth);
      v.rv = await this.auth.fetch('recept1A',keyword,3);

      // loading画面を閉じる
      this.loading.element.style.display = 'none';

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