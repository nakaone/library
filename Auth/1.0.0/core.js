/**
 * @classdesc 入力されたID/PWと登録情報を突合し、IDに紐づく各種情報を返す
 *
 * - パスコード(passCode) : 受付番号入力後受信したメールに記載された番号
 * - パスワード(passWord) : 鍵ペア生成の際、秘密鍵の基となる文字列
 */
class Auth {
  /**
   * @constructor
   * @param {string} gatewayUrl - 認証局APIのURL
   * @param {AuthOpt} [opt={}] - 生成時オプション
   * @returns {void} なし
   *
   * #### 処理概要
   *
   * ```mermaid
   * sequenceDiagram
   *   autonumber
   *   actor mailer as メーラ
   *   actor browser as ブラウザ
   *   participant gateway as 認証局
   *   participant master as 管理局
   *   participant httpd as httpd
   *
   *   %% 受付番号入力
   *   mailer ->> httpd : 事前に送信された案内メールのリンクをクリック
   *   httpd ->> browser : ページファイル(index.html)
   *   activate browser
   *   Note right of browser: constructor()
   *   Note right of browser: getEntryNo()
   *
   *   browser ->> gateway : 受付番号、CP(平文)
   *   activate gateway
   *   Note right of gateway : auth1A()
   *
   *   gateway ->> master : 受付番号、CP(GS/MP)
   *   activate master
   *   Note right of master : auth1B()
   *   master ->> mailer : パスコード
   *   activate mailer
   *
   *   master ->> gateway : 申請登録結果
   *   deactivate master
   *
   *   gateway ->> browser : 申請登録結果
   *   deactivate gateway
   *   browser ->> browser : GP格納、パスコード入力画面表示
   *   deactivate browser
   *
   *
   *   %% パスコード入力
   *   mailer ->> browser : パスコード入力
   *   deactivate mailer
   *   activate browser
   *   Note right of browser : getPassCode()
   *   browser ->> gateway : 受付番号、パスコード(CS/GP)
   *   activate gateway
   *   Note right of gateway : auth2A
   *   gateway ->> master : 受付番号、パスコード、CP(GS/MP)
   *   activate master
   *   Note right of master : auth2B
   *   master ->> gateway : 利用者情報
   *   deactivate master
   *   gateway ->> browser : 利用者情報,CK
   *   deactivate gateway
   *   browser ->> browser : 初期画面表示
   *   deactivate browser
   *
   * ```
   *
   * - 文中の記号は以下の通り
   *   - CK:共通鍵(Common Key)
   *   - CP:利用者公開鍵(Client Public key)、CS:利用者秘密鍵(Client Secret key)
   *   - GP:認証局公開鍵(Gateway Public key)、GS:認証局秘密鍵(Gateway Secret key)
   *   - FP:配信局公開鍵(Front Public key)、FS:配信局秘密鍵(Front Secret key)
   *   - MP:管理局公開鍵(Master Public key)、MS:管理局秘密鍵(Master Secret key)
   *   - (xS/yP) = XX局秘密鍵で署名、YY局公開鍵で暗号化した、XX->YY宛の通信<br>
   *     例：(GS/MP) ⇒ GS(認証局秘密鍵)で署名、MP(管理局公開鍵)で暗号化
   * - (02) constructor() : DOMContentLoaded時、以下の処理を実行
   *   1. 利用者の秘密鍵(以下CSkey)・公開鍵(以下CPkey)を生成
   *   1. getEntryNo()を呼び出し
   * - (02) getEntryNo() : 受付番号入力
   *   1. 受付番号入力画面を表示(z-indexを最大にして他の画面を触らせない)
   *   1. 入力後待機画面表示、レスポンスがあったらgetPassCode()を呼び出し
   * - (03) auth1A() : 認証申請の受付
   *   1. 受付番号とCPをauth1Bに送信
   *   1. auth1Bの申請結果を受けたらブラウザに結果を送信<br>
   *      申請OKの場合はGPも併せて送信
   * - (04) auth1B() : 認証申請の登録
   *   1. 受付番号とCPをシートに書き込み
   *   1. 正当性を検証
   *      - パスコードが一致
   *      - パスコード発行日時から1時間以内
   *      - 3回連続失敗後1時間以上経過
   *   1. 正当だった場合はパスコードを生成、シートに書き込み
   *   1. 申請者にパスコードを通知(05)
   *   1. 申請登録の結果をauth1Aに返す
   * - (09) getPassCode() : パスコード入力
   *   1. パスコード入力画面を表示<br>
   *      ※パスコードは数値6桁を想定。変更する場合、auth2Bのパスコード正当性ロジック見直しのこと。
   *   1. パスコードが入力されたらauth2Aに送信
   *   1. auth2Aからレスポンスがあったらthisに保存、初期画面を表示
   * - (10) auth2A
   *   1. 受付番号・パスコード・CPkeyを管理局に送信
   *   1. 利用者情報をauth2Bから受けたらFPを追加して利用者に返す
   * - (12) auth2B
   *   1. 送信された受付番号・パスコード・CPkeyが有効か、シートの申請登録と突合
   *   1. OKなら利用者情報をauth2Aに返す
   *
   * #### 使用方法
   *
   * ```
   * let config;
   * window.addEventListener('DOMContentLoaded',async () => {
   *   const v = {};
   *   console.log('DOMContentLoaded start.');
   *   v.auth = new Auth('https://script.google.com/macros/s/〜/exec');
   *   await v.auth.build();
   *   // ローディング画面解除
   *   document.querySelector('div[name="loading"]').style.display = 'none';
   *
   *   console.log(v.auth);
   *   console.log('DOMContentLoaded end.');
   * });
   * ```
   *
   * - `new Auth()`実行後、必ず`.build()`を実行する
   *
   */
  constructor(gatewayUrl,opt={}){
    const v = {whois:'Auth.constructor'};
    console.log(v.whois+' start.');
    try {

      v.step = '1'; // オプション未定義項目の既定値をプロパティにセット
      this.#setProperties(this,null,opt);

      v.step = '2'; // 必須項目をプロパティに保存
      this.gateway.url = gatewayUrl;  // 認証局のURL

      v.step = '3'; // 各種画面を用意する
      //   ※鍵ペア生成で時間がかかるので、先に待機画面を表示
      this.#setWindows();

      v.step = '4'; // 秘密鍵・公開鍵を作成し、プロパティに格納する
      this.#setupKeys();

      console.log(v.whois+' normal end.',this);
    } catch(e){
      v.msg = v.whois + ' abnormal end(step.'+v.step+').' + e.message;
      console.error(v.msg);
      alert(v.msg);
    }
  }

