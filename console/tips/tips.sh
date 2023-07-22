#!/bin/sh
# -x  つけるとverbose

echo "\n\n===== camp2023.sh start ============================"
echo `TZ='Asia/Tokyo' date`

node ../../tools/embedComponent.js \
    -i:template.html -o:tips.html -t:html