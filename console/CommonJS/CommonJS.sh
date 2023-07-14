#!/bin/sh
# -x  つけるとverbose

echo "\n\n===== CommonJS.sh start ============================"
echo `TZ='Asia/Tokyo' date`

cp ../szLib/szLib.js ./CommonJS.js

cat ../../component/embedComponent.js >> CommonJS.js
# onNodeが入っちゃうのは後日...

cat <<EOD >> CommonJS.js


exports.analyzeArg = analyzeArg;
exports.analyzePath = analyzePath;
exports.Array_tabulize = Array_tabulize;
exports.Date.calc = Date.calc;
exports.Date.toLocale = Date.toLocale;
exports.embedComponent = embedComponent;
exports.mergeDeeply = mergeDeeply;
exports.querySelector = querySelector;
exports.simpleMenu = simpleMenu;
exports.TimeTable = TimeTable;
exports.webScanner = webScanner;
exports.whichType = whichType;
EOD

#node ../../tools/embedComponent.js \
#    -i:template.html -o:szLib.js -t:text