  /** 初期化時に必要な一連の非同期処理を実施
   * @param {void} - 無し
   * @returns {void} 無し
   */
  async build(){
    const v = {whois:'Auth.build',rv:null};
    console.log(v.whois+' start.');
    try {
      v.step = '1.1';  // 受付番号をダイアログから取得
      console.log('l.221',this.entryNo.value)
      if( this.entryNo.value !== null ){  // 起動時に取得済みならダイアログにセット
        document.querySelector('dialog[name="entryNo"] input[type="number"]')
        .value = this.entryNo.value;
      }
      do
        this.entryNo.value = await this.#getEntryNo();
      while( this.entryNo.value.match(/^[0-9]{1,4}$/) === null );

      v.step = '1.2'; v.arg = { // auth1Aに渡す引数をセット
        entryNo: this.entryNo.value,
        publicKey: this.RSA.pKey,
      }
      console.log('arg',v.arg);

      v.step = '1.3'; // fetch
      v.rv = await this.fetch('auth1A',v.arg,0);
      if( v.rv.isErr ){
        alert(v.rv.message);
        return null;
      } else {
        this.gateway.pKey = v.rv.result;
      }

      v.step = '2.1'; do  // 受付番号が指定形式になるまでループ
        this.passCode.value = await this.#getPassCode();
      while( this.passCode.value.match(/^[0-9]{6}$/) === null );

      // 入力フォームから値を取得
      //this.#changeScreen('loading');
      v.step = '2.2'; v.arg = { // auth1Bに渡す引数
        entryNo: this.entryNo.value,
        passCode: this.passCode.value,
      }
      console.log('arg',v.arg);

      v.step = '2.3'; // fetch
      v.rv = await this.fetch('auth2A',v.arg,3);
      if( v.rv.isErr ){
        console.error(v.rv);
      } else {
        // 申請者情報と共通鍵を格納
        this.commonKey = v.rv.result.common;
        this.info = v.rv.result.info;
        console.log('commonKey='+this.commonKey,'info',this.info);
      }

      console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.\n',e);
    }
  }

