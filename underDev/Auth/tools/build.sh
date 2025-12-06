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


## header.mdを付加
#for f in $tmp/*.md; do
#  out="${f/tmp/doc}"
#  cat $src/doc/header.md "$f" > "$out"
#done
