/* 
1. 基本的に新しい記事が上に来るようにする
1. contentの中の"`"は"\`"に置換する(content終了記号と誤解される)
1. URLクエリで`/tips.html?id=xxxx`(xxxxは記事のID)とすると直接記事を呼び出せる
1. createdの秒以下は入力しない(∵ここから導出されるIDは分未満切捨で自動計算)
1. refが一つもないならテンプレート内のオブジェクトは削除
▼▼▼▼▼▼▼▼▼▼▼ テンプレートここから
{ // =====================================================================
  title: "",
  created: "2023// :",
  tag: [],
  ref: [{
    site: "",
    title: "",
    url:"",
  }], article:
  // =====================================================================
`

\`\`\`
\`\`\`

`},
▲▲▲▲▲▲▲▲▲▲▲ テンプレートここまで
*/
function getArticles(){
  return [
// この直後に追加
{ // =====================================================================
  title: "Markdown->html変換手順",
  created: "2023/09/22 10:40",
  tag: ['md'],
  ref: [{
    site: "",
    title: "",
    url:"",
  }], article:
  // =====================================================================
`
1. エディタで新規htmlファイルを作成、以下を事前にペースト<br>
   \`<!DOCTYPE html><html xml:lang="ja" lang="ja"></html>\`
1. 変換対象のMarkdown文書をchromeで開く
1. 開発者コンソールを開き、以下のコマンドを実行<br>
   \`document.querySelector('html').innerHTML\`
1. 実行結果をhtmlタグの間にペースト
1. 余計な改行(\\\\n)を削除して保存
`},
{ // =====================================================================
  title: "JavaScriptでsleep機能",
  created: "2023/09/01 08:54",
  tag: ['sleep'],
  ref: [{
    site: "",
    title: "Promiseでsleep機能を作る",
    url:"https://www.sejuku.net/blog/24629#index_id5",
  }], article:
  // =====================================================================
`以下の「指定時間待機」の部分を参照。secの単位はミリ秒

\`\`\`
window.addEventListener('DOMContentLoaded',async () => {
  const v = {whois:'DOMContentLoaded',
    sleep: (sec) =>  // 指定時間待機
      {return new Promise(resolve => setTimeout(resolve,sec))}
  };
  console.log(v.whois+' start.');
  try {

    v.LoadingIcon = new LoadingIcon('[name="loading"]');
    if( v.rv instanceof Error ) throw v.LoadingIcon;
    console.log(v.LoadingIcon);

    await v.sleep(5000);
    v.LoadingIcon.show();
    await v.sleep(5000);
    v.LoadingIcon.hide();

    console.log(v.whois+' normal end.',v.LoadingIcon);
  } catch(e){
    console.error(e,v);
  }
});
\`\`\`

`},
{ // =====================================================================
  title: "class用テンプレート",
  created: "2023/08/29 12:40",
  tag: ['class','proto','template'],
  ref: [], article:
  // =====================================================================
`JavaScript class用のテンプレート

1. 基本的に表示するページ単位でクラスを作成する
1. 以下は予約語とする
   - parent (string|HTMLElement) : 呼出元のhtmlの要素。constructorの引数。
     文字列で渡された場合、CSSセレクタとして扱う。
   - wrapper(HTMLElement) : parent直下でクラスで構成する要素全てを包含する要素
1. constructorでページのCSS/HTMLの定義を全て行う<br>
   ∵複数回呼び出すと要素やスタイルシートの重複が起きる
1. opt.cssは「通常隠蔽、actクラスが追加された表示」という形で定義
1. 複数回追加されないよう、必要な要素はopt.htmlで定義し、constructorで一括生成する

\`\`\`
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
        // CSS/HTML定義
        css:[
          /* Participants共通部分 */ \`
          .Participants.act {
            margin: 1rem;
            width: calc(100% - 2rem);
            display: grid;
            row-gap: 1rem;
            grid-template-columns: 1fr;
          }
          .Participants {
            display: none;
          }\`,
        ],
        html:[],
      },
    };
    console.log(v.whois+' start.',parent,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;


      v.step = 4; // 終了処理
      this.close();
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\\n',e,v);
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
      console.error(v.whois+' abnormal end(step.'+v.step+').\\n',e,v);
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

  /**
   * @returns {null|Error}
   */
  template = () => {
    const v = {whois:'Participants.template',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 3; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\\n',e,v);
      return e;
    }
  }  
}
\`\`\`

<details><summary>ダイアログのように入力値を受け取る場合のサンプル</summary>

- 入力値の受け取りはeditメソッド参照

\`\`\`
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
          /* Participants共通部分 */ \`
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
          }\`,
          /* 概要欄(QRコード、受付番号、申込者名) */\`
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
            grid-column: 5 / 13;
          }
          .Participants .summary [name="entryStr"] span {
            font-size: 2rem;
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
          }\`,
          /* 参加者一覧 */\`
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
          }\`,
          /* 詳細情報 */\`
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
          }\`,
          /* 取消・決定・全員受領ボタン */\`
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
          }\`,
        ],
        html:[
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
        this[x] = this.wrapper.querySelector('.'+x);
      });

      v.step = 3; // 画面を非表示に
      this.close();

      v.step = 4; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\\n',e,v);
      return e;
    }
  }

  /** 参加者情報を画面にセット
   * @param {Object} data - Authから返された参加者情報(Auth.info)
   * @returns {void}
   */
  #setData = (data) => {
    const v = {whois:'Participants.#setData',rv:true,step:0};
    console.log(v.whois+' start.');
    try {

      // ---------------------------------------------
      // 1. QRコード、受付番号、申込者名
      // ---------------------------------------------
      v.step = 1.1; // QRコード表示
      data.entryStr = String('0000'+data.entryNo).slice(-4);
      v.qrcode = this.summary.querySelector('[name="qrcode"]');
      v.qrSize = v.qrcode.clientWidth;
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
      console.error(v.whois+' abnormal end(step.'+v.step+').\\n',e,v);
      return e;
    }
  }

  /** 参加費の編集を行い、編集結果を返す
   * @param {Object} data - Authから返された参加者情報(Auth.info)
   * @returns {Object} {entryNo:{string},fee0n:'未入場/無料/未収/既収/退場済'}
   */
  edit = async (data) => {
    const v = {whois:'Participants.edit',rv:true,step:0};
    console.log(v.whois+' start.');
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
          + '\\nParticipants.edit normal end.\\n');
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
            '参加費を画面のように登録します。\\nよろしいですか？'
          ) ) rv = {};*/
          // 終了処理
          console.log('決定 -> '+JSON.stringify(rv)
          + '\\nParticipants.edit normal end.\\n');
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
            '全参加者の参加費を「受領」にします。\\nよろしいですか？'
          ) ) rv = {};*/
          // 終了処理
          console.log('全員受領 -> '+JSON.stringify(rv)
          + '\\nParticipants.edit normal end.\\n');
          this.close();
          resolve(rv);
        });
      });

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\\n',e,v);
      return e;
    }
  }

  /** 参加者情報を表示する
   * @param {Object} data - Authから返された参加者情報(Auth.info)
   * @returns {void}
   */
  view = (data) => {
    const v = {whois:'Participants.view',rv:true,step:0};
    console.log(v.whois+' start.');
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
      console.error(v.whois+' abnormal end(step.'+v.step+').\\n',e,v);
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
    console.log(v.whois+' start.');
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
      console.error(v.whois+' abnormal end(step.'+v.step+').\\n',e,v);
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
\`\`\`

</details>

<details><summary>呼出元のhtmlサンプル</summary>

\`\`\`
<!DOCTYPE html><html xml:lang="ja" lang="ja"><head>
<title>design(Participants)</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="../szLib.css" rel="stylesheet" />
<style type="text/css"></style>
</head><body>
  <div class="Participants"></div>
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script type="text/javascript" src="core.js"></script>
<script type="text/javascript" src="../createElement.js"></script>
<script type="text/javascript" src="../mergeDeeply.js"></script>
<script type="text/javascript" src="../setupInstance/core.js"></script>
<script type="text/javascript">
window.addEventListener('DOMContentLoaded',async () => {
  const v = {whois:'DOMContentLoaded'};
  console.log(v.whois+' start.');
  try {

    v.Participants = new Participants('div.Participants',kokusho,{});
    if( v.rv instanceof Error ) throw v.Participants;
    console.log(v.Participants);

    //console.log(await v.Participants.edit());
    console.log(v.Participants.view());

    console.log(v.whois+' normal end.',v.rv);
  } catch(e){
    console.error(e,v);
  }
});

const kokusho = {"タイムスタンプ":"2023-08-01T06:36:48.485Z","メールアドレス":"nakaone.kunihiro@gmail.com","申込者氏名":"国生　さゆり","申込者カナ":"コクショウ　サユリ","申込者の参加":"参加予定(宿泊あり)","宿泊、テント":"宿泊する(テントなし)","引取者氏名":"申込者が参加して帰宅時の付添もするのでお迎えは不要","参加者01氏名":"国生　二郎","参加者01カナ":"コクショウ　ジロウ","参加者01所属":"未就学児","参加者02氏名":"","参加者02カナ":"","参加者02所属":"","参加者03氏名":"","参加者03カナ":"","参加者03所属":"","参加者04氏名":"","参加者04カナ":"","参加者04所属":"","参加者05カナ":"","参加者05氏名":"","参加者05所属":"","緊急連絡先":"","ボランティア募集":"","備考":"","キャンセル":"","":"","name":"","entryStr":"","authority":"2","cancel":"","entryNo":"8","publicKey":"iPUMOS7fuuwQngJys2i1C+5D6bvmjrW82a0PXfyGYAyCyrlqSv8LXQdlHqwQeyrwoOv41SOaAVmLKFIFNpBBjmplfFFIxg4f6GAiVikHCMigqmCg+0XvHUEsQMSO5VHze9Sd1Tml/kcmpUEPg8zsIVSK6oFKQWLe69VFKMKt7T8=","editURL":"https://docs.google.com/forms/d/e/1FAIpQLScEzS8-uNgeM40rZvGl60uZewwHZhyPeQJAicS_LjMEYrMqfQ/viewform?edit2=2_ABaOnueEf0MZp9TyeRuVRGK6toYaRDxYmY5_-w_psQH_VRBlAkAfIB2h8Kay9qRUUITM98E","passCode":"868670","genPassCode":"2023-08-25T04:43:06.611Z","NG1":"","NG2":"","certificate":"2023-08-25T04:43:33.237Z","fee00":"","fee01":"","fee02":"","fee03":"","fee04":"","fee05":"","memo":""};
</script>
</html>
\`\`\`

</details>


`},
{ // =====================================================================
  title: "JavaScriptでのファイル加工",
  created: "2023/08/28 11:55",
  tag: ['proto','テンプレート','node','css','console'],
  ref: [], article:
  // =====================================================================
`コンソールでちょっとしたファイル加工を行う場合のサンプル。

以下はParticipants開発でCSSファイルからsetupInstance()に渡すCSS定義オブジェクトを作成した例。

\`\`\`
// useage:
// % node cssConvert.js [入力先ファイル名] > [出力先ファイル名]

const fs = require('fs');
const v = {
  sp:'        ',
  propRex: /^\\s+(.+?)\\s*:\\s*(.+?);.*$/,
  selRex: /^\\s*(.+?)\\s*\\{.*$/,
};

// 入力先ファイルから内容を読み込む
v.r0 = fs.readFileSync(process.argv[2], {encoding: 'utf-8'});
v.r1 = v.r0.split('\\n');
v.r2 = ['[\\n'];
v.r1.forEach(l => {
  if( v.selRex.test(l) ){
    // selの変換
    v.r2.push(l.replace(
      v.selRex,
      "  }\\n},{\\n  sel :'$1',\\n  prop:{\\n")
    );
  }
  if( v.propRex.test(l) ){
    // prop部分の変換
    v.r2.push(l.replace(
      v.propRex,
      "    '$1': '$2',\\n"  
    ));
  }
})
v.r2.push('  }\\n}],')
v.r3 = v.r2.join('');
console.log(v.r3);
\`\`\`

`},
{ // =====================================================================
  title: "JavaScriptのclassで自分のメソッドを呼び出せない",
  created: "2023/8/13 15:35",
  tag: ['class','this'],
  ref: [{
    site: "",
    title: "JavaScriptのコールバックで クラスthis が参照できないの解決策",
    url:"https://pisuke-code.com/javascript-class-this-in-callback/",
  }], article:
  // =====================================================================
`## 現象

JavaScript classでメソッドを定義し、イベントリスナに追加する。

\`\`\`
class Reception {
  constructor(area,boot,opt={}){
    (中略)
    v.step = '3'; // スキャナ起動イベントの定義(「受付」タグのクリック)
    this.boot.element.addEventListener('click',this.bootScanner);
  }

  async bootScanner(){
    (中略)
    const sel = this.area.selector+' [name="entry"] .webScanner';
    (中略)
  }
}
\`\`\`

以下のようなエラーが発生

\`\`\`
Reception.bootScanner abnormal end.
TypeError: Cannot read properties of undefined (reading 'selector')
\`\`\`

これはbootScannerの中でクラスメンバ(this)が参照できないのが原因(thisがundefinedになっている)。

## 対応

この場合、bootScannerを**アロー関数で定義**すると回避できる。

\`\`\`
class Reception {
  constructor(area,boot,opt={}){
    (中略)
  }

  bootScanner = async () => {
    (中略)
    const sel = this.area.selector+' [name="entry"] .webScanner';
\`\`\`

`},
{ // =====================================================================
  title: "[失敗]Mac標準ApacheのSSL通信化(https対応)",
  created: "2023/7/21 14:30",
  updated: "2023/7/23 14:51",
  tag: ['Apache','httpd','mac OS標準','SSL','https'],
  ref: [{
    site: "",
    title: "Macに最初から入っているApacheでSSL通信する環境を整えた",
    url:"https://www.karakaram.com/mac-apache-ssl/",
  }], article:
  // =====================================================================
`# 結論

後掲の作業を実施しても接続拒否で失敗。

現状(camp2023)のソースはGoogle Driveへの保存でhttps接続できるので、必要性は高くないと判断、これ以上の調査・作業は中止。

以下は事前調査と作業記録。

# 事前確認：httpd-ssl.confの存在

\`\`\`
cd /etc/apache2 
% ls 
extra		magic		original	users
httpd.conf	mime.types	other
% vi httpd.conf
-------------------------
# Secure (SSL/TLS) connections 
#Include /private/etc/apache2/extra/httpd-ssl.conf
# 
# Note: The following must must be present to support
#       starting without SSL on platforms with no /dev/random equivalent
#       but a statically compiled-in mod_ssl.
# 
-------------------------
:/httpd-ssl.conf
-------------------------
% ls /private/etc/apache2/extra
httpd-autoindex.conf		httpd-mpm.conf
httpd-dav.conf			httpd-multilang-errordoc.conf
httpd-default.conf		httpd-ssl.conf <-- ちゃんとあった
httpd-info.conf			httpd-userdir.conf
httpd-languages.conf		httpd-vhosts.conf
httpd-manual.conf		proxy-html.conf
\`\`\`

# 実作業

1. サーバ秘密鍵を作成する
2. 証明書署名要求(CSR)を作成する
3. 自己署名証明書(CRT)を作成する
4. 秘密鍵と証明書を Apache から参照できる場所に設置
5. Apache が SSL 設定ファイルを読み込めるようにする
6. Apache を再起動して動作確認

## サーバ秘密鍵を作成する

最初サイト記載通り\`openssl genrsa -des3 -rand rand.dat 1024 > server.pem\`を行ったが、「"-rand"なんてパラメータはない」と言われたのでスキップ

\`\`\`
% openssl genrsa -des3 1024 > server.pem 
Generating RSA private key, 1024 bit long modulus
...................+++++
........................+++++
e is 65537 (0x10001)
Enter pass phrase:[skz.oyaji]
Verifying - Enter pass phrase:[skz.oyaji]
% openssl rsa -in server.pem -out server.pem
Enter pass phrase for server.pem:[skz.oyaji]
writing RSA key
%
\`\`\`

## 証明書署名要求(CSR)を作成する

\`\`\`
% openssl req -new -key server.pem -out csr.pem
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) []:jp
State or Province Name (full name) []:Tokyo
Locality Name (eg, city) []:Setageya
Organization Name (eg, company) []:Shimokitazawa
Organizational Unit Name (eg, section) []:Oyaji
Common Name (eg, fully qualified host name) []:
Email Address []:shimokitasho.oyaji@gmail.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:skz.oyaji
%
\`\`\`

## 自己署名証明書(CRT)を作成する

\`\`\`
% openssl req -days 365 -in csr.pem -key server.pem -x509 -out crt.pem 
% ls -la
total 24
drwxr-xr-x   5 ena.kaon  staff  160  7 23 14:21 .
drwxr-xr-x  12 ena.kaon  staff  384  7 23 10:31 ..
-rw-r--r--   1 ena.kaon  staff  932  7 23 14:21 crt.pem
-rw-r--r--   1 ena.kaon  staff  729  7 23 14:19 csr.pem
-rw-r--r--   1 ena.kaon  staff  887  7 23 14:16 server.pem
% 
\`\`\`

## 秘密鍵と証明書を Apache から参照できる場所に設置

\`\`\`
sudo vi /private/etc/apache2/extra/httpd-ssl.conf
\`\`\`

以下viの画面

\`\`\`
#   Server Certificate:
#   (中略)
SSLCertificateFile "/private/etc/apache2/server.crt"
#SSLCertificateFile "/private/etc/apache2/server-dsa.crt"
#SSLCertificateFile "/private/etc/apache2/server-ecc.crt"

#   Server Private Key:
#   (中略)
SSLCertificateKeyFile "/private/etc/apache2/server.key"
#SSLCertificateKeyFile "/private/etc/apache2/server-dsa.key"
#SSLCertificateKeyFile "/private/etc/apache2/server-ecc.key"
\`\`\`

念の為にバックアップしようとしたら、実態がなかった

\`\`\`
% mkdir backup
% cd backup 
ena.kaon@enakaonnoMacBook-Air backup % sudo cp /private/etc/apache2/server.crt ./
sudo cp /private/etc/apache2/server.key ./
Password:
cp: /private/etc/apache2/server.crt: No such file or directory
cp: /private/etc/apache2/server.key: No such file or directory
\`\`\`

安心して作成したファイルをコピー

\`\`\`
% sudo cp server.pem /private/etc/apache2/server.key
sudo cp crt.pem /private/etc/apache2/server.crt
% ls -la /private/etc/apache2 
total 104
drwxr-xr-x  11 root  wheel    352  7 23 14:31 .
drwxr-xr-x  79 root  wheel   2528  7 20 18:17 ..
drwxr-xr-x  14 root  wheel    448  7 23 14:28 extra
-rw-r--r--   1 root  wheel  21648  6 15 19:08 httpd.conf
-rw-r--r--   1 root  wheel  13064  6 15 19:08 magic
-rw-r--r--   1 root  wheel  61118  6 15 19:08 mime.types
drwxr-xr-x   4 root  wheel    128  6 15 19:08 original
drwxr-xr-x   4 root  wheel    128  6 15 19:08 other
-rw-r--r--   1 root  wheel    932  7 23 14:31 server.crt
-rw-r--r--   1 root  wheel    887  7 23 14:31 server.key
drwxr-xr-x   2 root  wheel     64  6 15 19:08 users
% 
\`\`\`

## Apache が SSL 設定ファイルを読み込めるようにする

修正前

\`\`\`
# Secure (SSL/TLS) connections
#Include /private/etc/apache2/extra/httpd-ssl.conf
\`\`\`

修正後

\`\`\`
# Secure (SSL/TLS) connections
Include /private/etc/apache2/extra/httpd-ssl.conf
\`\`\`

## Apache を再起動して動作確認


http://localhost/
-> Failed to load resource: 

https://localhost/
-> このサイトにアクセスできませんlocalhost で接続が拒否されました。

https://192.168.1.7/
このサイトにアクセスできません192.168.1.7 で接続が拒否されました。

`},{ // =====================================================================
  title: "スプレッドシート上でQRコード作成時の注意",
  created: "2023/7/23 13:38",
  tag: ['Google Spread','QR','JSON'],
  ref: [{
    site: "MDN",
    title: "JSON.parse() は末尾のカンマを許容しない",
    url:"https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#json.parse_%E3%81%AF%E6%9C%AB%E5%B0%BE%E3%81%AE%E3%82%AB%E3%83%B3%E3%83%9E%E3%82%92%E8%A8%B1%E5%AE%B9%E3%81%97%E3%81%AA%E3%81%84",
  }], article:
  // =====================================================================
`JSONのQRコードを作成する場合、最後のメンバの後ろには','を付けてはならない。

⇒ d列に"label:'value',"の文字列を作成し、arrayformula(concatenate(d:d))とすると末尾にカンマが入る。
ついでに単一引用符も許されないので、要注意。

`},{ // =====================================================================
  title: "VSCodeでGASを編集",
  created: "2023/7/23 13:32",
  tag: ['VSCode','Google Apps Script','編集','clasp'],
  ref: [{
    site: "",
    title: "claspを使ってGoogle Apps Scriptをローカルで開発・編集する その1 - claspを使ってみる",
    url:"https://qiita.com/croquette0212/items/f78cc42d328131c3db43",
  },{
    site: "",
    title: "clasp公式",
    url:"https://github.com/google/clasp",
  }], article:
  // =====================================================================
`コンソールでGASフォルダに移動、以下のコマンドを実行

- Googleから新規取得：\`clasp clone 1lWxD〜Jau3L\`
- Googleからソースを複写：\`clasp pull\`
- ローカルの編集結果をGoogleに反映：\`clasp push\` (ファイル毎に実行)

GASフォルダに複数ソースを集めようとすると\`.clasp.json already exist\`エラーでうまく行かない。取り敢えず以下で対応。

\`\`\`
cd 〜/GAS
mkdir szLib
clasp clone "1lWxDf〜Jau3L" --rootDir ./szLib
mkdir broad
clasp clone "1xmqZ〜wMkJr" --rootDir ./broad
\`\`\`

以下は一括クローンのスクリプト

\`\`\`
cd ~/Desktop/GitHub/EventStaff/GAS/
rm -rf *

mkdir auth
cd auth
clasp clone "1tpNOGYh0oK_jI13xMCdB6oFMHyfB9fd1pij22fOR0Md_l3PdAP98d5A7"

mkdir broad
cd broad
clasp clone "1xmqZLk3MuTkqy2Fy_J4_1y3dVQns1PJ_YN0V4eTKQkMsjtlcjvzwMkJr"

mkdir delivery
cd delivery
clasp clone "1njRQbqxYhzGdK2Q-XQtyZB4vW0LUl1gWawnkr_TCmkwsq_hNJd-LUYdI"

mkdir master
cd master
clasp clone "1ZTPbqoESlBE0saH22f3aUlbIOobg0iUjLkXlAoyojuJ4JTV4Q-bBz7TO"

mkdir post
cd post
clasp clone "105XhDZdUMmC6ZhvUERs01J5gTYA2be065mGnlW4RZDvblr8mHIvrNz1P"

mkdir szLib
cd szLib
clasp clone "1lWxDf1fpXFP0TzbvNo1AyTLpzWmrP3nOJPNgFskTQyOaaSKbcpHJau3L"
\`\`\`

## 一括クローン

\`\`\`
cd ~/Desktop/GitHub/EventStaff/GAS/
rm -rf *

mkdir auth
cd auth
clasp clone "1tpNOGYh0oK_jI13xMCdB6oFMHyfB9fd1pij22fOR0Md_l3PdAP98d5A7"
cd ..

mkdir broad
cd broad
clasp clone "1xmqZLk3MuTkqy2Fy_J4_1y3dVQns1PJ_YN0V4eTKQkMsjtlcjvzwMkJr"
cd ..

mkdir delivery
cd delivery
clasp clone "1njRQbqxYhzGdK2Q-XQtyZB4vW0LUl1gWawnkr_TCmkwsq_hNJd-LUYdI"
cd ..

mkdir master
cd master
clasp clone "1ZTPbqoESlBE0saH22f3aUlbIOobg0iUjLkXlAoyojuJ4JTV4Q-bBz7TO"
cd ..

mkdir post
cd post
clasp clone "105XhDZdUMmC6ZhvUERs01J5gTYA2be065mGnlW4RZDvblr8mHIvrNz1P"
cd ..

mkdir szLib
cd szLib
clasp clone "1lWxDf1fpXFP0TzbvNo1AyTLpzWmrP3nOJPNgFskTQyOaaSKbcpHJau3L"
cd ..
\`\`\`

`},{ // =====================================================================
  title: "[旧版]GASから他API呼び出しのテンプレート",
  created: "2023/7/23 13:30",
  tag: ['Google Apps Script','fetch','template','prototype'],
  ref: [], article:
  // =====================================================================
`

\`\`\`
const options = {
  'method': 'post',
  'headers': {
    'contentType': 'application/json',
  },
  'payload': {
    passPhrase  : config.MasterKey,  // 相手先APIの秘密鍵
    func: 'auth1B',   // 相手先APIのdoPostで分岐させる際のキーワード
    entryNo: entryNo, // 以下、相手に渡したいキー・値の組み合わせ
  },
}
const r0 = UrlFetchApp.fetch(config.MasterURL,options);
const r1 = r0.getContentText();
const res = JSON.parse(r1);
console.log('■■局.res='+r1);
if( res.isErr ){
  rv = {isErr:true,message:res.message};
} else {
  rv = {isErr:false};
}
\`\`\`

`},
{ // =====================================================================
  title: "[旧版]GASのdoPost関数テンプレート",
  created: "2023/7/23 13:27",
  tag: ['Google Apps Script','doPost','template','prototype'],
  ref: [], article:
  // =====================================================================
`旧版。参考のため暫定的に掲載。

\`\`\`
const elaps = {account:'shimokitasho.oyaji@gmail.com',department:'■■局'};
const conf = szLib.getConf();

/** doPost: パラメータに応じて処理を分岐
 * @param {object} e - Class UrlFetchApp <a href="https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchurl,-params">fetch(url, params)</a>の"Make a POST request with a JSON payload"参照
 * @param {object} arg - データ部分。JSON.parse(e.postData.getDataAsString())の結果
 * @param {string} arg.passPhrase - 共通鍵。szLib.getUrl()で取得
 * @param {string} arg.from       - 送信元
 * @param {string} arg.to         - 送信先(自分)
 * @param {string} arg.func       - 分岐する処理名
 * @param {string} arg.data       - 処理対象データ
 * @return {object} 正常終了の場合は分岐先処理の戻り値、エラーの場合は以下。
 * <ul>
 * <li>isErr {boolean}  - true(固定)
 * <li>message {string} - エラーメッセージ
 * </ul>
 */
function doPost(e){
  elaps.startTime = Date.now();  // 開始時刻をセット
  console.log('■■局.doPost start.',e);

  const arg = JSON.parse(e.postData.contents);
  let rv = null;
  if( arg.passPhrase === conf.Master.key ){
    try {
      elaps.func = arg.func; // 処理名をセット
    
      switch( arg.func ){
        case 'auth1B':
          rv = auth1B(arg.data);
          break;
      }
    } catch(e) {
      // Errorオブジェクトをrvとするとmessageが欠落するので再作成
      rv = {isErr:true, message:e.name+': '+e.message};
    } finally {
      console.log('■■局.doPost end. rv='+JSON.stringify(rv));
      szLib.elaps(elaps, rv.isErr ? rv.message : 'OK');  // 結果を渡して書き込み
      return ContentService
      .createTextOutput(JSON.stringify(rv,null,2))
      .setMimeType(ContentService.MimeType.JSON);
    }
  } else {
    rv = {isErr:true,message:'invalid passPhrase :'+e.parameter.passPhrase};
    console.error('■■局.doPost end. '+rv.message);
    console.log('end',elaps);
    szLib.elaps(elaps, rv.isErr ? rv.message : 'OK');
  }
}
\`\`\`

`},{ // =====================================================================
  title: "PandocでOPMLをMDに変換する",
  created: "2023/7/23 13:21",
  tag: ['workflowy','opml','pandoc','md','markdown'],
  ref: [{
    site: "",
    title: "Pandoc で OPML ファイルを markdown に変換する",
    url:"https://www.d-wood.com/blog/2015/07/24_7583.html",
  }], article:
  // =====================================================================
`
(未検証)

\`\`\`
\`\`\`

`},
{ // =====================================================================
  title: "JavaScriptテンプレート",
  created: "2023/7/22 11:50",
  tag: ['JavaScript','template','prototype'],
  ref: [], article:
  // =====================================================================
`2023.8.24

\`\`\`
prototype = () => {
  const v = {whois:'prototype',rv:null,step:0};
  console.log(v.whois+' start.');
  try {

    console.log("%s step.%s\\n",v.whois,v.step,this);

    console.log(v.whois+' normal end.\\n',v.rv);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}
\`\`\`

2023.7.22

\`\`\`
function prototype(){
  const v = {rv:null};
  console.log('prototype start.');
  try {

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('prototype end.');
    return v.rv;
  } catch(e){
    console.error('prototype abnormal end.',e);
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止する場合
    v.rv.stack = e.stack; return v.rv; // 処理継続する場合
  }
}
\`\`\`

`},
{ // =====================================================================
  title: "HTMLテンプレート(ライブラリコンポーネント用)",
  created: "2023/7/22 11:00",
  updated: "2023/7/22 13:46",
  tag: ['html','template','prototype','library','component','console','webApp'],
  ref: [], article:
  // =====================================================================
`# 使用上の注意

1. コア部分に加え、webアプリ・テストにも対応。適宜不要部分は削除して使用。
1. 文中の'prototype'は最初に一括置換
1. JSDocは作成中に適宜追加すること

\`\`\`
<!DOCTYPE html><html xml:lang="ja" lang="ja"><head>
<title>prototype</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style type="text/css" class="core">/* コアCSS */
</style>
</head><body>
<div><!-- 開始：HTML -->
<h1>prototype</h1>
<p>開発者コンソールの「Uncaught ReferenceError: require is not defined」は無視して問題無し</p>

<div class="core"><!-- コアHTML -->
</div>

<div class="webApp"><!-- webアプリHTML -->
  <div>
    <label for="inputData">入力</label>
    <textarea id="inputData">テストデータ</textarea>
  </div>
  <div>
    <label for="outputData">出力</label>
    <textarea id="outputData"></textarea>
  </div>

</div>
</div><!-- 終了：HTML領域 -->

<div><!-- 開始：Script領域 -->
<!-- 外部Script -->
<!-- 自作ライブラリ -->
<!-- webApp利用時： srcのみ必要。パスはcomponentが起点
  コンソール利用時：class="onConsole" data-embedが必要。data-embedの起点はtools -->
<script type="text/javascript" src="analyzeArg.js" class="onConsole"
  data-embed="../component/analyzeArg.js"></script>

<script type="text/javascript" class="core">/* コアScript */
function prototype(arg){
  const v = {rv:null};
  console.log('prototype start.');
  try {

    v.rv = arg;
    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('prototype end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止する場合
    v.rv.stack = e.stack; return v.rv; // 処理継続する場合
  }
}
</script>

<script type="text/javascript" class="onConsole">/* コンソール実行用 */
const fs = require('fs'); // ファイル操作
function onConsole(){
  console.log('prototype.onConsole start.');
  const v = {rv:null};
  try {

    // 事前処理：引数チェック、既定値の設定
    v.argv = analyzeArg();
    console.log(v.argv)
    if(v.argv.hasOwnProperty('stack')) throw v.argv;

    v.readFile = fs.readFileSync(v.argv.opt.i,'utf-8').trim();
    v.rv = prototype(v.readFile);
    v.writeFile = fs.writeFileSync(v.argv.opt.o,v.rv,'utf-8');  

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('prototype.onConsole end.');
  } catch(e){
    console.error('prototype.onConsole abnormal end.',e);
  }
}
onConsole();
</script>

<script type="text/javascript" class="test">/* テスト用 */
function prototypeTest(){
  const v = {data:[
    'fuga','hoge',
  ]};
  console.log('prototypeTest start.');
  try {

    for( let i=0 ; i<v.data.length ; i++ ){
      v.result = prototype(v.data[i]);
      console.log(v.result);
    }
    console.log('prototypeTest end.');

  } catch(e){
    console.error('prototypeTest abnormal end.',e);
  }
}
</script>

<script type="text/javascript">
function onInput(event=null){
  const v = {
    in: document.getElementById('inputData'),
    out: document.getElementById('outputData'),
  };
  console.log('onInput start.');
  try {

    console.log(event,v.in.value);
    v.out.value = prototype(v.in.value);
    console.log('onInput end.');

  } catch(e){
    console.error('onInput abnormal end.',e);
    alert(e.stack); 
    v.rv.stack = e.stack; return v.rv;
  }
}

window.addEventListener('DOMContentLoaded',() => {
  const v = {};

  // webアプリの入力欄変更時のイベントを定義
  document.getElementById('inputData')
    .addEventListener('input',event => onInput(event));
  // テストデータを表示するため、キー入力時の処理を呼び出す
  onInput();

  // 開発者コンソール上でテスト
  prototypeTest();
});
</script>
</div><!-- 終了：Script領域 -->
</body></html>
\`\`\`

`},{ // =====================================================================
  title: "HTMLテンプレート(最小構成)",
  created: "2023/7/22 10:50",
  tag: ['html','template','prototype'],
  ref: [], article:
  // =====================================================================
`最小構成

\`\`\`html
<!DOCTYPE html><html xml:lang="ja" lang="ja"><head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="../szLib.css" rel="stylesheet" />
<style type="text/css"></style>
</head><body>


</body>
<script type="text/javascript">
window.addEventListener('DOMContentLoaded',() => {
  const v = {};
});
</script>
</html>
\`\`\`

`},
{ // =====================================================================
  title: "検証：CSSは動的に追加した要素にも適用される",
  created: "2023/7/21 17:25",
  tag: ['html','css','element'],
  ref: [], article:
  // =====================================================================
`結論：読み込み時点で不在で動的に追加した要素にも、事前に定義されていたCSSは適用される。

<details><summary>検証したソース</summary>

\`\`\`html
<!DOCTYPE html><html lang="ja">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <meta http-equiv="Content-Script-Type" content="text/javascript">
  <title>CSS適用テスト</title>
  <style>
    #scanner {
      background-color: aqua;
      width: 80vw;
      height: 80vw;
      padding: 10vw;
    }
    #scanner .video {
      background-color: brown;
      width: 80%;
      height: 80%;
    }
  </style>
</head>

<body>
  <button onclick="addDiv()">add</button>
  <button onclick="delDiv()">del</button>
  <div id="test"></div>
</body>
<script>
const addDiv = () => {
  const e1 = document.createElement('div');
  e1.id = 'scanner';

  const e2 = document.createElement('div');
  e2.className = 'video';

  e1.appendChild(e2);
  document.getElementById('test').appendChild(e1);
}

const delDiv = () => {
  document.getElementById('scanner').remove();
}
</script>
</html>
\`\`\`

</details>

`},{ // =====================================================================
  title: "Android開発者画面の参照方法",
  created: "2023/7/21 17:30",
  tag: ['Android','開発','USB','デバッグ','debug'],
  ref: [], article:
  // =====================================================================
`[chrome://inspect/#devices](chrome://inspect/#devices)を開く

- [Android実機で Chrome の開発者ツールを開く＆デバッグする方法](https://pisuke-code.com/android-use-chrome-devtools/)
- Android側でのUSB接続許可：[Android デバイスで USB デバッグを有効にする](https://www.embarcadero.com/starthere/xe5-2/mobdevsetup/android/ja/enabling_usb_debugging_on_an_android_device.html)
`},{ // =====================================================================
  title: "「Google の審査プロセスを完了していません」の対応",
  created: "2023/7/21 17:19",
  tag: ['Google Cloud','OAuth','エラー','err'],
  ref: [], article:
  // =====================================================================
`Google Cloud > APIとサービス > OAuth同意画面 > 公開ステータス

「テスト」となっている場合、「アプリを公開」をクリック
`},{ // =====================================================================
  title: "GASで実行したスクリプトのログ参照方法",
  created: "2023/7/21 15:42",
  tag: ['GAS','ログ','Google Cloud Console'],
  ref: [{
    site: "",
    title: "Google Apps Scriptでトリガー実行（doGet,doPost）のログを表示するにはGCPプロジェクトに紐付ける必要があるらしい",
    url:"https://ryjkmr.com/google-apps-script-console-log/",
  }], article:
  // =====================================================================
`GASのdoPostはconsole.logを入れたとしてもGASのExecutions上でログが取得できない。これを参照する方法。

- ログの設定
  - GCPでの作業
    - 新規プロジェクトの作成
      - GCPコンソールのプロジェクト選択欄で「新しいプロジェクト」を選択
      - 「プロジェクトの選択」画面で「新しいプロジェクト」を選択
      - 「新しいプロジェクト」画面でプロジェクト名を付けて「作成」をクリック<br>
        \`プロジェクト名：EventStaff  場所：組織なし\`
    - 0Auth同意
      - APIとサービス > 0Auth同意画面
      - 0Auth同意画面で「User Type : 外部」を設定して「作成」
      - アプリ登録の編集①0Auth同意画面<br>
        公開ステータスの「テスト」の下にある「アプリを公開」 > 「本番環境にPUSHしますか？」で確認<br>
        他は以下の3項目だけ設定
        \`\`\`
        アプリ名：EventStaff
        ユーザーサポートメール：shimokitasho.oyaji@gmail.com
        デベロッパーの連絡先：同上
        \`\`\`
      - アプリ登録の編集②スコープ：特に設定なし
      - アプリ登録の編集③テストユーザ：特に設定なし
      - アプリ登録の編集④概要：特に設定なし
    - コンソール他で表示されるプロジェクト番号をコピー
  - GASでの作業
    - Apps Scriptコンソール > プロジェクトの設定(歯車) > プロジェクトを変更
    - 拡張機能 > Apps Script
    - GASのプロジェクト設定で「プロジェクト番号」をペースト、「プロジェクトの変更」をクリック
    - GCPプロジェクト画面で「プロジェクトを変更」をクリック
    - 改めてデプロイ(新規)を実行
- ログの参照
  - https://console.cloud.google.com/logs/
  - GCPダッシュボード > モニタリング > 「→[モニタリング]に移動」 > 画面右上のLOGGING<br>
    GASコンソール「実行数」から「Cloudのログ」を選択しても表示されない
`},{ // =====================================================================
  title: "JSDocの作り方",
  created: "2023/7/21 15:29",
  tag: ['JSDoc','Documentation','jsdoc-to-markdown','jsdoc2md'],
  ref: [], article:
  // =====================================================================
`[JSDoc使い方メモ](https://qiita.com/opengl-8080/items/a36679f7926f4cac0a81)

\`/** \`の直後に動作概要を記述可能だが、関数定義の前に記述する必要がある(以下はNG)

\`\`\`
function getSheetData(sheetName='マスタ',spreadId){  /** 指定シートから全データ取得
 * @param {string} sheetName - 取得対象シート名
(後略)
\`\`\`

戻り値が複雑な場合、以下の形式で記述。

\`\`\`
/**
 * 以下の3つの要因に基づいて重さを計算します:
 * <ul>
 * <li>送った項目
 * <li>受け取った項目
 * <li>タイムスタンプ
 * </ul>
 */
\`\`\`

documentationが\`@link\`に未対応のため、リンクは\`<a href="〜">...</a>\`で記述する。

出力はGASディレクトリに移動、出力先を指定して\`jsdoc -r szLib -d ../doc/szLib\`のように実行する。

<details><summary>[不採用] Documentation.js</summary>

documentation build -f md Agency.js --markdown-toc-max-depth=2 > Agency.md

[JsDocをもとにドキュメントを自動生成する](https://qiita.com/yuma84/items/e34e800cbd0b7632f85f)
[Using documentation on the command line](https://github.com/documentationjs/documentation/blob/master/docs/USAGE.md)

</details>

<details><summary>[不採用] JSDocによる一括作成</summary>

\`\`\`
cd ~/Desktop/GitHub/EventStaff/
rm -rf ./doc/*

cd GAS
jsdoc -r auth -d ../doc/auth
jsdoc -r broad -d ../doc/broad
jsdoc -r delivery -d ../doc/delivery
jsdoc -r master -d ../doc/master
jsdoc -r post -d ../doc/post
jsdoc -r szLib -d ../doc/szLib

cd ..
jsdoc js/EventStaff.js -d doc/EventStaff
jsdoc js/library.js -d doc/library
\`\`\`

悪い点
- 生成されるのがHTMLのため、githubにアップするとHTMLのソースが表示される!!

</details>

[採用] jsdoc-to-markdown

例：\`jsdoc2md Agency.js > Agency2.md\`

良い点
- 1関数1項目で、説明もparamもreturnsもその配下にまとまっている<br>
　⇒ 他のMDに移植しやすい(レベルの置換が簡単)
- Documentation.jsのようなobjectをMDNの解説ページにリンクさせる等、余計なリンクがない
- ローカルリンクはaタグを使っている。D.jsのようにリスト型では無いので、複数ソースを一つのMDにまとめても問題なし

悪い点
- TOCがタグだらけ。見づらい
- returnsがparamより先に来ていて違和感がある
- 理由は分からないが、string, object等の型名毎にcodeタグが付いてくる
`},{ // =====================================================================
  title: "GAS：APIのURLを固定する",
  created: "2023/7/21 15:19",
  tag: ['GAS','API','URL','固定'],
  ref: [{
    site: "",
    title: "GoogleAppsScript(GAS)を固定URLでデプロイする方法",
    url:"https://codeaid.jp/gas-deploy/",
  }], article:
  // =====================================================================
`予め「新しいデプロイ」で「公開URL」を作成。これが固定URLとなる

1. ソース修正後「新しいデプロイ」で新バージョンを作成
1. 「デプロイの管理」で「公開URL」を選択
1. 右上の鉛筆マークをクリックして編集モードに
1. バージョン欄で作成された新バージョンを選択
1. 説明欄に「公開URL」を設定

なお適宜不要なバージョンはアーカイブする。
`},{ // =====================================================================
  title: "mac OS標準Apache httpdの起動と終了",
  created: "2023/07/21 08:00",
  tag: ['Apache','httpd','mac OS標準','起動','停止'],
  ref: [], article:
  // =====================================================================
`
\`\`\`
% which httpd   # httpdがインストールされているパスの確認
/usr/sbin/httpd
% which apachectl #apachectlがインストールされているパスの確認
/usr/sbin/apachectl
% /usr/sbin/httpd -version  # httpdのバージョン
Server version: Apache/2.4.56 (Unix)
Server built:   Apr 15 2023 04:26:33
% sudo /usr/sbin/apachectl start  # httpdの起動
Password:
/System/Library/LaunchDaemons/org.apache.httpd.plist: service already loaded
Load failed: 37: Operation already in progress
% sudo /usr/sbin/apachectl stop # httpdの停止
\`\`\`
`},{ // =====================================================================
  title: "DocumentRootの確認",
  created: "2023/07/21 08:00",
  tag: ['Apache','httpd','mac OS標準','DocumentRoot'],
  ref: [], article:
  // =====================================================================
`
\`\`\`
% cd /etc/apache2 # httpd.confの格納場所
% ls -la
total 88
drwxr-xr-x   9 root  wheel    288  6 15 19:08 .
drwxr-xr-x  79 root  wheel   2528  7 20 18:17 ..
drwxr-xr-x  14 root  wheel    448  6 15 19:08 extra
-rw-r--r--   1 root  wheel  21648  6 15 19:08 httpd.conf
-rw-r--r--   1 root  wheel  13064  6 15 19:08 magic
-rw-r--r--   1 root  wheel  61118  6 15 19:08 mime.types
drwxr-xr-x   4 root  wheel    128  6 15 19:08 original
drwxr-xr-x   4 root  wheel    128  6 15 19:08 other
drwxr-xr-x   2 root  wheel     64  6 15 19:08 users
% vi httpd.conf # 以降viの画面
-------------------------
# DocumentRoot: The directory out of which you will serve your
# documents. By default, all requests are taken from this directory, but
# symbolic links and aliases may be used to point to other locations.
# 
DocumentRoot "/Library/WebServer/Documents"  <-- ここ
-------------------------
:/DocumentRoot
-------------------------
% cd /Library/WebServer/Documents # 現状の内容確認(2023/7/20)
% ls 
css		index.html	js
img		index.html.en	src
\`\`\`
`},{ // =====================================================================
  title: "MacのLocalhostで起動中のサーバにAndroidスマートフォンからアクセスする",
  created: "2023/07/21 08:00",
  tag: ['Apache','httpd','mac OS標準','スマホ','開発'],
  ref: [{
    site: "",
    title:"MacのLocalhostで起動中のサーバにAndroidスマートフォンからアクセスする",
    url:"https://knmts.com/as-a-engineer-38/",
  }], article:
  // =====================================================================
`通常は\`http://localhost/\`または\`http://127.0.0.1/\`。

\`\`\`
% ifconfig en0
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
  options=6463<RXCSUM,TXCSUM,TSO4,TSO6,CHANNEL_IO,PARTIAL_CSUM,ZEROINVERT_CSUM>
  ether 0c:e4:41:e8:71:85 
  inet6 fe80::4b8:8c63:f0e5:60cb%en0 prefixlen 64 secured scopeid 0xc 
  inet6 2404:7a80:2301:2b00:1014:c9e8:5021:1907 prefixlen 64 autoconf secured 
  inet6 2404:7a80:2301:2b00:6d66:9e73:e45d:1308 prefixlen 64 autoconf temporary 
  inet 192.168.1.7 netmask 0xffffff00 broadcast 192.168.1.255
  nat64 prefix 2001:260:306:b:: prefixlen 96
  nd6 options=201<PERFORMNUD,DAD>
  media: autoselect
  status: active
\`\`\`
`}]}