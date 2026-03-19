<p id="top" class="l1">"auth"サーバ側仕様書</p>
<div class="submenu">

[実装イメージ](#implement) | [分岐先決定手順](#procedure) | [関数・クラス](#funclassList) | [データ型](#typedefList)

</div>

# <a href="#top"><span id="implement">実装イメージ</span></a>

```js
// ライブラリ関数定義
function devTools(){...}; // (中略)

// authServer関係クラス定義
class authServer{...};
class cryptoServer{...};
class Member{...};  // (中略)

// グローバル変数定義
const dev = devTools();
const config = {...}; // authClient/Server共通設定情報
const asv = authServer({
  // プロジェクト毎の独自パラメータ
});

// Webアプリ定義
function doPost(e) {
  const rv = asv.exec(e.postData.contents); // 受け取った本文(文字列)
  if( rv !== null ){ // fatal(無応答)の場合はnullを返す
    return ContentService
      .createTextOutput(rv);
  }
}

// スプレッドシートメニュー定義
const ui = SpreadsheetApp.getUi();
ui.createMenu('追加したメニュー')
  .addItem('加入認否入力', 'menu10')
  .addSeparator()
  .addSubMenu(ui.createMenu("システム関係")
    .addItem('実行環境の初期化', 'menu21')
    .addItem("【緊急】鍵ペアの更新", "menu22")
  )
  .addToUi();
const menu10 = () => asv.listNotYetDecided();
const menu21 = () => asv.setupEnvironment();
const menu22 = () => asv.resetSPkey();
```

# <a href="#top"><span id="procedure">サーバ側処理分岐先決定手順</span></a>

<!--::$src/doc/decisionTable.server.md::-->
