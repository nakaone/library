#!/bin/sh
# -x  つけるとverbose
# created with reference to embedRecursively/2.0.0/build.sh, BurgerMenu/2.0.0/build.sh, camp2024/client/build.sh
set -e # エラー時点で停止

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n=======================================\n"
echo "\n$hr[embedRecursively] build start$hr"

# 1.1 変数・ツールの定義
echo "step.1.1 start."
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
mod="$lib/embedRecursively/1.1.0"
esed="node $lib/esed/1.0.0/core.js"
querySelector="node $lib/querySelector/2.0.0/core.js"
tmp="$mod/tmp"; rm -rf $tmp/*
#w01="$tmp/work01";w02="$tmp/work02";w03="$tmp/work03"

# 1.2 .DS_storeの全削除
echo "step.1.2 start."
cd $mod
find . -name '.DS_Store' -type f -ls -delete


# ----------------------------------------------
# 2. pipe.jsの生成
# ----------------------------------------------
# 2.1 pipe処理部分の記述
cat << EOS > $mod/pipe.js
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
EOS
cp $mod/pipe.js $mod/pipetest.js
# 2.2 embedRecursively(core.js)
cat $mod/core.js | awk 1 \
| $esed -x:" *console.log.+\n" -s:"" >> $mod/pipe.js
cat $mod/core.js | awk 1 >> $mod/pipetest.js
# 2.3 その他ライブラリ
cat $lib/analyzeArg/1.1.0/core.js | awk 1 \
| $esed -x:" *console.log.+\n" -s:"" >> $mod/pipe.js
cat $lib/stringify/1.1.1/core.js | awk 1 >> $mod/pipe.js
cat $lib/whichType/1.0.1/core.js | awk 1 \
| $esed -x:" *console.log.+\n" -s:"" >> $mod/pipe.js


# ----------------------------------------------
# ----------------------------------------------
jsdoc2md $mod/core.js > $tmp/jsdoc.md
cat << EOS > $tmp/source.md
\`\`\`
`cat $mod/core.js | awk 1`
\`\`\`
EOS
cat $mod/proto.md | awk 1 \
| $esed -x:"\/\*::CSS/1.3.0/core.css::\*\/" -f:$lib/CSS/1.3.0/core.css \
| $esed -x:"<!--::JSDoc.md::-->" -f:$tmp/jsdoc.md \
| $esed -x:"<!--::source.md::-->" -f:$tmp/source.md \
> $mod/readme.md

echo "\n$hr[embedRecursively] build end$hr"
