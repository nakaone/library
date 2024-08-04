/** HTML文書から指定されたCSSセレクタ要素のinnerHTMLを抽出
 * 
 * - パイプ処理
 * - CSSセレクタは'-key'スイッチで指定する
 * - 原則querySelectorで検索するが、'-a'を指定するとquerySelectorAllで検索し、結果をJSONで返す
 * - bodyタグを指定した場合、</body>以下のscriptタグも含まれるので注意
 * 
 * @example
 * 
 * ```
 * pbpaste | node core.js -key:'body' > tmp.html
 * cat index.html | awk 1 | node core.js -a -key:'.screen[name="fuga"]' > tmp/index.html
 * ```
 * 
 * pbpaste : クリップボードの内容を標準出力するmacのコマンド
 * 
 * - Qiita [javascriptの標準入力](https://qiita.com/Molly95554907/items/fddb0a426f9e01d50663)
 */

process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});

reader.on('line', line => lines.push(line));
reader.on('close',()=>querySelector(lines.join('\n'),analyzeArg().opt));

/** querySelector: HTML文書から指定されたCSSセレクタ要素のinnerHTMLを抽出
 * @param {string} content - htmlソース
 * @param {Object} opt
 * @param {string} opt.key - 抽出対象のCSSセレクタ
 * @param {any} opt.a - 存在する場合、全件を検索して配列化してJSONで返す
 * @returns {string|string[]} 抽出対象のinnerHTML
 */
function querySelector(content,opt){
  const v = {whois:'querySelector',step:0,rv:null};
  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  try {

    v.step = 1; // DOM化
    v.dom = new JSDOM(content).window.document;

    if( !opt.hasOwnProperty('a') ){
      v.step = 2; // 単一要素指定の場合
      v.rv = v.dom.querySelector(opt.key).innerHTML;
    } else {
      v.step = 3; // 複数要素指定の場合
      v.rv = [];
      v.dom.querySelectorAll(opt.key).forEach(x => v.rv.push(x.innerHTML));
      v.rv = JSON.stringify(v.rv);
    }
    
    v.step = 9; // 終了処理
    console.log(v.rv);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

// コンソール出力不可のため、ライブラリは埋込の上console文を削除
function analyzeArg(){
  const v = {whois:'analyzeArg',rv:{opt:{},val:[]}};
  try {
    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }
    return v.rv;
  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}
function stringify(variable,opt={addType:false}){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {type:whichType(arg)};
    w.pre = opt.addType ? `[${w.type}]` : '';
    switch( w.type ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = w.pre + arg.toString(); break;
      case 'BigInt':
        w.rv = w.pre + parseInt(arg); break;
      case 'Undefined':
        w.rv = w.pre + 'undefined'; break;
      case 'Object':
        w.rv = {};
        for( w.i in arg ){
          // 自分自身(stringify)は出力対象外
          if( w.i === 'stringify' ) continue;
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      case 'Array':
        w.rv = [];
        for( w.i=0 ; w.i<arg.length ; w.i++ ){
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      default:
        w.rv = w.pre + arg;
    }
    return w.rv;
  };
  try {

    v.step = 1; // 事前準備
    if( typeof opt === 'boolean' ) opt={addType:opt};

    v.step = 2; // 終了処理
    return JSON.stringify(conv(variable));

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}
