/*
- [JavaScriptでの rem ⇔ px に変換するテクニック＆コード例](https://pisuke-code.com/javascript-convert-rem-to-px/)
*/
/** 参加者情報の表示・編集を行い、編集結果を返す
 * @param {HTMLElement} parent - 親要素
 * @param {Object} this.data - 参加者情報
 * @param {Object} [opt={}] - オプション
 * @param {boolean} [opt.edit=false] - 編集モードならtrue, 参照モードならfalse
 * @param {boolean} [opt.showList=false] - リスト表示ならtrue、但し編集モードなら強制表示
 * @param {boolean} [opt.showDetail=false] - 詳細を表示するならtrue
 * @returns {Object.<string, any>} 修正された項目ラベルと値
 * 
 */
class drawPassport {
  constructor(opt={}){
    const v = {whois:'drawPassport.constructor',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1.1; // オプション未定義項目の既定値をプロパティにセット
      v.rv = setupInstance(this,opt,{
        edit: false,  // {boolean} trueなら編集モード、falseなら参照モード
        showList: false,  // {boolean} 参加者一覧を表示するならtrue
        showDetail: false,  // {boolean} 詳細情報を表示するならtrue
        /*
        css:[{
          // drawPassport全体
          sel :'.drawPassport',
          prop:{
            'width': 'calc(100% - 2rem)',
            'display': 'grid',
            'grid-template-columns': '1fr',
            'padding': '1rem',
            'font-size': '1rem',
          }
        },{
          sel :'.drawPassport rt',
          prop:{
            'font-size': '50%',
          }
        },{
          sel :'.drawPassport .label',
          prop:{
            'margin-top': '1rem',
            'width': '100%',
            'display': 'grid',
            'grid-template-columns': 'repeat(3, 1fr)',
            'gap': '2rem',
          }
        },{
          sel :'.drawPassport .label p',
          prop:{
            'grid-column': '1 / 3',
            'font-size': '1.4rem',
          }
        },{
          sel :'.drawPassport .label button',
          prop:{
            'grid-column': '3 / 4',
          }
        },

        // summary: QRコード、受付番号、申込者名
        {
          sel :'.drawPassport .summary',
          prop:{
            'width': '100%',
            'margin': '1rem 0px',
            'display': 'grid',
            'grid-template-columns': 'repeat(12, 1fr)',
            'gap': '1rem',
          }
        },{
          sel :'.drawPassport .summary [name="qrcode"]',
          prop:{
            'padding': '0rem',
            'grid-row': '1 / 3',
            'grid-column': '1 / 5',
          }
        },{
          sel :'.drawPassport .summary [name="entryNo"]',
          prop:{
            'grid-row': '1 / 2',
            'grid-column': '5 / 13',
          }
        },{
          sel :'.drawPassport .summary [name="entryNo"] span',
          prop:{
            'font-size': '2rem',
          }
        },{
          sel :'.drawPassport .summary [name="申込者氏名"]',
          prop:{
            'grid-row': '2 / 3',
            'grid-column': '5 / 13',
          }
        },{
          sel :'.drawPassport .summary ruby span',
          prop:{
            'font-size': '2rem',
          }
        },{
          sel :'.drawPassport .summary rt span',
          prop:{
            'font-size': '1rem',
          }
        },
        
        // list: 参加者リスト
        {
          sel :'.drawPassport .list .content',
          prop:{
            'width': '100%',
            'margin': '1rem 0px',
            'display': 'grid',
            'grid-template-columns': 'repeat(12, 1fr)',
            'gap': '0.2rem',
          }
        },{
          sel :'.drawPassport .list .content.hide',
          prop:{
            'display': 'none',
          }
        },{
          sel :'.drawPassport .list .content div:nth-child(4n+1)',
          prop:{
            'grid-column': '1 / 3',
          }
        },{
          sel :'.drawPassport .list .content div:nth-child(4n+2)',
          prop:{
            'grid-column': '3 / 7',
          }
        },{
          sel :'.drawPassport .list .content div:nth-child(4n+3)',
          prop:{
            'grid-column': '7 / 10',
          }
        },{
          sel :'.drawPassport .list .content div:nth-child(4n+4)',
          prop:{
            'grid-column': '10 / 13',
          }
        },
        
        // detail: 詳細情報
        {
          sel :'.drawPassport .detail',
          prop:{
          }
        },{
          sel :'.drawPassport .detail .content',
          prop:{
            'width': '100%',
            'margin': '1rem 0px',
            'display': 'grid',
            'grid-template-columns': '2fr 3fr',
            'gap': '0.2rem',
          }
        },{
          sel :'.drawPassport .detail .content.hide',
          prop:{
            'display': 'none',
          }
        },{
          sel :'.drawPassport .message',
          prop:{
            'display': 'block',
          }
        },{
          sel :'.drawPassport .message.hide',
          prop:{
            'display': 'none',
          }
        },
        
        // buttons: ボタン領域
        {
          sel :'.drawPassport .buttons',
          prop:{
            'width': '100%',
            'margin': '1rem 0px',
            'display': 'grid',
            'grid-template-columns': 'repeat(3, 1fr)',
            'gap': '2rem',
          }
        },{
          sel :'.drawPassport .buttons button',
          prop:{
            'display': 'block',
            'width': '100%',
            'font-size': '2rem',
          }
        },{
          sel :'.drawPassport .buttons [name="取消"].hide',
          prop:{
            'display': 'none',
          }
        },{
          sel :'.drawPassport .buttons [name="決定"].hide',
          prop:{
            'display': 'none',
          }
        },{
          sel :'.drawPassport .buttons [name="全員"].hide',
          prop:{
            'display': 'none',
          }
        }],
        */
      });
      if( v.rv instanceof Error ) throw v.rv;
      v.step = 1.2; // 編集モードなら参加者一覧は必ず表示する
      this.showList = this.edit || this.showList;
  
      v.step = 1.3; // 描画領域をクリアし、必要な要素をセット
      this.#setupElements();

      v.step = 1.4; // ボタンの初期状態設定
      // 参加者一覧開閉ボタンの初期状態設定
      this.toggle('.list',opt.showList);
      this.parent.element.querySelector('.list .label button')
      .addEventListener('click',this.toggle);
      // 詳細情報開閉ボタンの初期状態設定
      this.toggle('.detail',opt.showDetail);
      this.parent.element.querySelector('.detail .label button')
      .addEventListener('click',this.toggle);
    
      v.step = 2; // QRコード、受付番号、申込者名
      this.#setupSummary();

      v.step = 3; // 参加者一覧
      this.#setupList();

      v.step = 4; // 詳細情報
      this.#setupDetail();

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }    
  }

