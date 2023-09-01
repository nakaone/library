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

      // 待機画面の準備
      this.LoadingIcon = new LoadingIcon(
        this.parent.querySelector('.Reception [name="LoadingIcon"]')
      );

      // スキャナの準備
      this.WebScanner = new WebScanner(
        this.parent.querySelector('.Reception [name="WebScanner"]',{
          showVideo:true, // debug: canvasだけでなくvideoも表示
        })
      );

      // 候補者選択画面の準備
      this.itemSelector = new itemSelector(
        this.parent.querySelector('.Reception [name="itemSelector"]')
      );

      // 参加費入力画面の準備
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

      v.step = 1; // QRコードをスキャン or 氏名(一部)の入力
      v.rv = await this.WebScanner.scanQR();
      if( v.rv instanceof Error ) throw v.rv;
      //if( v.rv === null ) 読込失敗orタイムアウト

      v.step = 2; // 入力された検索キーで認証局経由・管理局に該当者情報を問合せ
      this.LoadingIcon.show();
      v.rv = await this.auth.fetch('recept1A',v.keyword,3);
      if( v.rv instanceof Error ) throw v.rv;
      this.LoadingIcon.hide();

      if( v.rv.isErr || v.rv.result.length === 0 ){
        v.step = 3.1; // 検索画面でメッセージをポップアップ
        alert( v.rv.message );
      } else {
        v.step = 3.2; // 検索成功(該当者あり)
        v.target = v.rv.result[0];
        if( v.rv.result.length > 1 ){
          v.step = 3.21; // 該当者が複数
          // ⇒ 該当者一覧画面に遷移、編集対象者を特定
          console.log(JSON.stringify(v.rv.result));
          v.target = await this.itemSelector(v.rv.result);
          if( v.target instanceof Error ) throw v.target;
        }
        v.step = 3.3; // 編集画面を表示し、変更箇所を取得
        v.data = await this.drawPassport.edit(v.target);
        if( v.data instanceof Error ) throw v.data;
        // auth.fetchで変更箇所を管理局に送信
        if( v.data !== null ){
          this.LoadingIcon.show();
          v.rv = await this.auth.fetch('recept2A',v.data,3);
          this.LoadingIcon.hide();
          // 編集結果のメッセージを表示
          alert(v.rv.message);
        }
      }
      // 検索画面を再表示(bootScanner)
      //this.bootScanner();

      // 終了処理
      console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      this.LoadingIcon.hide();
      alert(e.message);
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