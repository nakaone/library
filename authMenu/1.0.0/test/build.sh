#!/bin/sh
# -x  つけるとverbose
# reference: Auth
set -e # エラー時点で停止

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n===============================================\n"
echo "\n$hr`date +"%T"` [camp2024] build start$hr"

# 1.1 変数・ツールの定義
echo "`date +"%T"` - camp2024: step.1.1 start."
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
mod="$GitHub/library/authMenu/1.0.0/test"
# ツール
embed="node $lib/embedRecursively/1.1.0/pipe.js"
esed="node $lib/esed/1.0.0/core.js"
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
user="$mod/user"

# 1.2 .DS_storeの全削除
echo "`date +"%T"` - camp2024: step.1.2 start."
cd $mod
find . -name '.DS_Store' -type f -ls -delete

## 1.3 中間・最終成果物の原型をtmpに作成
#echo "`date +"%T"` - camp2024: step.1.3 start."
#core="$tmp/core.js"; touch $core
#pipe="$tmp/pipe.js"; touch $pipe
#clSrc="$tmp/client.html"; touch $clSrc # 最終成果物
#clDoc="$tmp/client.md"; touch $clDoc   # JSDoc
#svSource="$tmp/server.js"; touch $svSource
#svDoc="$tmp/server.md"; touch $svDoc
#initSrc="$tmp/initialize.js"; touch $initSrc
#initDoc="$tmp/initialize.md"; touch $initDoc
#readme="$tmp/readme.md"; touch $readme

# 1.4 使用するクラスを最新化
echo "`date +"%T"` - camp2024: step.1.4 start."
$lib/authMenu/1.0.0/build.sh

# 1.5 関数定義
echo "`date +"%T"` - camp2024: step.1.5 start."
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
# 2. pipe.jsの生成
# ----------------------------------------------

# shellソースをMDに埋め込むと、コメント用の"#"を段落と看做してしまうためエスケープ
#cat $mod/build.sh | awk 1 | sed -E "s/^/  /g" > $tmp/build.sh

# ----------------------------------------------
# 3. サーバ側ソースの作成(server.gs)
# ----------------------------------------------
echo "`date +"%T"` - camp2024: step.3.2 start."
svSource="$tmp/server.js"
svDoc="$tmp/server.md"
cat $src/doGet.js | awk 1 > $svSource
cat $lib/cryptico/cryptico.min.gs | awk 1 >> $svSource
cat $lib/mergeDeeply/1.1.0/core.js | awk 1 >> $svSource
cat $lib/stringify/1.1.1/core.js | awk 1 >> $svSource
cat $lib/whichType/1.0.1/core.js | awk 1 >> $svSource
# 最終成果物の作成
cp $svSource $mod/server.gs
## JSDocの作成
# sedはjsdoc2mdの冒頭4行削除用(強制付加されるtitle,a nameタグの削除)
jsdoc2md $svSource | sed '1,4d' > $svDoc

# ----------------------------------------------
# 4. クライアント側ソースの作成(index.html)
# ----------------------------------------------
# 4.1 proto.htmlへの埋込前処理
# 4.11 Markdown文書をhtml化
echo "`date +"%T"` - camp2024: step.4.11 start."
list=(
  実施要領
  注意事項
  持ち物リスト
)
for x in ${list[@]}; do
  cat $user/$x.md | marked > $tmp/$x.html
done
# 4.12 会場案内図
echo "`date +"%T"` - camp2024: step.4.12 start."
cat $user/map2023.svg \
| $esed -x:" style=\"position: fixed; top: 0px; left: 0px;\"" -s:"" \
> $tmp/map2023.svg # svg内の画像を固定する指定は削除
# 4.13 システム設定
echo "`date +"%T"` - camp2024: step.4.13 start."
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
echo "`date +"%T"` - camp2024: step.4.2 start."
clScript="$tmp/script.js"
cat $lib/authMenu/1.0.0/client.js | awk 1 > $clScript
cat $lib/cryptico/cryptico.min.js | awk 1 >> $clScript
cat $lib/changeScreen/1.1.0/core.js | awk 1 >> $clScript
cat $lib/createElement/1.2.1/core.js | awk 1 >> $clScript
cat $lib/mergeDeeply/1.1.0/core.js | awk 1 >> $clScript
cat $lib/stringify/1.1.1/core.js | awk 1 >> $clScript
cat $lib/whichType/1.0.1/core.js | awk 1 >> $clScript
cat $clScript | awk 1 > $tmp/script.js

# 4.3 onload部分の作成
echo "`date +"%T"` - camp2024: step.4.3 start."
clOnload="$tmp/onload.js"
touch $clOnload

## JSDocの作成
clDoc="$tmp/client.md"
cat $clScript $clOnload > $tmp/client.js
# sedはjsdoc2mdの冒頭4行削除用(強制付加されるtitle,a nameタグの削除)
jsdoc2md $tmp/client.js | sed '1,4d' > $clDoc

# 4.4 proto.htmlへの埋め込み
echo "`date +"%T"` - camp2024: step.4.4 start."
cat $user/proto.html | awk 1 \
| $embed -lib:$lib -tmp:$tmp -user:$user -src:$src > $mod/index.html

## ----------------------------------------------
## 5. 仕様書の作成
## ----------------------------------------------
## 5.1 readmeのプロトタイプに外部ファイルを挿入
#echo "`date +"%T"` - camp2024: step.5.1 start."
#cat $doc/proto.md | awk 1 \
#| $embed -lib:$lib -doc:$doc -tmp:$tmp -mod:$mod \
#> $readme
#
## 5.2 MDの見出しを採番、結果を最終成果物として出力
#echo "`date +"%T"` - camp2024: step.5.2 start."
#cat $readme | awk 1 | $modify > $mod/readme.md

echo "\n$hr[camp2024] build end$hr"