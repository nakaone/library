#!/bin/sh
# -x  つけるとverbose
# reference: Auth, BurgerMenu, camp2024/client
set -e # エラー時点で停止

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n===============================================\n"
echo "\n$hr`date +"%T"` [Auth] build start$hr"

# 1.1 変数・ツールの定義
echo "`date +"%T"` - step.1.1 start."
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
mod="$lib/Auth/2.0.0"
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
# 入力ソース
src="$mod/src"
doc="$mod/doc"

# 1.2 .DS_storeの全削除
echo "`date +"%T"` - step.1.2 start."
cd $mod
find . -name '.DS_Store' -type f -ls -delete

# 1.3 中間・最終成果物の原型をtmpに作成
echo "`date +"%T"` - step.1.3 start."
core="$tmp/core.js"; touch $core
pipe="$tmp/pipe.js"; touch $pipe
clSrc="$tmp/client.js"; touch $clSrc # 最終成果物
clDoc="$tmp/client.md"; touch $clDoc   # JSDoc
svSrc="$tmp/server.js"; touch $svSrc
svDoc="$tmp/server.md"; touch $svDoc
readme="$tmp/readme.md"; touch $readme

# 1.4 使用するクラスを最新化
#echo "`date +"%T"` - step.1.4 start."
$lib/BurgerMenu/1.2.0/build.sh
#$lib/SingleTableClient/1.0.0/build.sh

# 1.5 関数定義
echo "`date +"%T"` - step.1.5 start."
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
# 2. server.gs(class authServer)の作成
# ----------------------------------------------
# 2.1 ソースの作成
echo "`date +"%T"` - step.2.1 start."
cat $src/server.js | awk 1 | $embed -src:$src >> $svSrc
cp $svSrc $mod/server.gs

# 2.3 JSDocの作成
echo "`date +"%T"` - step.2.3 start."
# sedはjsdoc2mdの冒頭4行削除用(強制付加されるtitle,a nameタグの削除)
jsdoc2md $svSrc | sed '1,4d' >> $svDoc

# 2.4 ソースを仕様書埋込用に修正
echo "`date +"%T"` - step.2.4 start."
rm -f $w01; touch $w01;
addSource "server.gs" $svSrc $w01
cp $w01 $svSrc

# ----------------------------------------------
# 3. initialize.gs(初期化処理)の作成
# ----------------------------------------------
cp $src/initialize.js $mod/initialize.gs

# ----------------------------------------------
# 4. client.js(class authClient)の作成
# ----------------------------------------------
echo "`date +"%T"` - step.4.1 start."
cat $src/client.js | awk 1 | $embed -src:$src >> $clSrc
cp $clSrc $mod/client.js

# 4.2 JSDocの作成
echo "`date +"%T"` - step.4.2 start."
# sedはjsdoc2mdの冒頭4行削除用(強制付加されるtitle,a nameタグの削除)
jsdoc2md $clSrc | sed '1,4d' >> $clDoc

# 4.3 ソースを仕様書埋込用に修正
echo "`date +"%T"` - step.4.3 start."
rm -f $w01; touch $w01;
addSource "client.js" $clSrc $w01
cp $w01 $clSrc

# ----------------------------------------------
# 5. 仕様書の作成
# ----------------------------------------------

# 5.1 readmeのプロトタイプに外部ファイルを挿入
echo "`date +"%T"` - step.5.1 start."
cat $doc/proto.md | awk 1 \
| $embed -lib:$lib -doc:$doc -tmp:$tmp \
> $readme

# 5.2 MDの見出しを採番、結果を最終成果物として出力
echo "`date +"%T"` - step.5.2 start."
cat $readme | awk 1 | $modify > $mod/readme.md

echo "\n$hr`date +"%T"` [Auth] build end$hr"