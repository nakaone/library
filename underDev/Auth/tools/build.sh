#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

# ----------------------------------------------
# 0. 事前準備
# ----------------------------------------------
prj="$lib/underDev/Auth"
arc="$prj/archives"
src="$prj/src"
dep="$prj/deploy"
doc="$prj/doc"
img="$prj/img"
tmp="$prj/tmp"
rm -rf $doc/*
rm -rf $tmp/*

# ----------------------------------------------
# 1. 仕様書
# ----------------------------------------------

# クラス別定義
node $src/doc/specDef.js | node $prj/tools/specify.mjs -h:$src/doc/header.md -o:$doc -l:$tmp

# クライアント・サーバ側仕様書
cat $src/doc/header.md $src/doc/client.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/cl/client.md
cat $src/doc/header.md $src/doc/server.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/sv/server.md

# doc直下文書用をrootHeader.mdとして作成
cat $src/doc/header.md | sed 's|\.\./||g' > $tmp/rootHeader.md
# 総説
cat $tmp/rootHeader.md $src/doc/specification.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/specification.md
# JavaScriptライブラリ
cat $tmp/rootHeader.md $src/doc/JSLib.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/JSLib.md
# 開発仕様
cat $tmp/rootHeader.md  $src/doc/dev.md > $doc/dev.md

# ----------------------------------------------
# 2. クライアント側
# ----------------------------------------------
#cat $src/test.html | awk 1 | \
#$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $dep/test.html
cat $src/client/onLoad.js | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $tmp/onLoad.js
cat $src/client/index.html | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $dep/index.html

# 2.1 テスト用のmjs作成
echo "\nexport {devTools,authClient,authClientConfig,authConfig,localFunc};" >> $tmp/onLoad.js
mv $tmp/onLoad.js $dep/onLoad.mjs

# AIレビュー用
#cat $doc/specification.md $doc/JSLib.md > $tmp/common.md
#cat $doc/cl/*.md > $tmp/cl.md
#cat $tmp/common.md $tmp/cl.md > $tmp/review.cl.md
#cat $doc/sv/*.md > $tmp/sv.md
#cat $tmp/common.md $tmp/sv.md > $tmp/review.sv.md


## header.mdを付加
#for f in $tmp/*.md; do
#  out="${f/tmp/doc}"
#  cat $src/doc/header.md "$f" > "$out"
#done
