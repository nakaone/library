/**
 * @classdesc 受付番号等の参加者特定キーを基に参加者を検索、参加費等の編集を行う
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
        parent: parent, // {HTMLElement} 親要素(ラッパー)
        parentSelector: null, // {string} 親要素(ラッパー)のCSSセレクタ
        // CSS/HTML定義
        // css:[],
        html:[  // イベント定義を複数回行わないようにするため、eventで定義
          {attr:{class:'Reception',name:'LoadingIcon'}},
          {attr:{class:'Reception',name:'WebScanner'}},
          {attr:{class:'Reception',name:'itemSelector'}},
          {attr:{class:'Reception',name:'Perticipants'}},
        ],
      },
    };
    console.log(v.whois+' start.',auth,parent,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 2; // 待機画面の準備
      this.LoadingIcon = new LoadingIcon(
        this.parent.querySelector('[name="LoadingIcon"]')
      );
      if( this.LoadingIcon instanceof Error ) throw this.LoadingIcon;

      v.step = 3; // スキャナの準備
      this.WebScanner = new WebScanner(
        this.parent.querySelector('[name="WebScanner"]',{
          description: '受付番号または氏名(ヨミ)の一部を入力してください',
        })
      );
      if( this.WebScanner instanceof Error ) throw this.WebScanner;

      v.step = 4; // 候補者選択画面の準備
      this.itemSelector = new itemSelector(
        this.parent.querySelector('[name="itemSelector"]')
      );
      if( this.itemSelector instanceof Error ) throw this.itemSelector;

      v.step = 5; // 参加費入力画面の準備
      this.Perticipants = new Perticipants(
        this.parent.querySelector('[name="Perticipants"]')
      );
      if( this.Perticipants instanceof Error ) throw this.Perticipants;

      v.step = 6; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 受付番号等の参加者特定キーを基に参加者を検索、参加費等の編集を行う
   * @param {void}
   * @returns {true|Error}
   */
  main = async () => {
    const v = {whois:'Reception.main',rv:true,step:0,loop:true};
    console.log(v.whois+' start.');
    try {

      while(v.loop){  // v.loopがtrueの間、繰り返し
        // 停止条件①：エラー発生

        v.step = 1; // QRコードをスキャン or 氏名(一部)の入力
        v.keyword = null;
        v.keyword = await this.WebScanner.entry();
        if( v.keyword instanceof Error ) throw v.keyword;
        if( v.keyword === null ) continue; // 読込失敗orタイムアウト
  
        v.step = 2; // 入力された検索キーで認証局経由・管理局に該当者情報を問合せ
        this.LoadingIcon.show();
        v.rv = await this.auth.fetch('recept1A',v.keyword,3);
        if( v.rv instanceof Error ) throw v.rv;
        this.LoadingIcon.hide();
  
        v.step = 3; // 無権限・不正公開鍵・不適切検索キー文字列のエラー
        if( v.rv.isErr ){
          throw new Error(v.rv.message);
        }

        if( v.rv.result.length === 0 ){
          v.step = 3.1; // エラーまたは該当無し
          // ⇒ 検索画面でメッセージをポップアップ
          alert( v.rv.message );
        } else {
          v.step = 3.2; // 検索成功(該当者あり)
          v.target = v.rv.result[0];
          if( v.rv.result.length > 1 ){
            v.step = 3.21; // 該当者が複数
            // ⇒ 該当者一覧画面に遷移、編集対象者を特定
            v.target = await this.itemSelector.select(v.rv.result);
            if( v.target instanceof Error ) throw v.target;
          }
          v.step = 3.3; // 編集画面を表示し、変更箇所を取得
          v.data = await this.Perticipants.edit(v.target);
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
      }

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
}