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
node $src/doc/specDef.js | node $prj/tools/specify.js -o:$tmp

#node $src/doc/classdef.js | node $prj/tools/classdef.js -o:$tmp
#
## クラス一覧
#cat $src/doc/classes.md | awk 1 | \
#$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $tmp/classes.md
#rm $tmp/classList.md
#
## JavaScriptライブラリ
#cat $src/doc/JSLib.md | awk 1 | \
#$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $tmp/JSLib.md
#
## 総説
#cat $src/doc/spec.md | awk 1 | \
#$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $tmp/spec.md
#
## header.mdを付加
#for f in $tmp/*.md; do
#  out="${f/tmp/doc}"
#  cat $src/doc/header.md "$f" > "$out"
#done
