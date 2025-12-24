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
zip -r $arc/`date +"%Y%m%d"`.zip ./ -x "archives/*" "node_modules/*" "tmp/*"
# 除外指定(-x)ではフォルダ名を直接指定のこと(変数だと除外されない)
