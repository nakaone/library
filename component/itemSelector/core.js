/**
 * @classdesc 配列から表を作成、対象を選択して配列の要素を返す
 */
class itemSelector {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object[]} [data=null] - 選択肢の配列
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(parent,data=null,opt={}){
    const v = {whois:'itemSelector.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        data: data, // {Object[]} 選択肢の配列
        // メンバとして持つHTMLElementの定義
        parent: parent, // {HTMLElement} 親要素(ラッパー)
        parentSelector: null, // {string} 親要素(ラッパー)のCSSセレクタ
        style: null,  // {HTMLStyleElement} CSS定義
        // CSS/HTML定義
        css:[
          /* itemSelector共通部分 */ `
          .itemSelector {
            --fontSize: 1.5rem;
            --circle: calc(var(--fontSize) * 3);
            --bgColor: #ddd;
            width: 100%;
          }
          .itemSelector.hide {
            display: none;
          }`,
          /* tr:行単位の定義 */`
          .itemSelector .tr {
            width: 100%;
            display: grid;
            grid-template-columns: var(--circle) 1fr;
            align-items: center;
            margin-bottom: var(--fontSize);
          }`,
          /* icon: 背景のアイコン */`
          .itemSelector .icon {
            grid-row: 1 / 2;
            grid-column: 1 / 3;
            width: 0px;
            height: 0px;
            border-top: calc(var(--circle) / 2) solid transparent;
            border-left: calc(var(--circle) * 3) solid var(--bgColor);
            border-bottom: calc(var(--circle) / 2) solid transparent;
            border-right: calc(var(--circle) / 2) solid transparent;
          }`,
          /* item: 選択肢の情報(氏名、メアド) */`
          .itemSelector .item {
            grid-row: 1 / 2;
            grid-column: 1 / 3;
            z-index: 10;
            padding-left: calc(var(--fontSize) / 2);
            display: grid;
            grid-template-columns: 4fr 6fr;
            align-items: center;
          }
          .itemSelector ruby {
            font-size: var(--fontSize);
          }
          .itemSelector rt {
            font-size: 50%;
          }`,
        ],
        html:[  // イベント定義を複数回行わないようにするため、eventで定義
        ],
      },
    };
    console.log(v.whois+' start.',opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 2; // 画面を非表示に
      this.close();

      v.step = 3; // 終了処理
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
   * 
   * trのnameが欲しいのに子要素のrubyやrtのnameを探してしまう問題が発生。<br>
   * ⇒ ×target ○currentTarget
   * 
   * - [子要素クリック時の親要素のクリックイベントの挙動](https://www.sunapro.com/currenttarget/)
   */
  #setData = (data=null) => {
    const v = {whois:'drawPassport.#setData',rv:true,step:0};
    console.log(v.whois+' start.');
    try {

      if( data !== null ) this.data = data;

      this.data.forEach(x => {
        v.tr = createElement(
          {attr:{class:'tr',name:x.entryNo},children:[
            {attr:{class:'icon'}},
            {attr:{class:'item'},children:[
              {tag:'ruby',text:x['申込者氏名'],children:[
                {tag:'rt',text:x['申込者カナ']}
              ]},
              {text:x['メールアドレス']},
            ]}
          ]}
        );
        this.parent.appendChild(v.tr);
      });

      console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  select = (data=null) => {
    const v = {whois:'itemSelector.template',rv:true,step:0};
    console.log(v.whois+' start.');
    try {
      // 親要素を表示
      this.open();

      // 編集対象となる参加者情報を表示
      v.rv = this.#setData(data);
      if( v.rv instanceof Error ) throw v.rv;

      return new Promise(resolve => {
        this.parent.querySelectorAll('div.tr').forEach(x => {
          x.addEventListener('click',event => {
            // 戻り値の作成(×target ○currentTarget)
            const rv = event.currentTarget.getAttribute('name');
            // 終了処理
            console.log('itemSelector.select normal end.\n',rv);
            this.close();
            resolve(rv);
          });
        });
      });

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
