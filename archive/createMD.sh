#!/bin/sh
# -x  つけるとverbose

# createMD: ライブラリのコンポーネントからコアスクリプトを抽出、tmp直下にMarkdown作成
# useage ./createMD.sh xxx (※xxxは拡張子不要)

function textContent(){
  node node/textContent.js -i:JavaScript/$1.html -o:tmp/$1.js script.source
  jsdoc2md tmp/$1.js > tmp/$1.md
}

echo `TZ='Asia/Tokyo' date`
cd /Users/ena.kaon/Desktop/GitHub/library
textContent $1