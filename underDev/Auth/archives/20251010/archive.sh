#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

prj="$lib/underDev/Auth"
arc="$prj/archives"
src="$prj/src"
doc="$prj/doc"

# ----------------------------------------------
# バックアップファイルの作成
# ----------------------------------------------
cd $prj
zip -r $arc/`date +"%Y%m%d"`.zip ./ -x $arc/*
