#!/bin/sh
# -x  つけるとverbose

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n=======================================\n"
echo "\n$hr[BurgerMenu] build start$hr"

# 1.1 変数・ツールの定義
echo "`date +"%T"` - BurgerMenu: step.1.1 start."
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
mod="$lib/BurgerMenu/1.2.1"
# ツール
embed="node $lib/embedRecursively/1.1.0/pipe.js"
esed="node $lib/esed/1.0.0/pipe.js"
modify="node $lib/modifyMD/1.0.0/pipe.js"
querySelector="node $lib/querySelector/2.0.0/core.js"
# 作業用フォルダの準備
tmp="$mod/tmp";
if [ ! -d $tmp ]; then
  mkdir $tmp
else 
  rm -rf $tmp/*
fi
w01="$tmp/work01"; touch $w01
w02="$tmp/work02"; touch $w02
w03="$tmp/work03"; touch $w03

# 1.2 .DS_storeの全削除
echo "`date +"%T"` - BurgerMenu: step.1.2 start."
cd $mod
find .. -name '.DS_Store' -type f -ls -delete

# 1.5 関数定義
echo "`date +"%T"` - BurgerMenu: step.1.5 start."
# addSource : プログラムソースを追加
# {string} $1 - プログラムソース名(MD上のラベル)
# {string} $2 - プログラムソースのフルパス
# {string} $3 - 成果物の【追加】先ファイル名
addSource(){
  echo "addSource '$1' start."
  cat << EOS >> $3
<details><summary>$1</summary>

\`\`\`
`cat $2 | awk 1`
\`\`\`

</details>

EOS
}

# ----------------------------------------------
# 5. 仕様書の作成
# ----------------------------------------------
# 5.1 jsdoc2mdで追加される行は除外してmd作成
echo "`date +"%T"` - BurgerMenu: step.5.1 start."
jsdoc2md $mod/core.js | sed '1,4d' > $tmp/jsdoc.md

# 5.2 プログラムソースの作成
echo "`date +"%T"` - BurgerMenu: step.5.2 start."
source="$tmp/source.md"; touch $source
addSource "class BurgerMenu" $mod/core.js $source

# 5.2 readme.mdを作成
echo "`date +"%T"` - BurgerMenu: step.5.3 start."
cat $mod/proto.md | awk 1 \
| $embed -lib:$lib -tmp:$tmp \
| $modify > $mod/readme.md

echo "\n$hr[BurgerMenu] build end$hr"