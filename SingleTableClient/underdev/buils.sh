#!/bin/sh
# -x  つけるとverbose

echo "\n\n\n\n\n[SingleTableClient] build start"

# .DS_storeの全削除
find .. -name '.DS_Store' -type f -ls -delete

lib="/Users/ena.kaon/Desktop/GitHub/library"
esed="$lib/esed/1.0.0/core.js"
mod="$lib/SingleTableClient/underdev"
readme=$mod/readme.md
tmp="$mod/tmp"
rm -rf $tmp
mkdir $tmp

# -------------------------------------------
# readme.mdの作成
# -------------------------------------------
# 標準CSSを用意(コメントはesedで除外)
echo "<style type=\"text/css\">" > $readme
cat $lib/CSS/1.3.0/core.css | awk 1 \
| node $esed -x:"\/\*[\s\S]*?\*\/\n*" -s:"" >> $readme
echo "</style>\n\n" >> $readme
# proto/readme.mdを追加
cat $mod/proto/readme.md >> $readme