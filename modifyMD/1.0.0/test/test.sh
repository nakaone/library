#!/bin/sh
# -x  つけるとverbose
# created with reference to embedRecursively/2.0.0/build.sh, BurgerMenu/2.0.0/build.sh, camp2024/client/build.sh
set -e # エラー時点で停止

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n=======================================\n"
echo "\n$hr[modifyMD] test.sh start$hr"

# 1.1 変数・ツールの定義
echo "step.1.1 start."
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
mod="$lib/modifyMD/1.0.0"
test="$mod/test"

# 1.2 pipe.jsの最新化
echo "step.1.2 start."
$mod/build.sh


# ----------------------------------------------
# 2. テスト実行
# ----------------------------------------------
cat $test/test.md | awk 1 \
| node $mod/pipe.js > $test/result.md


echo "\n$hr[modifyMD] test.sh end$hr"
