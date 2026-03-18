#!/usr/bin/env zsh
function main { # メイン処理
  setup           # パスの定義他、事前準備
  detailedDesign  # JavaScriptソースからMarkdown作成
  overviewDesign  # readme/index.md他の全体的な仕様書
  deploy          # ソースをdeployに作成、clasp実行
  makeNotes       # AI質問用にノート作成
  ending          # 終了時処理
}

function setup {  # 事前準備
  echo "== setup start."

  # datetimeモジュールを読み込む
  setopt extended_glob
  setopt null_glob
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
  mkdir $tmp/createSpec
  mkdir $tmp/NotebookLM

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
  echo "== ending start."

  # 終了時刻を取得
  end_time=$EPOCHREALTIME
  end_human=$(date '+%Y-%m-%d %H:%M:%S.%3N')
  echo "終了時刻: $end_human"

  # 処理時間を計算（ミリ秒単位）
  elapsed_ms=$(printf "%.0f" "$(echo "($end_time - $start_time) * 1000" | bc -l)")
  echo "処理時間: ${elapsed_ms} ms"
}

function detailedDesign {  # createSpecでJavaScriptソース(JSDoc)からMarkdown作成
  echo "== detailedDesign start."
  # index.md及びクラス・グローバル関数個別MDをtmpに作成
  # ※ 最終的にsrc/doc/header.mdを先頭に付けるため、出力先はtmp/
  # ※ jsdoc実行時エラーを表示するため、標準エラー出力はリダイレクトしない
  cs="$tmp/createSpec"
  node $createSpec $src/(client|common|server|lib)/**/*.(js|mjs) \
  -o $cs -r $cs/doclet.json 1> $cs/result.log 2> $cs/error.log

  # docルート直下文書用に相対パスを修正したheader.mdを用意
  cat $src/doc/header.md | sed 's|\.\./||g' > $tmp/header.md

  # index.md及びクラス・グローバル関数個別MDにヘッダを付けてdoc以下にコピー
  find $tmp/createSpec -type f -name '*.md' | while read -r filepath; do
    # 相対パスを取得（例: client/authClient.md）
    relpath="${filepath#$tmp/createSpec}"
    # 出力先のパスを作成
    outpath="$doc/$relpath"
    # 出力先ディレクトリを作成（存在しない場合）
    mkdir -p "$(dirname "$outpath")"
    # header.md + 元ファイル を結合して出力
    cat "$src/doc/header.md" "$filepath" > "$outpath"
  done

  # doc直下のindex.mdはクラス・グローバル関数個別MDとヘッダ部が異なるので削除
  rm -f $doc/index.md

  # ルートとなるindex.mdが出力されていればdocルート直下用header.mdを付けて出力
  [ -f $tmp/createSpec/index.md ] && cat tmp/header.md $tmp/createSpec/index.md \
  > $doc/index.md
}

function overviewDesign {  # readme/index.md他の全体的な仕様書
  echo "== overviewDesign start."
  # 図表
  cp $src/doc/*.svg $doc/img/
  # 総説
  cat $tmp/header.md $src/doc/readme.md | awk 1 | node $embed -src:$src -tmp:$tmp > $doc/readme.md
  # 暗号化・署名方式
  cat $tmp/header.md $src/doc/crypto.md > $doc/crypto.md
  # メンバ・デバイス管理
  cat $tmp/header.md $src/doc/Member.md > $doc/Member.md

  # クライアント側
  cat $src/doc/header.md $src/doc/client.md $tmp/createSpec/client/index.md | awk 1 | \
  node $embed -src:$src -tmp:$tmp > $doc/client/index.md
  # サーバ側
  cat $src/doc/header.md $src/doc/server.md $tmp/createSpec/server/index.md | awk 1 | \
  node $embed -src:$src -tmp:$tmp > $doc/server/index.md
  # 開発仕様
  cat $tmp/header.md  $src/doc/dev.md > $doc/dev.md
}

function deploy {  # ソースをdeployに作成、clasp実行
  echo "== deploy start."
  ## ----------------------------------------------
  ## 1. クライアント・サーバ共通
  ## ----------------------------------------------
  #
  ## === 1.2 クラス・関数別ソース準備
  ## $src/common/*.mjsをimport/export文を削除して$tmpに出力
  #for f in $src/common/*.mjs; do
  #  bn=$(basename "$f" ".mjs")
  #  # import/export文の削除
  #  sed '/^import /d; s/^export //' "$f" > "$tmp/$bn.js"
  #done

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

function makeNotes { # AI質問用にノート作成
  echo "== makeNotes start."

  notes="$tmp/NotebookLM"

  # 1. development.txt : 開発環境、ツール類
  # 1.1 フォルダ構成
  outfile="$notes/development.txt"
  tree $prj -I 'archives' > $outfile
  echo "\n\f" >> $outfile  # 改ページコード（フォームフィード）
  # 1.2 対象ファイルリスト作成
  # - : シンボリックリンクも対象に含める(ex."D-.N")
  # . : 通常ファイルのみ（ディレクトリやシンボリックリンクを除外）
  # / : ディレクトリのみ
  # D : ドットファイル（隠しファイル）も含める
  # N : マッチしなくてもエラーにしない（nullglob）
  # ^ : 否定（例：^/ は「ディレクトリ以外」）
  # `*.(sh|json)`: 拡張子が .sh または .json のファイル
  # $PWD/...：フルパスで表示
  # **/*(.)：再帰的にファイルのみ
  files=(
    $prj/*(D.N) # 隠しファイルを含め、フォルダを除く直下のファイル
    $prj/tools/**/*.(sh|json)(D-.N)  # tools
  )
  dumpFile

  # 2. applications.txt
  outfile="$notes/applications.txt"
  files=(
    #$dep/**/*(DN) # jsrsasignは除外すること
    $src/(client|common|server)/**/*(-.N)
  )
  dumpFile

  # 3. specifications.txt
  outfile="$notes/specifications.txt"
  files=(
    $doc/**/*(.N)
  )
  dumpFile

  # 4. libraries.txt
  outfile="$notes/libraries.txt"
  files=(
    $src/lib/**/*(-.N)
    $tmp/createSpec.*(.N) # createSpec実行結果
  )
  dumpFile
}

function dumpFile { # makeNotesから呼ばれる個別ファイルの内容追加関数
  for f in $files; do
    {
      echo "===== $f =====\n"
      cat -- "$f"
      echo "\n\f"  # 改ページコード（フォームフィード）
    } >> $outfile
  done

  # outfileの内容を基にMD5を付加
  cp $outfile $tmp/md5work.txt
  md5=$(md5sum "$outfile" | awk '{print $1}')
  { echo "[Content-Hash: $md5]\n"; cat "$tmp/md5work.txt"; } > $outfile
}

main  # 全ての個別処理定義後、メイン処理を呼び出し
