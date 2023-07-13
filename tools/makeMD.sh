#!/bin/sh
# -x  つけるとverbose

# makeMD
#   component以下の指定htmlから<script class="core">を抽出、
#   MarkDown文書をcomponent配下に作成する。
#
#   なおJSファイルは本ツールを使用せず、直接jsdoc2mdでMD化する。

# ==========================================================
#   主処理
# ==========================================================
#tfn=`TZ='Asia/Tokyo' date +%Y%m%d%H%M%S`  # Temporary File Name
tfn="temporary"
# echo $tfn

node querySelector.js -i:../component/$1.html -o:$tfn.js script.core
jsdoc2md $tfn.js > ../component/$1.md
rm $tfn.js