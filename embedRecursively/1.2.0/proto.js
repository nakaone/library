process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', () => {
  console.log(embedRecursively(lines.join('\n'),analyzeArg().opt));
});

//::$prj/core.js::
//::$lib/analyzeArg/1.1.1/core.js::
//::$lib/stringify/1.1.1/core.js::
//::$lib/whichType/1.0.1/core.js::