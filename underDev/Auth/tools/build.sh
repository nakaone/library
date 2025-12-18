#!/bin/sh
# -x  つけるとverbose
set -e # エラー時点で停止
source ~/Desktop/GitHub/tools/common.sh

# ----------------------------------------------
# 0. 事前準備
# ----------------------------------------------
prj="$lib/underDev/Auth"
arc="$prj/archives"
src="$prj/src"
dep="$prj/deploy"
doc="$prj/doc"
img="$prj/img"
tmp="$prj/tmp"
test="$prj/__tests__/b0004.test.mjs"
#rm -rf $dep/*
rm -rf $doc/*
rm -rf $tmp/*

# doPush: GitHub/claspで更新するならtrue
# ./build.sh -p ⇒ doPush === true
doPush=false
if [[ "$1" == "-p" ]]; then
  doPush=true
fi

# ----------------------------------------------
# 1. 仕様書
# ----------------------------------------------

# クラス別定義
node $src/doc/specDef.js | node $prj/tools/specify.mjs -h:$src/doc/header.md -o:$doc -l:$tmp

# クライアント・サーバ側仕様書
cat $src/doc/header.md $src/doc/client.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/cl/client.md
cat $src/doc/header.md $src/doc/server.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/sv/server.md

# doc直下文書用をrootHeader.mdとして作成
cat $src/doc/header.md | sed 's|\.\./||g' > $tmp/rootHeader.md
# 総説
cat $tmp/rootHeader.md $src/doc/specification.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/specification.md
# JavaScriptライブラリ
cat $tmp/rootHeader.md $src/doc/JSLib.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/JSLib.md
# 開発仕様
cat $tmp/rootHeader.md  $src/doc/dev.md | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp > $doc/dev.md
# 図
mkdir $doc/img
cp $src/doc/img/* $doc/img

# ----------------------------------------------
# 2. クライアント側
# ----------------------------------------------

# Vitestを実行
clsource="$tmp/client.source.md"
echo "## 質問・依頼事項\n\n## テストソース\n\n\`\`\`js" > $clsource
cat $test >> $clsource
echo "\n\`\`\`\n\n## 実行結果\n\n\`\`\`zsh" >> $clsource
cd $prj
#npx vitest run "$test" | sed 's/\x1b\[[0-9;]*m//g' >> $clsource
cd tools/
echo "\`\`\`\n" >> $clsource

for f in $src/client/*.mjs; do
  bn=$(basename "$f" ".mjs")
  # import/export文の削除
  sed '/^import /d; s/^export //' "$f" > "$tmp/$bn.js"
  # 生成AI質問用ソース一覧作成
  echo "## $bn.mjs\n\n\`\`\`js" >> $clsource
  cat $f >> $clsource
  echo "\n\`\`\`\n\n" >> $clsource
done

# index.htmlの作成
  # deployフォルダに置くとGASにコピーされてしまうため、
  # 一度deploy以下のindex.htmlは消去し、直接GitHub/public/authに出力
[[ -f $dep/index.html ]] && rm $dep/index.html
# 開発時の更新確認のため、index.htmlに現在日時を挿入
echo "<p style='text-align:right'>$(date "+%Y/%m/%d %H:%M:%S")</p>" \
> $tmp/timestamp.html
cat $src/client/index.html | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp \
> $GitHub/public/auth/index.html
if $doPush; then
  cd $GitHub/public/
  git add auth/
  if ! git diff --cached --quiet; then
    git commit -m "$(date "+%Y%m%d-%H%M")"
    git push origin main
  fi
  cd $prj/tools
fi

# ----------------------------------------------
# 3. サーバ側
# ----------------------------------------------

for f in $src/server/*.mjs; do
  bn=$(basename "$f" ".mjs")
  # import/export文の削除
  sed '/^import /d; s/^export //' "$f" > "$tmp/$bn.js"
done

# Code.gsの作成
echo "// $(date "+%Y%m%d-%H%M%S")" > $dep/Code.gs
cat $src/server/code.js | awk 1 | \
$embed -prj:$prj -lib:$lib -src:$src -doc:$doc -tmp:$tmp >> $dep/Code.gs
# jsrsasignのコピー
cp $src/server/jsrsasign-all-min.js $dep/jsrsasign.gs
# GASへ反映
if $doPush; then
  cd $prj/deploy
  clasp push --force
  cd $prj/tools
fi

# ----------------------------------------------
# 4. 事後処理
# ----------------------------------------------
# index.htmlをデバッグ用にdeploy以下にコピー
cp $GitHub/public/auth/index.html $dep/index.html
