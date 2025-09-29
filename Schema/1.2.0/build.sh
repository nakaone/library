#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

# ----------------------------------------------
# 0. 事前準備
# ----------------------------------------------
prj="$lib/Schema/1.2.0"

cat $prj/test.js | awk 1 | \
$embed -prj:$prj -lib:$lib > $prj/test.gs
