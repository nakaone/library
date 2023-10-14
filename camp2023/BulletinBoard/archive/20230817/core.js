/**
 * @classdesc 掲示板
 */
class BulletinBoard {
  /**
   * @constructor
   * @param {Object} opt - オプション
   * @returns {void}
   */
  constructor(opt){
    const v = {whois:'BulletinBoard.constructor',step:'0',rv:null};
    console.log(v.whois+' start.',opt);
    try {

      v.step = '1'; // オプション未定義項目の既定値をプロパティにセット
      v.rv = setupInstance(this,opt,{
        //auth: null, // {Auth} 認証局他のAuthインスタンス
        parent: parent, // {HTMLElement} 親要素(ラッパー)
        parentSelector: null, // {string} 親要素(ラッパー)のCSSセレクタ
        interval: 60000,
        intervalId: null, // インターバルID
        posts: [],  // 投稿メッセージ一覧
        css: [
          {sel:'.date',prop:{
            'margin-top':'1rem',
            'padding-left': '1rem',
            'font-family': 'fantasy',
            'font-size': '1.5rem',
            'border-bottom': 'solid 4px #ddd'
          }},
          {sel:'.header',prop:{
            'margin-top': '1rem',
            'display': 'grid',
            'grid-template-columns': '3rem 1fr',
            'grid-gap': '0.5rem',
            'background-color': '#ddd',
            'padding-left': '0.5rem',
          }},
          {sel:'.fromto',prop:{
            'font-size': '0.8rem',
          }},
          {sel:'.time',prop:{
            'font-size': '0.8rem',
            'font-family': 'cursive',
          }},
          {sel:'.message',prop:{}},
        ],
      });
      console.log('l.51',v.rv,this.auth);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = '3'; // 新規のお知らせが来たら末尾を表示するよう設定
      // https://at.sachi-web.com/blog-entry-1516.html
      this.mo = new MutationObserver(() => {
        console.log('mutation detected');
        this.parent.scrollTop = this.parent.scrollHeight;
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

      v.step = '4'; // インターバルをセット
      this.start();

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 掲示板にポストする
   *
   */
  post = async () => {
    const v = {whois:'BulletinBoard.post',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {



      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      this.stop();
      return e;
    }
  }

  /** 掲示板から配信を受ける
   *
   * this.startにより定期的に起動されるよう設定される。
   * @param {void}
   * @returns
   */
  delivery = async() => {
    const v = {whois:'BulletinBoard.delivery',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      // Auth.fetchで認証局に問い合わせ
      console.log(this.auth);
      v.rv = await this.auth.fetch('delivery',{
        entryNo: this.auth.entryNo.value,
        publicKey: this.auth.RSA.pKey,
      },3);
      if( v.rv.isErr ){
        alert(v.rv.message);
        return null;
      }

      // 親領域に描画
      this.parent.innerHTML = '';
      // timestamp順にソート
      this.posts = v.rv.result;
      this.posts.sort((a,b) => a.timestamp < b.timestamp ? -1 : 1);
      console.log(this.posts);
      // 日付型に変更
      this.posts.forEach(x => x.timestamp = new Date(x.timestamp));

      v.lastDate = new Date('1900/1/1');
      this.posts.forEach(post => {
        if( post.timestamp.getFullYear() !== v.lastDate.getFullYear()
         || post.timestamp.getMonth()    !== v.lastDate.getMonth()
         || post.timestamp.getDate()     !== v.lastDate.getDate()
        ){
          // 投稿日が変わったら日付を表示
          this.parent.appendChild(createElement({
            attr: {class:'date'},
            text: new Intl.DateTimeFormat('en', { month: 'long'}).format(post.timestamp)
              + ' ' + ('00'+post.timestamp.getDate()).slice(-2)
              + ', ' + post.timestamp.getFullYear(),
          }));
          // 前行の日付を書き換え
          v.lastDate = post.timestamp;
        }
        // From / To
        this.parent.appendChild(createElement({
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
        this.parent.appendChild(createElement({
          attr: {class:'message'},
          text: post.message,
        }));
      });

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      this.stop();
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
      this.intervalId = setInterval(this.delivery, this.interval);

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
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
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 設定内容の変更(主に時間間隔の修正を想定)
   * @param {Object} opt
   * @returns {void}
   */
  change = (opt) => {
    const v = {whois:'BulletinBoard.change',step:'0',rv:null};
    console.log(v.whois+' start.');
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
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}