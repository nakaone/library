/** パイプ処理でコメントを削除する
 * - [javascriptの標準入力](https://qiita.com/Molly95554907/items/fddb0a426f9e01d50663)
 * 
 * @example
 * 
 * ```
 * cat src.html | node pipe.js -r:replace.txt -k:keyword > dest.html
 * ```
 * 
 * - f {string} 置換前文字列(キーワード)
 * - t {string} 置換後文字列
 * - r {string} 置換後の文字列が入ったテキストファイル名。置換後文字列と排他
 */
process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', (line) => {　//line変数には標準入力から渡された一行のデータが格納されている
  //if( !line.match(/^\s*$/) ) 有効にすると空白行を勝手にスキップするので無効化
  lines.push(line);　//ここで、lines配列に、標準入力から渡されたデータが入る
});
reader.on('close', () => {　//受け取ったデータを用いて処理を行う
  const rv = nised(lines.join('\n'));
  console.log(rv.dest);
});

//import fs from 'fs';
const fs = require('fs');
function nised(src){
  const v = {whois:'nised',rv:{opt:{},val:[],src:src,dest:null}};
  try {

    v.step = 1; // analyzeArg
    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }

    if( v.rv.opt.hasOwnProperty('t') ){
      v.step = 2.1; // 置換後文字列をコマンドラインから設定
      v.to = v.rv.opt.t;
    } else {
      v.step = 2.2; // 置換後文字列(ファイル)の読み込み
      v.to = fs.readFileSync(v.rv.opt.r,'utf8');
    }

    v.step = 3; // 置換実行
    v.rv.dest = src.replace(v.rv.opt.f,v.to);

    v.step = 4; // 終了処理
    return v.rv;

  } catch(e){
    console.error('%s abnormal end at step.%s\n%s\nsrc=%s\nv=%s'
      ,v.whois,v.step,e.message,src,JSON.stringify(v));
    return e;  }
}
