/**
 * @classdesc htmlからdata-BurgerMenu属性を持つ要素を抽出、ハンバーガーメニューを作成
 */
class BurgerMenu {

  /**
   * @constructor
   * @param {Object} arg 
   * @returns {BurgerMenu|Error}
   */
  constructor(arg={}){
    const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
    try {

      v.step = 1; // 引数と既定値からメンバの値を設定
      v.r = this.#setProperties(arg);
      if( v.r instanceof Error ) throw v.r;

      v.step = 2; // アイコン、ナビ、背景の作成
      v.step = 2.1; // アイコンの作成
      this.icon = createElement({
        attr:{class:'icon'},
        event:{click:this.toggle},
        children:[{
          tag:'button',
          children:[{tag:'span'},{tag:'span'},{tag:'span'}],
        }]
      },this.wrapper);
      v.step = 2.2; // ナビゲータの作成
        this.navi = createElement({
        tag:'nav',
      },this.wrapper);
      v.step = 2.3; // ナビゲータ背景の作成
        this.back = createElement({
        attr:{class:'back'},
        event:{click:this.toggle},
      },this.wrapper);

      v.step = 3; // 親要素を走査してナビゲーションを作成
      v.rv = this.genNavi();
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 9; // 終了処理
      changeScreen(this.home);
      console.log(`${v.whois} normal end.`);
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\narg=${stringify(arg)}`;  // 引数
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** constructorの引数と既定値からthisの値を設定
   * @param {Object} arg - constructorに渡された引数オブジェクト
   * @returns {null|Error}
   */
  #setProperties(arg){
    const v = {whois:this.constructor.name+'.setProperties',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1; // 既定値の定義
      v.default = {
        wrapper: `.${this.constructor.name}[name="wrapper"]`, // {string|HTMLElement}
        auth: 1, // ユーザ権限の既定値
        allow: 2 ** 32 - 1, // data-BurgerMenuのauth(開示範囲)の既定値
        func: {}, // {Object.<string,function>} メニューから呼び出される関数
        home: null,
        initialSubMenu: true, // サブメニューの初期状態。true:開いた状態、false:閉じた状態
      };
      v.default.css = `/* BurgerMenu専用CSS
          BurgerMenu共通変数定義
          --text: テキストおよびハンバーガーアイコンの線の色
          --maxIndex: ローディング画面優先なので、最大値2147483647-1
        */
        .BurgerMenu {
          --text : #000;
          --fore : #fff;
          --back : #ddd;
          --debug : rgba(255,0,0,1);
          --iconSize : 100px;
          --maxIndex : 2147483646;
          --navWidth : 0.7;
        }
        /* ハンバーガーアイコン
          icon周囲にiconSizeの40%程度の余白が必要なのでtop,rightを指定
        */
        .BurgerMenu .icon {
          display : flex;
          justify-content : flex-end;
          place-items : center;
          position : absolute;
          top : calc(var(--iconSize) * 0.4);
          right : calc(var(--iconSize) * 0.4);
          width : var(--iconSize);
          height : var(--iconSize);
          z-index : var(--maxIndex);
        }
        .BurgerMenu .icon > button {
          place-content : center center;
          display : block;
          margin : 0;
          padding : 0px;
          box-sizing : border-box;
          width : calc(var(--iconSize) * 0.7);
          height : calc(var(--iconSize) * 0.7);
          border : none;
          background : rgba(0,0,0,0);
          position : relative;
          box-shadow : none;
        }
        .BurgerMenu .icon button span {
          display : block;
          width : 100%;
          height : calc(var(--iconSize) * 0.12);
          border-radius : calc(var(--iconSize) * 0.06);
          position : absolute;
          left : 0;
          background : var(--text);
          transition : top 0.24s, transform 0.24s, opacity 0.24s;
        }
        .BurgerMenu .icon button span:nth-child(1) {
          top : 0;
        }
        .BurgerMenu .icon button span:nth-child(2) {
          top : 50%;
          transform : translateY(-50%);
        }
        .BurgerMenu .icon button span:nth-child(3) {
          top : 100%;
          transform : translateY(-100%);
        }
        .BurgerMenu .icon button span.is_active:nth-child(1) {
          top : 50%;
          transform : translateY(-50%) rotate(135deg);
        }
        .BurgerMenu .icon button span.is_active:nth-child(2) {
          transform : translate(50%, -50%);
          opacity : 0;
        }
        .BurgerMenu .icon button span.is_active:nth-child(3) {
          top : 50%;
          transform : translateY(-50%) rotate(-135deg);
        }
        /* ナビゲーション領域 */
        .BurgerMenu nav {
          display : none;
        }
        .BurgerMenu nav.is_active {
          display : block;
          margin : 0 0 0 auto;
          font-size : 1rem;
          position : absolute;
          top : calc(var(--iconSize) * 1.8);
          right : 0;
          width : calc(100% * var(--navWidth));
          height : var(--iconSize);
          z-index : var(--maxIndex);
        }
        .BurgerMenu nav ul {
          margin : 0rem 0rem 1rem 0rem;
          padding : 0rem 0rem 0rem 0rem;
          background-color : var(--back);
        }
        .BurgerMenu nav ul ul { /* 2階層以降のulにのみ適用 */
          display : none;
        }
        .BurgerMenu nav ul ul.is_open {
          display : block;
          border-top : solid 0.2rem var(--fore);
          border-left : solid 0.7rem var(--fore);
        }
        .BurgerMenu nav li {
          margin : 0.6rem 0rem 0.3rem 0.5rem;
          padding : 0.5rem 0rem 0rem 0rem;
          list-style : none;
          background-color : var(--back);
        }
        .BurgerMenu nav li a {
          color : var(--text);
          text-decoration : none;
          font-size: 1.5rem;
        },
        /* 背景 */
        .BurgerMenu .back {
          display : none;
        }
        .BurgerMenu .back.is_active {
          display : block;
          position : absolute;
          top : 0;
          right : 0;
          width : 100vw;
          height : 100vh;
          z-index : calc(var(--maxIndex) - 1);
          background : rgba(100,100,100,0.8);
        }
      `;
      v.default.toggle = () => {  // ナビゲーション領域の表示/非表示切り替え
        document.querySelector(`.${this.constructor.name} nav`).classList.toggle('is_active');
        document.querySelector(`.${this.constructor.name} .back`).classList.toggle('is_active');
        document.querySelectorAll(`.${this.constructor.name} .icon button span`)
        .forEach(x => x.classList.toggle('is_active'));        
      };
      v.default.showChildren = (event) => { // ブランチの下位階層メニュー表示/非表示切り替え
        event.target.parentNode.querySelector('ul').classList.toggle('is_open');
        let m = event.target.innerText.match(/^([▶️▼])(.+)/);
        const text = ((m[1] === '▼') ? '▶️' : '▼') + m[2];
        event.target.innerText = text;  
      };

      v.step = 2; // 引数と既定値から設定値のオブジェクトを作成
      v.arg = mergeDeeply(arg,v.default);
      if( v.arg instanceof Error ) throw v.arg;

      v.step = 3; // メンバに設定値をコピー
      for( v.x in v.arg ) this[v.x] = v.arg[v.x];

      v.step = 4; // wrapperが文字列(CSSセレクタ)ならHTMLElementに変更
      if( typeof this.wrapper === 'string' ){
        this.wrapper = document.querySelector(this.wrapper);
      }
      v.step = 5; // homeが無指定ならwrapper直下でdata-BurgerMenu属性を持つ最初の要素の識別子
      if( this.home === null ){
        for( v.i=0 ; v.i<this.wrapper.childElementCount ; v.i++ ){
          v.x = this.wrapper.children[v.i].getAttribute(`data-${this.constructor.name}`);
          if( v.x ){
            v.r = this.#objectize(v.x);
            if( v.r instanceof Error ) throw v.r;
            this.home = v.r.id;
            break;
          }
        }
      }
      v.step = 6; // BurgerMenu専用CSSが未定義なら追加
      if( !document.querySelector(`style[name="${this.constructor.name}"]`) ){
        v.styleTag = document.createElement('style');
        v.styleTag.setAttribute('name',this.constructor.name);
        v.styleTag.textContent = this.css;
        document.head.appendChild(v.styleTag);
      }
      v.step = 7; // 待機画面が未定義ならbody直下に追加
      if( !document.querySelector('body > div[name="loading"]') ){
        v.r = createElement({
          attr:{name:'loading',class:'loader screen'},
          text:'loading...'
        },'body');
      }
  
      v.step = 8; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\narg=${stringify(arg)}`;  // 引数
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  
  /** data-BurgerMenu属性の文字列をオブジェクトに変換
   * BurgerMenu専用として、以下の制限は許容する
   * - メンバ名は英小文字に限定
   * - カンマは区切記号のみで、id,label,func,hrefの値(文字列)内には不存在
   * 
   * @param {string} arg - data-BurgerMenuにセットされた文字列
   * @returns {Object|null|Error} 引数がnullまたは空文字列ならnullを返す
   */
  #objectize(arg){
    const v = {whois:this.constructor.name+'.objectize',rv:{},step:0};
    console.log(`${v.whois} start.`);
    try {

      v.step = 1; // nullまたは空文字列にはnullを返す
      if( !arg || arg.length === 0 ) return null;

      v.step = 2; // カンマで分割
      v.p = arg.split(',');

      v.step = 3; // 各値をオブジェクト化
      for( v.i=0 ; v.i<v.p.length ; v.i++ ){
        v.m = v.p[v.i].match(/^([a-z]+):['"]?(.+?)['"]?$/);
        if( v.m ){
          v.rv[v.m[1]] = v.m[2];
        } else {
          throw new Error('data-BurgerMenuの設定値が不適切です\n'+arg);
        }
      }

      v.step = 4.1; // idの存否チェック
      if( !v.rv.hasOwnProperty('id') )
        throw new Error('data-BurgerMenuの設定値にはidが必須です\n'+arg);
      v.step = 4.2; // ラベル不在の場合はidをセット
      if( !v.rv.hasOwnProperty('label') )
        v.rv.label = v.rv.id;
      v.step = 4.3; // allowの既定値設定
      v.rv.allow = v.rv.hasOwnProperty('allow') ? Number(v.rv.allow) : this.allow;
      v.step = 4.4; // func,href両方有ればhrefを削除
      if( v.rv.hasOwnProperty('func') && v.rv.hasOwnProperty('href') )
        delete v.rv.href;
      v.step = 4.5; // from/toの既定値設定
      v.rv.from = v.rv.hasOwnProperty('from')
        ? new Date(v.rv.from).getTime() : 0;  // 1970/1/1(UTC)
      v.rv.to = v.rv.hasOwnProperty('to')
        ? new Date(v.rv.from).getTime() : 253402182000000; // 9999/12/31(UTC)

      v.step = 5; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}\narg=${stringify(arg)}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  
  /** 親要素を走査してナビゲーションを作成
   * @param {HTMLElement} wrapper - body等の親要素。
   * @param {HTMLElement} navi - nav等のナビゲーション領域
   * @returns {null|Error}
   */
  genNavi(wrapper=this.wrapper,navi=this.navi,depth=0){
    const v = {whois:this.constructor.name+'.genNavi',rv:null,step:0,now:Date.now()};
    console.log(`${v.whois} start.`);
    try {

      v.step = 1.1; // sessionStorageからユーザ権限を読み取り
      v.r = sessionStorage.getItem(config.programId);
      if( !v.r ) throw new Error(`sessionStorageに${config.programId}キーが存在しません`);
      this.auth = JSON.parse(v.r).auth;
      v.step = 1.2; // navi領域をクリア
      if( depth === 0 ) navi.innerHTML = '';

      // 子要素を順次走査し、data-BurgerMenuを持つ要素をnaviに追加
      for( v.i=0 ; v.i<wrapper.childElementCount ; v.i++ ){
        v.d = wrapper.children[v.i];

        // wrapper内のdata-BurgerMenu属性を持つ要素に対する処理
        v.step = 2.1; // data-BurgerMenuを持たない要素はスキップ
        v.attr = this.#objectize(v.d.getAttribute(`data-${this.constructor.name}`));
        if( v.attr instanceof Error ) throw v.attr;
        if( v.attr === null ) continue;

        v.step = 2.2; // screenクラスが無ければ追加
        v.class = v.d.className.match(/screen/);
        if( !v.class ) v.d.classList.add('screen'); 
        v.step = 2.3; // nameが無ければ追加
        v.name = v.d.getAttribute('name');
        if( !v.name ){
          v.name = v.attr.id;
          v.d.setAttribute('name',v.name);
        }

        // navi領域への追加が必要か、判断
        v.step = 3.1; // 実行権限がない機能・画面はnavi領域に追加しない
        if( (this.auth & v.attr.allow) === 0 ) continue;
        v.step = 3.2; // 有効期間外の場合はnavi領域に追加しない
        if( v.now < v.attr.from || v.attr.to < v.now ) continue;

        v.step = 4; // navi領域にul未設定なら追加
        if( navi.tagName !== 'UL' ){
          v.r = createElement({tag:'ul',attr:{class:this.constructor.name}},navi);
          if( v.r instanceof Error ) throw v.r;
          navi = v.r;
        }

        v.step = 5; // メニュー項目(li)の追加
        v.li = {tag:'li',children:[{
          tag:'a',
          text:v.attr.label,
          attr:{class:this.constructor.name,name:v.attr.id},
        }]};
        v.hasChild = false;
        if( v.attr.hasOwnProperty('func') ){
          v.step = 5.1; // 指定関数実行の場合
          Object.assign(v.li.children[0],{
            attr:{href:'#',name:v.attr.func},
            event:{click:(event)=>{
              this.toggle();  // メニューを閉じる
              this.func[event.target.name](event); // 指定関数の実行
              this.genNavi(); // メニュー再描画
            }},
          });
        } else if( v.attr.hasOwnProperty('href') ){
          v.step = 5.2; // 他サイトへの遷移指定の場合
          Object.assign(v.li.children[0].attr,{href:v.attr.href,target:'_blank'});
          Object.assign(v.li.children[0],{event:{click:this.toggle}}); // 遷移後メニューを閉じる
        } else {
          v.step = 5.3; // その他(=画面切替)の場合
          // 子孫メニューがあるか確認
          if( v.d.querySelector(`[data-${this.constructor.name}]`) ){
            v.step = 5.33; // 子孫メニューが存在する場合
            v.hasChild = true; // 再帰呼出用のフラグを立てる
            Object.assign(v.li.children[0],{
              // 初期がサブメニュー表示ならclassにis_openを追加
              attr:{class:(this.initialSubMenu ? 'is_open' : '')},
              // '▼'または'▶︎'をメニューの前につける
              text: (this.initialSubMenu ? '▶︎' : '▼') + v.li.children[0].text,
              event: {click:this.showChildren}
            });
          } else { // 子孫メニューが存在しない場合
            v.step = 5.33; // nameを指定して画面切替
            Object.assign(v.li.children[0],{
              event:{click:(event)=>{
                changeScreen(event.target.getAttribute('name'));
                this.toggle();
              }}
            });
          }
        }

        v.step = 5.4; // navi領域にliを追加
        v.r = createElement(v.li,navi);
        if( v.r instanceof Error ) throw v.r;

        v.step = 5.5; // 子要素にdata-BurgerMenuが存在する場合、再帰呼出
        if( v.hasChild ){
          v.r = this.genNavi(v.d,v.r,depth+1);
          if( v.r instanceof Error ) throw v.r;
        }
      }

      v.step = 6; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}