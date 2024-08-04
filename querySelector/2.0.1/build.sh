#!/bin/sh
# -x  つけるとverbose
# reference: Auth
set -e # エラー時点で停止

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n===============================================\n"
echo "\n$hr`date +"%T"` [querySelector] build start$hr"

# 1.1 変数・ツールの定義
echo "`date +"%T"` - querySelector: step.1.1 start."
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
mod="$lib/querySelector/2.0.1"
# ツール
embed="node $lib/embedRecursively/1.1.0/pipe.js"
esed="node $lib/esed/1.0.0/core.js"
modify="node $lib/modifyMD/1.0.0/pipe.js"
querySelector="node $lib/querySelector/2.0.1/core.js"
# 作業用フォルダの準備
tmp="$mod/tmp";
if [ ! -d $tmp ]; then
  mkdir $tmp
else 
  rm -rf $tmp/*
fi

# 1.2 .DS_storeの全削除
echo "`date +"%T"` - querySelector: step.1.2 start."
cd $mod
find . -name '.DS_Store' -type f -ls -delete

# ----------------------------------------------
# 2.ソースの作成
# ----------------------------------------------
echo "`date +"%T"` - querySelector: step.2 start."
cat $mod/proto.js | awk 1 | $embed -mod:$mod -lib:$lib -tmp:$tmp > $mod/pipe.js
