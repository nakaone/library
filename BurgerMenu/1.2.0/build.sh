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
mod="$lib/BurgerMenu/1.1.0"
esed="node $lib/esed/1.0.0/core.js"

# 1.2 .DS_storeの全削除
cd $mod
find .. -name '.DS_Store' -type f -ls -delete

# 1.3 tmpの用意
#rm -rf $mod/tmp
#mkdir $mod/tmp
#tmp="$mod/tmp"

# 1.4 使用するクラスを最新化
#$lib/SingleTableClient/1.0.0/build.sh


# ----------------------------------------------
# 2. index.htmlの作成
# ----------------------------------------------
# 2.1 CSS部分

# 2.2 html部分
#work="$tmp/index.html"
#cp $src/static/index.header.html $work
#list=(
#  実施要領
#  注意事項
#  持ち物リスト
#)
#for x in ${list[@]}; do
#  echo "<div name=\"$x\">\n" >> $work
#  cat $src/static/$x.md | marked >> $work
#  echo "</div>\n\n" >> $work
#done
#cat $src/templates/origin.html \
#| node $esed -x:"\/\*::CSS::\*\/" -f:$lib/CSS/1.3.0/core.css \
#| node $esed -x:"<!--::body::-->" -f:$work \
#> $src/index.html

# 2.3 script部分

# ----------------------------------------------
# 3. server.gsの作成
# ----------------------------------------------


# ----------------------------------------------
# 4. 仕様書の作成
# ----------------------------------------------
readme="$mod/readme.md"
# 標準CSSを追加(コメントはesedで除外)
echo "<style scoped type=\"text/css\">" > $readme
cat $lib/CSS/1.3.0/core.css | awk 1 \
| $esed -x:"\/\*[\s\S]*?\*\/\n*" -s:"" >> $readme
echo "</style>\n\n" >> $readme

# proto/readme.mdを追加
# jsdoc2mdで追加される行は除外してmd作成
jsdoc2md $mod/core.js | sed '1,4d' > $mod/core.md
cat $mod/proto.md \
| $esed -x:"__JSDoc" -f:$mod/core.md \
| $esed -x:"__source" -f:$mod/core.js \
| $esed -x:"__test" -f:$mod/test.html \
| $esed -x:"__build" -f:$mod/build.sh \
>> $readme


echo "\n$hr[BurgerMenu] build end$hr"



# ----------------------------------------------
# 参考：関数化、if文
# ----------------------------------------------

#makeJSDoc(){
#  base=$1
#  type=$2
#  if [ -n $3 ]; then # 入力フォルダ名指定あり
#    iFile=$3/$base
#  else               # 入力フォルダ名指定なし
#    iFile=$base
#  fi
#}
## makeJSDoc ベースファイル名 タイプ 入力フォルダ名 出力フォルダ名
#makeJSDoc css css $iDir $dDir