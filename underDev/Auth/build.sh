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
img="$doc/img"

# ----------------------------------------------
# 1. 仕様書
# ----------------------------------------------

mmdc -i $doc/joining.mermaid -o $img/joining.png

cat $doc/spec.proto.md | awk 1 | \
$embed -prj:$prj -lib:$lib -doc:$doc > $doc/specification.md
