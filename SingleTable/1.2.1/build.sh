#!/bin/sh
# -x  つけるとverbose

echo "\n\n\n\n\nSingleTable build.sh start"

# .DS_storeの全削除
find .. -name '.DS_Store' -type f -ls -delete

echo "`date +"%T"` - SingleTable: step.1 start."
lib="/Users/ena.kaon/Desktop/GitHub/library"
nised="$lib/nised/1.0.0/pipe.cjs"
mod="$lib/SingleTable/1.2.1"
tmp="$mod/tmp"
rm -rf $tmp
mkdir $tmp

# ----------------------------------------------
# core.jsの作成
# ----------------------------------------------
echo "`date +"%T"` - SingleTable: step.2.1 start."
methods=( # type=gsは複数なのでループ処理
  constructor
  prepSheet
  prepData
  dump
  select
  update
  insert
  delete
)
cp $mod/proto/core.js $tmp/before.js
for method in ${methods[@]}; do
  echo "`date +"%T"` - SingleTable: step.2.2 [$method] start."
  # 各メソッドのソースをインデント
  #   ※VSCodeで編集するため、メソッドも行頭から記述しているため
  sed 's/^/  /g' $mod/$method/core.js > $tmp/$method.js
  # プロトタイプ(proto/core.js)にメソッドを追加
  cat $tmp/before.js \
  | node $nised -f:"  // ::$method::" -r:$tmp/$method.js \
  > $tmp/after.js
  cp $tmp/after.js $tmp/before.js
  # テストはメソッド単位なので割愛
done
# メソッド追加結果をcore.jsとして作成
cp $tmp/after.js $mod/core.js

# -------------------------------------------
# readme.mdの作成
# -------------------------------------------
echo "`date +"%T"` - SingleTable: step.3 start."
jsdoc2md $mod/core.js > $tmp/core.md
cat $mod/proto/readme.md \
| node $nised -f:"__JSDoc" -r:$tmp/core.md \
| node $nised -f:"__source" -r:$mod/core.js \
> $mod/../readme.md

echo "`date +"%T"` - SingleTable: end."
