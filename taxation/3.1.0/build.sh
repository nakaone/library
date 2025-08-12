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
prj="$lib/taxation/3.0.0"
src="$prj/src"

# 0.12 .DS_storeの全削除
find $GitHub -name '.DS_Store' -type f -ls -delete

# 0.13 build関係ツール
embed="node $lib/embedRecursively/1.2.0/pipe.js"
esed="node $lib/esed/1.0.0/core.js"
modify="node $lib/modifyMD/1.0.0/pipe.js"
querySelector="node $lib/querySelector/2.0.1/pipe.js"
opml="$lib/workflowy/opml"
workflowy="node $lib/workflowy/1.1.0/pipe.js"

# ----------------------------------------------
# 以下で code.gs, download.html, index.htmlを作成、
# Google Spread「証憑yyyy」にファイルとして登録する。
# ----------------------------------------------

# ----------------------------------------------
# 1. "code.gs" の作成
# ----------------------------------------------
cat $src/code.js | awk 1 | $embed -prj:$prj -lib:$lib -src:$src > $prj/code.gs

# ----------------------------------------------
# 2. "download.html" の作成
# ----------------------------------------------
cp $src/download.html $prj

# ----------------------------------------------
# 3. "index.html" の作成
# ----------------------------------------------
cat $src/proto.html | awk 1 | $embed -prj:$prj -lib:$lib -src:$src > $prj/index.html



# ----------------------------------------------
# 「特記事項」htmlの作成
# ----------------------------------------------
# pandoc $prj/notes.md -f markdown -t html -o $prj/notes.html
# rm $prj/notes.html

# ソースの最小化 : https://elon-task.com/1658-2/
#npx html-minifier 20250408.html --collapse-whitespace --remove-comments -o index.html
#CSS最小化 : cleancss -o tmp2.html tmp1.html
#JavaScript最小化 : uglifyjs ./tmp1.html -c --source-map -o ./tmp3.html
