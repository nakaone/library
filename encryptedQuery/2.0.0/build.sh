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
prj="$lib/encryptedQuery/2.0.0"
test="$prj/test"
src="$prj/src"
doc="$prj/doc"
test="$prj/test"
prjName="encryptedQuery"
tmp="$prj/tmp"; mkdir -p $tmp

# ----------------------------------------------
# 1. 仕様書の作成
# ----------------------------------------------
log "1";
mmdc -i $doc/onload.mmd -o $doc/onload.svg
mmdc -i $doc/update.mmd -o $doc/update.svg
#cat $src/SpreadDB.js | awk 1 | \
#$embed -prj:$prj -src:$src -lib:$lib -tmp:$tmp > $prj/core.js

# ----------------------------------------------
# 2. test.jsの作成
# ----------------------------------------------
#log "2";
#cat $test/proto.js | awk 1 | \
#$embed -prj:$prj -src:$src -lib:$lib -test:$test -tmp:$tmp > $prj/test.js

echo "\n$separator`date +"%T"` [$prjName] end$separator"