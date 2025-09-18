#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

# ----------------------------------------------
# 0. 事前準備
# ----------------------------------------------
prj="$lib/underDev/GASutil"
test="$prj/test"

# ----------------------------------------------
# 1. test.gsの作成
# ----------------------------------------------
cat $test/proto.js | awk 1 | \
$embed -prj:$prj -lib:$lib -test:$test > $test/test.gs
