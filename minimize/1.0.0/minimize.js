/* コアScript */
/**
 * @typedef {Object} minimizeArg
 * @prop {boolean} [jsdoc=false] - trueならJSDoc形式(/**〜*／)のコメントを削除する
 * @prop {boolean} [js=false] - trueならJavaScript形式(/*〜*／,／／)のコメントを削除する
 * @prop {boolean} [css=false] - trueならCSS形式(/*〜*／)のコメントを削除する
 * @prop {boolean} [html=false] - trueならHTML形式(<!--〜--＞)のコメントを削除する
 * @prop {boolean} [all=false] - trueなら上記全てのコメントを削除する
 */

/**
 * ソースから指定形式のコメントを削除
 * @param {string} str - 操作対象となるソース
 * @param {minimizeArg} opt - コメント形式の指定
 * @returns {string} コメントを削除したソース
 */
function minimize(str,opt={}){
  const v = {
    rv:str,
    rex:{
      jsdoc: /\s*?\/\*\*[\s\S]+?\*\/\s*?/g,
      js: /\s*\/\/.+\n/g,
      css: /\s*?\/\*[\s\S]+?\*\/\s*?/g,
      html: /\s*?<!\-\-[\s\S]+?\-\->\s*?/g,
    },
  };
  console.log('minimize start.');
  try {

    v.opt = Object.assign({
      jsdoc:false,
      js: false,
      css: false,
      html: false,
      all: false,
    },opt);
    console.log('opt='+JSON.stringify(v.opt));

    if( v.opt.jsdoc || v.opt.all ){
      v.rv = v.rv.replaceAll(v.rex.jsdoc,'');
    }
    if( v.opt.js || v.opt.all ){
      v.rv = v.rv.replaceAll(v.rex.css,'');
      v.rv = v.rv.replaceAll(v.rex.js,'\n');
    }
    if( v.opt.css || v.opt.all ){
      v.rv = v.rv.replaceAll(v.rex.css,'');
    }
    if( v.opt.html || v.opt.all ){
      v.rv = v.rv.replaceAll(v.rex.html,'');
    }

    // 複数の改行は一つに
    v.rv = v.rv.replaceAll(/\n+/g,'\n');

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('minimize end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack);
    //throw e; //以降の処理を全て停止する場合
    v.rv.stack = e.stack; return v.rv; // 処理継続する場合
  }
}
