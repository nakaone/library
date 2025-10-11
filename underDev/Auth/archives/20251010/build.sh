#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

# ----------------------------------------------
# 0. 事前準備
# ----------------------------------------------
prj="$lib/underDev/Auth"
arc="$prj/archives"
doc="$prj/doc"
img="$prj/img"

# ----------------------------------------------
# 1. 仕様書
# ----------------------------------------------

mmdc -i $doc/summary.mermaid -o $img/summary.png
mmdc -i $doc/joining.mermaid -o $img/joining.png
mmdc -i $doc/authenticate.mermaid -o $img/authenticate.png

# 仕様書
cat $doc/spec.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$doc > $prj/spec.md

# AI質問用
cat $doc/question.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$doc > $prj/question.md
