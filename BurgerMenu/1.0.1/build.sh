#!/bin/sh
# -x  つけるとverbose

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n=======================================\n"
echo "\n$hr[BurgerMenu] build start$hr"

# 1.1 変数・ツールの定義
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
esed="$lib/esed/1.0.0/core.js"
mod="$lib/BurgerMenu/1.0.1"
readme="$lib/BurgerMenu/readme.md"

# 1.2 .DS_storeの全削除
cd $mod
find .. -name '.DS_Store' -type f -ls -delete

# 1.3 tmpの用意
rm -rf tmp
mkdir tmp
tmp="tmp"

# 1.4 使用するクラスを最新化
#$lib/SingleTableClient/1.0.0/build.sh

## ----------------------------------------------
## 2. クライアント側(index.html)の作成
## ----------------------------------------------
## 2.1 スタイルシートの統合
#style="$tmp/client.css"
#touch $style
#list=(
#  $lib/CSS/1.3.0/core.css
#  $mod/src/css/BurgerMenu.css
#)
#for scr in ${list[@]}; do
#  cat $scr | awk 1 >> $style
#done
## 2.2 スクリプトの統合
#script="$tmp/client.js"
#touch $script
#list=(
#  $lib/mergeDeeply/1.1.0
#  $lib/stringify/1.1.1
#  $lib/isEqual/1.0.0
#  $lib/doGAS/1.0.0
#  $lib/writeClipboard/1.0.0
#  $lib/createElement/1.2.1
#  $lib/changeScreen/1.0.0
#  $lib/toLocale/1.0.0
#  $lib/whichType/1.0.1
#  $lib/SingleTableClient/1.0.0
#  $mod/src/onLoad
#)
#for scr in ${list[@]}; do
#  cat $scr/core.js | awk 1 >> $script
#done
## 2.3 プロトタイプへの組み込み
#cat $mod/src/proto/index.html | awk 1 \
#| node $esed -f:"/* ::client.css:: */" -r:$style \
#| node $esed -f:"// ::client.js::" -r:$script \
#> $mod/index.html
#
## ----------------------------------------------
## 3. サーバ側スクリプトの作成
## ----------------------------------------------
## 3.1 スクリプトの統合
#server="$tmp/server.js"
#touch $server
#list=(
#  $mod/src/doGet
#  $mod/src/BurgerMenuServer
#  $lib/SingleTable/1.2.0
#  $lib/SingleTableServer/1.0.0
#  $lib/convertNotation/1.0.0
#  $lib/stringify/1.1.1
#  $lib/whichType/1.0.1
#)
#for scr in ${list[@]}; do
#  cat $scr/core.js | awk 1 >> $server
#done
## 3.2 server.gsの作成
#cp $server $mod/server.gs

# ----------------------------------------------
# 4. 仕様書の作成
# ----------------------------------------------
# 標準CSSを用意(コメントはesedで除外)
echo "<style type=\"text/css\">" > $readme
cat $lib/CSS/1.3.0/core.css | awk 1 \
| node $esed -x:"\/\*[\s\S]*?\*\/\n*" -s:"" >> $readme
echo "</style>\n\n" >> $readme
# proto/readme.mdを追加
cat $mod/proto.md >> $readme

jsdoc2md $mod/core.js > $mod/core.md
cat $mod/proto.md \
| node $esed -x:"__JSDoc" -f:$mod/core.md \
| node $esed -x:"__source" -f:$mod/core.js \
| node $esed -x:"__test" -f:$mod/test.js \
| node $esed -x:"__build" -f:$mod/build.sh \
> $mod/../readme.md

#jsdoc2md $script > $tmp/client.md
#jsdoc2md $server > $tmp/server.md
#
#cat $mod/src/proto/readme.md | awk 1 \
#| node $esed -f:"<!--:: client.md ::-->" -r:$tmp/client.md \
#| node $esed -f:"<!--:: client.css ::-->" -r:$script \
#| node $esed -f:"<!--:: client.js ::-->" -r:$script \
#| node $esed -f:"<!--:: server.md ::-->" -r:$tmp/server.md \
#| node $esed -f:"<!--:: server.js ::-->" -r:$server \
#> $mod/readme.md

echo "\n$hr[BurgerMenu] build end$hr"