/** HTML文書から指定されたCSSセレクタ要素のinnerHTMLを抽出
 * 
 * - パイプ処理
 * - CSSセレクタは'-key'スイッチで指定する
 * - 原則querySelectorで検索するが、'-a'を指定するとquerySelectorAllで検索し、結果をJSONで返す
 * 
 * @example
 * 
 * ```
 * pbpaste | node core.js -key:'body' > tmp.html
 * cat index.html | awk 1 | node core.js -a -key:'.screen[name="fuga"]' > tmp/index.html
 * ```
 * 
 * pbpaste : クリップボードの内容を標準出力するmacのコマンド
 */

process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', querySelector);


const jsdom = require('jsdom');
const { JSDOM } = jsdom;
function querySelector(){ // 主処理
  const v = {whois:'querySelector',rv:null,step:0,org:lines.join('\n'),arg:analyzeArg().opt};
  try {
    v.html = new JSDOM(v.org).window.document;
    if( !v.arg.hasOwnProperty('a') ){
      v.rv = v.html.querySelector(v.arg.key).innerHTML;
    } else {
      v.rv = [];
      v.html.querySelectorAll(v.arg.key).forEach(x => v.rv.push(x.innerHTML));
      v.rv = JSON.stringify(v.rv);
    }
    console.log(v.rv);
  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
  }
}

/**
 * @typedef {object} AnalyzeArg - コマンドライン引数の分析結果
 * @prop {Object.<string, number>} opt - スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト
 * @prop {string[]} val - スイッチを持たない引数の配列
 */
/**
 * @desc コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す。<br>
 *
 * @example
 *
 * ```
 * node xxx.js -i:aaa.html bbb -o:ccc.json ddd eee
 * ⇒ {opt:{i:"aaa.html",o:"ccc.json"},val:["bbb","ddd","eee"]}
 * ```
 *
 * <caution>注意</caution>
 *
 * - スイッチは`(\-*)([0-9a-zA-Z]+):*(.*)$`形式であること
 * - スイッチに該当しないものは配列`val`にそのまま格納される
 *
 * @param {void} - なし
 * @returns {AnalyzeArg} 分析結果のオブジェクト
 */
function analyzeArg(){
  const v = {whois:'analyzeArg',rv:{opt:{},val:[]}};
  try {
    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3] || null;
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }
    return v.rv;
  } catch(e){
    e.message = `\n${v.whois} abnormal end.\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}