  /** 描画領域をクリアし、必要な要素をセットする
   * @param {void}
   * @returns {void}
   */
  #setupElements = () => {
    const v = {whois:'drawPassport.#setupElements',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      this.style = document.createElement('style');
      document.head.appendChild(this.style);
      this.style.innerText = `
        .drawPassport {
          width: calc(100% - 2rem);
          display: grid;
          grid-template-columns: 1fr;
          padding: 1rem;
          font-size: 1rem;
        }
        .drawPassport rt {
          font-size: 50%;
        }
        .drawPassport .label {
          margin-top: 1rem;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .drawPassport .label p {
          grid-column: 1 / 3;
          font-size: 1.4rem;
        }
        .drawPassport .label button {
          grid-column: 3 / 4;
        }
      
        /* QRコード、受付番号、申込者名 */
        .drawPassport .summary {
          width: 100%;
          margin: 1rem 0px;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1rem;
        }
        .drawPassport .summary [name="qrcode"]{
          padding: 0rem;
          grid-row: 1 / 3;
          grid-column: 1 / 5;
        }
        .drawPassport .summary [name="entryNo"]{
          grid-row: 1 / 2;
          grid-column: 5 / 13;
        }
        .drawPassport .summary [name="entryNo"] span {
          font-size: 2rem;
        }
        .drawPassport .summary [name="申込者氏名"]{
          grid-row: 2 / 3;
          grid-column: 5 / 13;
        }
        .drawPassport .summary ruby span {
          font-size: 2rem;
        }
        .drawPassport .summary rt span {
          font-size: 1rem;
        }
      
        /* 参加者リスト */
        .drawPassport .list .content {
          width: 100%;
          margin: 1rem 0px;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 0.2rem;
        }
        .drawPassport .list .content.hide {
          display: none;
        }
        .drawPassport .list .content div:nth-child(4n+1) {
          grid-column: 1 / 3;
        }
        .drawPassport .list .content div:nth-child(4n+2) {
          grid-column: 3 / 7;
        }
        .drawPassport .list .content div:nth-child(4n+3) {
          grid-column: 7 / 10;
        }
        .drawPassport .list .content div:nth-child(4n+4) {
          grid-column: 10 / 13;
        }
      
        /* 詳細 */
        .drawPassport .detail {
      
        }
        .drawPassport .detail .content {
          width: 100%;
          margin: 1rem 0px;
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 0.2rem;
        }
        .drawPassport .detail .content.hide {
          display: none;
        }
        .drawPassport .message {
          display: block;
        }
        .drawPassport .message.hide {
          display: none;
        }
      
        /* ボタン領域 */
        .drawPassport .buttons {
          width: 100%;
          margin: 1rem 0px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .drawPassport .buttons button {
          display: block;
          width: 100%;
          font-size: 2rem;
        }
        .drawPassport .buttons [name="取消"].hide {
          display: none;
        }
        .drawPassport .buttons [name="決定"].hide {
          display: none;
        }
        .drawPassport .buttons [name="全員"].hide {
          display: none;
        }
      `;

      this.parent.element.innerHTML = `
      <div class="summary">
        <div name="qrcode"></div>
        <div name="entryNo">No.<span class="v"></span></div>
        <div name="申込者氏名"><ruby><span class="v"></span>
          <rt name="申込者カナ"><span class="v"></span></rt>
        </ruby></div>
      </div>
  
      <div class="list">
        <div class="label">
          <p>参加者一覧</p>
          <button>表示</button>
        </div>
        <div class="content">
          <div class="th">No</div>
          <div class="th">氏名</div>
          <div class="th">所属</div>
          <div class="th">参加費</div>
        </div>
      </div>
  
      <div class="detail">
        <div class="label">
          <p>詳細情報</p>
          <button>非表示</button>
        </div>
        <div class="content"></div>
        <div class="message">
          <div name="editURL">
            <p>参加者一覧・詳細情報に誤謬・変更がある場合、以下のボタンをクリックして申込フォームを開いて修正してください。</p>
            <button>申込フォームを開く</button>
          </div>
        </div>
      </div>
  
      <div class="buttons">
        <button name="取消">取消</button>
        <button name="決定">決定</button>
        <button name="全員">全員<br>受領</button>  
      </div>
      `;
      this.summary = this.parent.element.querySelector(':scope > .summary');
      this.list = this.parent.element.querySelector(':scope > .list');
      this.detail = this.parent.element.querySelector(':scope > .detail');
      this.buttons = this.parent.element.querySelector(':scope > .buttons');

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 概要欄作成(QRコード、受付番号、申込者名)
   * @param {void}
   * @returns {void}
   */
  #setupSummary = () => {
    const v = {whois:'drawPassport.#setupSummary',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      this.data.entryStr = String('0000'+this.data.entryNo).slice(-4);
      v.qrcode = this.summary.querySelector('[name="qrcode"]');
      v.qrSize = v.qrcode.clientWidth;
      console.log('l.322',v.qrSize);
      new QRCode(v.qrcode,{
        text: this.data.entryStr,
        width: v.qrSize,
        height: v.qrSize,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel : QRCode.CorrectLevel.H,
      });
  
      ['entryNo','申込者氏名','申込者カナ'].forEach(x => {
        v.x = x;
        v.element = this.summary.querySelector('[name="'+x+'"] .v');
        v.element.innerText = this.data[v.x];
      });
  
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 参加者一覧作成
   * @param {void}
   * @returns {void}
   */
  #setupList = () => {
    const v = {whois:'drawPassport.#setupList',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.list = this.parent.element.querySelector('div.list .content');
      for( v.i=1 ; v.i<6 ; v.i++ ){
        v.prefix = '参加者0' + v.i;
        if( this.data[v.prefix+'氏名'].length === 0 )
          continue;
        v.list.appendChild(createElement({
          attr: {class:'td'},
          style: {textAlign:'right'},
          text: v.i,
        }));
        v.list.appendChild(createElement(
          {attr: {class:'td'},children:[
            {tag:'ruby',text:this.data[v.prefix+'氏名'],children:[
              {tag:'rt',text:this.data[v.prefix+'カナ']}
        ]}]}));
        v.list.appendChild(createElement({
          attr: {class:'td'},
          text: this.data[v.prefix+'所属'],
        }));
        v.list.appendChild(createElement({
          attr: {class:'td'},
          text: this.data['fee0'+v.i],
        }));
      }
    
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 詳細情報作成
   * @param {void}
   * @returns {void}
   */
  #setupDetail = () => {
    const v = {whois:'drawPassport.#setupDetail',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.detail = this.parent.element.querySelector('div.detail .content');
      ["メールアドレス","申込者の参加","宿泊、テント","引取者氏名","緊急連絡先",
      "ボランティア募集","キャンセル","備考"].forEach(x => {
        v.detail.appendChild(createElement({
          attr: {class:'th'},
          text: x,
        }));
        v.detail.appendChild(createElement({
          attr: {class:'td'},
          text: this.data[x],
        }));
      });
      v.step = 4.2; // 編集用URL
      v.detail.appendChild(createElement({
        attr: {class:'th'},
        text:'申込内容修正',
      }));
      v.detail.appendChild(createElement({
        tag:'button',
        text: '申込フォームを開く',
        event: {'click':()=>window.open(this.data.editURL,'_blank')},
      }));

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }


  /** 表示/非表示ボタンクリック時の処理を定義
   * @param {PointerEvent|string} event - クリック時のイベントまたはボタンのCSSセレクタ
   * @param {boolean} show - trueなら開く
   * @returns {void}
   */
  toggle = (event,show) => {
    const v = {whois:'drawPassport.toggle',step:1,rv:null};
    console.log(v.whois+' start.');
    try {

      let content;  // 表示/非表示を行う対象となる要素
      let button;   // クリックされたボタンの要素
      if( typeof event === 'string' ){
        v.step = 1.1; // 初期設定時(引数がPointerEventではなくstring)
        content = this.parent.element.querySelector(event+' .content');
        button = this.parent.element.querySelector(event+' button');
      } else {
        v.step = 1.2; // ボタンクリック時
        content = event.target.parentElement.parentElement
        .querySelector('.content');
        button = event.target;
      }
      console.log(content,button);

      v.step = 2; // 表示->非表示 or 非表示->表示 を判断
      let toOpen = show ? show : (button.innerText === '表示');
      if( toOpen ){
        v.step = 2.1; // 表示に変更する場合
        button.innerText = '非表示';
        content.classList.remove('hide');
      } else {
        v.step = 2.2; // 非表示に変更する場合
        button.innerText = '表示';
        content.classList.add('hide');
      }

      v.step = 3;
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  edit = async () => {
    const v = {whois:'drawPassport.edit',step:0,rv:null};
    console.log(v.whois+' start.');
    try {
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}