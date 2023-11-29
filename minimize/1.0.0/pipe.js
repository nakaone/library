/** パイプ処理でコメントを削除する
 * - [javascriptの標準入力](https://qiita.com/Molly95554907/items/fddb0a426f9e01d50663)
 * 
 * @example
 * 
 * cat xxx.js | node console.js > result.js
 */
process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', (line) => {　//line変数には標準入力から渡された一行のデータが格納されている
  if( !line.match(/^\s*$/) )
    lines.push(line);　//ここで、lines配列に、標準入力から渡されたデータが入る
});
reader.on('close', () => {　//受け取ったデータを用いて処理を行う
  const rv = minimize(lines.join('\n'),{all:true});
  console.log(rv);
});

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
    rv:str.trim(),
    rex:{
      jsdoc: /\s*?\/\*\*[\s\S]+?\*\/\s*?/g,
      js: /\s*\/\/.+\n/g,
      css: /\s*?\/\*[\s\S]+?\*\/\s*?/g,
      html: /\s*?<!\-\-[\s\S]+?\-\->\s*?/g,
    },
  };
  try {

    v.opt = Object.assign({
      jsdoc:false,
      js: false,
      css: false,
      html: false,
      all: false,
    },opt);

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

    // 空白行は削除、複数の改行は一つに
    v.rv = v.rv.replaceAll(/^\s+\n/g,'').replaceAll(/\n+/g,'\n');

    return v.rv;
  } catch(e){
    console.error(e,v);
    return e;
  }
}