#!/bin/sh
# -x  つけるとverbose

echo "\n\n\n\n\nbuild.sh start"

# .DS_storeの全削除
find . -name '.DS_Store' -type f -ls -delete

lib="/Users/ena.kaon/Desktop/GitHub/library"
mod="$lib/createElement/1.2.1"
nised="$lib/nised/1.0.0/pipe.cjs"

# -------------------------------------------
# readme.mdの作成
# -------------------------------------------
jsdoc2md $mod/core.js > $mod/core.md
cat $mod/proto.md \
| node $nised -f:"__JSDoc" -r:$mod/core.md \
| node $nised -f:"__source" -r:$mod/core.js \
| node $nised -f:"__test" -r:$mod/test.js \
> $mod/../readme.md