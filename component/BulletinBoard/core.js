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
    console.log(v.whois+' start.');
    try {

      v.step = '1'; // オプション未定義項目の既定値をプロパティにセット
      this.#setProperties(this,null,opt);
      this.parent.element = document.querySelector(this.parent.selector);

      v.step = '2'; // CSS定義を追加(getPassCodeと共通)
      v.style = createElement('style');
      document.head.appendChild(v.style);
      for( v.i=0 ; v.i<this.css.length ; v.i++ ){
        v.x = this.css[v.i];
        for( v.y in v.x.prop ){
          v.prop = this.parent.selector + ' ' + v.x.sel
            + ' { ' + v.y + ' : ' + v.x.prop[v.y] + '; }\n';
          v.style.sheet.insertRule(v.prop,
            v.style.sheet.cssRules.length,
          );
        }
      }

      v.step = '3'; // 新規のお知らせが来たら末尾を表示するよう設定
      // https://at.sachi-web.com/blog-entry-1516.html
      this.mo = new MutationObserver(() => {
        console.log('mutation detected');
        this.parent.element.scrollTop = this.parent.element.scrollHeight;
      });
      this.mo.observe(this.parent.element,{
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
      console.error(v.whois+' abnormal end.',e,v);
      return e;
    }
  }

  /** 設定先のオブジェクトに起動時パラメータを優先して既定値を設定する
   * @param {Object} dest - 設定先のオブジェクト。初回呼出時はthis
   * @param {def} def - 既定値のオブジェクト。初回呼出時はnull(内部定義を使用)
   * @param {AuthOpt} opt - 起動時にオプションとして渡されたオブジェクト
   * @returns {void}
   */
  #setProperties(dest,def,opt){
    const v = {whois:'Reception.#setProperties',rv:true,def:{
      auth: null, // {Auth} 認証局他のAuthインスタンス
      parent: {
        selector: '',
        element: null,
      },
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

      //console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      v.msg = v.whois + ' abnormal end(step.'+v.step+').' + e.message;
      console.error(v.msg);
      return e;
    }
  }

  post(){
    const v = {whois:'BulletinBoard.constructor',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {


      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }

  /**
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
        entryNo: this.auth.info.entryNo,
        publicKey: this.auth.RSA.pKey,
      },3);
      if( v.rv.isErr ){
        alert(v.rv.message);
        return null;
      }

      // 親領域に描画
      this.parent.element.innerHTML = '';
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
          this.parent.element.appendChild(createElement({
            attr: {class:'date'},
            text: new Intl.DateTimeFormat('en', { month: 'long'}).format(post.timestamp)
              + ' ' + ('00'+post.timestamp.getDate()).slice(-2)
              + ', ' + post.timestamp.getFullYear(),
          }));
          // 前行の日付を書き換え
          v.lastDate = post.timestamp;
        }
        // From / To
        this.parent.element.appendChild(createElement({
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
        this.parent.element.appendChild(createElement({
          attr: {class:'message'},
          text: post.message,
        }));
      });
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      this.stop();
      return e;        
    }
  }

  start = () => {
    if( this.intervalId !== null ){
      this.stop();
    }
    this.intervalId = setInterval(this.delivery, this.interval);
  }

  stop = () => {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  /** 設定内容の変更(主に時間間隔の修正を想定)
   * @param {Object} opt 
   * @returns {void}
   */
  change = (opt) => {
    this.#setProperties(this,null,opt);
    // 変更された内容でリスタート
    if( this.intervalId !== null ){
      this.stop();
      this.start();
    }
  }

}