#!/bin/zsh
setopt extended_glob
setopt null_glob

# ----------------------------------------------
# 事前準備(buildの共通部分)
# ----------------------------------------------

# 1.パスの定義

# 1.1.汎用定義
Desktop="/Users/ena.kaon/Desktop"
GitHub="$Desktop/GitHub"
lib="$GitHub/library"
htdocs="/Library/WebServer/Documents" # /etc/apache2/httpd.conf
dt=$(date "+%Y/%m/%d %H:%M:%S") # 日時文字列

# 1.2.プロジェクト固有
prj="$lib/underDev/Auth"
arc="$prj/archives"
dep="$prj/deploy"; rm -rf $dep/*
doc="$prj/doc"
src="$prj/src"
tmp="$prj/tmp"; rm -rf $tmp/*

# 2.build関係ツール
createSpec="node $lib/createSpec/1.0.0/core.mjs"
embed="node $lib/embedRecursively/1.2.0/pipe.js"
esed="node $lib/esed/1.0.0/core.js"
modify="node $lib/modifyMD/2.0.0/pipe.js"
querySelector="node $lib/querySelector/2.0.1/pipe.js"
opml="$lib/workflowy/opml"
workflowy="node $lib/workflowy/1.1.0/pipe.js"
# $embedに渡すパラメータを一括指定
opts="-GitHub:$GitHub -lib:$lib -prj:$prj -dep:$dep -doc:$doc -src:$src -tmp:$tmp"

# 2.".DS_store"の全削除
find $GitHub -name '.DS_Store' -type f -ls -delete

# ----------------------------------------------
# 個別処理定義
# ----------------------------------------------
function documentation {
  rm -rf $doc/*
  $createSpec $src/**/*.(js|mjs) -o $doc
}

# concatSource: AI質問用に関連ソースを単一テキストに統合して出力
function concatSource {
  files=(
    $lib/createSpec/1.0.0/core.mjs
    $lib/devTools/3.1.0/core.mjs
    $lib/mergeDeeply/2.0.0/core.mjs
    $prj/*(D.N) #隠しファイルを含めフォルダを除く
    $dep/**/*(DN)
    $doc/**/*(.N)
    $src/(client|common|server)/**/*(.N)
    $prj/tools/**/*.(sh|json)(D.N)
  )

  # 出力ファイルの準備
  outfile="$tmp/source.txt"
  touch $outfile
  for f in $files; do
    {
      echo "===== $f ====="
      cat -- "$f"
      echo "\n\f"  # 改ページコード（フォームフィード）
    } >> $outfile
  done
}

# ----------------------------------------------
# メイン処理
# ----------------------------------------------
echo $dt
#documentation
concatSource

# ----------------------------------------------
# 備忘
# ----------------------------------------------
# 2026.02.20 createSpec導入前

