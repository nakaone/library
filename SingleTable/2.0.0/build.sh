#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止

# ----------------------------------------------
# 0.1 事前準備(buildの共通部分)
# ----------------------------------------------

# 0.11 パスの定義
Desktop="/Users/ena.kaon/Desktop"
GitHub="$Desktop/GitHub"
lib="$GitHub/library"

# 0.12 .DS_storeの全削除
find $GitHub -name '.DS_Store' -type f -ls -delete

# 0.13 build関係ツール
embed="node $lib/embedRecursively/1.2.0/pipe.js"
esed="node $lib/esed/1.0.0/core.js"
modify="node $lib/modifyMD/1.0.0/pipe.js"
querySelector="node $lib/querySelector/2.0.1/pipe.js"

# 0.14 共通変数・関数の定義
echo "\n\n\n\n\n"  # 開始前に空白行をコンソールに出力
separator="\n===============================================\n"
function log(){  # 1.4 ログメッセージ出力関数
  echo "\n$separator`date +"%T"` [$prjName] step $1 start$separator"
}

# ----------------------------------------------
# 0.2 事前準備(プロジェクト固有部分)
# ----------------------------------------------
prj="$lib/SingleTable/2.0.0"
test="$prj/test"
src="$prj/src"
prjName="SingleTable"
tmp="$prj/tmp"; mkdir -p $tmp

# ----------------------------------------------
# 1. core.jsの作成
# ----------------------------------------------
log "1";
sed -e "s/^/  /g" $src/constructor.js > $tmp/constructor.js
cat $src/proto.js | awk 1 | \
$embed -prj:$prj -src:$src -lib:$lib -tmp:$tmp > $prj/core.js

echo "\n$separator`date +"%T"` [$prjName] end$separator"