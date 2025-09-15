#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

# ----------------------------------------------
# 0. 事前準備
# ----------------------------------------------
prj="$GitHub/library/Schema/1.1.0"
test="$prj/test"
tmp="/Users/ena.kaon/Desktop/tmp"

# ----------------------------------------------
# 1. 実行用ソースの作成
# ----------------------------------------------
cat $test/proto.js | awk 1 | \
$embed -prj:$prj -lib:$lib -test:$test > $test/test.js

# ----------------------------------------------
# 2. パッチ実行
# ----------------------------------------------
node $test/test.js > $test/result.json
rm $test/test.js
