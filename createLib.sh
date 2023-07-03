#!/bin/sh
# -x  つけるとverbose

# createLib: コンポーネントからコアスクリプトを抽出、ライブラリとMarkdownを作成
#   useage ./createLib.sh
#   作成されたライブラリとMarkdownはtmp直下に作成される。

function querySelector(){
  node node/querySelector.js -i:JavaScript/$1.html -o:tmp/$1.js script.core
  cat tmp/$1.js >> lib/$libName.js
}

function createLib(){
  rm lib/$libName.*
  for x in "$@"
  do
    querySelector $x
  done

  #echo $header > lib/$libName.md
  for l in "${header[@]}"
  do
    echo $l >> lib/$libName.md
  done
  echo "" >> lib/$libName.md  # 空白行を追加
  jsdoc2md lib/$libName.js >> lib/$libName.md
}

dt=`TZ='Asia/Tokyo' date`
echo dt
cd /Users/ena.kaon/Desktop/GitHub/library

# ライブラリ単位に以下を指定
#   libName : 作成するライブラリ名
#   header : Markdownの文頭。行単位にカンマ無し、スペース区切りで指定
#   createLib xxx yyy : コンポーネントxxx,yyyのコアを抽出して結合

libName="jsLib"
header=(
  "# ${libName}: HTMLまたはバッチ(Node.js)用ライブラリ"
  ""
  "<p style='text-align:right'>last update: ${dt}</p>"
  ""
  "アンダーバー('_')が含まれる関数名「XXX_yyy()」は、XXX型オブジェクトへのyyyメソッド追加を示す。"
)
createLib webScanner analyzeArg analyzePath querySelector whichType Date.calc Date.toLocale

# 参考 : UNIX & Linux コマンド・シェルスクリプト リファレンス
# 引数を処理する
#   https://shellscript.sunone.me/parameter.html
# 変数を使用する
#   https://shellscript.sunone.me/variable.html
# 配列を使用する
#   https://shellscript.sunone.me/array.html
#
# 参考 : bash/zsh: for で変数 i を02から10まで廻したい時
#   https://gordiustears.net/increment-counter-variable-in-bash/