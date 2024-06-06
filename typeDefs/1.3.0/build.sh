#!/bin/sh
# -x  つけるとverbose
# reference: Auth
set -e # エラー時点で停止

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n===============================================\n"
echo "\n$hr`date +"%T"` [typeDefs] build start$hr"

# 1.1 変数・ツールの定義
echo "`date +"%T"` - typeDefs: step.1.1 start."
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
mod="$lib/typeDefs/1.3.0"
src="$mod/src"
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

# 1.2 .DS_storeの全削除
echo "`date +"%T"` - typeDefs: step.1.2 start."
cd $mod
find . -name '.DS_Store' -type f -ls -delete

## 1.3 中間・最終成果物の原型をtmpに作成
echo "`date +"%T"` - typeDefs: step.1.3 start."

# 1.4 使用するクラスを最新化
echo "`date +"%T"` - typeDefs: step.1.4 start."
#$lib/SingleTable/1.2.0/build.sh

# 1.5 関数定義
echo "`date +"%T"` - typeDefs: step.1.5 start."
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
echo "`date +"%T"` - typeDefs: step.3.1 start."
cat $src/doGet.js | awk 1 > $tmp/server.js
#cat $lib/SingleTable/1.2.0/core.js | awk 1 >> $tmp/server.js
# 最終成果物の作成
cp $tmp/server.js $mod/server.gs
## JSDocの作成
# sedはjsdoc2mdの冒頭4行削除用(強制付加されるtitle,a nameタグの削除)
#jsdoc2md $svSource | sed '1,4d' > $svDoc

# ----------------------------------------------
# 4. クライアント側ソースの作成(index.html)
# ----------------------------------------------
# 4.1 proto.htmlへの埋込前処理
# 4.2 script部分の作成
# 4.3 onload部分の作成
## JSDocの作成
#clDoc="$tmp/client.md"
#cat $clScript $clOnload > $tmp/client.js
# sedはjsdoc2mdの冒頭4行削除用(強制付加されるtitle,a nameタグの削除)
#jsdoc2md $tmp/client.js | sed '1,4d' > $clDoc

# onload.jsはインデント
cat $src/onload.js | awk 1 | sed -E "s/^/    /g" > $tmp/onload.js

# 4.4 proto.htmlへの埋め込み
echo "`date +"%T"` - typeDefs: step.4.4 start."
cat $src/proto.html | awk 1 \
| $embed -lib:$lib -src:$src -tmp:$tmp > $mod/index.html

## ----------------------------------------------
## 5. 仕様書の作成
## ----------------------------------------------
## 5.1 readmeのプロトタイプに外部ファイルを挿入
#echo "`date +"%T"` - typeDefs: step.5.1 start."
#cat $doc/proto.md | awk 1 \
#| $embed -lib:$lib -doc:$doc -tmp:$tmp -mod:$mod \
#> $readme
#
## 5.2 MDの見出しを採番、結果を最終成果物として出力
#echo "`date +"%T"` - typeDefs: step.5.2 start."
#cat $readme | awk 1 | $modify > $mod/readme.md

echo "\n$hr[typeDefs] build end$hr"