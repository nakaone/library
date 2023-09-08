/**
 * @classdesc 参加者数の集計(total number of perticipants)
 */
class TNoPerticipants {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(parent,auth,opt={}){
    const v = {whois:'TNoPerticipants.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        auth: auth, // 認証局のURL

        // メンバとして持つHTMLElementの定義
        parent: parent, // {HTMLElement} 親要素
        parentSelector: null, // {string} 親要素のCSSセレクタ
        wrapper: null, // {HTMLElement} ラッパー
        wrapperSelector: null, // {string} ラッパーのCSSセレクタ
        style: null,  // {HTMLStyleElement} CSS定義

        // CSS/HTML定義
        css:[
          /* TNoPerticipants共通部分 */ `
          .TNoPerticipants.act {
            margin: 1rem;
            width: calc(100% - 2rem);
            display: grid;
            row-gap: 1rem;
            grid-template-columns: 1fr;
          }
          .TNoPerticipants {
            display: none;
          }`,
        ],
        html:[],
      },
    };
    console.log(v.whois+' start.',parent,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;


      v.step = 4; // 終了処理
      this.close();
      console.log(v.whois+' normal end.',this);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /**
   * @returns {null|Error}
   */
  build = async() => {
    const v = {whois:'TNoPerticipants.build',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = '1';
      v.rv = await this.auth.fetch('getTNoParticipants',{
        entryNo: this.auth.entryNo.value,
        publicKey: this.auth.RSA.pKey,
      },3);
      if( v.rv instanceof Error ) throw v.rv;
      if( v.rv.isErr ){
        alert(v.rv.message);
        return null;
      }

      v.step = 3; // 終了処理
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
    const v = {whois:'TNoPerticipants.template',step:0,rv:null};
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