#!/usr/bin/env zsh
function main { # メイン処理
  setup
  node $prj/test/sample.mjs
  ending
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
  prj="$lib/underDev/devTools"

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
main  # 全ての個別処理定義後、メイン処理を呼び出し
