#!/bin/sh
# -x  つけるとverbose
echo "\n\n== toolbox.sh ============================================"
echo `TZ='Asia/Tokyo' date`

# toolbox
#   component以下のtoolbox.htmlから<script class="core">を抽出
#
#   [useage]
#   ./toolbox.sh

function addMenu(){
node ../../tools/querySelector.js \
  -i:../../component/$1.html -o:$1.js script.core
cat $1.js >> toolbox.gs
}

# ==========================================================
#   主処理
# ==========================================================
rm *.gs
# ヘッダの作成
MSG=$(cat <<-EOD
/*
toolbox: Googleスプレッドのメニューに「道具箱」を追加

1. libraty/GAS/toolbox/toolbox.shを実行<br>
   ⇒ libraty/GAS/toolbox/toolbox.gsが生成される
2. toolbox.gsのソースをスプレッドシートに登録
   1. Apps Script > 「ファイル」を追加、スクリプトを選択
   2. 追加したスクリプト名をtoolbox.gsに変更
   3. toolbox.gsに1.で生成されたtoolbox.gsの内容をコピー&ペースト
3. 認証と権限付与<br>
   jsonRange()を実行、認証して実行権限を付与
4. トリガーを設定<br>
   Apps Script > トリガー(目覚まし時計アイコン) > トリガーを追加
   - 実行する関数：onOpen
   - 実行するデプロイ：Head
   - イベントのソース：スプレッドシート
   - イベントの種類：起動時
   - エラー通知：毎日通知を受け取る
5. シートを再起動
*/

EOD)
echo "$MSG" > toolbox.gs

# onLoad等、script.coreから核となるスクリプトを抽出
addMenu toolbox

# 道具箱で使用するツール、ライブラリを追加
addMenu jsonRange
addMenu whichType

rm *.js

echo "$MSG"