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
embed="node $lib/embedRecursively/1.1.0/pipe.js"
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
src="$test/src"
prjName="encryptedQuery"
tmp="$test/tmp"; mkdir -p $tmp

# ----------------------------------------------
# 1. サーバ側テスト用ソース：server.gsの作成
# ----------------------------------------------
log "1";
cat $src/doGet.js | awk 1 | \
$embed -prj:$prj -src:$src -lib:$lib -tmp:$tmp > $test/server.gs

# ----------------------------------------------
# 2. クライアント側テスト用ソース：index.htmlの作成
# ----------------------------------------------
log "2";
cat $src/index.html | awk 1 | \
$embed -prj:$prj -src:$src -lib:$lib -tmp:$tmp > $test/index.html


echo "\n$separator`date +"%T"` [$prjName] end$separator"