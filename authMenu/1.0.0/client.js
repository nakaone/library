/**
 * @classdesc authMenu機能群のクライアント側クラス
 */
class authMenu {

  //:x:$tmp/authMenu.changeScreen.js::

  //:x:$tmp/authMenu.genNavi.js::

  //:x:$tmp/authMenu.objectize.js::

/** setProperties: constructorの引数と既定値からthisの値を設定
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
        userId: null,
        auth: 1, // ユーザ権限の既定値
        userIdSelector: '[name="userId"]',
        publicAuth: 1,
        memberAuth: 2,
        allow: 2 ** 32 - 1, // data-menuのauth(開示範囲)の既定値
        func: {}, // {Object.<string,function>} メニューから呼び出される関数
        home: null,
        initialSubMenu: true, // サブメニューの初期状態。true:開いた状態、false:閉じた状態
        RSAkeyLength: 1024,
        passPhraseLength: 16,
        user: {}, // ユーザ情報
      };
      v.default.css = `/* authMenu専用CSS
          authMenu共通変数定義
          --text: テキストおよびハンバーガーアイコンの線の色
          --maxIndex: ローディング画面優先なので、最大値2147483647-1
        */
        .authMenu {
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
        .authMenu .icon {
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
        .authMenu .icon > button {
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
        .authMenu .icon button span {
          display : block;
          width : 100%;
          height : calc(var(--iconSize) * 0.12);
          border-radius : calc(var(--iconSize) * 0.06);
          position : absolute;
          left : 0;
          background : var(--text);
          transition : top 0.24s, transform 0.24s, opacity 0.24s;
        }
        .authMenu .icon button span:nth-child(1) {
          top : 0;
        }
        .authMenu .icon button span:nth-child(2) {
          top : 50%;
          transform : translateY(-50%);
        }
        .authMenu .icon button span:nth-child(3) {
          top : 100%;
          transform : translateY(-100%);
        }
        .authMenu .icon button span.is_active:nth-child(1) {
          top : 50%;
          transform : translateY(-50%) rotate(135deg);
        }
        .authMenu .icon button span.is_active:nth-child(2) {
          transform : translate(50%, -50%);
          opacity : 0;
        }
        .authMenu .icon button span.is_active:nth-child(3) {
          top : 50%;
          transform : translateY(-50%) rotate(-135deg);
        }
        /* ナビゲーション領域 */
        .authMenu nav {
          display : none;
        }
        .authMenu nav.is_active {
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
        .authMenu nav ul {
          margin : 0rem 0rem 1rem 0rem;
          padding : 0rem 0rem 0rem 0rem;
          background-color : var(--back);
        }
        .authMenu nav ul ul { /* 2階層以降のulにのみ適用 */
          display : none;
        }
        .authMenu nav ul ul.is_open {
          display : block;
          border-top : solid 0.2rem var(--fore);
          border-left : solid 0.7rem var(--fore);
        }
        .authMenu nav li {
          margin : 0.6rem 0rem 0.3rem 0.5rem;
          padding : 0.5rem 0rem 0rem 0rem;
          list-style : none;
          background-color : var(--back);
        }
        .authMenu nav li a {
          color : var(--text);
          text-decoration : none;
          font-size: 1.5rem;
        },
        /* 背景 */
        .authMenu .back {
          display : none;
        }
        .authMenu .back.is_active {
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
  
      v.step = 2; // 引数と既定値から設定値のオブジェクトを作成
      v.arg = mergeDeeply(arg,v.default);
      if( v.arg instanceof Error ) throw v.arg;
  
      v.step = 3; // インスタンス変数に設定値を保存
      Object.keys(v.arg).forEach(x => this[x] = v.arg[x]);
  
      v.step = 4; // sessionStorage他のユーザ情報を更新
      v.r = this.storeUserInfo(v.arg.user);
      if( v.r instanceof Error ) throw v.r;
  
      v.step = 5; // wrapperが文字列(CSSセレクタ)ならHTMLElementに変更
      if( typeof this.wrapper === 'string' ){
        this.wrapper = document.querySelector(this.wrapper);
      }
      v.step = 6; // authMenu専用CSSが未定義なら追加
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
      + `\n${e.message}\narg=${stringify(arg)}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

/** storeUserInfo: インスタンス変数やstorageに保存したユーザ情報を更新
   * 
   * ユーザ情報を取得し、①引数 > ②インスタンス変数 > ③sessionStorage > ④localStorage > ⑤HTMLに埋め込まれたユーザ情報(userId)の順に最新の情報を特定、各々の内容を更新する。
   * 
   * @param {object} arg={} - 特定の値を設定する場合に使用 
   * @returns {object|Error} 更新結果
   */
  storeUserInfo(arg={}){
    const v = {whois:this.constructor.name+'.storeUserInfo',rv:null,step:0};
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
    try {
  
      // -------------------------------------
      // 各格納場所から現在の保存内容を取得
      // -------------------------------------
      v.step = 1.1; //インスタンス変数
      v.user = this.hasOwnProperty('user') ? this.user : {};
      if( Object.keys(v.user).length === 0 ){
        // メンバが存在しない場合、全項目nullの初期オブジェクトを作成
        ['userId','created','email','auth','passPhrase','CSkey',
        'CPkey','updated','SPkey'].forEach(x => v.user[x]=null);
      }
      v.step = 1.2; // sessionStorage
      v.r = sessionStorage.getItem(this.constructor.name);
      v.session = v.r ? JSON.parse(v.r) : {};
      v.step = 1.3; // localStorage
      v.r = localStorage.getItem(this.constructor.name);
      v.local = v.r ? {userId:Number(v.r)} : {};
      v.step = 1.4; // HTMLに埋め込まれたユーザ情報(ID)
      v.dom = document.querySelector(this.userIdSelector);
      v.html = (v.dom !== null && v.dom.innerText.length > 0)
        ? {userId:Number(v.r)} :{};
  
      // -------------------------------------
      // 各格納場所のユーザ情報をv.rvに一元化
      // -------------------------------------
      v.step = 2.1; // 優先順位に沿ってユーザ情報を統合
      // 優先順位は`html < local < session < user < arg`
      v.rv = Object.assign(v.html,v.local,v.session,v.user,arg);
  
      v.step = 2.2; // 鍵ペア・秘密鍵が存在しなければ作成
      if( v.rv.passPhrase === null || v.rv.CSkey === null ){
        if( v.rv.passPhrase === null ){
          v.rv.passPhrase = createPassword(this.passPhraseLength);
          v.rv.updated = toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn');
        }
        v.rv.CSkey = cryptico.generateRSAKey(v.rv.passPhrase,(this.RSAkeyLength));
        v.rv.CPkey = cryptico.publicKeyString(v.rv.CSkey);
      }
  
      v.step = 2.3; // ユーザ権限の設定
      if( v.rv.auth === null ){
        // ユーザIDが未設定 ⇒ 一般公開用
        v.rv.auth = this.publicAuth;
      } else if( v.rv.auth === this.publicAuth ){
        // ユーザIDが設定済だが権限が一般公開用 ⇒ 参加者用に修正
        v.rv.auth = this.memberAuth;
      }
  
      // -------------------------------------
      // 各格納場所の値を更新
      // -------------------------------------
      v.step = 3.3; // インスタンス変数(メンバ)への保存
      this.user = v.rv;
      v.step = 3.2; // sessionStorageへの保存
      Object.keys(v.user).filter(x => x !== 'CSkey').forEach(x => {
        if( v.rv.hasOwnProperty(x) && v.rv[x] ){
          v.session[x] = v.rv[x];
        }
      });
      sessionStorage.setItem(this.constructor.name,JSON.stringify(v.session));
      v.step = 3.1; // localStorageへの保存
      localStorage.setItem(this.constructor.name,v.rv.userId);
  
      v.step = 4; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}\nv.rv=${v.rv}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** @constructor */
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
      v.r = this.changeScreen();
      if( v.r instanceof Error ) throw v.r;
      console.log(`${v.whois} normal end.`);
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\narg=${stringify(arg)}`;  // 引数
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** doGAS: authMenu用の既定値をセットしてdoGASを呼び出し
   * @param {Object} arg - authServerのメソッドに渡す引数オブジェクト
   * @param {Object} opt
   * @param {string} opt.type - argの加工形式
   * - JSON : JSON.stringify(arg)
   * - encrypt : SPkeyで暗号化・署名は無し
   * - signature : SPkeyで暗号化・CSkeyで署名
   */
  async doGAS(arg,opt={type:'JSON'}){
    const v = {arg:JSON.stringify(arg)};
    if( opt.type === 'encrypt' || opt.type === 'signature' ){
      v.encrypt = opt.type === 'encrypt'
      ? cryptico.encrypt(v.arg,this.user.SPkey)
      : cryptico.encrypt(v.arg,this.user.SPkey,this.user.CSkey);
      if( v.encrypt.status === 'success' ){
        v.arg = v.encrypt.cipher;
      } else {
        throw new Error('encrypt failed.');
      }
    }
    return await doGAS('authServer',this.userId,v.arg);
  }

  /** toggle: ナビゲーション領域の表示/非表示切り替え */
  toggle(){
    const v = {whois:'authMenu.toggle'};
    console.log(`${v.whois} start.`);
    try {
      v.step = 1;
      document.querySelector(`.authMenu nav`).classList.toggle('is_active');
      v.step = 2;
      document.querySelector(`.authMenu .back`).classList.toggle('is_active');
      v.step = 3;
      document.querySelectorAll(`.authMenu .icon button span`)
      .forEach(x => x.classList.toggle('is_active'));        
      console.log(`${v.whois} normal end.`);
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** showChildren: ブランチの下位階層メニュー表示/非表示切り替え */
  showChildren(event){
    event.target.parentNode.querySelector('ul').classList.toggle('is_open');
    let m = event.target.innerText.match(/^([▶️▼])(.+)/);
    const text = ((m[1] === '▼') ? '▶️' : '▼') + m[2];
    event.target.innerText = text;  
  }
}
