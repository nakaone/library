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
esed="node $lib/esed/1.0.0/core.js"
querySelector="node $lib/querySelector/2.0.0/core.js"
tmp="$mod/tmp"; rm -rf $tmp/*
w01="$tmp/work01";w02="$tmp/work02";w03="$tmp/work03"
proto="$tmp/proto.js"; cp $mod/proto.js $proto
readme="$tmp/readme.md"

# 1.2 終端位置指定文字列の定義
echo "step.1.2 start."
eoMethods="//::methods_add_here::"
mdJSDoc="<!--::JSDoc::-->"
mdSource="<!--::source::-->"

# 1.3 関数定義
echo "step.1.3 start."
# addMethod : core.jsにメソッドを追加
addMethod(){
  # {string} $1 - 追加するメソッド名
  echo "addMethod '$1' start."
  cat $mod/$1.js | awk 1 | sed "s/^/  /" > $w01
  echo $eoMethods >> $w01
  cat $proto | awk 1 | $esed -x:$eoMethods -f:$w01 > $w02
  cp $w02 $proto
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
# 4.1 共通CSSをclient.md先頭に追加(esedはコメント部分の削除)
echo "step.4.1 start."
cat << EOS > $readme
<style scoped type="text/css">
`cat $lib/CSS/1.3.0/core.css | awk 1 | $esed -x:"\/\*[\s\S]*?\*\/\n*" -s:""`
</style>
`cat $mod/proto.md`
EOS

# 4.3 JSDocを作成、プロトタイプに埋め込む
echo "step.4.3 start."
jsdoc2md $proto > $w01
cat $readme | awk 1 | $esed -x:$mdJSDoc -f:$w01 > $w02; cp $w02 $readme

# 4.6 tmp/readme.mdを$mod直下にコピー
echo "step.4.6 start."
cp $readme $mod/readme.md

echo "\n$hr[BurgerMenu] build end$hr"