  /** 設定先のオブジェクトに起動時パラメータを優先して既定値を設定する
   * @param {Object} dest - 設定先のオブジェクト。初回呼出時はthis
   * @param {def} def - 既定値のオブジェクト。初回呼出時はnull(内部定義を使用)
   * @param {AuthOpt} opt - 起動時にオプションとして渡されたオブジェクト
   * @returns {void}
   */
  #setProperties(dest,def,opt){
    const v = {whois:'Auth.#setProperties',rv:true,def:{
      parentSelector: "body", // {string} - 親要素のCSSセレクタ
      RSA:{  // 自局のRSAキー関係情報
        bits: 1024,     // {number} - RSAキー長
        passWord: null, // {string} - パスワード
        pwLength: 32,   // {number} - 自動生成する場合のパスワード文字数
        sKey: null,     // {RSAKey} - 秘密鍵
        pKey: null,     // {string} - 公開鍵
      },
      commonKey: null,  // {string} - 共通鍵
      info: null, // {Object.<string, any>} - 管理局.masterシートの参加者情報
      gateway:{ // 認証局関連情報
        url: null,  // {string} - APIのURL
        pKey: null, // {string} - 公開鍵
      },
      front: {  // 配信局関連情報
        url: null,  // {string} - APIのURL
        pKey: null, // {string} - 公開鍵
      },
      entryNo:{ // 受付番号関係
        element: null, // {HTMLElement} - 受付番号入力画面の要素。setWindowsで設定。
        value: '',  // {string} - 受付番号
        css: [
          {sel:'dialog.Auth',prop:{
            'margin':'auto',
            'padding':'1rem',
            'box-shadow':'0 0 1rem black',
          }},
          {sel:'dialog.Auth::backdrop',prop:{
            'background-color':'#ddd',
          }},
          {sel:'dialog.Auth p',prop:{
            'font-size':'1.5rem',
            'margin':'0.5rem 0',
          }},
          {sel:'dialog.Auth li',prop:{
            'font-size':'1rem',
            'margin':'0.5rem 0',
          }},
          {sel:'dialog.Auth > input[type="number"]',prop:{
            'font-size':'1.5rem',
            'border':'solid 2px #888',
            'height':'2rem',
            'width':'6rem',
          }},
          {sel:'dialog.Auth > input[type="button"]',prop:{
            'font-size':'1rem',
            'padding':'0.25rem 1rem',
            'margin-left':'1rem',
          }},
        ],
        dialog: `<p>受付番号を入力してください</p>`,
        /*
        header:'',    // {string} - 受付番号入力画面に表示するheaderのinnerHTML
        msg1:'受付番号を入力してください', // {string} - 入力欄の前に表示するメッセージ
        button:'送信',  // {string} - 受付番号入力画面のボタンのラベル
        msg2:'',      // {string} - 入力欄の後に表示するメッセージ
        */
        rex:/^[0-9]{1,4}$/, // {RegExp} - 受付番号チェック用正規表現
      },
      loading: {
        element: null,
        zIndex: 2147483647,  // z-indexの最大値
      },
      passCode:{
        element: null, // {HTMLElement} - パスコード入力画面の要素。setWindowsで設定。
        value: null,  // {string} - パスコード
        dialog: `<p>確認のメールを送信しました。<br>
          記載されているパスコード(数字6桁)を入力してください。</p>
          <ol>
            <li>パスコードの有効期限は1時間です</li>
            <li>まれに迷惑メールと判定される場合があります。<br>メールが来ない場合、そちらもご確認ください。</li>
            <li>3回連続誤入力で1時間ロックアウトされます。</li>
          </ol>`,
        rex:/^[0-9]{6}$/, // {RegExp} - パスコードチェック用正規表現
      },
    }};
    console.log(v.whois+' start.');
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

