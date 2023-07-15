#!/bin/sh
# -x  つけるとverbose

echo "\n\n===== camp2023.sh start ============================"
echo `TZ='Asia/Tokyo' date`

node ../../tools/embedComponent.js \
    -i:template.html -o:camp2023.html -t:html