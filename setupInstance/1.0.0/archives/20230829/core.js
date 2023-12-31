/** constructor共通の初期処理として①オプション・既定値をメンバに設定、②wrapper(parent)要素取得、③スタイルシート作成を行う
 * @param {Object} dest - 設定先のオブジェクト。初回呼出時はthis
 * @param {Object} opt - 起動時にオプションとして渡されたオブジェクト
 * @param {Object} def - 既定値のオブジェクト。初回呼出時はnull(内部定義を使用)
 * @param {number} [depth=0] - 再起呼出時の階層。開始・終了メッセージ制御用なので指定不要
 * @returns {void}
 *
 * ## 使用方法
 *
 * 1. 主にclass内constructorで冒頭に使用することを想定。
 * 1. 第一階層にメンバ"css"が存在すると、新規styleを生成
 * 1. 第一階層にメンバ"parent"が存在する場合、
 *    - 文字列型ならCSSセレクタと解して`parent:{selector:(string),element:(HTMLElement)}`を生成
 *    - HTMLElement型ならそのまま`parent:(HTMLElement)}`として設定
 *
 * ### 入力例
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
 * ### 出力例
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
 * ### デシジョンテーブル
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
    // 配列・オブジェクトの判定式
    isObj: obj => obj && typeof obj === 'object' && !Array.isArray(obj) && String(Object.prototype.toString.call(obj).slice(8,-1)) === 'Object',
    isArr: obj => obj && typeof obj === 'object' && Array.isArray(obj),
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
            // Setで重複を排除しているが、配列・オブジェクトは重複(中身もマージされない)
            dest[x] = [...new Set([...dest[x],...opt[x]])];
          } else {
            // optの値でdestの値を置換
            dest[x] = opt[x];
          }
        }
      });
    },
  };

  console.log(v.whois+' start.',dest,opt,def);
  try {

    v.step = 1; // ディープコピー
    dest = Object.assign(dest,def); // 既定値をセット
    v.deepcopy(dest,opt);

    v.step = 2; // parentの処理
    if( dest.hasOwnProperty('parent') ){
      if( typeof dest.parent === 'string' ){
        // CSSセレクタだった場合
        v.parent = dest.parent;
        dest.parent = {
          selector: v.parent,
          element : document.querySelector(v.parent),
        };
      }
    }
    //console.log(v.whois+' step.'+v.step+'\n',dest.parent);

    v.step = 3; // CSS定義に基づき新たなstyleを生成
    if( dest.hasOwnProperty('css') ){
      v.style = document.createElement('style');
      document.head.appendChild(v.style);
      for( v.i=0 ; v.i<dest.css.length ; v.i++ ){
        v.x = dest.css[v.i];
        for( v.y in v.x.prop ){
          v.prop = dest.parent.selector + ' ' + v.x.sel
            + ' { ' + v.y + ' : ' + v.x.prop[v.y] + '; }\n';
          v.style.sheet.insertRule(v.prop,
            v.style.sheet.cssRules.length,
          );
        }
      }
    }

    console.log(v.whois+' normal end.\n',dest);
    return v.rv;
  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}
