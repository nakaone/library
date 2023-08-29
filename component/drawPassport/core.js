/**
 * @classdesc 参加者情報の表示・編集
 * 
 * - [JavaScriptでの rem ⇔ px に変換するテクニック＆コード例](https://pisuke-code.com/javascript-convert-rem-to-px/)
 */
class drawPassport {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} data - 参加者情報
   * @param {Object} [opt={}] - オプション
   * @returns {void}
   */
  constructor(parent,data,opt={}){
    const v = {whois:'drawPassport.constructor',rv:true,step:0};
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
      //this.#setupList();

      v.step = 4; // 詳細情報
      //this.#setupDetail();

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
    const v = {whois:'drawPassport.#setup',rv:null,step:0,
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

      v.step = 2; // drawPassport共通部分のCSS作成
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
    const v = {whois:'drawPassport.#setupSummary',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // CSS定義
      this.style.innerText += `
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
      `;

      v.step = 2; // HTML定義
      this.parent.innerHTML += `
      <div class="summary">
        <div name="qrcode"></div>
        <div name="entryNo">No.<span class="v"></span></div>
        <div name="申込者氏名"><ruby><span class="v"></span>
          <rt name="申込者カナ"><span class="v"></span></rt>
        </ruby></div>
      </div>
      `;
      this.summary = this.parent.querySelector(':scope > .summary');

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

      v.step = 1; // CSS定義
      this.style.innerText += `
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
      `;

      v.step = 2; // HTML定義
      this.parent.innerHTML += `
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
      `;
      this.list = this.parent.querySelector(':scope > .list');

      v.step = 3; // 参加者情報をセット
      for( v.i=1 ; v.i<6 ; v.i++ ){
        v.prefix = '参加者0' + v.i;
        if( this.data[v.prefix+'氏名'].length === 0 )
          continue;
        this.list.appendChild(createElement({
          attr: {class:'td'},
          style: {textAlign:'right'},
          text: v.i,
        }));
        this.list.appendChild(createElement(
          {attr: {class:'td'},children:[
            {tag:'ruby',text:this.data[v.prefix+'氏名'],children:[
              {tag:'rt',text:this.data[v.prefix+'カナ']}
        ]}]}));
        this.list.appendChild(createElement({
          attr: {class:'td'},
          text: this.data[v.prefix+'所属'],
        }));
        this.list.appendChild(createElement({
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

  /** 参加者情報の表示・編集を行い、編集結果を返す
   * @param {void} - 無し
   * @returns {Object.<string, any>} 修正された項目ラベルと値
   */
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