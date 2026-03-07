#!/usr/bin/env zsh

Desktop="/Users/ena.kaon/Desktop"
GitHub="$Desktop/GitHub"
lib="$GitHub/library"
prj="$lib/underDev/Auth"
arc="$prj/archives"

find $GitHub -name '.DS_Store' -type f -ls -delete

cd $prj
zip -r $arc/`date +"%Y%m%d"`.zip ./ -x "archives/*" "node_modules/*" "tmp/*"
# 除外指定(-x)ではフォルダ名を直接指定のこと(変数だと除外されない)
