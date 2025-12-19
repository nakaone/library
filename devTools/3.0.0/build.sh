#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

# ----------------------------------------------
# 0. 事前準備
# ----------------------------------------------
#prj="$lib/devTools/3.0.0"

# ES Module対応版(core.mjs)から埋込用(core.js)を作成
sed 's/^export //' core.mjs > core.js
