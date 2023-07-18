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

node querySelector.js -i:../component/$1.html -o:../component/$1.js script.core
jsdoc2md ../component/$1.js > ../component/$1.md