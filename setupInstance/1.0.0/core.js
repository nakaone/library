/** クラス(constructor)共通の初期処理を行う。
 *
 * @param {Object} dest - 設定先のオブジェクト。初回呼出時はthis
 * @param {Object} opt - 起動時にオプションとして渡されたオブジェクト
 * @param {Object} def - 既定値のオブジェクト。初回呼出時はnull(内部定義を使用)
 * @returns {void}
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
 * ## 領域開閉制御に関するメモ
 *
 * 1. 領域全体の開閉制御はhtml側(BurgerMenu.change())で行う<br>
 *    ※displayの書き換えになっているが、将来的にはactクラスの加除に修正。<br>
 *    　現段階では影響が大きいため見送り。
 * 1. wrapperの既定値は「開いた状態(actあり)」とする
 * 1. wrapper内の要素の表示/非表示制御はメソッドで行う
 *
 * ## 入力例
 *
 * ```
 * const menu = new BurgerMenu({parent:'body',auth:confObj,fuga:{a:10}})
 *
 * class BurgerMenu {
 *   constructor(opt){
 *     setupInstance(
 *       this,  // 第一引数はthis(固定)
 *       opt,   // 第二引数はconstructorに渡されたオプション
 *       {      // 第三引数は既定値のオブジェクト
 *         css: [  // このクラスに適用するCSS定義の配列
 *           {
 *             sel:'.date', // CSSセレクタ
 *             prop:{       // 設定する値。ラベル・値ともクォーテーションで囲む
 *               'margin-top':'1rem',
 *               'padding-left': '1rem',
 *             }
 *           },
 *         ],
 *         parent: '',  // 親要素のCSSセレクタ or HTMLElementの既定値
 *         auth: null,
 *         hoge: 'Hello World',
 *         fuga: {
 *           a: null,
 *           b: 20,
 *         },
 *       });
 *     // 以降、constructorの処理
 * ```
 *
 * ## 出力例
 *
 * ```
 * this = {
 *   parent: {
 *     selector: 'body',  // optより導出
 *     element : (body element),  // optより導出
 *   },
 *   auth: confObj, // optの値を設定
 *   hoge: 'Hello World',  // 既定値を設定
 *   fuga: {
 *     a:10,  // optの値を設定
 *     b:20,  // 既定値を設定
 *   },
 * }
 * ```
 *
 * ```
 * <style type="text/css">
 * .date {
 *   margin-top: 1rem;
 *   padding-left: 1rem;
 * }
 * </style>
 * ```
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
const setupInstance = (dest,opt,def) => {
  const v = {whois:'setupInstance',rv:true,step:0,
    constructor: dest.constructor ? dest.constructor.name : null,  // 呼出元クラス名
    // 配列・オブジェクトの判定式
    isObj: obj => obj && String(Object.prototype.toString.call(obj).slice(8,-1)) === 'Object',
    isArr: obj => obj && String(Object.prototype.toString.call(obj).slice(8,-1)) === 'Array',
    // ディープコピー。値の設定ロジックは上記デシジョンテーブル参照
    deepcopy: (dest,opt) => {
      Object.keys(opt).forEach(x => {
        if( !dest.hasOwnProperty(x) ){
          // コピー先に存在しなければ追加
          dest[x] = opt[x];
        } else {
          if( v.isObj(dest[x]) && v.isObj(opt[x]) ){
            // 両方オブジェクト -> メンバをマージ
            v.deepcopy(dest[x],opt[x]);
          } else if( v.isArr(dest[x]) && v.isArr(opt[x]) ){
            // 両方配列 -> 配列をマージ
            // Setで配列要素の重複を排除しているが、
            // 配列要素が配列型・オブジェクト型の場合は重複する(中身もマージされない)
            dest[x] = [...new Set([...dest[x],...opt[x]])];
          } else {
            // optの値でdestの値を置換
            dest[x] = opt[x];
          }
        }
      });
    },
    cssDefs: '',  // CSS定義文字列による指定の場合、その結合した文字列
  };
  v.whois = v.constructor + '.' + v.whois;
  console.log(v.whois+' start.',dest,opt,def);
  try {

    v.step = 1; // 呼出元の確認、呼出元クラス名の取得
    if( !dest.constructor ){
      throw new Error('呼出元がクラスではありません');
    }

    v.step = 2; // オプションをメンバにディープコピー
    dest = Object.assign(dest,def); // 既定値をセット
    v.deepcopy(dest,opt);

    v.step = 3; // parent,wrapperの処理
    if( dest.hasOwnProperty('parent') ){
      if( (typeof dest.parent === 'string') || (dest.parent instanceof HTMLElement)){
        dest.parentSelector = null;
        if( typeof dest.parent === 'string' ){
          // CSSセレクタだった場合
          dest.parentSelector = dest.parent;
          dest.parent = document.querySelector(dest.parentSelector);
        }
        // wrapperをparentに追加
        dest.wrapper = createElement({attr:{class:v.constructor,name:'wrapper'}});
        dest.parent.appendChild(dest.wrapper);
        dest.wrapperSelector =
        (dest.parentSelector === null ? null : dest.parentSelector + ' > ')
        + 'div.' + v.constructor + '[name="wrapper"]';
      } else {
        throw new Error(v.whois+': parent is not string or HTMLElement.');
      }
    }
    dest.wrapper.classList.add('act'); // wrapperはact状態にしておく

    v.step = 4; // CSS定義に基づき新たなstyleを生成
    if( dest.hasOwnProperty('css') && // dest.cssがあり、未定義なら追加
    document.head.querySelector('style[name="'+v.constructor+'"]') === null ){
      dest.style = createElement({
        tag:'style',
        attr:{type:'text/css',name:v.constructor}
      });
      document.head.appendChild(dest.style);
      for( v.i=0 ; v.i<dest.css.length ; v.i++ ){
        v.x = dest.css[v.i];
        if( v.isObj(v.x) ){
          // {sel,prop}による指定の場合(将来的に廃止予定)
          for( v.y in v.x.prop ){
            v.prop = dest.parent.selector + ' ' + v.x.sel
              + ' { ' + v.y + ' : ' + v.x.prop[v.y] + '; }\n';
            dest.style.sheet.insertRule(v.prop,
              dest.style.sheet.cssRules.length,
            );
          }
        } else {
          // CSS定義文字列による指定の場合
          v.cssDefs = v.cssDefs + v.x;
        }
      }
      if( v.cssDefs.length > 0 ){
        dest.style.innerText = v.cssDefs.replaceAll(/\n/g,'').replaceAll(/\s+/g,' ');
      }
    }

    v.step = 5; // HTML定義に基づき親要素内のHTML要素を生成
    if( dest.hasOwnProperty('html') ){
      if( v.isObj(dest.html) ){
        v.step = 4.1; // オブジェクトならcreateElementの引数
        v.html = createElement(dest.html);
        if( v.html instanceof Error ) throw v.html;
        dest.wrapper.appendChild(v.html);
      } else {
        v.step = 4.2;
        if( v.isArr(dest.html) ){
          v.step = 4.21;
          if( typeof dest.html[0] === 'string' ){
            v.step = 4.211;
            // 配列の最初の要素が文字列なら結合してinnerHTML
            dest.wrapper.innerHTML = dest.html.join('');
          } else {
            v.step = 4.212;
            // オブジェクトならcreateElementして親要素に追加
            dest.html.forEach(x => dest.wrapper.appendChild(createElement(x)));
          }
        } else {
          v.step = 4.22;  // 文字列ならinnerHTMLそのもの
          dest.wrapper.innerHTML = dest.html;
        }
      }
    }

    v.step = 6; // 終了処理
    console.log(v.whois+' normal end.\n',dest);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}
