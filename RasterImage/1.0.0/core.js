/** ページ表示を行うクラスのための基底クラス */
class BasePage {
  /**
   * @typedef BasePageMembers
   * @prop {string} className - 継承先クラス名。自動設定
   * @prop {string|HTMLElement} parent='body' - ページ表示領域の親要素またはCSSセレクタ。
   *  constructorでHTMLElementに自動的に変換される。
   * @prop {string} parentSelector - ページ表示領域の親要素に対するCSSセレクタ。
   *  parentがHTMLElementだった場合は空文字列('')が設定される。
   * @prop {HTMLElement} wrapper - ページ表示領域
   * @prop {string} wrapperSelector - ページ表示領域に対するCSSセレクタ
   * @prop {string[]} css - CSS定義
   * @prop {string|CEDefObj|CEDefObj[]} html - HTML定義。
   *  文字列ならinnerHTMLそのもの、オブジェクトならcreateElementの引数と看做す
   * @prop {Object.<string, HTMLElement>} screenList - 複数画面を切り替える場合の画面名と要素
   * @prop {string} home - ホーム画面名
   */
  /**
   * @constructor
   * @param {Object} [def={}] - メンバの既定値(default)
   * @param {Object} [opt={}] - オプションとして与えられたオブジェクト
   * @returns {null|Error}
   * 
   * ## 処理概要
   * 
   * 1. オプション・既定値をメンバに設定
   * 1. オプション(Object)の第一階層にメンバ"parent"が存在する場合、
   *    1. メンバ"parent"がHTMLElement型の場合、
   *       - this.parentにメンバ"parent"をそのまま登録
   *       - this.parentSelectorにnullを設定
   *    1. メンバ"parent"が文字列型の場合、
   *       - this.parentにdocument.querySelector(opt.parent)を登録
   *       - this.parentSelectorにメンバ"parent"を設定
   *    1. this.parent直下にthis.wrapperを作成<br>
   *       `div class="呼出元クラス名" name="wrapper"`
   *    1. this.wrapperに"act"クラスを追加、既定値表示の状態とする
   * 1. オプション(Object)の第一階層にメンバ"css"が存在する場合、
   *    呼出元クラスで作成されたスタイルシートが存在しないなら新規作成する
   * 1. オプション(Object)の第一階層にメンバ"html"が存在する場合、
   *    this.wrapper内に指定のHTML要素を生成
   * 
   * ## 注意事項
   * 
   * 1. 複数画面使用時、各画面はwrapper直下で定義し、メンバとして名前をつける<br>
   *    これにより画面切り替え(changeScreen)を行う
   * 
   * ## 参考
   * 
   * - [ローディングアイコン集](https://projects.lukehaas.me/css-loaders/)
   * - [CSSで全画面オーバーレイを実装する方法＆コード例](https://pisuke-code.com/css-fullscreen-overlay/)
   */
  constructor(def={},opt={}){
    const v = {whois:'BasePage.constructor',rv:null,step:0,
      // def:基底クラス(本クラス)の既定値
      def:{parent:'body',wrapper:null,screenList:{},
        css: [
          /* LoadingIcon共通部分 */ `
          .LoadingIcon {
            position: absolute;
            left: 0; top: 0;
            width: 100%; height:100%;
            background: #fff;
            z-index: 2147483647;
            display: grid;
            place-items: center;
          }`,
          /* pattern.5 */`
          .loading5 {
            --dot-size: 4rem;
            --R: 0;
            --G: 0;
            --B: 0;
            --back: rgba(var(--R),var(--G),var(--B),1);
            --pale: rgba(var(--R),var(--G),var(--B),0.2);
            --middle: rgba(var(--R),var(--G),var(--B),0.5);
            --dark: rgba(var(--R),var(--G),var(--B),0.7);
            --m0: calc(var(--dot-size) * 0.8); /* 軌道の大きさ */
            --m1: calc(var(--m0) * -2.6);
            --m2: calc(var(--m0) * -1.8);
            --m3: calc(var(--m0) * 1.75);
            --m4: calc(var(--m0) * 1.8);
            --m5: calc(var(--m0) * 2.5);

            margin: 100px auto;
            font-size: 25px;
            width: var(--dot-size);
            height: var(--dot-size);
            border-radius: 50%;
            position: relative;
            text-indent: -9999em;
            -webkit-animation: load5 1.1s infinite ease;
            animation: load5 1.1s infinite ease;
            -webkit-transform: translateZ(0);
            -ms-transform: translateZ(0);
            transform: translateZ(0);
          }
          @-webkit-keyframes load5 {
            0%,
            100% {box-shadow:
              0em var(--m1) 0em 0em var(--back),
              var(--m4) var(--m2) 0 0em var(--pale),
              var(--m5) 0em 0 0em var(--pale),
              var(--m3) var(--m3) 0 0em var(--pale),
              0em var(--m5) 0 0em var(--pale),
              var(--m2) var(--m4) 0 0em var(--pale),
              var(--m1) 0em 0 0em var(--middle),
              var(--m2) var(--m2) 0 0em var(--dark);
            }
            12.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--dark), var(--m4) var(--m2) 0 0em var(--back), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--middle);
            }
            25% {
              box-shadow: 0em var(--m1) 0em 0em var(--middle), var(--m4) var(--m2) 0 0em var(--dark), var(--m5) 0em 0 0em var(--back), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            37.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--middle), var(--m5) 0em 0 0em var(--dark), var(--m3) var(--m3) 0 0em var(--back), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            50% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--middle), var(--m3) var(--m3) 0 0em var(--dark), 0em var(--m5) 0 0em var(--back), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            62.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--middle), 0em var(--m5) 0 0em var(--dark), var(--m2) var(--m4) 0 0em var(--back), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            75% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--middle), var(--m2) var(--m4) 0 0em var(--dark), var(--m1) 0em 0 0em var(--back), var(--m2) var(--m2) 0 0em var(--pale);
            }
            87.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--middle), var(--m1) 0em 0 0em var(--dark), var(--m2) var(--m2) 0 0em var(--back);
            }
          }
          @keyframes load5 {
            0%,
            100% {
              box-shadow: 0em var(--m1) 0em 0em var(--back), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--middle), var(--m2) var(--m2) 0 0em var(--dark);
            }
            12.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--dark), var(--m4) var(--m2) 0 0em var(--back), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--middle);
            }
            25% {
              box-shadow: 0em var(--m1) 0em 0em var(--middle), var(--m4) var(--m2) 0 0em var(--dark), var(--m5) 0em 0 0em var(--back), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            37.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--middle), var(--m5) 0em 0 0em var(--dark), var(--m3) var(--m3) 0 0em var(--back), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            50% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--middle), var(--m3) var(--m3) 0 0em var(--dark), 0em var(--m5) 0 0em var(--back), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            62.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--middle), 0em var(--m5) 0 0em var(--dark), var(--m2) var(--m4) 0 0em var(--back), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            75% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--middle), var(--m2) var(--m4) 0 0em var(--dark), var(--m1) 0em 0 0em var(--back), var(--m2) var(--m2) 0 0em var(--pale);
            }
            87.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--middle), var(--m1) 0em 0 0em var(--dark), var(--m2) var(--m2) 0 0em var(--back);
            }
            
          }`,
        ],
        html: [
          {attr:{class:'BasePage'},children:[
            {attr:{class:'LoadingIcon'},name:'loading',children:[
              {attr:{class:'loading5'},text:'loading...'}
            ]},
          ]},
        ],
      },
    };
    console.log(v.whois+' start.',def,opt);
    try {

      // BasePageの既定値をメンバに保存し、特有のCSSを定義
      v.step = 1.1; // 既定値をメンバに保存
      this.deepcopy(this,v.def);
      console.log("%s step.%s\n",v.whois,v.step,this.css);

      v.step = 1.2; // BasePage用(=継承先クラス共通)のCSSを定義
      // BasePageで作成するHTML,CSSは継承先クラス共通なので、
      // HTMLはBODY直下に`<div name="BasePage">として作成、
      // CSSはHEAD内部に`<style name="BasePage">`として作成し、
      // 継承先インスタンス生成の都度存否確認し、存在しなければ生成する。
      this.className = 'BasePage';
      v.rv = this.setStyleSheet();
      if( v.rv instanceof Error ) throw v.rv;
      this.css = []; // CSSのBasePage特有部分は定義済なのでクリア

      v.step = 1.3; // BasePage用(=継承先クラス共通)のHTMLを生成
      if( document.querySelector('body > div.BasePage') === null ){
        this.createElement(this.html,document.querySelector('body'));
      }
      this.html = []; // HTMLのBasePage特有部分は作成済なのでクリア


      // 継承先クラスの既定値・オプションをメンバに保存
      v.step = 2.1; // (継承先)クラス名をthis.classNameに保存
      this.className = this.constructor.name;
      v.step = 2.2; // def.css,htmlが配列でなかった場合は配列化
      ['css','html'].forEach(x => {
        if( def.hasOwnProperty(x) ){
          // 存在するが配列でないならば配列化
          if( !this.isArr(def[x]) ){
            def[x] = [def[x]];
          }
        } else {  // 未定義なら空配列をセット
          def[x] = [];
        }
      });
      v.step = 2.3; // 継承先クラスの既定値を設定
      this.deepcopy(this,def); 
      console.log("%s step.%s\n",v.whois,v.step,this.css);
      v.step = 2.4; // 継承先クラスのconstructorに渡されたオプションで上書き
      this.deepcopy(this,opt);
      console.log("%s step.%s\n",v.whois,v.step,this.screenList);

      v.step = 3; // parentの処理
      if( typeof this.parent === 'string' ){
        // 文字列(CSSセレクタ)として渡された場合
        this.parentSelector = this.parent;
        this.parent = document.querySelector(this.parentSelector);
      } else {
        // 継承先クラスのオプションで{parent:HTMLElement}が指定された場合
        this.parentSelector = '';
      }

      v.step = 4; // wrapperの処理
      if( this.wrapper === null ){
        this.wrapper = this.createElement(
          {attr:{name:'wrapper',class:this.className}},
        this.parent);
      }
      this.wrapperSelector
      = (this.parentSelector === null ? '' : this.parentSelector + ' > ')
      + 'div.' + this.className + '[name="wrapper"]';

      v.step = 5; // CSS定義に基づき新たなstyleを生成
      v.rv = this.setStyleSheet();
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 6; // HTML定義に基づき親要素内のHTML要素を生成
      if( this.html !== null ){
        if( typeof this.html === 'string' ){
          this.wrapper.innerHTML = this.html;
        } else {
          this.createElement(this.html,this.wrapper);
        }
      }
  
      v.step = 7; // ホーム画面に遷移
      v.rv = this.changeScreen();
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 8; // 終了処理
      console.log(v.whois+' normal end.\n',v.rv);
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 劣後(dest)オブジェクトに優先(opt)のメンバを追加・上書きする
   * @param {Object} dest 
   * @param {Object} opt 
   * @returns {null|Error}
   * 
   * ## デシジョンテーブル
   * 
   * | 優先(a) | 劣後(b) | 結果 | 備考 |
   * | :--: | :--: | :--: | :-- |
   * |  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
   * |  A  |  B  |  A  | |
   * |  A  | [B] |  A  | |
   * |  A  | {B} |  A  | |
   * | [A] |  -  | [A] | |
   * | [A] |  B  | [A] | |
   * | [A] | [B] | [A+B] | 配列は置換ではなく結合。但し重複不可 |
   * | [A] | {B} | [A] | |
   * | {A} |  -  | {A} | |
   * | {A} |  B  | {A} | |
   * | {A} | [B] | {A} | |
   * | {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
   * |  -  |  -  |  -  | |
   * |  -  |  B  |  B  | |
   * |  -  | [B] | [B] | |
   * |  -  | {B} | {B} | |
   * 
   */
  deepcopy = (dest,opt) => {
    const v = {whois:'BasePage.deepcopy',rv:null,step:0};
    console.log(v.whois+' start.');
    try {
  
      Object.keys(opt).forEach(x => {
        v.step = 1;
        if( !dest.hasOwnProperty(x) ){
          v.step = 2;
          // コピー先に存在しなければ追加
          dest[x] = opt[x];
        } else {
          if( this.isObj(dest[x]) && this.isObj(opt[x]) ){
            v.step = 3; // 両方オブジェクト -> メンバをマージ
            v.rv = this.deepcopy(dest[x],opt[x]);
            if( v.rv instanceof Error ) throw v.rv;
          } else if( this.isArr(dest[x]) && this.isArr(opt[x]) ){
            v.step = 4; // 両方配列 -> 配列をマージ
            // Setで配列要素の重複を排除しているが、
            // 配列要素が配列型・オブジェクト型の場合は重複する(中身もマージされない)
            dest[x] = [...new Set([...dest[x],...opt[x]])];
            //dest[x] = dest[x].concat(opt[x]);
            //console.log(dest[x],opt[x]);
          } else {
            v.step = 5; // 両方オブジェクトでも両方配列でもない場合、optの値でdestの値を置換
            dest[x] = opt[x];
          }
        }
      });
  
      v.step = 6; // 終了処理
      console.log(v.whois+' normal end. result=%s',v.rv);
      return v.rv;
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 
   * @typedef CEDefObj - createElementに渡すオブジェクト形式
   * @prop {string} [tag='div'] - タグ
   * @prop {Object.<string, string>} [attr={}] - タグの属性(ex.src, class)
   * @prop {Object.<string, string>} [style={}] - 適用するCSS。ラベルは通常のCSSと同じ。
   * @prop {Object.<string, string>} [event={}] - イベント名：関数Objのオブジェクト。ex. {click:()=>{〜}}
   * @prop {string} [text=''] - innerTextにセットする文字列
   * @prop {string} [html=''] - innerHTMLにセットする文字列
   * @prop {CEDefObj[]} [children=[]] - 子要素
   * @prop {string} [name=''] - クラスメンバにする場合、メンバ名となる文字列
   */

  /** 表示する画面の切替
   * @param {string} screenName - 表示する画面のcreateElementで指定したnameの値
   * @returns {null|Error}
   */
  changeScreen = (screenName=this.home) => {
    const v = {whois:'BasePage.changeScreen',rv:null,step:0};
    console.log(v.whois+' start.',screenName);
    try {

      v.step = 1;
      for( v.x in this.screenList ){
        this[v.x].style.display = v.x === screenName ? '' : 'none';
      }
  
      v.step = 2; // 終了処理
      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** HTMLElementを生成する
   * @param {CEDefObj|CEDefObj[]} arg - 生成するHTMLElementの定義
   * @param {HTMLElement|string} [parent=null] - 本関数内部で親要素への追加まで行う場合に指定
   * @returns {HTMLElement|Error}
   */
  createElement = (arg,parent=null) => {
    const v = {whois:'BasePage.createElement',rv:[],step:0};
    console.log(v.whois+' start.',arg);
    try {
      v.step = 1.1; // 引数を強制的に配列化
      v.isArr = this.isArr(arg); // 引数が配列ならtrue。戻り値にも使用するので保存
      if( !v.isArr ) arg = [arg];
      v.step = 1.2; // 親要素の特定
      if( parent !== null ){
        v.parent = typeof parent === 'string' ? document.querySelector(parent) : parent;
      }


      for( v.i = 0 ; v.i<arg.length ; v.i++ ){
        v.step = 2; // 既定値の設定
        v.def = {tag: 'div',attr: {},style:{},event:{},text: '',html:'',children:[],name:''};
        Object.assign(v.def,(typeof arg[v.i] === 'string' ? {tag:arg} : arg[v.i]))

        v.step = 3; // HTMLElementを生成、v.objとする
        v.obj = document.createElement(v.def.tag);

        v.step = 4; // HTMLElementの属性を定義
        for( v.j in v.def.attr ){
          v.obj.setAttribute(v.j,v.x = v.def.attr[v.j]);
        }

        v.step = 5; // 論理属性を定義(ex.checked)
        for( v.j in v.def.logical ){
          if( v.def.logical[v.j] ){
            v.obj.setAttribute(v.j,true);
          }
        }

        v.step = 6; // style属性の定義
        for( v.j in v.def.style ){
          if( v.j.match(/^\-\-/) ){ // CSS変数
            v.obj.style.setProperty(v.j,v.def.style[v.j]);
          } else {
            v.obj.style[v.j] = v.def.style[v.j];
          }
        }

        v.step = 7; // イベントの定義
        for( v.j in v.def.event ){
          v.obj.addEventListener(v.j,v.def.event[v.j],false);
        }

        v.step = 8; // 内部文字列(html or text)
        if( v.def.html.length > 0 ){
          v.obj.innerHTML = v.def.html;
        } else {
          v.obj.innerText = v.def.text;
        }

        v.step = 9; // 子要素の追加(parentは指定しない)
        for( v.j=0 ; v.j<v.def.children.length ; v.j++ ){
          v.obj.appendChild(this.createElement(v.def.children[v.j]));
        }

        v.step = 10; // 戻り値への登録
        v.rv.push(v.obj);

        v.step = 11; // 親要素への追加
        if( parent !== null ){
          v.parent.appendChild(v.obj);
        }

        v.step = 12; // メンバとして、また切替画面として登録
        if( v.def.name.length > 0 ){
          this[v.def.name] = v.obj;
          this.screenList[v.def.name] = v.obj;
        }
      }

      v.step = 12; // 配列で渡されたら配列で、オブジェクトならオブジェクトを返す
      v.rv = v.isArr ? v.rv : v.rv[0];
      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 引数が配列か判定
   * @param {any} obj - 判定対象
   * @returns {boolean}
   */
  isArr = obj => obj && String(Object.prototype.toString.call(obj).slice(8,-1)) === 'Array';

  /** 引数がオブジェクトか判定
   * @param {any} obj - 判定対象
   * @returns {boolean}
   */
  isObj = obj => obj && String(Object.prototype.toString.call(obj).slice(8,-1)) === 'Object';

  /** 指定時間待機
   * @param {number} sec - 待機時間(ミリ秒)
   * @returns {void}
   */
  sleep = (sec) =>
    {return new Promise(resolve => setTimeout(resolve,sec))};

  /** this.cssからスタイルシートを追加作成
   * @param {void}
   * @returns {null|Error}
   */
  setStyleSheet = () => {
    const v = {whois:this.className+'.setStyleSheet',rv:null,step:0,cssDefs:''};
    console.log(v.whois+' start.',this.css);
    try {
  
      v.step = 1; // CSS定義が空ならスキップ
      if( this.css.length === 0 ){
        console.log(v.whois+' normal end.(empty CSS)\n');
        return v.rv;        
      }

      v.step = 2; // 既に他インスタンスで作成済みならスキップ
      if( document.head.querySelector('style[name="'+this.className+'"]') !== null ){
        console.log(v.whois+' normal end.(already exist)\n');
        return v.rv;
      }

      v.step = 3; // CSS全文を一つのテキストにした上で`〜 {〜}`の部分を全て抽出
      v.css = this.css.join('').replaceAll(/\n/g,' ').replaceAll(/\s+/g,' ');
      console.log(this.css.join('').match(/[^\{\}]+?\{.+?\}/g));
      v.css.match(/[^\{\}]+?\{.+?\}/g).forEach(l => {
        v.step = 4; // `〜 {〜}`の部分からselectorと括弧内を抽出
        v.m = l.match(/\s*([^\{\}]+?)\s*\{(.+?)\}/);
        v.selector = v.m[1].trim();
        if( v.selector.indexOf(this.className) < 0  // CSSセレクタに継承先クラス名がない
         && v.selector.slice(0,1) !== '@' // CSSのアットルールに該当しない
         && v.selector.match(/[0-9\.%]+/) === null ){  // animationの定義(比率)に該当しない
          v.step = 5; // 先頭にクラス名をクラスとして追加(style scopedもどき)
          v.selector = ' .' + this.className + ' ' + v.selector;
        }
        v.step = 6; // 作成するCSS本文(cssDefs)に追加
        v.cssDefs += v.selector + ' {' + v.m[2] + '} ';
      });

      v.step = 7; // cssDefsの中身があれば定義
      if( v.cssDefs.length > 0 ){
        v.step = 8; // 余計な空白を削除
        v.cssDefs = v.cssDefs.replaceAll(/\n/g,' ').replaceAll(/\s+/g,' ');
        v.step = 9; // スタイルタグを作成して追加
        this.createElement({
          tag:'style',
          attr:{type:'text/css',name:this.className},
          text:v.cssDefs
        },document.head);
      }

      v.step = 10; // 終了処理
      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}

class RasterImage extends BasePage {
  /**
   * @constructor
   * @param {*} opt 
   * @returns {null|Error}
   * 
   * ## 参考
   * 
   * - GitHub [Compressor.js Options](https://github.com/fengyuanchen/compressorjs#options)
   * - [【JavaScript】ブラウザ画面にドラッグ＆ドロップされた画像をimg要素で表示する](https://www.softel.co.jp/blogs/tech/archives/5679)
   * - DnDで複数ファイルをアップロード [画像ファイルアップロード | プレビュー,DnD](https://amaraimusi.sakura.ne.jp/note_prg/JavaScript/file_note.html)
   */
  constructor(opt){
    const v = {whois:'RasterImage.constructor',rv:null,step:0,def:{
      parent: 'body',
      compressor: { // compressor.jsオプションの既定値
        maxWidth: 640,
        maxHeight: 640,
        quality: 0.80,
        mimeType: 'image/webp',
      },
      files: [],  // {File[]} - DnDされたファイルオブジェクトの配列
      css: [`
        img {max-width:400px;max-height:400px}
        .multiInput {
          border: solid 5px #ccc;
          margin: 1rem;
          padding:2em;
          text-align:center;
        }
      `],
      html: [
        {attr:{class:'multi'},name:'multi',children:[
          {attr:{class:'multiInput'},text:'画像ファイルをドロップ(複数可)',event:{drop:(e)=>{
            e.stopPropagation();
            e.preventDefault();
            this.onDrop(e.dataTransfer.files);
          },dragover:(e)=>{
            e.preventDefault();
          }}},
        ]}
      ],
    }};
    console.log(v.whois+' start.',opt);
    try {
      super(v.def,opt);
      this.changeScreen('multi');
  
      v.step = 99; // 終了処理
      console.log(v.whois+' normal end.\n',v.rv);
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 画像(複数)がドロップされた際の処理
   * @param {ProgressEvent} files
   * @returns {null|Error}
   */
  onDrop = async (files) => {
    const v = {whois:this.className+'.onDrop',rv:null,step:0};
    console.log(v.whois+' start.',files);
    try {

      for( v.i=0 ; v.i<files.length ; v.i++ ){
        // 変換前はthis.files[n].origin, 変換後はthis.files[n].compressで参照可
        v.step = 1.1; // 変換前をoriginに保存
        v.file = {origin:files[v.i]};
        v.step = 1.2; // 変換後をcompressに保存
        console.log(this.compressor);
        v.file.compress = await this.compress(files[v.i],this.compressor);
        console.log(v.file);
        v.step = 1.3; // 変換結果をメンバ変数に格納
        this.files.push(v.file);
        v.step = 1.4; // 比率計算
        v.file.compress.ratio = v.file.compress.size / v.file.origin.size;

        v.step = 2; // プレビュー表示
        this.createElement({style:{
          margin: '1rem',
          padding: '1rem',
          width:'80%',
          display:'grid',
          'grid-template-columns': '1fr 1fr',
          'grid-gap': '2rem',
        },children:[
          {style:{'font-size':'1.2rem'},text:v.file.origin.name},
          {style:{'font-size':'1.2rem'},text:v.file.compress.name},
          {tag:'img',attr:{src:URL.createObjectURL(v.file.origin)}},
          {tag:'img',attr:{src:URL.createObjectURL(v.file.compress)}},
          {style:{'text-align':'right'},text:v.file.origin.size+' bytes'},
          {style:{'text-align':'right'},text:v.file.compress.size+' bytes ('
          + Math.round(v.file.compress.ratio * 10000) / 100 + ' %)'},
          {text:v.file.origin.type},
          {text:v.file.compress.type},
        ]},this.multi);

        // 圧縮したファイルのダウンロード
        v.rv = this.download(v.file.compress);
        if( v.rv instanceof Error ) throw v.rv;
      }

      v.step = 99; // 終了処理
      console.log(v.whois+' normal end.\\n',this.files);
      return v.rv;
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 画像ファイルを圧縮
   * @param {File} file - 圧縮対象ファイル
   * @param {Object} opt - compressorのオプション
   * @returns 
   * 
   * ## 参考
   * 
   * - GitHub [Compressor.js Options](https://github.com/fengyuanchen/compressorjs#options)
   * - [Callback to Async Await](https://stackoverflow.com/questions/49800374/callback-to-async-await)
   */
  compress = (file,opt) => {
    return new Promise((resolve,reject) => {
      opt.success = resolve;
      opt.error = reject;
      new Compressor(file,opt);
    });
  }

  download = (blob) => {
    const v = {whois:this.className+'.download',rv:null,step:0};
    console.log(v.whois+' start.');
    try {
  
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.download = blob.name;
      a.href = url;
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      v.step = 99; // 終了処理
      console.log(v.whois+' normal end.\\n',v.rv);
      return v.rv;
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }  
}