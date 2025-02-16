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
opml="$lib/workflowy/opml"

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
prj="$lib/$prjName/1.1.0"
tmp="$prj/tmp"; mkdir -p $tmp; rm -rf $tmp/*
dev="$prj/dev"

# ----------------------------------------------
log "1"; # テスト用サンプル(33a7f77d9c25)
# ----------------------------------------------
cat $dev/sample.opml | awk 1 | node $prj/pipe.js -root:33a7f77d9c25 -lv:2 > $dev/sample.md

# ----------------------------------------------
log "2"; # readme.md
# ----------------------------------------------
#cat $opml/20250209.opml | awk 1 | node $prj/pipe.js -root:5a8dd15033a4 -lv:2 > $prj/readme.md

echo "\n$separator`date +"%T"` [$prjName] end$separator"