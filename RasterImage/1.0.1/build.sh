#!/bin/sh
# -x  つけるとverbose

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n=======================================\n"
echo "\n$hr[RasterImage] build start$hr"

# 1.1 変数・ツールの定義
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
mod="$lib/RasterImage/1.0.1"
esed="node $lib/esed/1.0.0/core.js"

# 1.2 .DS_storeの全削除
cd $mod
find . -name '.DS_Store' -type f -ls -delete

# 1.3 tmpの用意
rm -rf $mod/tmp
mkdir $mod/tmp
tmp="$mod/tmp"

# 1.4 使用するクラスを最新化
#$lib/SingleTableClient/1.0.0/build.sh


# ----------------------------------------------
# 2. server.gsの作成
# ----------------------------------------------
rm $mod/server.gs # 旧版があれば削除
cp $mod/server.js $mod/server.gs


# ----------------------------------------------
# 3. index.htmlの作成
# ----------------------------------------------
rm $mod/index.html # 旧版があれば削除
# 3.1 CSS部分
css="$tmp/index.css"
touch $css

# 3.2 html部分
html="$tmp/index.html"
touch $html
#cp $src/static/index.header.html $html
#list=(
#  実施要領
#  注意事項
#  持ち物リスト
#)
#for x in ${list[@]}; do
#  echo "<div name=\"$x\">\n" >> $html
#  cat $src/static/$x.md | marked >> $html
#  echo "</div>\n\n" >> $html
#done
#cat $src/templates/origin.html \
#| node $esed -x:"\/\*::CSS::\*\/" -f:$lib/CSS/1.3.0/core.css \
#| node $esed -x:"<!--::body::-->" -f:$html \
#> $src/index.html

# 3.3 script部分
script=$tmp/index.js
cat $lib/BasePage/1.1.0/core.js | awk 1 > $script #BasePage 1.0.0?
cat $mod/core.js | awk 1 >> $script

# 3.4 index.htmlプロトタイプのCSS/html/script部分を置換
cat $mod/proto.html \
| $esed -x:"\/\*::css::\*\/" -f:$css \
| $esed -x:"<!--::html::-->" -f:$html \
| $esed -x:"\/\/::script::" -f:$script \
> $mod/index.html


# ----------------------------------------------
# 4. 仕様書の作成
# ----------------------------------------------
rm $mod/readme.md # 旧版があれば削除
readme="$tmp/readme.md"
# 4.1 tmp/readme.mdに標準CSS＋プロトタイプを作成(CSSのコメントはesedで除外)
echo "<style scoped type=\"text/css\">" > $readme
cat $lib/CSS/1.3.0/core.css | awk 1 \
| $esed -x:"\/\*[\s\S]*?\*\/\n*" -s:"" >> $readme
echo "</style>\n\n" >> $readme
cat $mod/proto.md >> $readme

# 4.2 JSDocを作成
jsdoc="$tmp/jsdoc.md"
# sedはjsdoc2mdの冒頭4行削除用(強制付加されるtitle,a nameタグの削除)
jsdoc2md $mod/core.js | sed '1,4d' > $jsdoc

# 4.3 ソース部分を作成
source="$tmp/source.md"
touch $source
# 4.3.1 関数定義：ソースファイルのmdへの追加
addSource(){
  src=$1  # ソースファイル名
  if [ $# -lt 2 ]; then # 引数の数が2未満
    name=$1 # name未指定ならソースファイル名で表示
  else
    name=$2 # name指定ありなら指定文字列で表示
  fi
  #echo "<a href=\"#top\" style=\"text-align:right\">先頭へ</a>\n" >> $source
  echo "<details><summary>$name</summary>\n\n\`\`\`" >> $source
  cat $src | awk 1 >> $source
  echo "\n\`\`\`\n\n</details>\n\n" >> $source
}
# 4.3.2 必要なソースを順次追加
addSource $mod/core.js core.js
addSource $mod/index.html index.html
addSource $mod/server.js server.gs
#addSource $mod/test.html
addSource $mod/build.sh build.sh

# 4.4 readme.mdプロトタイプのJSDoc/source部分を置換
cat $readme \
| $esed -x:"__JSDoc" -f:$jsdoc \
| $esed -x:"__source" -f:$source \
>> $mod/readme.md


echo "\n$hr[RasterImage] build end$hr"