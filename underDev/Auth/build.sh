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
doc="$prj/doc"
img="$prj/img"
tmp="$prj/tmp"

# ----------------------------------------------
# 1. 仕様書
# ----------------------------------------------

# typedef
node $src/doc/typedef.js -o:$tmp

# 仕様書
cat $src/doc/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $prj/spec.md
cat $src/doc/cryptoServer.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $doc/cryptoServer.md
cat $src/doc/cryptoClient.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $doc/cryptoClient.md
cat $src/doc/authServer.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $doc/authServer.md
cat $src/doc/authClient.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $doc/authClient.md
cat $src/doc/Member.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $doc/Member.md

# AI質問用
cat $src/doc/ChatGPT.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $doc/ChatGPT.md

cat $src/authServer/authServer.js | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -tmp:$tmp > $prj/authServer.gs
