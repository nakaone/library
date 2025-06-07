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
opml="$lib/workflowy/opml"
workflowy="node $lib/workflowy/1.1.0/pipe.js"


# カレントディレクトリは作業用フォルダとして実行
prj=$PWD #"$Desktop/tmp/20250604_税務定期作業"
cd $prj
pandoc $prj/notes.md -f markdown -t html -o $prj/notes.html
cat $prj/local/proto.html | awk 1 | \
$embed -prj:$prj -lib:$lib > $prj/index.html
rm $prj/notes.html

# ソースの最小化 : https://elon-task.com/1658-2/
#npx html-minifier 20250408.html --collapse-whitespace --remove-comments -o index.html
#CSS最小化 : cleancss -o tmp2.html tmp1.html
#JavaScript最小化 : uglifyjs ./tmp1.html -c --source-map -o ./tmp3.html
