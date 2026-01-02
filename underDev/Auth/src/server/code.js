// ライブラリ関数定義
//::$lib/devTools/3.0.0/core.js::
//::$lib/toLocale/1.2.1/core.js::

// authServer関係クラス定義
//::$tmp/authServer.js::
//::$tmp/cryptoServer.js::
//::$tmp/Member.js::

// 動作設定定義
//::$tmp/serverConfig.js::

// テスト用サーバ側関数
//::$src/server/serverFunc.js::

// クライアント側HTML配信
function doGet(e) {
  const tpl = HtmlService.createTemplateFromFile('index');
  tpl.VERSION = toLocale(new Date(),'yyyy/MM/dd hh:mm:ss');
  return tpl.evaluate()
    .setTitle('Auth(test)');
}

// Webアプリ定義
async function doPost(e) {
  console.log('doPost called');
  //const asv = await authServer.initialize(globalThis.config);
  //const rv = asv.exec(e.postData.contents); // 受け取った本文(文字列)
  const rv = {msg:'doPost response'};
  if( rv !== null ){ // fatal(無応答)の場合はnullを返す
    return ContentService
      .createTextOutput(JSON.stringify(rv))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// スプレッドシートメニュー定義
//::$src/server/menu.js::
