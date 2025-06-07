const fs = require('fs');
const v = {};

// 前世代のマスタ(old.json)を読み込み、v.masterとしてオブジェクト化
v.text = fs.readFileSync("old.json","utf-8");
v.master = JSON.parse(v.text);
for( v.x in v.master ){
  v.master[v.x].isExist = false; // 全て削除済とする
}

// 標準入力から最新のリスト(current.json)を入手、v.currentとしてオブジェクト化
v.lines = []; // 標準入力から受け取ったデータを格納する配列
v.rl = require('readline').createInterface({input: process.stdin});
v.rl.on('line', x => v.lines.push(x)).on('close',() => {
  // 標準入力読み込み終了時の処理
  v.rl.close();
  v.current = JSON.parse(v.lines.join('\n'));
  // マージ
  for( v.x in v.current ){
    v.current[v.x].isExist = true;  // 存在フラグを立てる
    v.master[v.x] = v.current[v.x]; // v.masterに上書き
  }
  // マージして結果を出力
  console.log(JSON.stringify(v.master,null,2));
});