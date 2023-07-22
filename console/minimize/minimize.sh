#!/bin/sh
# -x  つけるとverbose

# minimize.sh
#   単体でコンソール実行可能なminimize.jsを生成する

echo "\n\n===== minimize.sh start ============================"
echo `TZ='Asia/Tokyo' date`

rm minimize.html
rm minimize.js
rm minimize.onConsole.js

node ../../tools/embedComponent.js \
    -i:template.html -o:minimize.html -t:html

# script.coreから核となるスクリプトを抽出
node ../../tools/querySelector.js \
    -i:minimize.html -o:minimize.js script.core
node ../../tools/querySelector.js \
    -i:minimize.html -o:minimize.onConsole.js script.onConsole
cat minimize.onConsole.js >> minimize.js