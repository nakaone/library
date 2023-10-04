#!/bin/sh
# -x  つけるとverbose

echo "\n\n===== camp2023.sh start ============================"
echo `TZ='Asia/Tokyo' date`

dStr=`date "+%Y%m%d%H%M%S"`

node ../../tools/embedComponent.js \
    -i:template.html -o:tips.html -t:html

# 履歴を保存
cp tips.html tips.$dStr.html
