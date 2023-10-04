#!/bin/sh
# -x  つけるとverbose

# updateComponent
#   component以下の指定htmlから<script class="core">を抽出、
#   MarkDown文書をcomponent配下に作成する。
#
#   なおJSファイルは本ツールを使用せず、直接jsdoc2mdでMD化する。
#
#   [useage]
#   ./updateComponent (拡張子無しの)コンポーネント名

# ==========================================================
#   主処理
# ==========================================================

# カレントディレクトリはtools/の想定
cd /Users/ena.kaon/Desktop/GitHub/library/tools

# 1.作業用フォルダを作成、外部ファイルを埋め込み
mkdir tmp
node embedComponent.js \
  -i:../component/$1.html -o:tmp/$1.html -t:html

# 2.核となる部分を抽出
node querySelector.js \
  -i:tmp/$1.html -o:tmp/$1.core.js script.core

# 3.JSDocの作成
# 3.1.最終更新日時
echo "lastUpdate: "`TZ='Asia/Tokyo' date` > ../component/$1.md
echo "" >> ../component/$1.md
# 3.2.MarkDown本文
jsdoc2md tmp/$1.core.js >> ../component/$1.md
# 3.3.ソースコード
cat <<EOD1 >> ../component/$1.md

## source

\`\`\`
EOD1
cat tmp/$1.core.js >> ../component/$1.md
cat <<EOD2 >> ../component/$1.md
\`\`\`
EOD2

# 4.ライブラリに使用するコンポーネントを作成
node minimize.js -i:tmp/$1.core.js -o:../component/$1.js all
# cp tmp/$1.core.js ../component/$1.js

# 5.コンソール実行用JavaScript
#   なお実行時に参照する可能性があるので、敢えてminimizeは行わない
node querySelector.js \
  -i:tmp/$1.html -o:tmp/$1.onConsole.js script.onConsole
# 5.1.ファイルサイズを取得
SIZE=`wc -c < tmp/$1.onConsole.js`
echo $1".onChange file size="$SIZE
# 5.2.ファイルサイズ>0ならtools/に作成
if [ $SIZE -gt 0 ]; then
  cat tmp/$1.core.js > ../tools/$1.js
  cat tmp/$1.onConsole.js >> ../tools/$1.js
fi

# 6.tmpの内容を削除
rm tmp/*
rmdir tmp
