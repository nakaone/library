#!/bin/sh
# -x  つけるとverbose
# created with reference to camp2024/client/build.sh
set -e # エラー時点で停止

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n=======================================\n"
echo "\n$hr[BurgerMenu] build start$hr"

# 1.1 変数・ツールの定義
echo "step.1.1 start."
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
mod="$lib/BurgerMenu/2.0.0"
src="$mod/src"
doc="$mod/doc"
esed="node $lib/esed/1.0.0/core.js"
querySelector="node $lib/querySelector/2.0.0/core.js"
tmp="$mod/tmp"; rm -rf $tmp/*
w01="$tmp/work01";w02="$tmp/work02";w03="$tmp/work03"

# 1.2 .DS_storeの全削除
echo "step.1.2 start."
cd $mod
find . -name '.DS_Store' -type f -ls -delete

# 1.3 最終成果物の原型をtmpに作成
echo "step.1.3 start."
# 1.3.1 core.js
proto="$tmp/proto.js"
cp $src/proto.js $proto
# 1.3.2 readme.md
readme="$tmp/readme.md"
# 共通CSSを先頭に追加(esedでCSS内のコメントを削除)、原型を埋め込み
cat << EOS > $readme
<style scoped type="text/css">
`cat $lib/CSS/1.3.0/core.css | awk 1 | $esed -x:"\/\*[\s\S]*?\*\/\n*" -s:""`
</style>
`cat $doc/proto.md`
EOS

# 1.4 終端位置指定文字列の定義
echo "step.1.4 start."
mdBar="<!--::MenuBar::-->"
eoMethods="//::methods_add_here::"
mdArticles="<!--::articles::-->"
mdJSDoc="<!--::JSDoc::-->"
mdSource="<!--::source::-->"

# 1.5 関数定義
echo "step.1.5 start."
# addMethod : core.jsにメソッドを追加
addMethod(){
  # {string} $1 - 追加するメソッド名
  echo "addMethod '$1' start."
  cat $src/$1.js | awk 1 | sed "s/^/  /" > $w01
  echo $eoMethods >> $w01
  cat $proto | awk 1 | $esed -x:$eoMethods -f:$w01 > $w02
  cp $w02 $proto
}

# addArticle : 解説記事のclient.mdへの埋め込み
addArticle(){
  # {string} $1 - 解説記事ファイル名
  # {string} $2 - ローカルリンクのラベル
  # {string} $3 - 解説記事のタイトル
  echo "addArticle '$3' start."
  menubar="$menubar | [$3](#$2)"
  echo $mdBar >> $w01
  echo "<a name=\"$2\"></a>" >> $w01
  cat $1 | awk 1 >> $w01
  echo "" >> $w01
}


# ----------------------------------------------
# 2. core.jsへのメソッドの埋め込み
# ----------------------------------------------
echo "step.2 start."
addMethod constructor
addMethod setProperties


# ----------------------------------------------
# 3. 終了処理
# ----------------------------------------------
echo "step.3 start."
# 3.1 終端位置指定文字列の削除
cat $proto | $esed -x:"<!--::.+::-->" -s:"" \
| $esed -x:"\/\/::.+::" -s:"" \
| $esed -x:"\/\*::.+::\*\/" -s:"" \
> $w01; cp $w01 $proto
# 3.2 行末の空白を削除
cat $proto | sed 's/ *$//' > $w01; cp $w01 $proto
# 3.3 連続する改行コードを単一に
cat $proto | tr -s "\n" > $w01; cp $w01 $proto
# 3.4 core.jsを更新
cp $proto $mod/core.js


# ----------------------------------------------
# 4. 仕様書の作成
# ----------------------------------------------
# 4.1 JSDocを作成、プロトタイプに埋め込む
echo "step.4.1 start."
jsdoc2md $proto > $w01
cat $readme | awk 1 | $esed -x:$mdJSDoc -f:$w01 > $w02; cp $w02 $readme

# 4.2 configをuseage.mdに埋め込み
echo "step.4.2 start."
cat $doc/useage.md | awk 1 | \
$esed -x:"\/\/::config::" -f:$src/config.js \
> $tmp/useage.md

# 4.4 解説記事をプロトタイプに埋め込みつつ、メニューバー文字列を作成
echo "step.4.4 start."
menubar="[先頭](#top)"
echo "" > $w01
addArticle $tmp/useage.md useage "使用方法"
addArticle $doc/deliverables.md deliverables "生成されるナビ"
addArticle $doc/auth.md authorization "認証の手順"

# 4.5 解説記事・メニューバー文字列を置換
echo "step.4.5 start."
cat $readme | awk 1 | $esed -x:$mdArticles -f:$w01 > $w02; cp $w02 $readme
menubar="$menubar | [仕様(JSDoc)](#jsdoc) | [プログラムソース](#program_source) | [改版履歴](#revision_history)"
cat $readme | awk 1 | sed -E "s/$mdBar/$menubar/g" > $w02; cp $w02 $readme

# 4.6 tmp/readme.mdを$mod直下にコピー
echo "step.4.6 start."
cp $readme $mod/readme.md

echo "\n$hr[BurgerMenu] build end$hr"