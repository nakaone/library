/**
 * @classdesc authMenu機能群のクライアント側クラス
 */
class authMenu {

  //::$tmp/authMenu.changeScreen.js::

  //::$tmp/authMenu.genNavi.js::

  //::$tmp/authMenu.objectize.js::

  //::$tmp/authMenu.setProperties.js::

  //::$tmp/authMenu.storeUserInfo.js::

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
