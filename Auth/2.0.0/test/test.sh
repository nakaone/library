#!/bin/sh
# -x  つけるとverbose
# reference: Auth, BurgerMenu, camp2024/client
set -e # エラー時点で停止

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n===============================================\n"
echo "\n$hr`date +"%T"` [Auth] test start$hr"

# 1.1 変数・ツールの定義
echo "`date +"%T"` - step.1.1 start."
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
mod="$lib/Auth/2.0.0"
test="$mod/test"
# ツール
embed="node $lib/embedRecursively/1.1.0/pipe.js"
esed="node $lib/esed/1.0.0/core.js"
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
# 入力ソース
camp="$GitHub/private/camp2024"
src="$camp/src"
doc="$camp/doc"
user="$camp/user"

# 1.2 .DS_storeの全削除
echo "`date +"%T"` - step.1.2 start."
cd $mod
find . -name '.DS_Store' -type f -ls -delete

# 1.3 中間・最終成果物の原型をtmpに作成
echo "`date +"%T"` - step.1.3 start."
clSrc="$tmp/client.html"; touch $clSrc
svSrc="$tmp/server.js"; touch $svSrc

# 1.4 使用するクラスを最新化
echo "`date +"%T"` - step.1.4 start."
$mod/build.sh

# ----------------------------------------------
# 2. server.gsの作成
# ----------------------------------------------
echo "`date +"%T"` - step.2 start."
cat $test/doGet.js | awk 1 > $svSrc
cat $lib/createPassword/1.0.1/core.js | awk 1 >> $svSrc
cat $lib/cryptico/cryptico.min.gs | awk 1 >> $svSrc
cat $lib/sendmail/1.0.0/core.js | awk 1 >> $svSrc
cat $lib/stringify/1.1.1/core.js | awk 1 >> $svSrc
cat $lib/whichType/1.0.1/core.js | awk 1 >> $svSrc
cat $mod/server.gs | awk 1 >> $svSrc
cp $svSrc $test/server.gs

# ----------------------------------------------
# 3. initialize.gs(初期化処理)の作成
# ----------------------------------------------
echo "`date +"%T"` - step.3 start."
cp $mod/initialize.gs $test/initialize.gs

# ----------------------------------------------
# 4. テスト用index.htmlの作成
# ----------------------------------------------

# 4.1 proto.htmlへの埋込前処理
# 4.11 Markdown文書をhtml化
echo "`date +"%T"` -  step.4.11 start."
list=(
  実施要領
  注意事項
  持ち物リスト
)
for x in ${list[@]}; do
  cat $user/$x.md | marked > $tmp/$x.html
done
# 4.12 会場案内図
echo "`date +"%T"` -  step.4.12 start."
cat $user/map2023.svg \
| $esed -x:" style=\"position: fixed; top: 0px; left: 0px;\"" -s:"" \
> $tmp/map2023.svg # svg内の画像を固定する指定は削除
# 4.13 システム設定
echo "`date +"%T"` -  step.4.13 start."
#cat $user/system.html | $querySelector -key:'style.core' > $w01; echo $eoCSS >> $w01
#cat $proto | awk 1 | $esed -x:$rexCSS -f:$w01 > $w02; cp $w02 $proto
## doc/omatsuri.mdから機能説明の部分を抽出
cat $doc/omatsuri.md | marked | awk 1 \
| $esed -x:"<h1>.+<\/h1>" -s:"" > $tmp/omatsuri.html
## system.htmlからbody部分を抽出
cat $user/system.html \
| $querySelector -key:'[name="wrapper"]' \
| awk 1 > $tmp/system.html

# 4.2 script部分の作成
echo "`date +"%T"` -  step.4.2 start."
cat $lib/Auth/2.0.0/client.js | awk 1 > $w01
cat $lib/BurgerMenu/1.2.0/core.js | awk 1 >> $w01
cat $lib/cryptico/cryptico.min.js | awk 1 >> $w01
cat $lib/changeScreen/1.1.0/core.js | awk 1 >> $w01
cat $lib/createElement/1.2.1/core.js | awk 1 >> $w01
cat $lib/mergeDeeply/1.1.0/core.js | awk 1 >> $w01
cat $lib/stringify/1.1.1/core.js | awk 1 >> $w01
cat $lib/whichType/1.0.1/core.js | awk 1 >> $w01
cat $w01 | awk 1 > $tmp/script.js

# 4.3 onload部分の作成
#echo "`date +"%T"` -  step.4.3 start."
#cp $test/onload.js $tmp/onload.js

# 4.4 proto.htmlへの埋め込み
echo "`date +"%T"` -  step.4.4 start."
cat $test/proto.html | awk 1 \
| $embed -lib:$lib -tmp:$tmp -user:$user -src:$src \
> $test/index.html


echo "\n$hr`date +"%T"` [Auth] test end$hr"
