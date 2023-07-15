#!/bin/sh
# -x  つけるとverbose

echo "\n\n===== CommonJS.sh start ============================"
echo `TZ='Asia/Tokyo' date`

node ../../tools/embedComponent.js \
    -i:template.html -o:CommonJS.js -t:text
