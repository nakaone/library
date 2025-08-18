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
# 2. "report.html" の作成
#   src/report.html(.js, .css)を作成・修正。
#   deploy/report.htmlをGASに保存
# ----------------------------------------------
cat $src/report.html | awk 1 | $embed -prj:$prj -lib:$lib -src:$src > $dep/report.html

# ----------------------------------------------
# 3. "help.html"の作成
#   「作業手順書(help.html)」は以下のWorkFlowyで作成
#   https://workflowy.com/#/9f9f262cba76
#   作成後はdoc/help.opmlに保存、deploy/help.htmlをGASに保存
# ----------------------------------------------
# workflowy -> md
cat $doc/help.opml | awk 1 | $workflowy -root:9f9f262cba76 -lv:3 > $doc/help.md
# md -> html
pandoc $doc/help.md -f markdown -t html -o $doc/help.html
# テンプレートに埋め込み
cat $src/help.html | awk 1 | $embed -prj:$prj -lib:$lib -src:$src -doc:$doc > $dep/help.html
rm $doc/help.md
rm $doc/help.html


# ソースの最小化 : https://elon-task.com/1658-2/
#npx html-minifier 20250408.html --collapse-whitespace --remove-comments -o index.html
#CSS最小化 : cleancss -o tmp2.html tmp1.html
#JavaScript最小化 : uglifyjs ./tmp1.html -c --source-map -o ./tmp3.html
