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
  console.log('===== analyzeArg start.');
  const v = {rv:{opt:{},val:[]}};
  try {

    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      // process.argv:コマンドライン引数の配列
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }

    console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== analyzeArg end.');
    return v.rv;
  } catch(e){
    console.error('===== analyzeArg abnormal end.\n',e);
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
/* コンソール実行用 */
const fs = require('fs'); // ファイル操作

/**
 * コンソールからminimizeを実行する
 * @param {string} i - 入力ファイル名
 * @param {string} o - 出力ファイル名
 * @param {string[]} option - 削除対象とするコメント形式[all|jsdoc|js|css|html]
 * 
 * @example
 * 
 * ```
 * node minimize.js -i:minimize.html -o:test.html all
 * node minimize.js -i:minimize.html -o:test.html jsdoc <- JSDocのみ削除
 * ```
 */
function onConsole(){
  console.log('minimize.onConsole start.');
  const v = {rv:null,opt:{}};
  try {

    // 事前処理：引数チェック、既定値の設定
    v.argv = analyzeArg();
    console.log('argv='+JSON.stringify(v.argv));
    if(v.argv.hasOwnProperty('stack')) throw v.argv;

    // オプション(対象形式)の作成
    v.argv.val.forEach(x => v.opt[x]=true);

    v.readFile = fs.readFileSync(v.argv.opt.i,'utf-8').trim();
    v.rv = minimize(v.readFile,v.opt);
    v.writeFile = fs.writeFileSync(v.argv.opt.o,v.rv,'utf-8');  

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('minimize.onConsole end.');
  } catch(e){
    console.error('minimize.onConsole abnormal end.',e);
  }
}
onConsole();
