class authMenu {
/**
 * @constructor
 * @param {Object} arg 
 * @returns {authMenu|Error}
 */
constructor(arg={}){
  const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    v.step = 1.1; // 引数と既定値からメンバの値を設定
    v.r = this.#setProperties(arg);
    if( v.r instanceof Error ) throw v.r;

    v.step = 1.2; // sessionStorage/localStorageのユーザ情報を更新
    v.r = this.storeUserInfo();
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
/** sessionStorage/localStorageのユーザ情報を更新する
 * 
 * ①本関数の引数、②HTMLに埋め込まれたユーザ情報、③sessionStorage、④localStorageから
 * ユーザ情報が取得できないか試行、①>②>③>④の優先順位で最新の情報を特定し、
 * localStorageにはユーザIDのみ、sessionStorageにはユーザID＋権限を保存する。
 * 
 * @param {number} userId=null - 決まったユーザIDを指定する場合に指定
 * @returns {void}
 * 
 * @example
 * 
 * **実行結果(例)**
 * 
 * - localStorage : ユーザIDのみ。以下は例。
 *   | Key | Value |
 *   | :-- | :-- |
 *   | authMenu | 123 |
 * - sessionStorage : ユーザID＋ユーザ権限
 *   | Key | Value |
 *   | :-- | :-- |
 *   | authMenu | {"userId":123,"auth":1} |
 * 
 * **HTMLへのユーザIDの埋め込み**
 * 
 * 応募後の登録内容確認メールのように、URLのクエリ文字列でユーザIDが与えられた場合、
 * 以下のようにHTMLにIDが埋め込まれて返される。
 * 
 * 1. クエリ文字列が埋め込まれたURL(末尾の`id=123`)
 *    ```
 *    https://script.google.com/macros/s/AK〜24yz/exec?id=123
 *    ```
 * 2. doGet関数で返すHTMLファイルに予め埋込用の要素を定義
 *    ```
 *    <div style="display:none" name="userId"><?= userId ?></div>
 *    ```
 * 3. 要求時、クエリ文字列を埋め込んだHTMLを返す<br>
 *    ```
 *    function doGet(e){
 *      const template = HtmlService.createTemplateFromFile('index');
 *      template.userId = e.parameter.id;  // 'userId'がHTML上の変数、末尾'id'がクエリ文字列の内容
 *      const htmlOutput = template.evaluate();
 *      htmlOutput.setTitle('camp2024');
 *      return htmlOutput;
 *    }
 *    ```
 * 4. `opt.userIdSelector='div[name="userId"]'`を指定して本関数を実行、HTMLからユーザIDを取得
 * 
 */
storeUserInfo(userId=null){
  const v = {whois:'storeUserInfo',rv:null,step:0,html:null,arg:null};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // オプションの既定値をセット

    v.step = 2.1; // sessionStorageからユーザ情報を取得
    v.r = sessionStorage.getItem(this.constructor.name);
    v.session = v.r ? JSON.parse(v.r) : {userId:null,auth:this.publicAuth};
    v.step = 2.2; // localStorageからユーザ情報を取得
    v.r = localStorage.getItem(this.constructor.name);
    v.local = v.r ? Number(v.r) : null;
    v.step = 2.3; // HTMLに埋め込まれたuserIdを取得
    v.dom = document.querySelector(this.userIdSelector);
    if( v.dom !== null ){
      v.r = v.dom.innerText;
      v.html = v.r.length > 0 ? Number(v.r) : null;  
    }
    v.step = 2.4; // 引数で渡されたuserIdを取得
    if( userId !== null ) v.arg = Number(userId);

    v.step = 2.1; // userIdの特定
    // 優先順位は`arg > html > session > local`
    v.session.userId = v.arg !== null ? v.arg
    : ( v.html !== null ? v.html
    : ( v.session.userId !== null ? v.session.userId
    : ( v.local !== null ? v.local : null)));
    v.step = 2.2; // userIdが特定され且つauthが最低の場合は参加者(auth=2)に昇格
    if( v.session.userId !== null && v.session.auth === this.publicAuth ){
      v.session.auth = this.memberAuth;
    }

    v.step = 3.1; // sessionStorageへの保存
    sessionStorage.setItem(this.constructor.name,JSON.stringify(v.session));
    v.step = 3.2; // localStorageへの保存
    localStorage.setItem(this.constructor.name,v.session.userId);
    v.step = 3.3; // メンバに保存
    this.userId = v.session.userId;
    this.auth = v.session.auth;

    v.step = 4; // 終了処理
    v.rv = v.session;
    console.log(`${v.whois} normal end.\n`
    +`v.session=${JSON.stringify(v.session)}\nv.local=${v.local}\nv.html=${v.html}\nv.arg=${v.arg}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

  // ===================================
  // メニュー関係(旧BurgerMenu)
  // ===================================
/** data-menu属性の文字列をオブジェクトに変換
 * authMenu専用として、以下の制限は許容する
 * - メンバ名は英小文字に限定
 * - カンマは区切記号のみで、id,label,func,hrefの値(文字列)内には不存在
 * 
 * @param {string} arg - data-menuにセットされた文字列
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
        throw new Error('data-menuの設定値が不適切です\n'+arg);
      }
    }

    v.step = 4.1; // idの存否チェック
    if( !v.rv.hasOwnProperty('id') )
      throw new Error('data-menuの設定値にはidが必須です\n'+arg);
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

    if( depth === 0 ){
      v.step = 1.1; // sessionStorageからユーザ権限を読み取り
      v.r = sessionStorage.getItem(this.constructor.name);
      if( !v.r ) throw new Error(`sessionStorageに${this.constructor.name}キーが存在しません`);
      this.auth = JSON.parse(v.r).auth;

      v.step = 1.2; // navi領域をクリア
      navi.innerHTML = '';
    }

    // 子要素を順次走査し、data-menuを持つ要素をnaviに追加
    for( v.i=0 ; v.i<wrapper.childElementCount ; v.i++ ){
      v.d = wrapper.children[v.i];

      // wrapper内のdata-menu属性を持つ要素に対する処理
      v.step = 2.1; // data-menuを持たない要素はスキップ
      v.attr = this.#objectize(v.d.getAttribute(`data-menu`));
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
        if( v.d.querySelector(`[data-menu]`) ){
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
              this.changeScreen(event.target.getAttribute('name'));
              this.toggle();
            }}
          });
        }
      }

      v.step = 5.4; // navi領域にliを追加
      v.r = createElement(v.li,navi);
      if( v.r instanceof Error ) throw v.r;

      v.step = 5.5; // 子要素にdata-menuが存在する場合、再帰呼出
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