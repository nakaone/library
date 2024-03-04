/** 標準入力を指定正規表現で置換し、標準出力に送る
 * なお複数箇所にマッチした場合、全て置換する。
 * 
 * @param {string} 第一引数 - 正規表現文字列
 * @param {string} 第二引数 - 置換後の文字列
 * @returns {string} 置換後の文字列
 * 
 * @example
 * 
 * CSSからコメントを削除
 * 
 * ```
 * cat /Users/ena.kaon/Desktop/GitHub/library/CSS/1.3.0/core.css \
 * | node esed.js "\/\*[\s\S]+?\*\/\n" ""
 * ```
 * 
 * - `[\s\S]`は改行を含むあらゆる文字(`.`は改行にはマッチしない)
 */

process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', main);

function main(){ // 主処理
  const v = {
    org:lines.join('\n'),
    rex:new RegExp(process.argv[2],'g'),
  };

  for( v.i=0 ; v.i<process.argv.length ; v.i++){
    console.log(`${v.i} : "${process.argv[v.i]}"`)
  }
  v.rv = v.org.replaceAll(v.rex,process.argv[3]);  
  console.log(v.rv);  // 処理結果を標準出力
}