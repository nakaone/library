// useage:
// % node cssConvert.js [入力先ファイル名] > [出力先ファイル名]

const fs = require('fs');
const v = {
  sp:'        ',
  propRex: /^\s+(.+?)\s*:\s*(.+?);.*$/,
  selRex: /^\s*(.+?)\s*\{.*$/,
};

// 入力先ファイルから内容を読み込む
v.r0 = fs.readFileSync(process.argv[2], {encoding: 'utf-8'});
v.r1 = v.r0.split('\n');
v.r2 = ['[\n'];
v.r1.forEach(l => {
  if( v.selRex.test(l) ){
    // selの変換
    v.r2.push(l.replace(
      v.selRex,
      "  }\n},{\n  sel :'$1',\n  prop:{\n")
    );
  }
  if( v.propRex.test(l) ){
    // prop部分の変換
    v.r2.push(l.replace(
      v.propRex,
      "    '$1': '$2',\n"  
    ));
  }
})
v.r2.push('  }\n}],')
v.r3 = v.r2.join('');
console.log(v.r3);