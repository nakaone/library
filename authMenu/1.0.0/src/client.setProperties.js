/** constructorの引数と既定値からthisの値を設定
 * 
 * @param {Object} arg - constructorに渡された引数オブジェクト
 * @returns {null|Error}
 * 
 * @desc
 * 
 * ### <a id="authMenu_memberList">authMenuクラスメンバ一覧</a>
 * 
 * 1. 「**太字**」はインスタンス生成時、必須指定項目
 * 1. 「【*内部*】」は指定不要の項目(constructor他で自動的に設定されるメンバ)
 * 1. その他はconstructorの引数で指定可、指定が無い項目は既定値をセット
 * 
 * - wrapper='.authMenu[name="wrapper"] {string|HTMLElement}<br>
 *   メニュー全体を囲む要素。body不可
 * - icon {HTMLElement} : 【*内部*】メニューアイコンとなるHTML要素
 * - navi {HTMLElement} : 【*内部*】ナビ領域となるHTML要素
 * - back {HTMLElement} : 【*内部*】ナビ領域の背景となるHTML要素
 * - userId {number} : ユーザID。this.storeUserInfoで設定
 * - auth=1 {number} : ユーザ(クライアント)の権限
 * - userIdSelector='[name="userId"]' {string}<br>
 *   URLクエリ文字列で与えられたuserIdを保持する要素のCSSセレクタ
 * - publicAuth=1 {number}<br>
 *   ユーザIDの特定で権限が昇格する場合、変更前の権限(一般公開用権限)
 * - memberAuth=2 {number}<br>
 *   ユーザIDの特定で権限が昇格する場合、変更後の権限(参加者用権限)
 * - allow=2**32-1 {number}<br>
 *   data-menuのauth(開示範囲)の既定値
 * - func={} {Object.<string,function>}<br>
 *   メニューから呼び出される関数。ラベルはdata-menu属性の`func`に対応させる。
 * - **home** {string|Object.<number,string>}<br>
 *   文字列の場合、ホーム画面とするdata-menu属性のid。<br>
 *   ユーザ権限別にホームを設定するなら`{auth:スクリーン名(.screen[name])}`形式のオブジェクトを指定。<br>
 *   例(auth=1:一般公開,2:参加者,4:スタッフ)⇒`{1:'実施要領',2:'参加者パス',4:'スタッフの手引き'}`
 * - initialSubMenu=true {boolean}<br>
 *   サブメニューの初期状態。true:開いた状態、false:閉じた状態
 * - css {string} : authMenu専用CSS。書き換えする場合、全文指定すること(一部変更は不可)
 * - toggle {Arrow} : 【*内部*】ナビゲーション領域の表示/非表示切り替え
 * - showChildren {Arror} : 【*内部*】ブランチの下位階層メニュー表示/非表示切り替え
 * - changeScreen {Arror} : 【*内部*】this.homeの内容に従って画面を切り替え
 * - RSAkeyLength=1024 {number} : 鍵ペアのキー長
 * - passPhraseLength=16 {number} : 鍵ペア生成の際のパスフレーズ長
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
    v.default.toggle = () => {
      // ナビゲーション領域の表示/非表示切り替え
      document.querySelector(`.${this.constructor.name} nav`).classList.toggle('is_active');
      document.querySelector(`.${this.constructor.name} .back`).classList.toggle('is_active');
      document.querySelectorAll(`.${this.constructor.name} .icon button span`)
      .forEach(x => x.classList.toggle('is_active'));        
    };
    v.default.showChildren = (event) => {
      // ブランチの下位階層メニュー表示/非表示切り替え
      event.target.parentNode.querySelector('ul').classList.toggle('is_open');
      let m = event.target.innerText.match(/^([▶️▼])(.+)/);
      const text = ((m[1] === '▼') ? '▶️' : '▼') + m[2];
      event.target.innerText = text;  
    };
    v.default.changeScreen = (arg=null) => {
      // this.homeの内容に従って画面を切り替える
      if( arg === null ){
        // 変更先画面が無指定 => ホーム画面を表示
        arg = typeof this.home === 'string' ? this.home : this.home[this.auth];
      }
      return changeScreen(arg);
    }

    v.step = 2; // 引数と既定値から設定値のオブジェクトを作成
    v.arg = mergeDeeply(arg,v.default);
    if( v.arg instanceof Error ) throw v.arg;

    v.step = 3; // メンバに設定値をコピー
    for( v.x in v.arg ) this[v.x] = v.arg[v.x];

    v.step = 4; // wrapperが文字列(CSSセレクタ)ならHTMLElementに変更
    if( typeof this.wrapper === 'string' ){
      this.wrapper = document.querySelector(this.wrapper);
    }
    v.step = 5; // authMenu専用CSSが未定義なら追加
    if( !document.querySelector(`style[name="${this.constructor.name}"]`) ){
      v.styleTag = document.createElement('style');
      v.styleTag.setAttribute('name',this.constructor.name);
      v.styleTag.textContent = this.css;
      document.head.appendChild(v.styleTag);
    }
    v.step = 6; // 待機画面が未定義ならbody直下に追加
    if( !document.querySelector('body > div[name="loading"]') ){
      v.r = createElement({
        attr:{name:'loading',class:'loader screen'},
        text:'loading...'
      },'body');
    }

    v.step = 7; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}