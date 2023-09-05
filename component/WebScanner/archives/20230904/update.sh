#!/bin/sh
# -x  つけるとverbose

echo `TZ='Asia/Tokyo' date`

node ../../tools/embedComponent.js -i:webApp.html -o:WebScanner.spa.html -t:html