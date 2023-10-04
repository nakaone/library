#!/bin/sh
# -x  つけるとverbose

echo "\n\n===== szLib.sh start ============================"
echo `TZ='Asia/Tokyo' date`

node ../../tools/embedComponent.js \
    -i:template.html -o:szLib.js -t:text

jsdoc2md szLib.js > szLib.md