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

# script.coreから核となるスクリプトを抽出
node querySelector.js -i:../component/$1.html -o:../component/$1.js script.core

# JSDocの作成
jsdoc2md ../component/$1.js > ../component/$1.md

# ソースを追加
cat <<EOD1 >> ../component/$1.md

## source

\`\`\`
EOD1
cat ../component/$1.js >> ../component/$1.md
cat <<EOD2 >> ../component/$1.md
\`\`\`
EOD2