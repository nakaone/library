#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

# ----------------------------------------------
# 0. 事前準備
# ----------------------------------------------
prj="$lib/taxation/3.1.0"
arc="$prj/archives"
src="$prj/src"
doc="$prj/doc"
dep="$prj/deploy"

# ----------------------------------------------
# 1. "code.gs" の作成
# ----------------------------------------------
cat $src/code.js | awk 1 | $embed -prj:$prj -lib:$lib -src:$src > $dep/code.gs

# ----------------------------------------------
# 2. "download.html" の作成
# ----------------------------------------------
cp $src/download.html $dep

# ----------------------------------------------
# 3. "index.html" の作成
# ----------------------------------------------
#cat $src/proto.html | awk 1 | $embed -prj:$prj -lib:$lib -src:$src > $prj/index.html



# ----------------------------------------------
# 「特記事項」htmlの作成
# ----------------------------------------------
# pandoc $prj/notes.md -f markdown -t html -o $prj/notes.html
# rm $prj/notes.html

# ソースの最小化 : https://elon-task.com/1658-2/
#npx html-minifier 20250408.html --collapse-whitespace --remove-comments -o index.html
#CSS最小化 : cleancss -o tmp2.html tmp1.html
#JavaScript最小化 : uglifyjs ./tmp1.html -c --source-map -o ./tmp3.html
