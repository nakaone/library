lastUpdate: 2023年 7月30日 日曜日 07時26分22秒 JST

## Classes

<dl>
<dt><a href="#Auth">Auth</a></dt>
<dd><p>入力されたID/PWと登録情報を突合し、IDに紐づく各種情報を返す</p>
<ul>
<li>パスコード(passCode) : 受付番号入力後受信したメールに記載された番号</li>
<li>パスワード(passWord) : 鍵ペア生成の際、秘密鍵の基となる文字列</li>
</ul>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#AuthOpt">AuthOpt</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Auth"></a>

## Auth
入力されたID/PWと登録情報を突合し、IDに紐づく各種情報を返す

- パスコード(passCode) : 受付番号入力後受信したメールに記載された番号
- パスワード(passWord) : 鍵ペア生成の際、秘密鍵の基となる文字列

**Kind**: global class  
<a name="new_Auth_new"></a>

### new Auth([parentSelector], [opt])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [parentSelector] | <code>string</code> | <code>&quot;&#x27;body&#x27;&quot;</code> | 親要素のCSSセレクタ |
| [opt] | [<code>AuthOpt</code>](#AuthOpt) | <code>{}</code> | 生成時オプション |

<a name="AuthOpt"></a>

## AuthOpt : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [entryNo] | <code>string</code> |  | 受付番号(ID) |
| [passWord] | <code>string</code> |  | パスワード |
| [header] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 受付番号入力画面に表示するheaderのinnerHTML |
| [entryNoMessage] | <code>string</code> | <code>&quot;&#x27;受付番号を入力してください&#x27;&quot;</code> | 受付番号入力画面に表示するメッセージ |
| [entryNoButton] | <code>string</code> | <code>&quot;&#x27;送信&#x27;&quot;</code> | 受付番号入力画面のボタンのラベル |
| [entryNoRegExp] | <code>RegExp</code> | <code>/^[0-9]{1,4}$/</code> | 受付番号チェック用正規表現 |


## source

```
/* コアScript */
/**
 * @typedef {Object} AuthOpt
 * @prop {string} [entryNo] - 受付番号(ID)
 * @prop {string} [passWord] - パスワード
 * @prop {string} [header=''] - 受付番号入力画面に表示するheaderのinnerHTML
 * @prop {string} [entryNoMessage='受付番号を入力してください'] - 受付番号入力画面に表示するメッセージ
 * @prop {string} [entryNoButton='送信'] - 受付番号入力画面のボタンのラベル
 * @prop {RegExp} [entryNoRegExp=/^[0-9]{1,4}$/] - 受付番号チェック用正規表現
 */

/**
 * @classdesc 入力されたID/PWと登録情報を突合し、IDに紐づく各種情報を返す
 *
 * - パスコード(passCode) : 受付番号入力後受信したメールに記載された番号
 * - パスワード(passWord) : 鍵ペア生成の際、秘密鍵の基となる文字列
 */
class Auth {
  /**
   * @constructor
   * @param {string} [parentSelector='body'] - 親要素のCSSセレクタ
   * @param {AuthOpt} [opt={}] - 生成時オプション
   */
  constructor(parentSelector,opt={}){
    const v = {rv:null};
    console.log('Auth.constructor start.');
    try {

      // 1.オプション未定義項目の既定値をプロパティにセット
      this.#setProperties(this,{
        parentWindow: document.querySelector(parentSelector), // 親画面
        parentSelector: parentSelector, // 親画面のCSSセレクタ
        keys:{  // 自他局のRSAキー関係情報
          passWord: null, // {string} - パスワード
          secret: null,
          public: { // {string} - 公開鍵
            self: null,
            gateway: null,
            front: null,
          }
        },
        entryNo:{ // 受付番号関係
          element: null, // {HTMLElement} - 画面の要素
          value: null,  // {string} - 受付番号
          header:'',    // {string} - 受付番号入力画面に表示するheaderのinnerHTML
          msg1:'受付番号を入力してください', // {string} - 入力欄の前に表示するメッセージ
          button:'送信',  // {string} - 受付番号入力画面のボタンのラベル
          msg2:'',      // {string} - 入力欄の後に表示するメッセージ
          rex:/^[0-9]{1,4}$/, // {RegExp} - 受付番号チェック用正規表現
        },
        passCode:{
          element: null, // {HTMLElement} - 画面の要素
          value: null,  // {string} - パスコード
          header:'',    // {string} - パスコード入力画面に表示するheaderのinnerHTML
          msg1:'確認のメールを送信しました。記載されているパスコード(数字6桁)を入力してください。<br>'
          + '※まれに迷惑メールと判定される場合があります。メールが来ない場合、そちらもご確認ください。',
                        // {string} - 入力欄の前に表示するメッセージ
          button:'送信',  // {string} - 受付番号入力画面のボタンのラベル
          msg2: '※パスコードの有効期限は1時間です',
          rex:/^[0-9]{1,4}$/, // {RegExp} - 受付番号チェック用正規表現
        },
      },opt);
      console.log('this:',this);

      // 2.各種画面を用意する
      this.#setWindows();

      // 3.entryNo(ID)を認証局に送信、パスコードメールを受け取る
      this.#getEntryNo();

      //console.log('v.rv='+JSON.stringify(v.rv));
      console.log('Auth.constructor end.');
      return v.rv;
    } catch(e){
      console.error('Auth.constructor abnormal end.',e);
      // ブラウザで実行する場合はアラート表示
      //if( typeof window !== 'undefined' ) alert(e.stack);
      throw e; //以降の処理を全て停止
    }
  }

  /** 既定値を設定する
   * @param {AuthOpt} opt - 生成時オプションとして渡された値
   * @returns {void}
   */
  #setProperties(dest,def,opt){
    const v = {rv:true};
    console.log('Auth.#setProperties start.');
    try {

      for( let key in def ){
        if( whichType(def[key]) !== 'Object' ){
          dest[key] = opt[key] || def[key]; // 配列はマージしない
        } else {
          if( !dest.hasOwnProperty(key) ) dest[key] = {};
          this.#setProperties(dest[key],def[key],opt[key]||{});
        }
      }

      //console.log('this='+JSON.stringify(this));
      console.log('Auth.#setProperties end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#setProperties abnormal end.',e);
      //if( typeof window !== 'undefined' ) alert(e.stack);
      v.rv.stack = e.stack; return v.rv;
    }
  }

  /** 秘密鍵・公開鍵を作成し、プロパティに格納する
   * @param {void}
   * @returns {void}
   */
  #setupKeys(){
    const v = {rv:null};
    console.log('Auth.#setupKeys start.');
    try {
      // 鍵ペアの生成
      // this.keys.passWordが設定されていたらそれを使用

      
      //console.log('v.rv='+JSON.stringify(v.rv));
      console.log('Auth.#setupKeys end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#setupKeys abnormal end.',e);
      // ブラウザで実行する場合はアラート表示
      if( typeof window !== 'undefined' ) alert(e.stack); 
      //throw e; //以降の処理を全て停止する場合
      v.rv.stack = e.stack; return v.rv; // 処理継続する場合
    }
  }

  /** Auth関係画面をセットする
   *
   */
  #setWindows(){
    const v = {rv:null};
    console.log('Auth.#setWindows start.');
    try {
      // Auth関係画面のwrapper
      this.AuthWindow = createElement({
        style:{
          // CSSで全画面オーバーレイを実装する方法＆コード例
          // https://pisuke-code.com/css-fullscreen-overlay/
          position: "absolute",
          left: 0, top: 0,
          width: "100%", height:"100%",
          background:"#fff",
          zIndex:2147483647,  // z-indexの最大値
        },
      });

      // 受付番号入力画面
      this.entryNo.element = createElement({
        children:[
          {html:this.entryNo.header}, // タイトル
          {tag:'p',html:this.entryNo.msg1},  // 入力欄前メッセージ
          { // inputBox
            tag:'input',
            attr:{type:'text',name:'entryNo'},
            event:{'input':()=>{}},
          },
          { // 送信ボタン
            tag:'input',
            attr:{
              type:'button',
              name:'entryNoButton',
              value:this.entryNo.button,disabled:true
            },
          },
          {tag:'p',html:this.entryNo.msg2},  // 入力欄後メッセージ
        ],
      });

      // ローディング画面
      this.loading = {element:createElement({
        style:{
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          height:"100%",
          width:"100%",
        },
        children:[
          {
            attr:{class:'loading5'},
            style:{ // 点の大きさと色
              "--dot-size":"2rem",
              "--R":0,
              "--G":0,
              "--B":0,
            },
            text:'loading...'
          },
        ],
      })};

      // パスコード入力画面
      this.passCode.element = createElement({
        children:[
          {html:this.passCode.header}, // タイトル
          {tag:'p',html:this.passCode.msg1},  // 入力欄前メッセージ
          { // inputBox
            tag:'input',
            attr:{type:'text',name:'passCode'},
            event:{'input':()=>{}},
          },
          { // 送信ボタン
            tag:'input',
            attr:{
              type:'button',
              name:'passCodeButton',
              value:this.passCode.button,disabled:true
            },
          },
          {tag:'p',html:this.passCode.msg2},  // 入力欄後メッセージ
        ],
      });

      // 画面をセット
      this.parentWindow.appendChild(this.AuthWindow);
      this.AuthWindow.appendChild(this.entryNo.element);
      this.AuthWindow.appendChild(this.loading.element);
      this.AuthWindow.appendChild(this.passCode.element);

      // 入力された受付番号をプロパティに登録

      //console.log('v.rv='+JSON.stringify(v.rv));
      console.log('Auth.#setWindows end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#setWindows abnormal end.',e);
      // ブラウザで実行する場合はアラート表示
      //if( typeof window !== 'undefined' ) alert(e.stack);
      v.rv.stack = e.stack; return v.rv; // 処理継続する場合
    }

  }

  #changeScreen(screenId){
    const v = {rv:true};
    console.log('Auth.#changeScreen start.');
    try {

      ['entryNo','loading','passCode'].forEach(x => {
        this[x].element.style.display = x === screenId ? '' : 'none';
      });

      console.log('Auth.#changeScreen end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#changeScreen abnormal end.',e);
      // ブラウザで実行する場合はアラート表示
      //if( typeof window !== 'undefined' ) alert(e.stack);
      //throw e; //以降の処理を全て停止する場合
      v.rv.stack = e.stack; return v.rv; // 処理継続する場合
    }

  }



  #getEntryNo(){
    const v = {rv:null};
    console.log('Auth.#getEntryNo start.');
    try {

      this.#changeScreen('entryNo');
      
      //console.log('v.rv='+JSON.stringify(v.rv));
      console.log('Auth.#getEntryNo end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#getEntryNo abnormal end.',e);
      // ブラウザで実行する場合はアラート表示
      if( typeof window !== 'undefined' ) alert(e.stack);
      //throw e; //以降の処理を全て停止する場合
      v.rv.stack = e.stack; return v.rv; // 処理継続する場合
    }

  }

}
```