      console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      v.msg = v.whois + ' abnormal end(step.'+v.step+').' + e.message;
      console.error(v.msg);
      return e;
    }
  }

  /** 秘密鍵・公開鍵を作成し、プロパティに格納する
   * @param {void}
   * @returns {void}
   */
  #setupKeys(){
    const v = {whois:'Auth.#setupKeys',rv:null};
    console.log(v.whois+' start.');
    try {
      // パスワード未指定なら作成
      if( this.RSA.passWord === null ){
        this.RSA.passWord = createPassword(this.RSA.pwLength);
      }

      // 鍵ペアの生成
      this.RSA.sKey = cryptico.generateRSAKey(this.RSA.passWord, this.RSA.bits);
      this.RSA.pKey = cryptico.publicKeyString(this.RSA.sKey);
      //console.log(this.RSA);

      console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      v.msg = v.whois + ' abnormal end(step.'+v.step+').' + e.message;
      console.error(v.msg);
      return e;
    }
  }

  /** Auth関係画面をセットする
   * @param {void} - 無し
   * @returns {void} 無し
   */
  #setWindows(){
    const v = {whois:'Auth.#setWindows',rv:null};
    console.log(v.whois+' start.');
    try {

      // dialog用のCSS定義を追加(getPassCodeと共通)
      v.style = createElement('style');
      document.head.appendChild(v.style);
      for( v.i=0 ; v.i<this.entryNo.css.length ; v.i++ ){
        v.x = this.entryNo.css[v.i];
        for( v.y in v.x.prop ){
          v.prop = v.x.sel+' { '+v.y+' : '+v.x.prop[v.y]+'; }\n';
          console.log(v.prop);
          v.style.sheet.insertRule(v.prop,
            v.style.sheet.cssRules.length,
          );
        }
      }

      // 受付番号入力画面
      this.entryNo.element = createElement({
        tag:'dialog',
        attr:{name:'entryNo',class:'Auth'},
        children:[
          {tag:'div',html:this.entryNo.dialog},
          {tag:'input',attr:{type:'number'}},
          {tag:'input',attr:{type:'button',value:'送信'}},
        ],
      });
      document.querySelector('body').prepend(this.entryNo.element);

      // パスコード入力画面
      this.passCode.element = createElement({
        tag:'dialog',
        attr:{name:'passCode',class:'Auth'},
        children:[
          {tag:'div',html:this.passCode.dialog},
          {tag:'input',attr:{type:'number'}},
          {tag:'input',attr:{type:'button',value:'送信'}},
        ],
      });
      document.querySelector('body').prepend(this.passCode.element);

      //console.log('v.rv='+JSON.stringify(v.rv));
      console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return (e);
    }

  }

  /** entryNo(ID)をダイアログに入力
   * @param {void}
   * @returns {void}
   *
   * - Qiita [非同期な自作 confirm を作ってみた](https://qiita.com/naoki-funawatari/items/4de792bfefe5eab909cc)
   */
  #getEntryNo(){
    const v = {whois:'Auth.#getEntryNo'};
    console.log(v.whois+' start.');
    try {

      this.entryNo.element.showModal();

      return new Promise(resolve => {
        document.querySelector('dialog[name="entryNo"] input[type="button"]')
        .addEventListener('click',(event) => {
          this.entryNo.element.close();
          let rv = event.target.parentElement.querySelector('input[type="number"]').value;
          console.log('Auth.#getEntryNo normal end.',rv);
          resolve(rv);
        });
      });

    } catch(e){
      console.error(v.whois+' abnormal end.\n',e,v);
      return(e);
    }
  }

  /** メールから入力したpassCodeをダイアログに入力
   * @param {void}
   * @returns {void}
   */
  #getPassCode(){
    const v = {whois:'Auth.#getPassCode'};
    console.log(v.whois+' start.');
    try {
      this.passCode.element.showModal();

      return new Promise(resolve => {
        document.querySelector('dialog[name="passCode"] input[type="button"]')
        .addEventListener('click',(event) => {
          this.passCode.element.close();
          let rv = event.target.parentElement.querySelector('input[type="number"]').value;
          console.log('Auth.#getPassCode normal end.',rv);
          resolve(rv);
        });
      });
    } catch(e){
      console.error(v.whois+' abnormal end.\n',e,v);
      return(e);
    }
  }

  /** GASのAPI(doPost)を呼び出す
   * @param {string} fc - 呼び先関数名(auth1A等)
   * @param {Object} arg - 呼び先関数に渡すデータオブジェクト
   * @param {number} [md=0] - モード。0:平文、1:共通鍵で暗号化、2:署名無し暗号化、3:署名付き暗号化
   * @returns {Object} 呼び先からの戻り値
   *
   * - JS: [Async/await](https://ja.javascript.info/async-await)
   * - MDN: [フェッチが成功したかの確認](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch#%E3%83%95%E3%82%A7%E3%83%83%E3%83%81%E3%81%8C%E6%88%90%E5%8A%9F%E3%81%97%E3%81%9F%E3%81%8B%E3%81%AE%E7%A2%BA%E8%AA%8D)
   * - MDN: [fetch()](https://developer.mozilla.org/ja/docs/Web/API/fetch)
   * - MDN: [Response Object](https://developer.mozilla.org/ja/docs/Web/API/Response)
   * - Qiita: [Fetch APIでネットワークエラーも含めてエラーハンドリングする](https://qiita.com/IzumiSy/items/031df1df4f4541e536b4)
   */
  async fetch(fc,arg,md=0){
    const v = {whois:'Auth.fetch',rv:null,data:{cp:this.RSA.pKey}};
    console.log(v.whois+' start.\n',fc,arg,md);
    try {

      v.step = '1'; // 送信するトークンを生成
      v.token = {
        fm: this.entryNo.value,
        to: 'gateway',
        md: md,
        ts: Date.now(),
        dt: {
          fc: fc,
          arg: arg,
        }
      };

      v.step = '2'; // 暗号化・署名
      if( md === 1 ){ // 共通鍵で暗号化
        v.step = 2.1;
        v.token.dt = encryptAES(
          JSON.stringify(v.token.dt),this.commonKey);
      } else if( md === 2 || md === 3 ){
        v.step = 2.2;
        v.plaintext = JSON.stringify(v.token.dt);
        v.encode = encodeURI(v.plaintext);
        v.encrypt = md === 2  // 2:署名無し暗号化、3:署名付き暗号化
        ? cryptico.encrypt(v.encode,this.gateway.pKey)
        : cryptico.encrypt(v.encode,this.gateway.pKey,this.RSA.sKey);
        console.log('encrypt',v.encrypt);
        if( v.encrypt.status !== 'success' )
          throw new Error(JSON.stringify(v.encrypt));
        v.token.dt = v.encrypt.cipher;
      }

      v.step = '3.1'; // fetch
      v.fetch = await fetch(this.gateway.url,{
        "method": "POST",
        "body": JSON.stringify(v.token),
        "Accept": "application/json",
        "Content-Type": "application/json",
      });
      v.step = '3.2';
      v.rv = await v.fetch.json();
      console.log(v.rv);
      if( v.rv instanceof Error ) throw v.rv;
      v.step = '3.3';
      if( v.rv.isErr ){
        console.error(
          v.whois+' abnormal end.'
          + '\n' + v.rv.message
          + '\n' + v.rv.stack
        );
        alert(v.rv.message);
      }

      console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;
    }
  }

}