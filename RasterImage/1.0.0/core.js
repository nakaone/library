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
   * @prop {string|string[]} css - CSS定義。配列は途中にコメントを入れたい場合に使用
   * @prop {string|CEDefObj|CEDefObj[]} html - HTML定義。
   *  文字列ならinnerHTMLそのもの、オブジェクトならcreateElementの引数と看做す
   * @prop {Object.<string, HTMLElement>} screenList - 複数画面を切り替える場合の画面名と要素
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
   * 1. 複数画面使用時、各画面はwrapper直下で定義し、メンバとして名前をつける<br>
   *    これにより画面切り替え(changeScreen)を行う
   * 
   */
  constructor(def={},opt={}){
    const v = {whois:'BasePage.constructor',rv:null,step:0,
      // 基底クラス(本クラス)の既定値
      def:{parent:'body',wrapper:null,css:[],html:null,screenList:{}}
    };
    console.log(v.whois+' start.',def,opt);
    try {
      v.step = 1; // オプション・既定値をメンバに設定
      v.step = 1.1; // (継承先)クラス名をthis.classNameに保存
      this.className = this.constructor.name;
      v.step = 1.2; // 与えられたオプションをメンバに保存
      this.deepcopy(this,v.def); // 基底クラス(本クラス)の既定値を設定
      this.deepcopy(this,def); // 継承先クラスの既定値を設定
      this.deepcopy(this,opt); // オプションで上書き
      console.log("%s step.%s\n",v.whois,v.step,this);

      v.step = 2; // parentの処理
      if( typeof this.parent === 'string' ){
        // 文字列(CSSセレクタ)として渡された場合
        this.parentSelector = this.parent;
        this.parent = document.querySelector(this.parentSelector);
      } else {
        // 継承先クラスのオプションで{parent:HTMLElement}が指定された場合
        this.parentSelector = '';
      }

      v.step = 3; // wrapperの処理
      if( this.wrapper === null ){
        this.wrapper = this.createElement(
          {attr:{name:'wrapper',class:this.className}},
        this.parent);
      }
      this.wrapperSelector
      = (this.parentSelector === null ? '' : this.parentSelector + ' > ')
      + 'div.' + this.className + '[name="wrapper"]';

      v.step = 4; // CSS定義に基づき新たなstyleを生成
      v.cssDefs = '';
      // 既に他インスタンスで作成済みならスキップ
      if( document.head.querySelector('style[name="'+this.className+'"]') === null ){
        (this.isArr(this.css) ? this.css.join() : this.css)
        .match(/[^\{\}]+?\{.+?\}/g).forEach(l => {
          v.m = l.match(/\s*([^\{\}]+?)\s*\{(.+?)\}/);
          v.selector = v.m[1].trim();
          // CSSセレクタに継承先クラス名がない場合は追加
          if( v.selector.indexOf(this.className) < 0 ){
            v.selector = ' .' + this.className + ' ' + v.selector;
          }
          v.cssDefs += v.selector + ' {' + v.m[2] + '} ';
        });
        if( v.cssDefs.length > 0 ){
          v.cssDefs = v.cssDefs.replaceAll(/\n/g,' ').replaceAll(/\s+/g,' ');
          this.createElement({
            tag:'style',
            attr:{type:'text/css',name:this.className},
            text:v.cssDefs
          },document.head);
        }
      }
  
      v.step = 5; // HTML定義に基づき親要素内のHTML要素を生成
      if( this.html !== null ){
        if( typeof this.html === 'string' ){
          this.wrapper.innerHTML = this.html;
        } else {
          this.createElement(this.html,this.wrapper);
        }
      }
  
      v.step = 6; // 終了処理
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
          v.obj.appendChild(createElement(v.def.children[v.j]));
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

  /** 引数がオブジェクトか判定
   * @param {any} obj - 判定対象
   * @returns {boolean}
   */
  isObj = obj => obj && String(Object.prototype.toString.call(obj).slice(8,-1)) === 'Object';

  /** 引数が配列か判定
   * @param {any} obj - 判定対象
   * @returns {boolean}
   */
  isArr = obj => obj && String(Object.prototype.toString.call(obj).slice(8,-1)) === 'Array';

  /** 表示する画面の切替
   * @param {string} screenName - 表示する画面のcreateElementで指定したnameの値
   * @returns {null|Error}
   */
  changeScreen = screenName => {
    const v = {whois:'BasePage.changeScreen',rv:null,step:0};
    console.log(v.whois+' start.',screenName);
    try {

      v.step = 1;
      for( v.x in this.screenList ){
        this[v.x].style.display = v.x === screenName ? '' : 'none';
      }
  
      v.step = 2; // 終了処理
      console.log(v.whois+' normal end.\\n',v.rv);
      return v.rv;
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}

class RasterImage extends BasePage {
  constructor(opt){
    const v = {whois:'RasterImage.constructor',rv:null,step:0,def:{
      parent: 'body',
      css: "#target {border: solid 5px #ccc; padding:2em; text-align:center;}",
      html: [
        {attr:{id:'target'},text:'ここに画像ファイルをドロップします。'},
        {tag:'img',attr:{id:'preview'}},
      ],
    }};
    console.log(v.whois+' start.',opt);
    try {
      super(v.def,opt);
  
      v.step = 99; // 終了処理
      console.log(v.whois+' normal end.\n',v.rv);
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}