#!/bin/sh
# -x  つけるとverbose

cat ../../getActiveCellInfo/1.1.0/core.js > serverLib.tmp
cat ../../SingleTable/1.0.0/core.js >> serverLib.tmp
cat ../../whichType/1.0.1/core.js >> serverLib.tmp

# パイプ処理でコメントを削除したソースをclientLib.htmlに追加
cat serverLib.tmp | node ../../minimize/1.0.0/pipe.js >> serverLib.gs
rm serverLib.tmp