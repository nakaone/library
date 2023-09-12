/**
 * @classdesc 参加者情報の表示・編集
 * 
 * - [JavaScriptでの rem ⇔ px に変換するテクニック＆コード例](https://pisuke-code.com/javascript-convert-rem-to-px/)
 */
class Perticipants {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} data - Authから返された参加者情報(Auth.info)
   * @param {Object} [opt={}] - オプション
   * @returns {void}
   */
  constructor(parent,data,opt={}){
    const v = {whois:'Perticipants.constructor',rv:true,step:0};
    console.log(v.whois+' start.',opt);
    try {

      v.step = 1; // メンバに既定値をセット、オプションがあれば上書き
      v.rv = this.#setup(parent,opt,{
        data: data, // {Object} 参加者情報
        edit: false,  // {boolean} trueなら編集モード、falseなら参照モード
        showList: false,  // {boolean} 参加者一覧を表示するならtrue
        showDetail: false,  // {boolean} 詳細情報を表示するならtrue
        parent: null, // {HTMLElement} 親要素(ラッパー)
        style: null,  // {HTMLStyleElement} CSS定義
        summary: null, // {HTMLElement} 概要領域のDIV要素
        list: null, // {HTMLElement} 参加者一覧領域のDIV要素
        detail: null, // {HTMLElement} 詳細領域のDIV要素
        buttons: null, // {HTMLElement} ボタン領域のDIV要素
      });
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 2; // QRコード、受付番号、申込者名
      this.#setupSummary();

      v.step = 3; // 参加者一覧
      this.#setupList();

      v.step = 4; // 詳細情報
      this.#setupDetail();

      v.step = 5; // 編集
      this.#setupEdit();

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** メンバに既定値をセット、オプションがあれば上書き
   * @param {HTMLElement|string} [parent=null] - 親要素(ラッパー)またはCSSセレクタ
   * @param {Object} opt - constructorに渡されたオプションオブジェクト
   * @param {*} def - 事前に定義してある既定値のオブジェクト
   * @returns {null|Error} 正常終了ならNull
   */
  #setup = (parent=null,opt,def) => {
    const v = {whois:'Perticipants.#setup',rv:null,step:0,
      isObj: obj => obj && typeof obj === 'object' && !Array.isArray(obj)
        && String(Object.prototype.toString.call(obj).slice(8,-1)) === 'Object',
      isArr: obj => obj && typeof obj === 'object' && Array.isArray(obj),
      deepcopy: (opt,dest=this) => { Object.keys(opt).forEach(x => {
        if( !dest.hasOwnProperty(x) ){ dest[x] = opt[x] } else {
          if( v.isObj(dest[x]) && v.isObj(opt[x]) ){
            v.deepcopy(dest[x],opt[x]);
          } else if( v.isArr(dest[x]) && v.isArr(opt[x]) ){
            dest[x] = [...new Set([...dest[x],...opt[x]])];
          } else { dest[x] = opt[x] }
    }})}};
    console.log(v.whois+' start.',opt,def);
    try {

      v.step = 1; // オプションをメンバとして登録
      v.deepcopy(opt,Object.assign(this,def));

      v.step = 2; // Perticipants共通部分のCSS作成
      this.style = document.createElement('style');
      document.head.appendChild(this.style);
      this.style.innerText = `
      .Perticipants {
        margin: 1rem;
        width: calc(100% - 2rem);
        display: grid;
        row-gap: 1rem;
        grid-template-columns: 1fr;
        /*
        width: 100%;
        margin: 1rem;
        width: calc(100% - 2rem);
        */
      }
      .Perticipants > div {
        width: 100%;
        display: grid;
        gap: 1rem;
        /*
        width: calc(100% - 6rem);
        margin: 1rem 0px;
        */
      }
      .Perticipants rt {
        font-size: 50%;
      }
      .Perticipants .label {
        margin-top: 1rem;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
      }
      .Perticipants .label p {
        grid-column: 1 / 3;
        font-size: 1.4rem;
      }
      .Perticipants .label button {
        grid-column: 3 / 4;
      }
      `;

      v.step = 3; // HTMLの作成
      this.parent = parent instanceof HTMLElement ? parent :
      ( typeof parent === 'string' ? document.querySelector(parent) : null);
      if( this.parent !== null ){
        this.parent.innerHTML = ``;
      }

      console.log(v.whois+' normal end.\n',v.rv);
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
    const v = {whois:'Perticipants.#setupSummary',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // CSS定義
      this.style.innerText = (this.style.innerText + `
      .Perticipants .summary {
        grid-template-columns: repeat(12, 1fr);
      }
      .Perticipants .summary [name="qrcode"]{
        padding: 0rem;
        grid-row: 1 / 3;
        grid-column: 1 / 5;
      }
      .Perticipants .summary [name="entryStr"]{
        grid-row: 1 / 2;
        grid-column: 5 / 13;
      }
      .Perticipants .summary [name="entryStr"] span {
        font-size: 2rem;
      }
      .Perticipants .summary [name="申込者氏名"]{
        grid-row: 2 / 3;
        grid-column: 5 / 13;
      }
      .Perticipants .summary ruby span {
        font-size: 2rem;
      }
      .Perticipants .summary rt span {
        font-size: 1rem;
      }
      `).replaceAll(/\n/g,'').replaceAll(/\s+/g,' ');

      v.step = 2; // HTML定義
      this.summary = createElement(
        {attr:{class:'summary'},children:[
          {attr:{name:'qrcode'}},
          {attr:{name:'entryStr'},text:'No.',children:[
            {tag:'span',attr:{class:'v'}},
          ]},
          {attr:{name:'申込者氏名'},children:[
            {tag:'ruby',children:[
              {tag:'span',attr:{class:'v'}},
              {tag:'rt',attr:{name:'申込者カナ'},children:[
                {tag:'span',attr:{class:'v'}}
              ]},
            ]}
          ]},
        ]},
      );
      this.parent.appendChild(this.summary);

      v.step = 3; // QRコード表示
      this.data.entryStr = String('0000'+this.data.entryNo).slice(-4);
      v.qrcode = this.summary.querySelector('[name="qrcode"]');
      v.qrSize = v.qrcode.clientWidth;
      new QRCode(v.qrcode,{
        text: this.data.entryStr,
        width: v.qrSize,
        height: v.qrSize,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel : QRCode.CorrectLevel.H,
      });
  
      v.step = 4; // その他文字情報表示
      ['entryStr','申込者氏名','申込者カナ'].forEach(x => {
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
    const v = {whois:'Perticipants.#setupList',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // CSS定義
      this.style.innerText = (this.style.innerText + `
      .Perticipants .list .content {
        width: 100%;
        margin: 1rem 0px;
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 0.2rem;
      }
      .Perticipants .list .content.hide {
        display: none;
      }
      .Perticipants .list .content div:nth-child(4n+1) {
        grid-column: 1 / 2;
      }
      .Perticipants .list .content div:nth-child(4n+2) {
        grid-column: 2 / 7;
      }
      .Perticipants .list .content div:nth-child(4n+3) {
        grid-column: 7 / 9;
      }
      .Perticipants .list .content div:nth-child(4n+4) {
        grid-column: 9 / 11;
      }
      `).replaceAll(/\n/g,'').replaceAll(/\s+/g,' ');

      v.step = 2; // HTML定義
      this.list = createElement(
        {attr:{class:'list'},children:[
          {attr:{class:'label'},children:[
            {tag:'p',text:'参加者一覧'},
            {tag:'button',text:'表示'},
          ]},
          {attr:{class:'content'},children:[
            {attr:{class:'th'},text:'No'},
            {attr:{class:'th'},text:'氏名'},
            {attr:{class:'th'},text:'所属'},
            {attr:{class:'th'},text:'参加費'},
          ]},
        ]}
      );
      this.parent.appendChild(this.list);

      // 参加者一覧開閉ボタン
      v.step = 3.1; // 編集モードなら参加者一覧は必ず表示するよう設定
      this.showList = this.edit || this.showList;
      v.step = 3.2; // 初期状態設定
      this.toggle('.list',this.showList);
      v.step = 3.3; // イベントリスナ設定
      this.list.querySelector('.label button')
      .addEventListener('click',this.toggle);

      v.step = 4; // 参加者情報をセット
      v.content = this.list.querySelector('.content');
      for( v.i=1 ; v.i<6 ; v.i++ ){
        v.prefix = '参加者0' + v.i;
        // 氏名が未登録の場合はスキップ
        if( this.data[v.prefix+'氏名'].length === 0 )
          continue;
        v.step = 4.1; // No
        v.content.appendChild(createElement({
          attr: {class:'td'},
          style: {textAlign:'right'},
          text: v.i,
        }));
        v.step = 4.2; // 氏名
        v.content.appendChild(createElement(
          {attr: {class:'td'},children:[
            {tag:'ruby',text:this.data[v.prefix+'氏名'],children:[
              {tag:'rt',text:this.data[v.prefix+'カナ']}
        ]}]}));
        v.step = 4.3; // 所属
        v.content.appendChild(createElement({
          attr: {class:'td'},
          text: this.data[v.prefix+'所属'],
        }));
        v.step = 4.4; // 参加費
        if( this.edit ){
          v.step = '4.4a';  // 編集モード⇒プルダウンで表示
          v.options = [];
          ['未入場','無料','未収','既収','退場済'].forEach(x => {
            v.options.push({
              tag:'option',
              value:x,
              text:x,
              logical:{selected:(this.data['fee0'+v.i] === x)},
            });
          });
          v.content.appendChild(createElement(
            {attr:{class:'td'},children:[{
              tag: 'select',
              attr: {class:'fee',name:'fee0'+v.i},
              children:v.options,
          }]}));
        } else {
          v.step = '4.4b';  // 参照モード⇒テキストで表示
          v.content.appendChild(createElement({
            attr: {class:'td'},
            text: this.data['fee0'+v.i] || '未入場',
          }));
        }
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
    const v = {whois:'Perticipants.#setupDetail',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // CSS定義
      this.style.innerText = (this.style.innerText + `
      .Perticipants .detail .content {
        width: 100%;
        margin: 1rem 0px;
        display: grid;
        grid-template-columns: 2fr 3fr;
        gap: 0.2rem;
      }
      .Perticipants .detail .content.hide {
        display: none;
      }
      .Perticipants .message {
        display: block;
      }
      .Perticipants .message button {
        margin-top: 1rem;
        padding: 0.5rem 2rem;
      }
      .Perticipants .message.hide {
        display: none;
      }
      `).replaceAll(/\n/g,'').replaceAll(/\s+/g,' ');

      v.step = 2; // HTML定義
      this.detail = createElement(
        {attr:{class:'detail'},children:[
          {attr:{class:'label'},children:[
            {tag:'p',text:'詳細情報'},
            {tag:'button',text:'表示'},
          ]},
          {attr:{class:'content'}},
          {attr:{class:'message'},children:[
            {attr:{name:'editURL'},children:[
              {tag:'p',text:'参加者一覧・詳細情報に誤謬・変更がある場合、以下のボタンをクリックして申込フォームを開いて修正してください。'},
              {tag:'button',text:'申込フォームを開く'},
            ]}
          ]},
        ]}
      );
      this.parent.appendChild(this.detail);

      // 詳細情報開閉ボタン
      v.step = 3.1; // 初期状態設定
      this.toggle('.detail',this.showDetail);
      v.step = 3.3; // イベントリスナ設定
      this.detail.querySelector('.label button')
      .addEventListener('click',this.toggle);

      v.step = 4; // 詳細情報をセット
      v.detail = this.detail.querySelector('.content');
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

      v.step = 5; // 編集用URL
      this.detail.querySelector('.message button')
      .addEventListener('click',()=>window.open(this.data.editURL,'_blank'));

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 参加者情報の表示・編集を行い、編集結果を返す
   * @param {void} - 無し
   * @returns {Object.<string, any>} 修正された項目ラベルと値
   */
  #setupEdit = () => {
    const v = {whois:'Perticipants.#setupEdit',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // CSS定義
      this.style.innerText = (this.style.innerText + `
      .Perticipants .buttons {
        width: 100%;
        margin: 1rem 0px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
      }
      .Perticipants .buttons button {
        display: block;
        width: 100%;
        font-size: 2rem;
      }
      .Perticipants .buttons [name="取消"].hide {
        display: none;
      }
      .Perticipants .buttons [name="決定"].hide {
        display: none;
      }
      .Perticipants .buttons [name="全員"].hide {
        display: none;
      }
      `).replaceAll(/\n/g,'').replaceAll(/\s+/g,' ');

      // 注：HTML定義はonEdit()で都度実行

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
    const v = {whois:'Perticipants.toggle',step:1,rv:null};
    console.log(v.whois+' start.');
    try {

      let content;  // 表示/非表示を行う対象となる要素
      let button;   // クリックされたボタンの要素
      if( typeof event === 'string' ){
        v.step = 1.1; // 初期設定時(引数がPointerEventではなくstring)
        content = this.parent.querySelector(event+' .content');
        button = this.parent.querySelector(event+' button');
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

  /** 参加費の編集を行い、編集結果を返す
   * @param {void} 
   * @returns {void}
   */
  onEdit = async () => {
    const v = {whois:'Perticipants.onEdit',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // HTML定義
      if( this.buttons !== null ){
        // 誤動作しないよう一度内容をクリア
        this.buttons.remove();
      }
      this.buttons = createElement(
        {attr:{class:'buttons'},children:[
          {tag:'button',attr:{name:'取消'},text:'取消'},
          {tag:'button',attr:{name:'決定'},text:'決定'},
          {tag:'button',attr:{name:'全員'},html:'全員<br>受領'},
        ]}
      );
      this.parent.appendChild(this.buttons);

      v.step = 2;
      return new Promise(resolve => {
        this.buttons.querySelector('[name="取消"]')
        .addEventListener('click',element => {
          console.log('取消 button clicked.',element.target);
          console.log('Perticipants.onEdit normal end.');
          resolve({entryNo:this.data.entryNo,result:null});
        });

        this.buttons.querySelector('[name="決定"]')
        .addEventListener('click',element => {
          console.log('決定 button clicked.',element.target);
          const rv = {entryNo:this.data.entryNo};
          this.list.querySelectorAll('.fee').forEach(x => {
            rv[x.getAttribute('name')] = x.value;
          });
          // 要confirm
          console.log('Perticipants.onEdit normal end.');
          resolve(rv);
        });

        this.buttons.querySelector('[name="全員"]')
        .addEventListener('click',element => {
          console.log('全員受領 button clicked.',element.target);
          const rv = {entryNo:this.data.entryNo};
          this.list.querySelectorAll('.fee').forEach(x => {
            rv[x.getAttribute('name')] = '既収';
          });
          // 要confirm
          console.log('Perticipants.onEdit normal end.');
          resolve(rv);
        });
      });

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}