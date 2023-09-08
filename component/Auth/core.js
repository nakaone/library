/**
 * @classdesc ブラウザで認証を行い、Webアプリから設定情報(config)を取得、後続処理を行う
 *
 * - パスコード(passCode) : 受付番号入力後受信したメールに記載された番号
 * - パスワード(passWord) : 鍵ペア生成の際、秘密鍵の基となる文字列
 */
class Auth {
  /**
   * @constructor
   * @param {string} gatewayUrl - 認証局APIのURL
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(gatewayUrl,opt={}){
    const v = {whois:'Auth.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
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
  
        // メンバとして持つHTMLElementの定義
        parent: 'body', // {HTMLElement} 親要素
        parentSelector: null, // {string} 親要素のCSSセレクタ
        wrapper: null, // {HTMLElement} ラッパー
        wrapperSelector: null, // {string} ラッパーのCSSセレクタ
        style: null,  // {HTMLStyleElement} CSS定義

        // CSS/HTML定義
        css:[
          /* Auth共通部分 */ `
          .Auth.act {
            margin: 1rem;
            width: calc(100% - 2rem);
            display: grid;
            row-gap: 1rem;
            grid-template-columns: 1fr;
          }
          .Auth {
            display: none;
          }`,
        ],
        html:[],
      },
    };
    console.log(v.whois+' start.',gatewayUrl,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;


      v.step = 4; // 終了処理
      this.close();
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 表示/非表示ボタンクリック時の処理を定義
   * @param {PointerEvent|string} event - クリック時のイベントまたはボタンのCSSセレクタ
   * @param {boolean} show - trueなら開く
   * @returns {void}
   */
  toggle = (event,show) => {
    const v = {whois:'Auth.toggle',step:1,rv:null};
    console.log(v.whois+' start.',event,show);
    try {

      let content;  // 表示/非表示を行う対象となる要素
      let button;   // クリックされたボタンの要素
      if( typeof event === 'string' ){
        v.step = 1.1; // 初期設定時(引数がPointerEventではなくstring)
        content = this.wrapper.querySelector(event+' .content');
        button = this.wrapper.querySelector(event+' button');
      } else {
        v.step = 1.2; // ボタンクリック時
        content = event.target.parentElement.parentElement
        .querySelector('.content');
        button = event.target;
      }

      v.step = 2; // 表示->非表示 or 非表示->表示 を判断
      let toOpen = show ? show : (button.innerText === '表示');
      if( toOpen ){
        v.step = 2.1; // 表示に変更する場合
        button.innerText = '非表示';
        content.classList.add('act');
      } else {
        v.step = 2.2; // 非表示に変更する場合
        button.innerText = '表示';
        content.classList.remove('act');
      }

      v.step = 3;
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 親要素内を表示 */
  open = () => {
    this.wrapper.classList.add('act');
  }

  /** 親要素内を隠蔽 */
  close = () => {
    this.wrapper.classList.remove('act');
  }

  /**
   * @returns {null|Error}
   */
  template = () => {
    const v = {whois:'Auth.template',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 3; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }  
}