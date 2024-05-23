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
/** 適宜認証を行った上で画面を切り替える
 * @param {string} screenName=null - 切替先の画面名
 * @returns {void}
 */
async changeScreen(screenName=null){
  const v = {whois:this.constructor.name+'.changeScreen',rv:null,step:0};
  console.log(`${v.whois} start.\nscreenName(${typeof screenName})="${screenName}"`);
  try {

    v.step = 1; // ユーザ権限と要求画面の開示範囲を比較
    v.step = 1.1; // 対象画面が未指定の場合、特定
    if( screenName === null ){
      console.log(this.constructor.name+`.changeScreen start.`
      + `\nthis.home=${stringify(this.home)}(${typeof this.home})`
      + `\nthis.user.auth=${this.user.auth}`);
      // 変更先画面が無指定 => ホーム画面を表示
      screenName = typeof this.home === 'string' ? this.home : this.home[this.user.auth];
    }

    v.step = 1.2; // 権限と開示範囲の比較
    if ( (this.screenAttr[screenName].allow & this.auth) > 0 ){
      v.step = 1.3; // 画面表示の権限が有る場合、要求画面を表示して終了
      console.log(`${v.whois} normal end.`);
      return changeScreen(screenName);  // 注：このchangeScreenはメソッドでは無くライブラリ関数
    }
  
    // 以降、対象画面の開示権限が無い場合の処理
    v.step = 2; // メアド未登録の場合
    if( !this.user.hasOwnProperty('email') || !this.user.email ){
      v.step = 2.1; // ダイアログでメアドを入力
      v.email = window.prompt('メールアドレスを入力してください');
      if( v.email === null ){
        v.step = 2.2; // 入力キャンセルなら即終了
        console.log(`${v.whois}: email address enter canceled (step ${v.step}).`);
        return v.rv;
      } else {
        v.step = 2.3; // メアドの形式チェック
        if( checkFormat(v.email,'email' ) === false ){
          alert('メールアドレスの形式が不適切です');
          console.log(`${v.whois}: invalid email address (step ${v.step}).`);
          return v.rv;
        }
        v.step = 2.4; // ユーザ情報更新
        v.r = this.storeUserInfo({email:v.email});
        if( v.r instanceof Error ) throw v.r;
      }
    }
  
    v.step = 4.1; // ユーザ情報の取得。ユーザ不在なら新規登録
    //【authServerの引数・戻り値】
    // @param {number} userId 
    // @param {null|string} arg - 分岐先処理名、分岐先処理に渡す引数オブジェクトのJSON
    // @returns {Object} 分岐先処理での処理結果
    //【getUserInfoの引数・戻り値】
    // @param {Object} arg
    // @param {string} arg.email=null - e-mail。新規ユーザ登録時のみ使用の想定
    // @param {string} arg.CPkey=null - 要求があったユーザの公開鍵
    // @param {string} arg.updated=null - CPkey生成・更新日時文字列
    // @param {boolean} arg.createIfNotExist=false - true:メアドが未登録なら作成
    // @param {boolean} arg.updateCPkey=false - true:渡されたCPkeyがシートと異なる場合は更新
    // @param {boolean} arg.returnTrialStatus=true - true:現在のログイン試行の状態を返す
    // @returns {object} 以下のメンバを持つオブジェクト
    // 1. SPkey {string} - サーバ側公開鍵
    // 1. isExist {boolean} - 既存メアドならtrue、新規登録ならfalse
    // 1. isEqual {boolean} - 引数のCPkeyがシート上のCPkeyと一致するならtrue
    // 1. isExpired {boolean} - CPkeyが有効期限切れならtrue
    // 1. data {object} - 該当ユーザのシート上のオブジェクト
    v.r = await this.doGAS({
      func: 'changeScreen',
      email: this.user.email,
      CPkey: this.user.CPkey,
      updated: this.user.updated,
      allow: this.screenAttr[screenName].allow,
      createIfNotExist: true,
      updateCPkey: true,
      returnTrialStatus: true,
    },{type:'JSON'});
    if( v.r instanceof Error ) throw v.r;

    v.step = 5; // 権限ありでstatusも問題なし ⇒ 該当ユーザ情報の更新
    if( whichType(v.r,'Object') ){
      v.r = this.storeUserInfo(v.r.data);
      if( v.r instanceof Error ) throw v.r;
      v.r = changeScreen(screenName);
      if( v.r instanceof Error ) throw v.r;
    }

    v.step = 6; // 権限が無い ⇒ エラーを表示して終了
    if( typeof v.r === 'number' ){
      alert(`指定画面(${screenName})の表示権限がありません。`);
      console.log(`${v.whois}: no authority (step ${v.step}).`
        +`\nremainRetryInterval=${v.r}`);
      return v.rv;
    }

    /*
    // 以降【権限あり and (CP不一致 or CP無効) ⇒ パスコード入力】
    v.step = 7.1; // 鍵ペア再生成
    this.user.passphrase = null;
    v.r = this.storeUserInfo(v.r.data);
    if( v.r instanceof Error ) throw v.r;

    v.step = 7.21; // パスコード通知メールの発行要求
    //【sendPasscodeの引数・戻り値】
    // @param {Object} arg
    // @param {number} arg.userId - ユーザID
    // @param {string} arg.CPkey - 要求があったユーザの公開鍵
    // @param {string} arg.updated - CPkey生成・更新日時文字列
    // @returns {object} 以下のメンバを持つオブジェクト
    // - result {number}
    //   - 0 : 成功(パスコード通知メールを送信)
    //   - 1 : パスコード生成からログインまでの猶予時間を過ぎている
    //   - 2 : 凍結中(前回ログイン失敗から一定時間経過していない)
    // - data=null {Object} シート上のユーザ情報オブジェクト(除、trial)
    // - SPkey=null {Object} サーバ側公開鍵
    // - loginGraceTime=900,000(15分) {number}<br>
    //   パスコード生成からログインまでの猶予時間(ミリ秒)
    // - remainRetryInterval {number} 再挑戦可能になるまでの時間(ミリ秒)
    // - passcodeDigits=6 {number} : パスコードの桁数
    v.r = await this.doGAS('sendPasscode',{
      userId: this.user.userId,
      CPkey: this.user.CPkey,
      updated: this.user.updated,
    });
    if( v.r instanceof Error ) throw v.r;
    v.step = 7.22; // エラーメッセージの表示
    if( v.r.result > 0 ){
      switch(v.r.result){
        case 1: v.msg = 'パスコード生成から入力までの時間が長すぎ、'
          + '\n現在のパスコードが無効になりました。'
          + '\n再度メニューを選択すれば、パスコードが再発行されます。'
          + `\n再発行後、${Math.ceil(v.r.loginGraceTime/60000)}分以内にパスコードを入力してください。`;
          break;
        case 2: v.msg = '前回のログイン連続失敗から所定時間を経過していません。'
          + `約${Math.ceil(v.r.remainRetryInterval/60000)}分後、再度ログインしてください。`;
          break;
      }
      console.log(`${v.whois}: rejected by sendPasscode (step ${v.step}).`);
      return v.rv;
    }
    v.step = 7.23; // ユーザ情報更新
    v.a = this.storeUserInfo({email:v.email});
    if( v.a instanceof Error ) throw v.a;

    v.step = 7.3; // パスコード入力
    v.passcode = window.prompt(`メールに記載されたパスコードを入力してください`
      + `(数値${v.r.passcodeDigits}桁)`
      + `\nパスコードを再発行する場合は"-1"を入力してください。`);
    if( v.passcode === null ){
      v.step = 7.31; // 入力キャンセルなら即終了
      console.log(`${v.whois}: passcode enter canceled (step ${v.step}).`);
      return v.rv;
    } else {
      if( isNaN(v.passcode) ){
        v.step = 7.32; // パスコードの形式チェック
        alert('パスコードの形式が不適切です');
        console.log(`${v.whois}: invalid passcode (step ${v.step}).`);
        return v.rv;
      } else {
        v.step = 7.33; // パスコードの数値化
        v.passcode = Number(v.passcode);
        if( v.passcode < 0 ){
          v.step = 7.34; // 再発行要求
          // パスコード再発行はパスコード入力ダイアログに負の数を入力し、
          // changeScreenからsendPasscodeを再度呼び出すことで行う
          v.r = this.changeScreen(screenName);
          if( v.r instanceof Error ) throw v.r;
          return v.r;
        }
      }
    }

    v.step = 7.41; // パスコード検証要求
    //【verifyPasscodeの引数・戻り値】
    v.encrypt = cryptico.encrypt(
      ('0'.repeat(v.r.passcodeDigits) + String(v.passcode)).slice(-v.rpasscodeDigits),
      this.SPkey,this.CSkey);
    v.r = await this.doGAS('verifyPasscode',{
      userId: this.user.userId,
      passcode: v.encrypt,
    });
    if( v.r instanceof Error ) throw v.r;
    */

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
/** 親要素を走査してナビゲーションを作成
 * @param {HTMLElement} wrapper - body等の親要素。
 * @param {HTMLElement} navi - nav等のナビゲーション領域
 * @param {number} depth=0 - 再帰呼出の階層
 * @param {boolean} addMenu=true - 再帰呼出で呼出元(親要素)がメニュー化対象ならtrue
 * @returns {null|Error}
 */
genNavi(wrapper=this.wrapper,navi=this.navi,depth=0,addMenu=true){
  const v = {whois:this.constructor.name+'.genNavi',rv:null,step:0,now:Date.now()};
  console.log(`${v.whois} start. depth=${depth}`);
  try {

    v.step = 1; // navi領域および画面・要素対応マップをクリア
    // 本作業は呼出後の最初の一回のみ実行、再帰呼出の場合は実施しない
    if( depth === 0 ){
      navi.innerHTML = '';
      this.screenAttr = {};
    }

    v.childDom = wrapper.querySelectorAll(':scope > [data-menu]');
    for( v.i=0 ; v.i < v.childDom.length ; v.i++ ){
      v.d = v.childDom[v.i];

      // ----------------------------------------------
      // wrapper内のdata-menu属性を持つ全要素に対する処理
      // ----------------------------------------------
      v.step = 2.1; // data-menu属性をthis.screenAttrに登録
      v.attr = this.#objectize(v.d.getAttribute(`data-menu`));
      if( v.attr instanceof Error ) throw v.attr;

      v.step = 2.2; // screenクラスが無ければ追加
      v.class = v.d.className.match(/screen/);
      if( !v.class ) v.d.classList.add('screen'); 

      v.step = 2.3; // nameが無ければ追加
      v.name = v.d.getAttribute('name');
      if( !v.name ){
        v.name = v.attr.id;
        v.d.setAttribute('name',v.name);
      }

      v.step = 2.4; // 画面・要素対応マップ(this.screenAttr)に登録
      this.screenAttr[v.name] = v.attr;

      // ----------------------------------------------
      // メニュー化対象か判断、対象ならナビ領域に追加
      // ----------------------------------------------

      v.step = 3; // navi領域への追加が必要か、判断
      v.addMenu = false;
      if( addMenu // 再帰呼出で呼出元(親要素)がメニュー化対象
        && (this.user.auth & v.attr.allow) > 0 // 実行権限が存在
        && v.attr.from <= v.now && v.now <= v.attr.to // かつ有効期間内
      ){
        v.addMenu = true;

        v.step = 3.1; // navi領域にul未設定なら追加
        if( navi.tagName !== 'UL' ){
          v.r = createElement({tag:'ul',attr:{class:this.constructor.name}},navi);
          if( v.r instanceof Error ) throw v.r;
          navi = v.r;
        }

        v.step = 3.2; // メニュー項目(li)の追加
        v.li = {tag:'li',children:[{
          tag:'a',
          text:v.attr.label,
          attr:{class:this.constructor.name,name:v.attr.id},
        }]};

        // 動作別にメニュー項目の内容を設定
        if( v.attr.hasOwnProperty('func') ){
          v.step = 3.3; // 指定関数実行の場合
          Object.assign(v.li.children[0],{
            attr:{href:'#',name:v.attr.func},
            event:{click:(event)=>{
              this.toggle();  // メニューを閉じる
              this.func[event.target.name](event); // 指定関数の実行
              this.genNavi(); // メニュー再描画
            }},
          });
        } else if( v.attr.hasOwnProperty('href') ){
          v.step = 3.4; // 他サイトへの遷移指定の場合
          Object.assign(v.li.children[0].attr,{href:v.attr.href,target:'_blank'});
          Object.assign(v.li.children[0],{event:{click:this.toggle}}); // 遷移後メニューを閉じる
        } else {
          // その他(=画面切替)の場合、子孫メニューがあるか確認
          if( v.d.querySelector(`[data-menu]`) ){
            v.step = 3.5; // 子孫メニューが存在する場合
            Object.assign(v.li.children[0],{
              // 初期がサブメニュー表示ならclassにis_openを追加
              attr:{class:(this.initialSubMenu ? 'is_open' : '')},
              // '▼'または'▶︎'をメニューの前につける
              text: (this.initialSubMenu ? '▶︎' : '▼') + v.li.children[0].text,
              event: {click:this.showChildren}
            });
          } else { // 子孫メニューが存在しない場合
            v.step = 3.6; // nameを指定して画面切替
            Object.assign(v.li.children[0],{
              event:{click:(event)=>{
                this.changeScreen(this.screenAttr[event.target.getAttribute('name')].screen);
                this.toggle();
              }}
            });
          }
        }

        v.step = 3.7; // navi領域にliを追加
        v.r = createElement(v.li,navi);
        if( v.r instanceof Error ) throw v.r;
      }

      // ----------------------------------------------
      // 子孫階層を持つか判断、子孫有りなら再帰呼出
      // ----------------------------------------------
      v.step = 4;
      if( v.d.querySelector('[data-menu]') !== null ){
        console.log('l.729',v.d,v.r,depth+1,(addMenu && v.addMenu))
        v.r = this.genNavi(v.d,v.r,depth+1,(addMenu && v.addMenu));
        if( v.r instanceof Error ) throw v.r;
      }
    }

    v.step = 5; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
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
/** setProperties: constructorの引数と既定値からthisの値を設定
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
 * - RSAkeyLength=1024 {number} : 鍵ペアのキー長
 * - passPhraseLength=16 {number} : 鍵ペア生成の際のパスフレーズ長
 * - user={} {object} ユーザ情報オブジェクト。詳細はstoreUserInfo()で設定
 * - screenAttr={} {Object.<string, object>}<br>
 *   メニューに登録した画面名とdata-menu属性(オブジェクト)の対応
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
 * 
 * 1. 本関数の引数オブジェクト
 * 1. インスタンス変数
 * 1. sessionStorage
 * 1. localStorage
 * 1. HTMLに埋め込まれたユーザ情報
 * 
 * ユーザ情報を取得し、①>②>③>④>⑤の優先順位で最新の情報を特定、各々の内容を更新する。
 * 
 * | 名称 | 属性 | 内容 | loc | ses | mem | I/O | sht |
 * | :-- | :-- | :-- | :--: | :--: | :--: | :--: | :--: |
 * | userId | number | (新規採番された)ユーザID | ◎ | ◎ | ◎ | ◎ | ◎ |
 * | created | string | ユーザID新規登録時刻(日時文字列) | × | ◎ | ◎ | × | ◎ |
 * | email | string | ユーザの連絡先メールアドレス | × | ◎ | ◎ | × | ◎ |
 * | auth | number | ユーザの権限 | × | ◎ | ◎ | ◎ | ◎ |
 * | passPhrase | string | クライアント側鍵ペア生成のパスフレーズ | × | ◎ | ◎ | × | × |
 * | CSkey | object | クライアント側の秘密鍵 | × | × | ◎ | × | × |
 * | CPkey | string | クライアント側の公開鍵 | × | ◎ | ◎ | × | ◎ |
 * | updated | string | クライアント側公開鍵生成時刻(日時文字列) | × | ◎ | ◎ | × | ◎ |
 * | SPkey | string | サーバ側の公開鍵 | × | ◎ | ◎ | ◎ | × |
 * | isExist | boolean | 新規登録対象メアドが登録済ならtrue | × | × | × | ◎ | × |
 * | trial | object | ログイン試行関係情報 | × | × | × | ▲ | ◎ |
 * 
 * - インスタンス変数には関数実行結果を除く全項目を持たせ、他の格納場所のマスタとして使用する
 * - sessionStorageはインスタンス変数のバックアップとして、保持可能な全項目を持たせる
 * - ユーザ情報に関するインスタンス変数(メンバ)は、他のインスタンス変数(設定項目)と区別するため、
 *   `this.user`オブジェクトに上記メンバを持たせる
 * 
 * 
 * @param {object} arg={} - 特定の値を設定する場合に使用 
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
/** authMenu用の既定値をセットしてdoGASを呼び出し
 * 
async doGAS(func,...args){
  return await doGAS('authServer',this.userId,func,...args);
}
 */
async doGAS(arg,opt={type:'JSON'}){
  return await doGAS('authServer',this.userId,JSON.stringify(arg));
}

/** ナビゲーション領域の表示/非表示切り替え */
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
/** ブランチの下位階層メニュー表示/非表示切り替え */
showChildren(event){
  event.target.parentNode.querySelector('ul').classList.toggle('is_open');
  let m = event.target.innerText.match(/^([▶️▼])(.+)/);
  const text = ((m[1] === '▼') ? '▶️' : '▼') + m[2];
  event.target.innerText = text;  
}
}
