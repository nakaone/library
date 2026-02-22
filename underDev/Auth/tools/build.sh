#!/usr/bin/env zsh
function main { # メイン処理
  setup
  concatSource
  detailedDesign
  overviewDesign
  ending
}
function setup {  # 事前準備
  setopt extended_glob
  setopt null_glob

  # datetimeモジュールを読み込む
  zmodload zsh/datetime
  # 開始時刻を取得（UNIX時間のナノ秒）
  start_time=$EPOCHREALTIME
  start_human=$(date '+%Y-%m-%d %H:%M:%S.%3N')
  echo "開始時刻: $start_human"

  # ----------------------
  # 1.パスの定義
  # ----------------------
  # 1.1.汎用定義
  Desktop="/Users/ena.kaon/Desktop"
  GitHub="$Desktop/GitHub"
  lib="$GitHub/library"
  htdocs="/Library/WebServer/Documents" # /etc/apache2/httpd.conf
  dt=$(date "+%Y/%m/%d %H:%M:%S") # 日時文字列

  # 1.2.プロジェクト固有
  prj="$lib/underDev/Auth"
  arc="$prj/archives"
  dep="$prj/deploy"; [ -d $dep ] && rm -rf $dep; mkdir $dep;
  doc="$prj/doc"; [ -d $doc ] && rm -rf $doc; mkdir $doc;
  mkdir $doc/client
  mkdir $doc/common
  mkdir $doc/server
  mkdir $doc/img
  src="$prj/src"
  tmp="$prj/tmp"; [ -d $tmp ] && rm -rf $tmp; mkdir $tmp;

  # 1.3.$embedに渡すパラメータを一括指定
  opts="-GitHub:$GitHub -lib:$lib -prj:$prj -dep:$dep -doc:$doc -src:$src -tmp:$tmp"

  # ----------------------
  # 2.build関係ツール
  # ----------------------
  #   使用時は先頭に"node"付加(ex.`node $embed $opts > $doc/sv/server.md`)
  createSpec="$lib/createSpec/1.0.0/core.mjs"
  embed="$lib/embedRecursively/1.2.0/pipe.js"
  esed="$lib/esed/1.0.0/core.js"
  modify="$lib/modifyMD/2.0.0/pipe.js"
  querySelector="$lib/querySelector/2.0.1/pipe.js"
  opml="$lib/workflowy/opml"
  workflowy="$lib/workflowy/1.1.0/pipe.js"

  # ----------------------
  # 3.".DS_store"の全削除
  # ----------------------
  find $GitHub -name '.DS_Store' -type f -ls -delete
}
function ending { # 終了時処理
  # 終了時刻を取得
  end_time=$EPOCHREALTIME
  end_human=$(date '+%Y-%m-%d %H:%M:%S.%3N')
  echo "終了時刻: $end_human"

  # 処理時間を計算（ミリ秒単位）
  elapsed_ms=$(printf "%.0f" "$(echo "($end_time - $start_time) * 1000" | bc -l)")
  echo "処理時間: ${elapsed_ms} ms"
}
function detailedDesign {  # JavaScriptソースからMarkdown作成
  # 最終的にsrc/doc/header.mdを先頭に付けるため、出力先はtmp/
  node $createSpec $src/(client|common|server)/**/*.(js|mjs) -o $tmp \
  1> $tmp/createSpec.log 2> $tmp/createSpec.error.log
}
function overviewDesign {  # readme/index.md他の全体的な仕様書
  # 図表
  cp $src/doc/*.svg $doc/img/
  # docルート直下文書用に相対パスを修正したheader.mdを用意
  cat $src/doc/header.md | sed 's|\.\./||g' > $tmp/header.md
  # 総説
  cat $tmp/header.md $src/doc/readme.md > $doc/readme.md
  # クライアント側
  cat $src/doc/header.md $src/doc/client.md > $doc/client/index.md
  # サーバ側
  cat $src/doc/header.md $src/doc/server.md > $doc/server/index.md
  # 開発仕様
  cat $tmp/header.md  $src/doc/dev.md > $doc/dev.md
}
function concatSource { # AI質問用に関連ソースを単一テキストに統合して出力
  # 対象ファイルリスト作成
  # . : 通常ファイルのみ（ディレクトリやシンボリックリンクを除外）
  # / : ディレクトリのみ
  # D : ドットファイル（隠しファイル）も含める
  # N : マッチしなくてもエラーにしない（nullglob）
  # ^ : 否定（例：^/ は「ディレクトリ以外」）
  # `*.(sh|json)`: 拡張子が .sh または .json のファイル
  # $PWD/...：フルパスで表示
  # **/*(.)：再帰的にファイルのみ
  files=(
    $createSpec
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
      echo "===== $f =====\n"
      cat -- "$f"
      echo "\n\f"  # 改ページコード（フォームフィード）
    } >> $outfile
  done
}
main  # 全ての個別処理定義後、メイン処理を呼び出し

function backup {  # 備忘
  # ----------------------------------------------
  # 2026.02.20 createSpec導入前
  # ----------------------------------------------

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
  #node $embed $opts > $doc/cl/client.md
  #cat $src/common/header.md $src/server/server.md | awk 1 | \
  #node $embed $opts > $doc/sv/server.md
  #
  ## doc直下文書用をrootHeader.mdとして作成
  #cat $src/common/header.md | sed 's|\.\./||g' > $tmp/rootHeader.md
  #
  ## 総説
  #cat $tmp/rootHeader.md $src/common/specification.md | awk 1 | \
  #node $embed $opts > $doc/specification.md
  #
  ## JavaScriptライブラリ
  #cat $tmp/rootHeader.md $src/common/JSLib.md | awk 1 | \
  #node $embed $opts > $doc/JSLib.md
  #
  ## 開発仕様
  #cat $tmp/rootHeader.md  $src/common/dev.md | awk 1 | \
  #node $embed $opts > $doc/dev.md
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
  #cat $src/client/index.html | awk 1 | node $embed $opts > $dep/index.html
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
  #node $embed $opts >> $dep/Code.gs
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
}