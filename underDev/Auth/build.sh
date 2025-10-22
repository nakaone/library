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
mmdc -i $src/authServer/authServer.sequenceDiagram.mmd -o $tmp/authServer.sequenceDiagram.svg
cat $src/authServer/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/authServer.md

cat $src/authServer/proto.js | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $src/authServer/core.js

# cryptoClient
cat $src/cryptoClient/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/cryptoClient.md

# cryptoServer
cat $src/cryptoServer/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/cryptoServer.md

# Member
cat $src/Member/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/Member.md
cat $src/Member/proto.js | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $src/Member/core.js

# 型定義
cat $src/common/typedef.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/typedef.md

# 仕様書
cat $src/common/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/spec.md

# 統合版
#cat $src/authServer.js | awk 1 | \
#$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $dep/code.gs
