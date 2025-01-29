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
modify="node $lib/modifyMD/2.0.0"
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
prjName="workflowy"
prj="$lib/$prjName/1.0.0"
src="$prj/src"
doc="$prj/doc"
test="$prj/test"
tmp="$prj/tmp"; mkdir -p $tmp; rm -rf $tmp/*

# ----------------------------------------------
log "1"; # xml2jsonのサンプル作成
# ----------------------------------------------
#cat $test/sample.opml | awk 1 | node $prj/pipe.js sample > $test/sample.json

# ----------------------------------------------
log "2"; # テスト
# ----------------------------------------------
#cat $test/sample.opml | awk 1 | node $prj/pipe.js markdown 2 > $test/sample.md
cat $test/SpreadDb.opml | awk 1 | node $prj/pipe.js markdown 3 > $test/SpreadDb.md

echo "\n$separator`date +"%T"` [$prjName] end$separator"