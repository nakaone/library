#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

# ----------------------------------------------
# 0. 事前準備
# ----------------------------------------------
prj="$lib/underDev/Auth"
arc="$prj/archives"
dep="$prj/deploy"
doc="$prj/doc"
rm -rf $dep/*.gs $dep/*.html
tmp="$prj/tmp"
rm -rf $tmp/*
dt=$(date "+%Y/%m/%d %H:%M:%S")
echo $dt

src="$prj/src"
# $embedに渡すパラメータを一括指定
opts="-GitHub:$GitHub -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp"

# ----------------------------------------------
# 1. クライアント・サーバ共通
# ----------------------------------------------

# === 1.1 仕様書関係
# クラス別定義
node $src/common/specDef.js | \
node $prj/tools/specify.mjs -h:$src/common/header.md -o:$doc -l:$tmp

# クライアント・サーバ側仕様書
cat $src/common/header.md $src/client/client.md | awk 1 | \
$embed $opts > $doc/cl/client.md
cat $src/common/header.md $src/server/server.md | awk 1 | \
$embed $opts > $doc/sv/server.md

# doc直下文書用をrootHeader.mdとして作成
cat $src/common/header.md | sed 's|\.\./||g' > $tmp/rootHeader.md

# 総説
cat $tmp/rootHeader.md $src/common/specification.md | awk 1 | \
$embed $opts > $doc/specification.md

# JavaScriptライブラリ
cat $tmp/rootHeader.md $src/common/JSLib.md | awk 1 | \
$embed $opts > $doc/JSLib.md

# 開発仕様
cat $tmp/rootHeader.md  $src/common/dev.md | awk 1 | \
$embed $opts > $doc/dev.md

# 図
mkdir $doc/img
cp $src/img/* $doc/img

# === 1.2 クラス・関数別ソース準備
# $src/common/*.mjsをimport/export文を削除して$tmpに出力
for f in $src/common/*.mjs; do
  bn=$(basename "$f" ".mjs")
  # import/export文の削除
  sed '/^import /d; s/^export //' "$f" > "$tmp/$bn.js"
done

# ----------------------------------------------
# 2. クライアント側
# ----------------------------------------------

# === 2.1 クラス・関数別ソース準備
# $src/client/*.mjsをimport/export文を削除して$tmpに出力
for f in $src/client/*.mjs; do
  bn=$(basename "$f" ".mjs")
  # import/export文の削除
  sed '/^import /d; s/^export //' "$f" > "$tmp/$bn.js"
done

# === 2.2 index.htmlの作成
# 開発時の更新確認のため、index.htmlに現在日時を挿入
echo "<p style='text-align:right'>build: $dt</p>" > $tmp/timestamp.html
cat $src/client/index.html | awk 1 | $embed $opts > $dep/index.html

# ----------------------------------------------
# 3. サーバ側
# ----------------------------------------------

# === 3.1 クラス・関数別ソース準備
for f in $src/server/*.mjs; do
  bn=$(basename "$f" ".mjs")
  # import/export文の削除
  sed '/^import /d; s/^export //' "$f" > "$tmp/$bn.js"
done

# === 3.2 Code.gsの作成
echo "// $dt" > $dep/Code.gs
cat $src/server/Code.js | awk 1 | \
$embed $opts >> $dep/Code.gs

# === 3.3 jsrsasignのコピー
echo "const navigator = { appName: 'Netscape' };" > $dep/jsrsasign.gs
echo "const window = this; // jsrsasignがwindowを要求する場合に備えて" >> $dep/jsrsasign.gs
cat $src/server/jsrsasign-all-min.js >> $dep/jsrsasign.gs

# ----------------------------------------------
# 4. GASに反映(clasp)
# ----------------------------------------------
# ※ 反映しない場合、起動時オプションに"-l"を追加(local test)
# ./build.sh -l
if [[ "$1" != "-l" ]]; then
  cd $prj/deploy
  clasp push #--force
  cd $prj/tools
fi

# ----------------------------------------------
# 5. NotebookKM用ファイル出力
# ----------------------------------------------

# 5.1 仕様書関係
nbSpec="$tmp/nbSpec.txt"
touch $nbSpec
echo "=== specification.md: 全体仕様\n" >> $nbSpec
cat $doc/specification.md >> $nbSpec
echo "=== specify.mjs: 仕様書作成用データ\n" >> $nbSpec
cat $prj/tools/specify.mjs >> $nbSpec

# 5.2 ソースコード
nbSource="$tmp/nbSource.txt"
echo "===\n=== Code.gs: サーバ側ソース\n===\n" > $nbSource
cat $dep/Code.gs >> $nbSource
echo "\n===\n=== jsrsasign.gs: サーバ側RSAライブラリ\n===\n" >> $nbSource
cat $dep/jsrsasign.gs >> $nbSource
echo "\n===\n=== index.html: クライアント側ソース\n===\n" >> $nbSource
cat $dep/index.html >> $nbSource
# tools
cat $prj/tools/nbTools.mjs | awk 1 | $embed $opts > $tmp/nbTools.txt
