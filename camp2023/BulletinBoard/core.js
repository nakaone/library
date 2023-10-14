/**
 * @classdesc 掲示板への投稿、表示
 */
class BulletinBoard {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(parent,auth,opt={}){
    const v = {whois:'BulletinBoard.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        interval: 60000,  // 掲示板の更新間隔。ミリ秒
        intervalId: null, // インターバルID
        posts: [],  // 投稿メッセージ一覧
        auth: auth, // 認証局他のAuthインスタンス
        authority: 2, // 投稿権限

        // メンバとして持つHTMLElementの定義
        parent: parent, // {HTMLElement} 親要素
        parentSelector: null, // {string} 親要素のCSSセレクタ
        wrapper: null, // {HTMLElement} ラッパー
        wrapperSelector: null, // {string} ラッパーのCSSセレクタ
        style: null,  // {HTMLStyleElement} CSS定義

        // CSS/HTML定義
        css:[
          /* BulletinBoard共通部分 */`
          .BulletinBoard .wrapper {
            width: 100%;
            height: calc(100vh - 4rem);
          }
          `,
          /* 掲示板領域
            .board height: 100vh - 上下余白(2rem×2)
            .display height: 100vh - 上下余白(2rem×2) - ボタン高さ4rem - ボタン上余白2rem
          */`
          .BulletinBoard .board {
            display: none;
          }
          .BulletinBoard .board.act {
            width: 100%;
            max-height: calc(100vh - 2rem);
            display: grid;
            grit-template-rows: 1fr minmax(0rem, 7rem);
          }
          .BulletinBoard .board .display {
            width: 100%;
            display: block;
          }
          .BulletinBoard .board .display .date {
            margin-top : 1rem;
            padding-left : 1rem;
            font-family : fantasy;
            font-size : 2rem;
            border-bottom : solid 4px #ddd;
          }
          .BulletinBoard .board .display .header {
            margin-top : 1rem;
            display : grid;
            grid-template-columns : 3rem 1fr;
            grid-gap : 0.5rem;
            background-color : #ddd;
            padding-left : 0.5rem;
          }
          .BulletinBoard .board .display .message {
            font-size: 1.3rem;
            line-height: 2rem;
          }
          .BulletinBoard .board .display .fromto {
            font-size : 1rem;
          }
          .BulletinBoard .board .display .time {
            font-size : 0.8rem;
            font-family : cursive;
          }
          .BulletinBoard .board button {
            display: block;
            margin: 2rem 0rem 1rem 0rem;
            width: 100%;
            height: 7rem;
            font-size: 2rem;
          }`,
          /* 投稿用画面 */`
          .BulletinBoard .post {
            display: none;
          }
          .BulletinBoard .post.act {
            width: 100%;
            margin-top: 5rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 2rem;
          }
          .BulletinBoard .post > * {
            width: 100%;
          }
          .BulletinBoard input {
            font-size: 1.5rem;
          }
          .BulletinBoard textarea {
            grid-column: 1 / 3;
            margin: 2rem 0px;
            height: 6rem;
          }
          .BulletinBoard button {
            font-size: 2rem;
            padding: 0.5rem 0rem;
          }`,
        ],
        html:[
          {attr:{class:'board act'},children:[
            {attr:{class:'display'}},
            {tag:'button',text:'投稿用画面を開く'},
          ]},
          {attr:{class:'post'},children:[
            {tag:'p',text:'From:'},
            {tag:'p',text:'To:'},
            {tag:'input',attr:{name:'from'}},
            {tag:'input',attr:{name:'to',value:'参加者各位'}},
            {tag:'textarea'},
            {tag:'button',attr:{name:'cancel'},text:'取消'},
            {tag:'button',attr:{name:'post'},text:'投稿'},
          ]},
          {attr:{class:'BulletinBoard',name:'LoadingIcon'}},
        ],
      },
    };
    console.log(v.whois+' start.',parent,auth,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 2; // 作業領域をメンバに登録
      this.board = this.wrapper.querySelector('.board');
      this.display = this.board.querySelector('.display');
      this.post = this.wrapper.querySelector('.post');

      v.step = 3; // 投稿権限があればボタン表示
      v.postButton = this.wrapper.querySelector('.board button');
      v.authority = Number(this.auth.info.authority);
      if( (v.authority & this.authority) > 0 ){
        v.postButton.addEventListener('click',this.announce);
      } else {
        // 投稿権限が無ければボタン非表示
        v.postButton.style.display = 'none';
      }

      v.step = 4; // 新規のお知らせが来たら末尾を表示するよう設定
      // https://at.sachi-web.com/blog-entry-1516.html
      this.mo = new MutationObserver(() => {
        console.log('BulletinBoard: mutation detected');
        this.display.scrollTop = this.display.scrollHeight;
        //this.parent.scrollTop = this.parent.scrollHeight;
      });
      this.mo.observe(this.parent,{
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,//孫以降のノードの変化も検出
        attributeOldValue: true,//変化前の属性データを記録する
        characterDataOldValue: true,//変化前のテキストノードを記録する
        attributeFilter: [],//配列で記述した属性だけを見張る
      });

      v.step = 5; // 待機画面の準備
      this.LoadingIcon = new LoadingIcon(
        this.parent.querySelector('[name="LoadingIcon"]')
      );
      if( this.LoadingIcon instanceof Error ) throw this.LoadingIcon;

      v.step = 6; // 終了処理
      this.close();
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 掲示板から配信を受ける
   *
   * this.startにより定期的に起動されるよう設定される。
   * @param {void}
   * @returns
   */
  receive = async() => {
    const v = {whois:'BulletinBoard.receive',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // Auth.fetchで認証局に問い合わせ
      v.rv = await this.auth.fetch('delivery',{
        entryNo: this.auth.entryNo.value,
        publicKey: this.auth.RSA.pKey,
      },3);
      if( v.rv instanceof Error ) throw v.rv;
      if( v.rv.isErr ){
        alert(v.rv.message);
        return null;
      }

      // 掲示板領域をクリア
      this.display.innerHTML = '';

      // timestamp順にソート
      this.posts = v.rv.result;
      this.posts.sort((a,b) => a.timestamp < b.timestamp ? -1 : 1);
      // 日付型に変更
      this.posts.forEach(x => x.timestamp = new Date(x.timestamp));

      v.lastDate = new Date('1900/1/1');
      this.posts.forEach(post => {
        if( post.timestamp.getFullYear() !== v.lastDate.getFullYear()
         || post.timestamp.getMonth()    !== v.lastDate.getMonth()
         || post.timestamp.getDate()     !== v.lastDate.getDate()
        ){
          // 投稿日が変わったら日付を表示
          // 月日のみ(ex 9/30)
          this.display.appendChild(createElement({
            attr: {class:'date'},
            text: (post.timestamp.getMonth() + 1)
                + ' / ' +post.timestamp.getDate()
          }));
          /* 英式(ex September 30,2023)
          this.display.appendChild(createElement({
            attr: {class:'date'},
            text: new Intl.DateTimeFormat('en', { month: 'long'}).format(post.timestamp)
              + ' ' + ('00'+post.timestamp.getDate()).slice(-2)
              + ', ' + post.timestamp.getFullYear(),
          }));
          */
          // 前行の日付を書き換え
          v.lastDate = post.timestamp;
        }
        // From / To
        this.display.appendChild(createElement({
          attr: {class:'header'},
          children: [{
            attr: {class:'time'},
            text: ('0'+post.timestamp.getHours()).slice(-2) + ':' +
                  ('0'+post.timestamp.getMinutes()).slice(-2)
          },{
            attr: {class:'fromto'},
            text: post.from + ' ▶️ ' + post.to
          }],
        }));
        // メッセージ
        this.display.appendChild(createElement({
          attr: {class:'message'},
          text: post.message,
        }));
      });

      v.step = 3; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 掲示板に投稿する
   * @returns {null|Error}
   */
  announce = async() => {
    const v = {whois:'BulletinBoard.announce',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = '1'; // from欄に申込者氏名をセット
      this.post.querySelector('[name="from"]').value
      = this.auth.info['申込者氏名'];

      v.step = '2'; // 掲示板を閉じ、投稿用領域を開く
      this.board.classList.remove('act');
      this.post.classList.add('act');

      v.step = '3';
      return new Promise(resolve => {
        // 取消 -> 戻り値はnull
        this.post.querySelector('[name="cancel"]')
        .addEventListener('click',(event) => {
          event.stopPropagation();
          resolve(this.upload(event));
        });

        // 決定 -> GASに投稿内容をアップロード
        this.post.querySelector('[name="post"]')
        .addEventListener('click',(event) => {
          event.stopPropagation();
          resolve(this.upload(event));
        });
      });

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 投稿内容をGASにアップロード
   * @param {Object} data - アップロードするデータオブジェクト
   * @returns {void}
   */
  upload = async(event) => {
    const v = {whois:'BulletinBoard.upload',step:'0',rv:null};
    console.log(v.whois+' start.',event);
    try {

      v.step = 1; // 待機画面表示
      this.LoadingIcon.show();

      v.step = 2; // 取消ボタンと投稿ボタンを識別
      v.name = event.target.getAttribute('name');

      if( v.name === 'post' ){
        v.step = 3.1; // 投稿処理
        v.data = {
          from     : this.post.querySelector('[name="from"]').value,
          to       : this.post.querySelector('[name="to"]').value,
          message  : this.post.querySelector('textarea').value,
          timestamp: new Date().toLocaleString(),
        };
        v.rv = await this.auth.fetch('post',v.data,3);
        if( v.rv instanceof Error ) throw v.rv;
        if( v.rv.isErr ) throw new Error(v.rv.message);
        v.step = 3.2; // 掲示板を最新の状態に更新する
        v.rv = await this.receive();
        if( v.rv instanceof Error ) throw v.rv;
      }

      v.step = 4; // 表示領域を表示、投稿領域を閉鎖
      this.board.classList.add('act');
      this.post.classList.remove('act');

      v.step = 5; // 終了処理
      this.LoadingIcon.hide();
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }


  /** 定期的な配信(受信)を開始する
   * @param {void}
   * @returns {void}
   */
  start = () => {
    const v = {whois:'BulletinBoard.start',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      if( this.intervalId !== null ){
        this.stop();
      }
      this.intervalId = setInterval(this.receive, this.interval);

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 定期的な配信(受信)を終了する
   * @param {void}
   * @returns {void}
   */
  stop = () => {
    const v = {whois:'BulletinBoard.stop',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      clearInterval(this.intervalId);
      this.intervalId = null;


      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 設定内容の変更(主に時間間隔の修正を想定)
   * @param {Object} opt
   * @returns {void}
   */
  change = (opt) => {
    const v = {whois:'BulletinBoard.change',step:'0',rv:null};
    console.log(v.whois+' start.',opt);
    try {

      v.current = JSON.parse(JSON.stringify(this));
      v.rv = setupInstance(this,opt,v.current);
      if( v.rv instanceof Error ) throw v.rv;
      // 変更された内容でリスタート
      if( this.intervalId !== null ){
        this.stop();
      }
      this.start();

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
}