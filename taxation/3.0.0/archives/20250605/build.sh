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

# 前回のmaster.jsonをold.jsonとして作業フォルダに保存しておくこと
dev="$Desktop/tmp/20250604_税務定期作業"
cd $dev
cat current.json | node merge.js > master.json


# ソースの最小化 : https://elon-task.com/1658-2/
#npx html-minifier 20250408.html --collapse-whitespace --remove-comments -o index.html
#CSS最小化 : cleancss -o tmp2.html tmp1.html
#JavaScript最小化 : uglifyjs ./tmp1.html -c --source-map -o ./tmp3.html
