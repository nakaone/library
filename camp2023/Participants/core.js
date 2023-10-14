/**
 * @classdesc 参加者情報の表示・編集
 *
 * - [JavaScriptでの rem ⇔ px に変換するテクニック＆コード例](https://pisuke-code.com/javascript-convert-rem-to-px/)
 */
class Participants {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(parent,opt={}){
    const v = {whois:'Participants.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        // メンバとして持つHTMLElementの定義
        parent: parent, // {HTMLElement} 親要素
        parentSelector: null, // {string} 親要素のCSSセレクタ
        wrapper: null, // {HTMLElement} ラッパー
        wrapperSelector: null, // {string} ラッパーのCSSセレクタ

        style: null,  // {HTMLStyleElement} CSS定義
        summary: null, // {HTMLElement} 概要領域のDIV要素
        list: null, // {HTMLElement} 参加者一覧領域のDIV要素
        detail: null, // {HTMLElement} 詳細領域のDIV要素
        buttons: null, // {HTMLElement} ボタン領域のDIV要素
        // CSS/HTML定義
        css:[
          /* Participants共通部分 */ `
          .Participants.act {
            margin: 1rem;
            width: calc(100% - 2rem);
            display: grid;
            row-gap: 1rem;
            grid-template-columns: 1fr;
          }
          .Participants {
            display: none;
          }
          .Participants > div {
            width: 100%;
            display: grid;
            gap: 1rem;
          }
          .Participants rt {
            font-size: 50%;
          }
          .Participants .label {
            margin-top: 1rem;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
          .Participants .label p {
            grid-column: 1 / 3;
            font-size: 1.4rem;
          }
          .Participants .label button {
            grid-column: 3 / 4;
          }`,
          /* 概要欄(QRコード、受付番号、申込者名) */`
          .Participants .summary {
            grid-template-columns: repeat(12, 1fr);
          }
          .Participants .summary [name="qrcode"]{
            padding: 0rem;
            grid-row: 1 / 3;
            grid-column: 1 / 5;
          }
          .Participants .summary [name="entryStr"]{
            grid-row: 1 / 2;
            grid-column: 5 / 10;
          }
          .Participants .summary [name="entryStr"] span {
            font-size: 2rem;
          }
          .Participants .summary [name="tent"] {
            grid-area: 1 / 10 / 2 / 13;
            font-size: 1.5rem;
          }
          .Participants .summary [name="tent"].failed {
            color: red;
          }
          .Participants .summary [name="申込者氏名"]{
            grid-row: 2 / 3;
            grid-column: 5 / 13;
          }
          .Participants .summary ruby span {
            font-size: 2rem;
          }
          .Participants .summary rt span {
            font-size: 1rem;
          }`,
          /* 参加者一覧 */`
          .Participants .list .label button {
            display: none;
          }
          .Participants .list .label button.act {
            display: block;
          }
          .Participants .list .content {
            display: none;
          }
          .Participants .list .content.act {
            width: 100%;
            margin: 1rem 0px;
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 0.2rem;
          }
          .Participants .list .content div:nth-child(4n+1) {
            grid-column: 1 / 2;
          }
          .Participants .list .content div:nth-child(4n+2) {
            grid-column: 2 / 7;
          }
          .Participants .list .content div:nth-child(4n+3) {
            grid-column: 7 / 9;
          }
          .Participants .list .content div:nth-child(4n+4) {
            grid-column: 9 / 11;
          }
          .Participants .list .content .td[name="fee"] > * {
            display: none;
          }
          .Participants .list .content .td[name="fee"] > *.act {
            display: block;
          }`,
          /* 詳細情報 */`
          .Participants .detail .content {
            display: none;
          }
          .Participants .detail .content.act {
            display: block;
          }
          .Participants .detail .content .table {
            width: 100%;
            margin: 1rem 0px;
            display: grid;
            grid-template-columns: 2fr 3fr;
            gap: 0.2rem;
          }
          .Participants .message {
            display: none;
          }
          .Participants .message.act {
            display: block;
          }
          .Participants .message button {
            margin-top: 1rem;
            padding: 0.5rem 2rem;
          }`,
          /* 取消・決定・全員受領ボタン */`
          .Participants .buttons {
            display: none;
          }
          .Participants .buttons.act {
            width: 100%;
            margin: 1rem 0px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
          .Participants .buttons button {
            display: block;
            width: 100%;
            font-size: 2rem;
          }`,
        ],
        html:[
          // 概要欄(QRコード、受付番号、申込者名)
          {attr:{class:'summary'},children:[
            {attr:{name:'qrcode'}},
            {attr:{name:'tent'}},
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
    console.log(v.whois+' start.',parent,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 2; // メンバとして持つHTMLElementを設定
      ['summary','list','detail','buttons'].forEach(x => {
        this[x] = this.wrapper.querySelector('.'+x);
      });

      v.step = 3; // 画面を非表示に
      this.close();

      v.step = 4; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 参加者情報を画面にセット
   * @param {Object} data - Authから返された参加者情報(Auth.info)
   * @returns {void}
   */
  #setData = (data) => {
    const v = {whois:'Participants.#setData',rv:true,step:0};
    console.log(v.whois+' start.',data);
    try {

      // ---------------------------------------------
      // 1. QRコード、受付番号、申込者名
      // ---------------------------------------------
      v.step = 1.1; // QRコード表示
      data.entryStr = String('0000'+data.entryNo).slice(-4);
      v.qrcode = this.summary.querySelector('[name="qrcode"]');
      /* 開発時メモ：v.qrSizeが取得できない
      plan.1
      v.qrcode.clientWidth -> 0
      plan.2
      v.qrcode.getBoundingClientRect() -> DOMRect {x:0, y:0, width:0, height:0, ...}
      plan.3
      v.cs1 = window.getComputedStyle(v.qrcode); // CSSStyleDecoration width:"262.664px"
      v.cs2 = JSON.parse(JSON.stringify(v.cs1));  // width:autoになってしまう
      */
      v.qrSize = 250; // 暫定的に固定値にする
      v.qrcode.innerHTML = '';  // 一度クリア
      new QRCode(v.qrcode,{
        text: data.entryStr,
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
        v.element.innerText = data[v.x];
      });

      v.step = 1.3; // 「落選/テント/体育館/日帰り」の表示
      if( Number(data.authority) === 0 ){
        this.summary.querySelector('[name="tent"]').classList.add('failed');
        v.tent = '落選';
      } else {
        this.summary.querySelector('[name="tent"]').classList.remove('failed');
        switch( data['宿泊、テント']){
          case '宿泊する(テントあり)': v.tent = 'テント'; break;
          case '宿泊する(テントなし)': v.tent = '体育館'; break;
          case '宿泊しない': v.tent = '日帰り'; break;
        }
      }
      this.summary.querySelector('[name="tent"]').innerText = v.tent;

      // ---------------------------------------------
      // 2. 参加者一覧
      // ---------------------------------------------
      v.step = 2.1; // 参加者情報をセット
      v.content = this.list.querySelector('.content');
      // 過去の参加者情報をクリア
      v.content.querySelectorAll('.td').forEach(x => x.remove());

      v.step = 2.2; // 申請者を「参加者00」としてコピー
      if( data['申込者の参加'] === '不参加' ){
        data['参加者00氏名'] = '';
      } else {
        data['参加者00氏名'] = data['申込者氏名'];
        data['参加者00カナ'] = data['申込者カナ'];
        data['参加者00所属'] = '保護者';
      }

      for( v.i=0 ; v.i<6 ; v.i++ ){
        v.prefix = '参加者0' + v.i;
        // 氏名が未登録の場合はスキップ
        if( data[v.prefix+'氏名'].length === 0 )
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
            {tag:'ruby',text:data[v.prefix+'氏名'],children:[
              {tag:'rt',text:data[v.prefix+'カナ']}
        ]}]}));
        v.step = 2.4; // 所属
        v.content.appendChild(createElement({
          attr: {class:'td'},
          text: data[v.prefix+'所属'],
        }));
        v.step = 2.5; // 参加費
        // 参加費欄はプルダウンとテキストと両方作成
        v.options = [];
        data['fee0'+v.i] = data['fee0'+v.i] || '未入場';
        ['未入場','無料','未収','既収','退場済'].forEach(x => {
          v.options.push({
            tag:'option',
            value:x,
            text:x,
            logical:{selected:(data['fee0'+v.i] === x)},
          });
        });
        v.content.appendChild(createElement(
          {attr:{class:'td',name:'fee'},children:[
            {text: data['fee0'+v.i]},
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
          text: data[x],
        }));
      });
      v.step = 3.2; // editURLボタンにイベント定義
      this.detail.querySelector('[name="editURL"] button')
      .addEventListener('click',()=>window.open(this.data.editURL,'_blank'));

      // ---------------------------------------------
      // 4. 取消・決定・全員受領ボタン
      // ---------------------------------------------

      console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 参加費の編集を行い、編集結果を返す
   * @param {Object} data - Authから返された参加者情報(Auth.info)
   * @returns {Object} {entryNo:{string},fee0n:'未入場/無料/未収/既収/退場済'}
   */
  edit = async (data) => {
    const v = {whois:'Participants.edit',rv:true,step:0};
    console.log(v.whois+' start.',data);
    try {

      v.step = 1; // 親要素を表示
      // ※display:noneのままだと内部要素のサイズが全て0に
      this.open();

      v.step = 2; // 編集対象となる参加者情報を表示
      this.data = data; // イベント発生時に参照するため保存
      v.rv = this.#setData(data);
      if( v.rv instanceof Error ) throw v.rv;

      /* 表示・非表示制御
        '.list .label button' : 参加者一覧表示/非表示ボタン
        '.list .content' : 参加者一覧(表)
        '.list .content .td[name="fee"] div' : 参加費欄(テキスト)
        '.list .content .td[name="fee"] select' : 参加費欄(プルダウン)
        '.detail .label button' : 詳細情報表示/非表示ボタン
        '.detail .content' : 詳細情報
        '.detail .content .message' : メッセージ(editURLへの誘導)
        '.buttons' : 取消・決定・全員受領ボタン
        '.buttons [name="取消"]' : 取消ボタン
        '.buttons [name="決定"]' : 決定ボタン
        '.buttons [name="全員"]' : 全員受領ボタン
      */
      v.step = 3.1; // 参加者一覧表示/非表示ボタン -> ボタンは非表示
      this.list.querySelector('.label button').classList.remove('act');
      v.step = 3.2; // 参加者一覧(表) -> 「表示」モードに設定
      this.toggle('.list',true);
      v.step = 3.3; // 参加費欄(テキスト) -> 非表示
      this.list.querySelectorAll('.content .td[name="fee"] div')
      .forEach(x => x.classList.remove('act'));
      v.step = 3.4; // 参加費欄(プルダウン) -> 表示
      this.list.querySelectorAll('.content .td[name="fee"] select')
      .forEach(x => x.classList.add('act'));
      v.step = 3.5; // 詳細情報表示/非表示ボタン -> ボタンは表示して「非表示」モードに設定
      this.detail.querySelector('.label button').classList.add('act');
      this.toggle('.detail',false);
      v.step = 3.6; // メッセージ(editURLへの誘導) -> 表示
      this.detail.querySelector('.content .message').classList.add('act');
      // 取消・決定・全員受領ボタン -> 表示
      this.buttons.classList.add('act');

      v.step = 4.1; // ボタンを正方形に
      this.buttons.querySelectorAll('button').forEach(x => {
        x.style.height = x.getBoundingClientRect().width + 'px';
      });
      v.step = 4.2; // 取消・決定・全員受領ボタンクリックで値を返すよう設定
      return new Promise(resolve => {
        // 取消 -> 戻り値はnull
        this.buttons.querySelector('[name="取消"]')
        .addEventListener('click',() => {
          // 戻り値の作成
          const rv = null;
          // 終了処理
          console.log('取消 -> '+JSON.stringify(rv)
          + '\nParticipants.edit normal end.\n');
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
          + '\nParticipants.edit normal end.\n');
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
          + '\nParticipants.edit normal end.\n');
          this.close();
          resolve(rv);
        });
      });

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 参加者情報を表示する
   * @param {Object} data - Authから返された参加者情報(Auth.info)
   * @returns {void}
   */
  view = (data) => {
    const v = {whois:'Participants.view',rv:true,step:0};
    console.log(v.whois+' start.',data);
    try {

      v.step = 1; // 親要素を表示
      // ※display:noneのままだと内部要素のサイズが全て0に
      this.open();

      v.step = 2; // 編集対象となる参加者情報を表示
      this.data = data; // イベント発生時に参照するため保存
      v.rv = this.#setData(data);
      if( v.rv instanceof Error ) throw v.rv;

      /* 表示・非表示制御
        '.list .label button' : 参加者一覧表示/非表示ボタン
        '.list .content' : 参加者一覧(表)
        '.list .content .td[name="fee"] div' : 参加費欄(テキスト)
        '.list .content .td[name="fee"] select' : 参加費欄(プルダウン)
        '.detail .label button' : 詳細情報表示/非表示ボタン
        '.detail .content' : 詳細情報
        '.detail .content .message' : メッセージ(editURLへの誘導)
        '.buttons' : 取消・決定・全員受領ボタン
        '.buttons [name="取消"]' : 取消ボタン
        '.buttons [name="決定"]' : 決定ボタン
        '.buttons [name="全員"]' : 全員受領ボタン
      */
      v.step = 3.1; // 参加者一覧表示/非表示ボタン -> ボタンは表示
      this.list.querySelector('.label button').classList.add('act');
      v.step = 3.2; // 参加者一覧(表) -> 「非表示」モードに設定
      this.toggle('.list',false);
      v.step = 3.3; // 参加費欄(テキスト) -> 表示
      this.list.querySelectorAll('.content .td[name="fee"] div')
      .forEach(x => x.classList.add('act'));
      v.step = 3.4; // 参加費欄(プルダウン) -> 非表示
      this.list.querySelectorAll('.content .td[name="fee"] select')
      .forEach(x => x.classList.remove('act'));
      v.step = 3.5; // 詳細情報表示/非表示ボタン -> ボタンは表示して「非表示」モードに設定
      this.detail.querySelector('.label button').classList.add('act');
      this.toggle('.detail',false);
      v.step = 3.6; // メッセージ(editURLへの誘導) -> 表示
      this.detail.querySelector('.content .message').classList.add('act');
      // 取消・決定・全員受領ボタン -> 非表示(操作不要)

      v.step = 4; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 表示/非表示ボタンクリック時の処理を定義
   * @param {PointerEvent|string} event - クリック時のイベントまたはボタンのCSSセレクタ
   * @param {boolean} show - trueなら開く
   * @returns {void}
   */
  toggle = (event,show) => {
    const v = {whois:'Participants.toggle',step:1,rv:null};
    console.log(v.whois+' start.',event,show);
    try {

      let content;  // 表示/非表示を行う対象となる要素
      let button;   // クリックされたボタンの要素
      if( typeof event === 'string' ){
        v.step = 1.1; // 初期設定時(引数がPointerEventではなくstring)
        content = this.wrapper.querySelector(event+' .content');
        button = this.wrapper.querySelector(event+' button');
      } else {
        v.step = 1.2; // ボタンクリック時
        content = event.target.parentElement.parentElement
        .querySelector('.content');
        button = event.target;
      }

      v.step = 2; // 表示->非表示 or 非表示->表示 を判断
      let toOpen = show ? show : (button.innerText === '表示');
      if( toOpen ){
        v.step = 2.1; // 表示に変更する場合
        button.innerText = '非表示';
        content.classList.add('act');
      } else {
        v.step = 2.2; // 非表示に変更する場合
        button.innerText = '表示';
        content.classList.remove('act');
      }

      v.step = 3;
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