##!/bin/sh
## -x  つけるとverbose
#set -e # エラー時点で停止
#source ~/Desktop/GitHub/tools/common.sh
#
## ----------------------------------------------
## 0. 事前準備
## ----------------------------------------------
#dt=$(date "+%Y/%m/%d %H:%M:%S")
#echo $dt
#
## 各種フォルダの設定
#prj="$lib/underDev/Auth"
#arc="$prj/archives"
#dep="$prj/deploy"
#doc="$prj/doc"
#src="$prj/src"
#tmp="$prj/tmp"
#
## 作業フォルダのクリア
#rm -rf $dep/*
#rm -rf $tmp/*
#
## $embedに渡すパラメータを一括指定
#opts="-GitHub:$GitHub -lib:$lib -prj:$prj -dep:$dep -doc:$doc -src:$src -tmp:$tmp"
#
## ----------------------------------------------
## 1. クライアント・サーバ共通
## ----------------------------------------------
#
## === 1.1 仕様書関係
## クラス別定義
#node $src/common/specDef.js | \
#node $prj/tools/specify.mjs -h:$src/common/header.md -o:$doc -l:$tmp
#
## クライアント・サーバ側仕様書
#cat $src/common/header.md $src/client/client.md | awk 1 | \
#$embed $opts > $doc/cl/client.md
#cat $src/common/header.md $src/server/server.md | awk 1 | \
#$embed $opts > $doc/sv/server.md
#
## doc直下文書用をrootHeader.mdとして作成
#cat $src/common/header.md | sed 's|\.\./||g' > $tmp/rootHeader.md
#
## 総説
#cat $tmp/rootHeader.md $src/common/specification.md | awk 1 | \
#$embed $opts > $doc/specification.md
#
## JavaScriptライブラリ
#cat $tmp/rootHeader.md $src/common/JSLib.md | awk 1 | \
#$embed $opts > $doc/JSLib.md
#
## 開発仕様
#cat $tmp/rootHeader.md  $src/common/dev.md | awk 1 | \
#$embed $opts > $doc/dev.md
#
## 図
#mkdir $doc/img
#cp $src/img/* $doc/img
#
## === 1.2 クラス・関数別ソース準備
## $src/common/*.mjsをimport/export文を削除して$tmpに出力
#for f in $src/common/*.mjs; do
#  bn=$(basename "$f" ".mjs")
#  # import/export文の削除
#  sed '/^import /d; s/^export //' "$f" > "$tmp/$bn.js"
#done
#
## ----------------------------------------------
## 2. クライアント側
## ----------------------------------------------
#
## === 2.1 クラス・関数別ソース準備
## $src/client/*.mjsをimport/export文を削除して$tmpに出力
#for f in $src/client/*.mjs; do
#  bn=$(basename "$f" ".mjs")
#  # import/export文の削除
#  sed '/^import /d; s/^export //' "$f" > "$tmp/$bn.js"
#done
#
## === 2.2 index.htmlの作成
## 開発時の更新確認のため、index.htmlに現在日時を挿入
#echo "<p style='text-align:right'>build: $dt</p>" > $tmp/timestamp.html
#cat $src/client/index.html | awk 1 | $embed $opts > $dep/index.html
#
## ----------------------------------------------
## 3. サーバ側
## ----------------------------------------------
#
## === 3.1 クラス・関数別ソース準備
#for f in $src/server/*.mjs; do
#  bn=$(basename "$f" ".mjs")
#  # import/export文の削除
#  sed '/^import /d; s/^export //' "$f" > "$tmp/$bn.js"
#done
#
## === 3.2 clasp設定ファイルの準備
#cp $prj/tools/.clasp.json $dep/
#cp $prj/tools/appsscript.json $dep/
#
## === 3.2 Code.gsの作成
#echo "// $dt" > $dep/Code.gs
#cat $src/server/Code.js | awk 1 | \
#$embed $opts >> $dep/Code.gs
#
## === 3.3 jsrsasignのコピー
#echo "const navigator = { appName: 'Netscape' };" > $dep/jsrsasign.gs
#echo "const window = this; // jsrsasignがwindowを要求する場合に備えて" >> $dep/jsrsasign.gs
#cat $src/server/jsrsasign-all-min.js >> $dep/jsrsasign.gs
#
## ----------------------------------------------
## 4. GASに反映(clasp)
## ----------------------------------------------
## ※ 反映しない場合、起動時オプションに"-l"を追加(local test)
## ./build.sh -l
#if [[ "$1" != "-l" ]]; then
#  cd $prj/deploy
#  clasp push
#  cd $prj/tools
#fi
#
## ----------------------------------------------
## 5. NotebookKM用ファイル出力
## ----------------------------------------------
#
## 5.1 仕様書関係
#nbSpec="$tmp/nbSpec.txt"
#touch $nbSpec
#echo "=== specification.md: 全体仕様\n" >> $nbSpec
#cat $doc/specification.md >> $nbSpec
#echo "=== specify.mjs: 仕様書作成用データ\n" >> $nbSpec
#cat $prj/tools/specify.mjs >> $nbSpec
#
## 5.2 ソースコード
#nbSource="$tmp/nbSource.txt"
#echo "===\n=== Code.gs: サーバ側ソース\n===\n" > $nbSource
#cat $dep/Code.gs >> $nbSource
#echo "\n===\n=== jsrsasign.gs: サーバ側RSAライブラリ\n===\n" >> $nbSource
#cat $dep/jsrsasign.gs >> $nbSource
#echo "\n===\n=== index.html: クライアント側ソース\n===\n" >> $nbSource
#cat $dep/index.html >> $nbSource
## tools
#cat $prj/tools/nbTools.mjs | awk 1 | $embed $opts > $tmp/nbTools.txt
#