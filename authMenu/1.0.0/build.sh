#!/bin/sh
# -x  つけるとverbose
# reference: authMenu, authMenu, camp2024/client
set -e # エラー時点で停止

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
bName="authMenu"
hr="\n===============================================\n"
echo "\n$hr`date +"%T"` [$bName] build start$hr"

# 1.1 変数・ツールの定義
echo "`date +"%T"` - [$bName] step.1.1 start."
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
mod="$lib/authMenu/1.0.0"
# ツール
embed="node $lib/embedRecursively/1.1.0/pipe.js"
esed="node $lib/esed/1.0.0/pipe.js"
modify="node $lib/modifyMD/1.1.0/pipe.js"
querySelector="node $lib/querySelector/2.0.0/core.js"
# 作業用フォルダの準備
tmp="$mod/tmp";
if [ ! -d $tmp ]; then
  mkdir $tmp
else 
  rm -rf $tmp/*
fi
# 入力ソース
src="$mod/src"
doc="$mod/doc"

# 1.2 .DS_storeの全削除
echo "`date +"%T"` - [$bName] step.1.2 start."
cd $mod
find . -name '.DS_Store' -type f -ls -delete

# 1.3 中間・最終成果物の原型をtmpに作成
#echo "`date +"%T"` - step.1.3 start."
#core="$tmp/core.js"; touch $core
#pipe="$tmp/pipe.js"; touch $pipe
#clSource="$tmp/client.js"; touch $clSource # 最終成果物
#clDoc="$tmp/client.md"; touch $clDoc   # JSDoc
#svSource="$tmp/server.js"; touch $svSource
#svDoc="$tmp/server.md"; touch $svDoc

# 1.4 使用するクラスを最新化
echo "`date +"%T"` - [$bName] step.1.4 start."
$lib/SingleTable/1.2.0/build.sh

# 1.5 関数定義
echo "`date +"%T"` - [$bName] step.1.5 start."
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
# 2. setProperties.gsの作成
# ----------------------------------------------
echo "`date +"%T"` - [$bName] step.2 start."
cp $src/setProperties.js $mod/setProperties.gs

# ----------------------------------------------
# 3. server.gs(authFront, authServer)の作成
# ----------------------------------------------
## メソッドのソースはインデント
#cat $src/onload.js | awk 1 | sed -E "s/^/    /g" > $tmp/onload.js

## 3.1 ソースの作成
#echo "`date +"%T"` - [$bName] step.3.1 start."
#cat $src/server.js | awk 1 | $embed -src:$src >> $svSource
#cp $svSource $mod/server.gs
## server: setProperties.gs
#cat $src/server.setProperties.js | awk 1 >> $svSource 
#cp $src/server.setProperties.js $mod/setProperties.gs

## 3.3 JSDocの作成
#echo "`date +"%T"` - [$bName] step.3.3 start."
## sedはjsdoc2mdの冒頭4行削除用(強制付加されるtitle,a nameタグの削除)
#jsdoc2md $svSource | sed '1,4d' >> $svDoc

## 3.4 仕様書埋込用にソースをdetailタグで囲む
#echo "`date +"%T"` - [$bName] step.3.4 start."
#w24="$tmp/w24"; touch $w24;
#addSource "server.gs" $svSource $w24
#cp $w24 $svSource



# ----------------------------------------------
# 4. client.js(class authMenu)の作成
# ----------------------------------------------
echo "`date +"%T"` - [$bName] step.4.1 start."
# 4.1 メソッドのソースはインデント
cat $src/authMenu.setProperties.js | awk 1 | sed -E "s/^/  /g" \
> $tmp/authMenu.setProperties.js
cat $src/authMenu.storeUserInfo.js | awk 1 | sed -E "s/^/  /g" \
> $tmp/authMenu.storeUserInfo.js

# 4.2 class authMenuのソースを作成
echo "`date +"%T"` - [$bName] step.4.2 start."
cat $src/authMenu.constructor.js | awk 1 \
| $embed -tmp:$tmp > $mod/client.js

# 4.2 JSDocの作成
echo "`date +"%T"` - [$bName] step.4.3 start."
# sedはjsdoc2mdの冒頭4行削除用(強制付加されるtitle,a nameタグの削除)
jsdoc2md $mod/client.js | sed '1,4d' > $tmp/client.md

# 4.3 仕様書埋込用にソースをdetailタグで囲む
#echo "`date +"%T"` - [$bName] step.4.4 start."
#w43="$tmp/w43"
#addSource "client.js" $clSource $w43
#cp $w43 $clSource

# ----------------------------------------------
# 5. 仕様書の作成
# ----------------------------------------------

# 5.1 readmeのプロトタイプに外部ファイルを挿入
#echo "`date +"%T"` - step.5.1 start."
#readme="$tmp/readme.md"; touch $readme
#cat $doc/proto.md | awk 1 \
#| $embed -lib:$lib -doc:$doc -tmp:$tmp \
#> $readme

# 5.2 MDの見出しを採番、結果を最終成果物として出力
#echo "`date +"%T"` - step.5.2 start."
#cat $readme | awk 1 | $modify > $mod/readme.md

echo "\n$hr`date +"%T"` [$bName] build end$hr"