// ライブラリ関数定義
//::$lib/devTools/2.1.0/core.js::

// authServer関係クラス定義
//::$tmp/authServer.js::
//::$tmp/cryptoServer.js::
//::$tmp/Member.js::

// グローバル変数定義
const dev = devTools();
const asv = authServer({
  adminMail: 'ena.kaon@gmail.com',
  adminName: 'あどみ',
  func: {
    svTest: m => {serverFunc(...m)},
  }
});

// テスト用サーバ側関数
function serverFunc(arg){
  const v = {whois:`serverFunc`, arg:{arg}, rv:null};
  dev.start(v);
  try {
    console.log(`${v.whois}: arg=${JSON.stringify(arg,null,2)}`);
    return true;
  } catch (e) { return dev.error(e); }
}

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