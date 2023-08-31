/**
 * @classdesc 参加者情報の表示・編集
 * 
 * - [JavaScriptでの rem ⇔ px に変換するテクニック＆コード例](https://pisuke-code.com/javascript-convert-rem-to-px/)
 */
class drawPassport {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} data - Authから返された参加者情報(Auth.info)
   * @param {Object} [opt={}] - オプション
   * @returns {void}
   */
  constructor(parent,data=null,opt={}){
    const v = {whois:'drawPassport.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        data: data, // {Object} 参加者情報
        // メンバとして持つHTMLElementの定義
        parent: typeof parent !== 'string' ? parent : 
        document.querySelector(parent), // {HTMLElement} 親要素(ラッパー)
        parentSelector: typeof parent === 'string' ? parent : null,
        style: null,  // {HTMLStyleElement} CSS定義
        summary: null, // {HTMLElement} 概要領域のDIV要素
        list: null, // {HTMLElement} 参加者一覧領域のDIV要素
        detail: null, // {HTMLElement} 詳細領域のDIV要素
        buttons: null, // {HTMLElement} ボタン領域のDIV要素
        // CSS/HTML定義
        css:[
          /* drawPassport共通部分 */ `
          .drawPassport {
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
          .drawPassport.hide {
            display: none;
          }
          .drawPassport > div {
            width: 100%;
            display: grid;
            gap: 1rem;
            /*
            width: calc(100% - 6rem);
            margin: 1rem 0px;
            */
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
          }`,
          /* 概要欄(QRコード、受付番号、申込者名) */`
          .drawPassport .summary {
            grid-template-columns: repeat(12, 1fr);
          }
          .drawPassport .summary [name="qrcode"]{
            padding: 0rem;
            grid-row: 1 / 3;
            grid-column: 1 / 5;
          }
          .drawPassport .summary [name="entryStr"]{
            grid-row: 1 / 2;
            grid-column: 5 / 13;
          }
          .drawPassport .summary [name="entryStr"] span {
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
          }`,
          /* 参加者一覧 */`
          .drawPassport .list .label button.hide {
            display: none;
          }
          .drawPassport .list .content {
            width: 100%;
            margin: 1rem 0px;
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 0.2rem;
          }
          .drawPassport .list .content.hide {
            display: none;
          }
          .drawPassport .list .content div:nth-child(4n+1) {
            grid-column: 1 / 2;
          }
          .drawPassport .list .content div:nth-child(4n+2) {
            grid-column: 2 / 7;
          }
          .drawPassport .list .content div:nth-child(4n+3) {
            grid-column: 7 / 9;
          }
          .drawPassport .list .content div:nth-child(4n+4) {
            grid-column: 9 / 11;
          }
          .drawPassport .list .content .td[name="fee"] > .hide {
            display: none;
          }`,
          /* 詳細情報 */`
          .drawPassport .detail .content {
            display: block;
          }
          .drawPassport .detail .content.hide {
            display: none;
          }
          .drawPassport .detail .content .table {
            width: 100%;
            margin: 1rem 0px;
            display: grid;
            grid-template-columns: 2fr 3fr;
            gap: 0.2rem;
          }
          .drawPassport .message {
            display: block;
          }
          .drawPassport .message button {
            margin-top: 1rem;
            padding: 0.5rem 2rem;
          }
          .drawPassport .message.hide {
            display: none;
          }`,
          /* 取消・決定・全員受領ボタン */`
          .drawPassport .buttons {
            width: 100%;
            margin: 1rem 0px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
          .drawPassport .buttons.hide {
            display: none;
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
          }`,
        ],
        html:[  // イベント定義を複数回行わないようにするため、eventで定義
          // 概要欄(QRコード、受付番号、申込者名)
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
          // 参加者一覧
          {attr:{class:'list'},children:[
            {attr:{class:'label'},children:[
              {tag:'p',text:'参加者一覧'},
              {tag:'button',text:'非表示',event:{click:this.toggle}},
            ]},
            {attr:{class:'content'},children:[
              {attr:{class:'th'},text:'No'},
              {attr:{class:'th'},text:'氏名'},
              {attr:{class:'th'},text:'所属'},
              {attr:{class:'th'},text:'参加費'},
            ]},
          ]},
          // 詳細情報
          {attr:{class:'detail'},children:[
            {attr:{class:'label'},children:[
              {tag:'p',text:'詳細情報'},
              {tag:'button',text:'非表示',event:{click:this.toggle}},
            ]},
            {attr:{class:'content'},children:[
              {attr:{class:'table'}},
              {attr:{class:'message'},children:[
                {attr:{name:'editURL'},children:[
                  {tag:'p',text:'参加者一覧・詳細情報に誤謬・変更がある場合、以下のボタンをクリックして申込フォームを開いて修正してください。'},
                  {
                    tag:'button',
                    text:'申込フォームを開く',
                    event:{click:()=>window.open(this.data.editURL,'_blank')},
                  },
                ]}
              ]},
            ]},
          ]},
          // 取消・決定・全員受領ボタン
          {attr:{class:'buttons'},children:[
            {tag:'button',attr:{name:'取消'},text:'取消'},
            {tag:'button',attr:{name:'決定'},text:'決定'},
            {tag:'button',attr:{name:'全員'},html:'全員<br>受領'},
          ]},
        ],
      },
    };
    console.log(v.whois+' start.',opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 2; // メンバとして持つHTMLElementを設定
      ['summary','list','detail','buttons'].forEach(x => {
        this[x] = this.parent.querySelector('.'+x);
      });

      v.step = 3; // 画面を非表示に
      this.close();

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 参加者情報(this.data)を画面にセット
   * @param {void}
   * @returns {void}
   */
  #setData = () => {
    const v = {whois:'drawPassport.#setData',rv:true,step:0};
    console.log(v.whois+' start.');
    try {

      // ---------------------------------------------
      // 1. QRコード、受付番号、申込者名
      // ---------------------------------------------
      v.step = 1.1; // QRコード表示
      this.data.entryStr = String('0000'+this.data.entryNo).slice(-4);
      v.qrcode = this.summary.querySelector('[name="qrcode"]');
      v.qrSize = v.qrcode.clientWidth;
      v.qrcode.innerHTML = '';  // 一度クリア
      new QRCode(v.qrcode,{
        text: this.data.entryStr,
        width: v.qrSize,
        height: v.qrSize,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel : QRCode.CorrectLevel.H,
      });
  
      v.step = 1.2; // その他文字情報表示
      ['entryStr','申込者氏名','申込者カナ'].forEach(x => {
        v.x = x;
        v.element = this.summary.querySelector('[name="'+x+'"] .v');
        v.element.innerText = this.data[v.x];
      });

      // ---------------------------------------------
      // 2. 参加者一覧
      // ---------------------------------------------
      v.step = 2.1; // 参加者情報をセット
      v.content = this.list.querySelector('.content');
      // 過去の参加者情報をクリア
      v.content.querySelectorAll('.td').forEach(x => x.remove());
      for( v.i=1 ; v.i<6 ; v.i++ ){
        v.prefix = '参加者0' + v.i;
        // 氏名が未登録の場合はスキップ
        if( this.data[v.prefix+'氏名'].length === 0 )
          continue;
        v.step = 2.2; // No
        v.content.appendChild(createElement({
          attr: {class:'td'},
          style: {textAlign:'right'},
          text: v.i,
        }));
        v.step = 2.3; // 氏名
        v.content.appendChild(createElement(
          {attr: {class:'td'},children:[
            {tag:'ruby',text:this.data[v.prefix+'氏名'],children:[
              {tag:'rt',text:this.data[v.prefix+'カナ']}
        ]}]}));
        v.step = 2.4; // 所属
        v.content.appendChild(createElement({
          attr: {class:'td'},
          text: this.data[v.prefix+'所属'],
        }));
        v.step = 2.5; // 参加費
        // 参加費欄はプルダウンとテキストと両方作成
        v.options = [];
        this.data['fee0'+v.i] = this.data['fee0'+v.i] || '未入場';
        ['未入場','無料','未収','既収','退場済'].forEach(x => {
          v.options.push({
            tag:'option',
            value:x,
            text:x,
            logical:{selected:(this.data['fee0'+v.i] === x)},
          });
        });
        v.content.appendChild(createElement(
          {attr:{class:'td',name:'fee'},children:[
            {text: this.data['fee0'+v.i]},
            {
              tag     : 'select',
              attr    : {class:'fee',name:'fee0'+v.i},
              children: v.options
            },
          ]},
        ));
      }

      // ---------------------------------------------
      // 3. 詳細情報
      // ---------------------------------------------
      v.step = 3.1; // 詳細情報をセット
      v.detail = this.detail.querySelector('.content .table');
      v.detail.innerHTML = '';  // 過去の詳細情報をクリア
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

      // ---------------------------------------------
      // 4. 取消・決定・全員受領ボタン
      // ---------------------------------------------
      v.step = 4.1; // ボタンを正方形に
      this.buttons.querySelectorAll('button').forEach(x => {
        x.style.height = x.clientWidth+'px';
      });

      console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 参加費の編集を行い、編集結果を返す
   * @param {Object} [data=null] - 編集対象となる参加者情報 
   * @returns {Object} {entryNo:{string},fee0n:'未入場/無料/未収/既収/退場済'}
   */
  edit = async (data=null) => {
    const v = {whois:'drawPassport.edit',rv:true,step:0};
    console.log(v.whois+' start.');
    try {
      // 親要素を表示
      // ※display:noneのままだと内部要素のサイズが全て0に
      this.open();

      // 参加者情報を渡された場合、セット
      if( data !== null ) this.data = data;

      // 編集対象となる参加者情報を表示
      v.rv = this.#setData();
      if( v.rv instanceof Error ) throw v.rv;

      // 参加者情報をボタンを削除(非表示)
      this.list.querySelector('.label button').classList.add('hide');

      // 参加者一覧・参加費欄でプルダウン以外は非表示
      this.list.querySelectorAll('.content .td[name="fee"] div').forEach(x => {
        x.classList.add('hide');
      });

      // 詳細情報を非表示状態に変更
      v.rv = this.toggle('.detail',false);

      // 取消・決定・全員収納ボタンを表示
      return new Promise(resolve => {
        // 取消 -> 戻り値はnull
        this.buttons.querySelector('[name="取消"]')
        .addEventListener('click',() => {
          // 戻り値の作成
          const rv = null;
          // 終了処理
          console.log('取消 -> '+JSON.stringify(rv)
          + '\ndrawPassport.edit normal end.\n');
          this.close();
          resolve({entryNo:this.data.entryNo,result:rv});
        });

        // 決定 -> {Object.<string, string>}、キャンセルなら{}
        this.buttons.querySelector('[name="決定"]')
        .addEventListener('click',() => {
          // 戻り値の作成
          let rv = {entryNo:this.data.entryNo};
          this.list.querySelectorAll('.fee').forEach(x => {
            rv[x.getAttribute('name')] = x.value;
          });
          /* 入力内容の確認
          if( !window.confirm(
            '参加費を画面のように登録します。\nよろしいですか？'
          ) ) rv = {};*/
          // 終了処理
          console.log('決定 -> '+JSON.stringify(rv)
          + '\ndrawPassport.edit normal end.\n');
          this.close();
          resolve(rv);
        });

        // 全員受領 -> {Object.<string, string>}、キャンセルなら{}
        this.buttons.querySelector('[name="全員"]')
        .addEventListener('click',() => {
          // 戻り値の作成
          let rv = {entryNo:this.data.entryNo};
          this.list.querySelectorAll('.fee').forEach(x => {
            rv[x.getAttribute('name')] = '既収';
          });
          /* 入力内容の確認
          if( !window.confirm(
            '全参加者の参加費を「受領」にします。\nよろしいですか？'
          ) ) rv = {};*/
          // 終了処理
          console.log('全員受領 -> '+JSON.stringify(rv)
          + '\ndrawPassport.edit normal end.\n');
          this.close();
          resolve(rv);
        });
      });

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 参加者情報を表示する
   * @param {void}
   * @returns {void}
   */
  view = () => {
    const v = {whois:'drawPassport.view',rv:true,step:0};
    console.log(v.whois+' start.');
    try {
      // 親要素を表示
      // ※display:noneのままだと内部要素のサイズが全て0に
      this.open();

      // 参加者情報を渡された場合、セット
      if( data !== null ) this.data = data;

      // 編集対象となる参加者情報を表示
      v.rv = this.#setData();
      if( v.rv instanceof Error ) throw v.rv;

      // 参加者一覧・参加費欄でプルダウンは非表示
      this.list.querySelectorAll('.content .td[name="fee"] select').forEach(x => {
        x.classList.add('hide');        
      });

      // 参加者一覧・詳細情報を非表示状態に変更
      v.rv = this.toggle('.list',false);
      v.rv = this.toggle('.detail',false);

      // 取消・決定・全員収納ボタンは非表示
      this.buttons.classList.add('hide');

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

  /** 親要素(parent)内を表示 */
  open = () => {
    this.parent.classList.remove('hide');
  }

  /** 親要素(parent)内を隠蔽 */
  close = () => {
    this.parent.classList.add('hide');
  }
}