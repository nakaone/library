process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({
  //readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', esed);

/** 標準入力を指定正規表現で置換し、標準出力に送る
 * 
 * - 複数箇所にマッチした場合、全て置換する。
 * 
 * @param {string} x - 正規表現文字列
 * @param {string} s - 置換後の文字列。ファイルと択一
 * @param {string} f - 置換後の文字列を格納したファイル
 * @param {string} e='utf-8' - エンコード指定
 * @returns {void}
 * 
 * @example
 * 
 * CSSからコメントを削除
 * 
 * ```
 * tf="/Users/ena.kaon/Desktop/GitHub/library/CSS/1.3.0/core.css"
 * cat $tf | node core.js -x:"\/\*[\s\S]+?\*\/\n" -s:"" > result01.txt
 * ```
 * 
 * - `[\s\S]`は改行を含むあらゆる文字(`.`は改行にはマッチしない)
 * 
 * ファイルの中身で置換
 * 
 * ```
 * cat << EOF > test.txt
 * aaa
 * bbb
 * EOF
 * cat $tf | node core.js -x:"\/\*[\s\S]+?\*\/\n" -f:"test.txt" > result02.txt
 * ```
 * 
 * #### 改版履歴
 * 
 * - rev.1.0.0 2024/03/04 初版
 */
function esed(){ // 主処理
  const v = {
    fs : require('fs'),
    arg: analyzeArg(), // 起動時引数
  };
  v.rex = new RegExp(v.arg.opt.x,'g'); // 正規表現
  
  // エンコード指定に既定値設定
  v.arg.opt.e = v.arg.opt.hasOwnProperty('e') ? v.arg.opt.e : 'utf-8';

  // 置換後の文字列を引数またはファイルから取得
  if( v.arg.opt.hasOwnProperty('f') ){
    v.str = v.fs.readFileSync(v.arg.opt.f,v.arg.opt.e);
  } else {
    v.str = v.arg.opt.s;
  }

  // 置換実行
  v.rv = lines.join('\n').replaceAll(v.rex,v.str);  
  console.log(v.rv);  // 処理結果を標準出力
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
  //console.log(v.whois+' start.');
  try {
    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }

    //console.log(v.whois+' normal end.');
    return v.rv;
  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}