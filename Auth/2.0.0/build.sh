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
w01="$tmp/work01";w02="$tmp/work02";w03="$tmp/work03"
# 入力ソース
client="$mod/client"
server="$mod/server"
doc="$mod/doc"

# 1.2 .DS_storeの全削除
echo "`date +"%T"` - step.1.2 start."
cd $mod
find . -name '.DS_Store' -type f -ls -delete

# 1.3 中間・最終成果物の原型をtmpに作成
echo "`date +"%T"` - step.1.3 start."
core="$tmp/core.js"; touch $core
pipe="$tmp/pipe.js"; touch $pipe
jsdoc="$tmp/jsdoc.md"; touch $jsdoc
source="$tmp/source.md"; touch $source
readme="$tmp/readme.md"; touch $readme

# 1.4 使用するクラスを最新化
#echo "`date +"%T"` - step.1.4 start."
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
# 2. pipe.jsの生成
# ----------------------------------------------

# ----------------------------------------------
# 3. server.gsの作成
# ----------------------------------------------

# ----------------------------------------------
# 4. index.htmlの作成
# ----------------------------------------------

# ----------------------------------------------
# 5. 仕様書の作成
# ----------------------------------------------
echo "`date +"%T"` - step.5 start."
rm $mod/readme.md # 旧版があれば削除

# 5.1 JSDocを作成
# sedはjsdoc2mdの冒頭4行削除用(強制付加されるtitle,a nameタグの削除)
#echo "`date +"%T"` - step.5.1 start."
#jsdoc2md $script | sed '1,4d' > $jsdoc

# 5.2 ソース部分を作成
#echo "`date +"%T"` - step.5.2 start."
#addSource "core.js" $mod/client/core.js $source

# 5.3 readmeのプロトタイプに外部ファイルを挿入
echo "`date +"%T"` - step.5.3 start."
cat $doc/proto.md | awk 1 \
| $embed -lib:$lib -doc:$doc -tmp:$tmp \
> $readme

# 5.4 MDの見出しを採番、結果を最終成果物として出力
echo "`date +"%T"` - step.5.4 start."
cat $readme | awk 1 | $modify > $mod/readme.md

echo "\n$hr`date +"%T"` [Auth] build end$hr"
echo "##### 注意：BurgerMenu/2.0.0は内容移行後、削除のこと #####\n"

# ===== 以降、バックアップ ===============

## 1.3 最終成果物の原型をtmpに作成
#echo "step.1.3 start."
## 1.3.1 core.js
#proto="$tmp/proto.js"
#cp $client/proto.js $proto
## 1.3.2 readme.md
#readme="$tmp/readme.md"
## 共通CSSを先頭に追加(esedでCSS内のコメントを削除)、原型を埋め込み
#cat << EOS > $readme
#<style scoped type="text/css">
#`cat $lib/CSS/1.3.0/core.css | awk 1 | $esed -x:"\/\*[\s\S]*?\*\/\n*" -s:""`
#</style>
#`cat $doc/proto.md`
#EOS
#
## 1.4 終端位置指定文字列の定義
#echo "step.1.4 start."
#mdBar="<!--::MenuBar::-->"
#eoMethods="//::methods_add_here::"
#mdArticles="<!--::articles::-->"
#mdJSDoc="<!--::JSDoc::-->"
#mdSource="<!--::source::-->"
#
## 1.5 関数定義
#echo "step.1.5 start."
## addMethod : core.jsにメソッドを追加
#addMethod(){
#  # {string} $1 - 追加するメソッド名
#  echo "addMethod '$1' start."
#  cat $client/$1.js | awk 1 | sed "s/^/  /" > $w01
#  echo $eoMethods >> $w01
#  cat $proto | awk 1 | $esed -x:$eoMethods -f:$w01 > $w02
#  cp $w02 $proto
#}
#
## addArticle : 解説記事のclient.mdへの埋め込み
#addArticle(){
#  # {string} $1 - 解説記事ファイル名
#  # {string} $2 - ローカルリンクのラベル
#  # {string} $3 - 解説記事のタイトル
#  # {string} $4 - 埋込先ファイル名
#  echo "addArticle '$3' start."
#  menubar="$menubar | [$3](#$2)"
#  echo $mdBar >> $4
#  echo "<a name=\"$2\"></a>" >> $4
#  cat $1 | awk 1 >> $4
#  echo "" >> $4
#}
#
## addConfig : configファイルのソースをMarkdownとして作成
#addConfig(){
#  # {string} $1 - タイトル
#  # {string} $2 - ファイル名
#  # {string} $3 - ソース追加先のファイル名
#  echo "addConfig '$1' start."
#  cat << EOS >> $3
#### $1
#
#\`\`\`
#`cat $2 | awk 1`
#\`\`\`
#
#EOS
#}
#
## ----------------------------------------------
## 2. core.jsへのメソッドの埋め込み
## ----------------------------------------------
#echo "step.2 start."
#addMethod constructor
#addMethod setProperties
#
#
## ----------------------------------------------
## 3. 終了処理
## ----------------------------------------------
#echo "step.3 start."
## 3.1 終端位置指定文字列の削除
#cat $proto | $esed -x:"<!--::.+::-->" -s:"" \
#| $esed -x:"\/\/::.+::" -s:"" \
#| $esed -x:"\/\*::.+::\*\/" -s:"" \
#> $w01; cp $w01 $proto
## 3.2 行末の空白を削除
#cat $proto | sed 's/ *$//' > $w01; cp $w01 $proto
## 3.3 連続する改行コードを単一に
#cat $proto | tr -s "\n" > $w01; cp $w01 $proto
## 3.4 core.jsを更新
#cp $proto $mod/core.js
#
#
## ----------------------------------------------
## 4. 仕様書の作成
## ----------------------------------------------
## 4.1 JSDocを作成、プロトタイプに埋め込む
#echo "step.4.1 start."
#jsdoc2md $proto > $w01
#cat $readme | awk 1 | $esed -x:$mdJSDoc -f:$w01 > $w02; cp $w02 $readme
#
## 4.4 解説記事をプロトタイプに埋め込みつつ、メニューバー文字列を作成
#echo "step.4.4 start."
#menubar="[先頭](#top)"
#echo "" > $w01  # 埋込結果を保持するワーク
## 4.4.1 別ソースからの埋め込みが必要な解説記事
#rm $w02; touch $w02
#addConfig "2.1 client/server共通部分" $client/commonConfig.js $w02
#addConfig "2.2 client特有部分" $client/clientConfig.js $w02
#addConfig "2.3 server特有部分" $server/serverConfig.js $w02
#cat $doc/useage.md | awk 1 | \
#$esed -x:"\/\/::config::" -f:$w02 > $w03
#addArticle $w03 useage "使用方法" $w01
## 4.4.2 埋め込み不要の解説記事
#addArticle $doc/deliverables.md deliverables "生成されるナビ" $w01
#addArticle $doc/auth.md authorization "認証の手順" $w01
#
## 4.5 解説記事・メニューバー文字列を置換
#echo "step.4.5 start."
#cat $readme | awk 1 | $esed -x:$mdArticles -f:$w01 > $w02; cp $w02 $readme
#menubar="$menubar | [仕様(JSDoc)](#jsdoc) | [プログラムソース](#program_source) | [改版履歴](#revision_history)"
#cat $readme | awk 1 | sed -E "s/$mdBar/$menubar/g" > $w02; cp $w02 $readme
#
## 4.6 tmp/readme.mdを$mod直下にコピー
#echo "step.4.6 start."
#cp $readme $mod/readme.md
