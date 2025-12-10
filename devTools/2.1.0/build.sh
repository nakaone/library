#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

# ----------------------------------------------
# 0. 事前準備
# ----------------------------------------------
prj="$lib/devTools/2.1.0"

# ES Moduleの作成
cp $prj/core.js $prj/core.mjs
echo "\nexport {devTools};" >> $prj/core.mjs
