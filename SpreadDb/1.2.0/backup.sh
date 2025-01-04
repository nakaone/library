#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止

# パスの定義
Desktop="/Users/ena.kaon/Desktop"
GitHub="$Desktop/GitHub"
lib="$GitHub/library"
prj="$lib/SpreadDb/1.1.0"
now=`date +"%Y%m%d-%H%M"`
log="$prj/tmp/$now"

# .DS_storeの全削除
find $GitHub -name '.DS_Store' -type f -ls -delete

# log配下に保存するファイルを集約
mkdir -p $log
array=(doc src)
for d in "${array[@]}"; do
  echo $d
  mkdir -p "$log/$d"
  cp $prj/$d/* $log/$d/
done
cp $prj/*.js $log
cp $prj/*.sh $log

# archives配下にzip作成
cd $log
zip -r $prj/archives/$now.zip ./
