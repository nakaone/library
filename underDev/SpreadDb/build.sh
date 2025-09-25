#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

# ----------------------------------------------
# 0. 事前準備
# ----------------------------------------------
dev="$lib/underDev"
prj="$dev/SpreadDb"
test="$prj/test"

# ----------------------------------------------
# 1. test.gsの作成
# ----------------------------------------------
cat $test/proto.js | awk 1 | \
$embed -prj:$prj -lib:$lib -dev:$dev -test:$test > $test/test.gs

# 開発時、修正箇所が見にくくなるので暫定的にコメントアウト
# jsdoc core.js -d $prj/doc
