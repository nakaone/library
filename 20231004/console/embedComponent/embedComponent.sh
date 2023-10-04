#!/bin/sh
# -x  つけるとverbose

# embedComponent.sh
#   単体でコンソール実行可能なembedComponent.jsを生成する

echo "\n\n===== embedComponent.sh start ============================"
echo `TZ='Asia/Tokyo' date`

node ../../tools/embedComponent.js \
    -i:template.html -o:embedComponent.js -t:text