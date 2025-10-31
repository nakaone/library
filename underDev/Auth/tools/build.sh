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
rm -rf $tmp/*

# ----------------------------------------------
# 1. 仕様書
# ----------------------------------------------

# typedef
node $src/common/typedef.js -o:$tmp

# authClient
cat $src/authClient/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/authClient.md

# authServer
#mmdc -i $src/authServer/authServer.sequenceDiagram.mmd -o $tmp/authServer.sequenceDiagram.svg
cat $src/authServer/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/authServer.md

#cat $src/authServer/proto.js | awk 1 | \
#$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $dep/authServer.gs

# cryptoClient
cat $src/cryptoClient/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/cryptoClient.md

# cryptoServer
cat $src/cryptoServer/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/cryptoServer.md

# Member
# 複数箇所引用、かつdetailsタグ内での表示なのでSVG化
mmdc -i $src/Member/Member.classDiagram.mmd -o $tmp/Member.classDiagram.svg
cat $src/Member/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/Member.md
cat $src/Member/proto.js | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $src/Member/core.js

# 内発処理
cat $src/common/internalProcessing.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/internalProcessing.md

# 総説
cat $src/common/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/spec.md

# 型定義・ライブラリ
#cat $src/common/typedef.md | awk 1 | \
#$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/typedef.md
rm -rf $tmp/*
node $src/common/classdef.js -o:$tmp
cat $src/common/library.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $tmp/library.md

# 統合版
#cat $src/authServer.js | awk 1 | \
#$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $dep/code.gs
