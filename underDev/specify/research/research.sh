#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

tmp="./tmp"
# $embedに渡すパラメータを一括指定
opts="-GitHub:$GitHub -lib:$lib -prj:$prj -dep:$dep -doc:$doc -src:$src -tmp:$tmp"

function test (){
  jsdoc -X sample/test.js > $tmp/test.json
  node createSpec.mjs sample/test.js -o $doc/test -r $tmp/test.doc.json
}

function createSpec (){
  # 1. createSpec本体
  # 1.1 jsdoc -X
  cp createSpec.mjs $tmp/createSpec.js
  jsdoc -X $tmp/createSpec.js > $tmp/createSpec.json
  rm $tmp/createSpec.js
  # 1.2 createSpec内でcreateSpec.doc.json出力
  node createSpec.mjs createSpec.mjs -o $doc/createSpec -r $tmp/createSpec.doc.json
}

test
createSpec

# 分析
#cat research.json | awk 1 | $embed -tmp:$tmp > $tmp/research.json
cat research.json | awk 1 | $embed -tmp:$tmp | node research.mjs
