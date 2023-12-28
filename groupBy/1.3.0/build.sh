#!/bin/sh
# -x  つけるとverbose

echo "\n\n\n\n\ngroupBy/1.3.0/build.sh start"

# -----------------------
# 0.事前準備
# -----------------------

# .DS_storeの全削除
find . -name '.DS_Store' -type f -ls -delete

lib="../.."
nised="$lib/nised/1.0.0/pipe.cjs"
minimize="$lib/minimize/1.0.0/pipe.js"

# -----------------------
# 1.メイン処理
# -----------------------
tmp="core.tmp"
jsdoc2md core.js > $tmp
cat proto.md \
| node $nised -f:"__JSDoc" -r:$tmp \
| node $nised -f:"__source" -r:core.js \
| node $nised -f:"__test" -r:test.js \
> readme.md

rm $tmp
