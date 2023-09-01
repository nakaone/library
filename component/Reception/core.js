/**
 * @classdesc クラスの概要説明
 */
class Reception {
  /**
   * @constructor
   * @param {Auth} auth - 認証局他のAuthインスタンス
   * @param {string|HTMLElement} parent - 親要素(wrapper)またはそのCSSセレクタ
   * @returns {true|Error}
   */
  constructor(auth,parent,opt={}){
    const v = {whois:'Reception.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        auth: auth, // 認証局他のAuthインスタンス
        parent: typeof parent !== 'string' ? parent
          : document.querySelector(parent),
        // CSS/HTML定義
        css:[
          /* Reception共通部分 */ ``,
        ],
        html:[  // イベント定義を複数回行わないようにするため、eventで定義
          {attr:{class:'Reception',name:'LoadingIcon'}},
          {attr:{class:'Reception',name:'WebScanner'}},
          {attr:{class:'Reception',name:'itemSelector'}},
          {attr:{class:'Reception',name:'drawPassport'}},
        ],
      },
    };
    console.log(v.whois+' start.');
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      this.LoadingIcon = new LoadingIcon(
        this.parent.querySelector('.Reception [name="LoadingIcon"]')
      );

      this.WebScanner = new WebScanner(
        '.Reception [name="WebScanner"]'
      );
      this.itemSelector = new itemSelector(
        this.parent.querySelector('.Reception [name="itemSelector"]')
      );
      this.drawPassport = new drawPassport(
        this.parent.querySelector('.Reception [name="drawPassport"]')
      );

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  main = async () => {
    const v = {whois:'Reception.main',rv:true,step:0};
    console.log(v.whois+' start.');
    try {

      v.rv = await this.WebScanner.scanQR();
      if( v.rv instanceof Error ) throw v.rv;

      this.LoadingIcon.show();
      this.LoadingIcon.hide();
      console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }


  template = () => {
    const v = {whois:'Reception.template',rv:true,step:0};
    console.log(v.whois+' start.');
    try {

      console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}