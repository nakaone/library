# 「道具箱」設定手順

## 新規ツール開発時

1. 「ena.kaon Google Drive > My Drive > projects > GAS Libraries」の下に新規GASファイルを作成
1. 作成したGASファイルの「ライブラリ」にcommonを追加<br>
   Script ID = `14vttuLFtkWYFJpAxTIlRS0qgkDoajvZa0eoLNJAOfrDuX2uit85V8qvw`

## スプレッドシート(コンテナバインドスクリプト)への「道具箱」登録

1. スプレッドシートで「Apps Script」画面を開く
1. 「ライブラリ」にツールを追加
   - convertHTML : 選択範囲をHTML化<br>
     Script ID = `1_rPygHJz3lDJfrSrBE10KaQl77dnwYj5gf770XpFd1010DQd3dnMiBUC`
1. `toolbox.gs`として次項のソースを貼り付け
1. トリガーを設定<br>
   Apps Script > トリガー(目覚まし時計アイコン) > トリガーを追加
   - 実行する関数：onOpen
   - 実行するデプロイ：Head
   - イベントのソース：スプレッドシート
   - イベントの種類：起動時
   - エラー通知：毎日通知を受け取る
1. 初回実行時、「認証が必要です」のメッセージが出たら承認

## toolbox.gs

```
/** 「道具箱」関係スクリプト */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱')
  .addItem("選択範囲をHTML化","showHtmlTableSidebar");
  // サブメニュー使用時はaddSubMenuを使用
  menu.addToUi();
}

/** 「選択範囲をHTML化」関係 */
function showHtmlTableSidebar(){
  convertHTML.showHtmlTableSidebar();
}

function getCellInfo(){
  return convertHTML.getCellInfo();
}
```