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

#mmdc -i $doc/summary.mermaid -o $img/summary.svg
#mmdc -i $doc/preparation.mermaid -o $img/preparation.svg
#mmdc -i $doc/joining.mermaid -o $img/joining.svg
#mmdc -i $doc/login.mermaid -o $img/login.svg
#mmdc -i $doc/processingRequest.mermaid -o $img/processingRequest.svg

# typedef
node $src/doc/typedef.js -o:$tmp

# 仕様書
cat $src/doc/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $prj/spec.md
cat $src/doc/authServer.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $doc/authServer.md
cat $src/doc/cryptoServer.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $doc/cryptoServer.md
cat $src/doc/Member.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $doc/Member.md

# AI質問用
cat $doc/question.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$src/doc -tmp:$tmp > $prj/question.md
