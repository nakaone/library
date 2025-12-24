
// クライアント側HTML配信
function doGet(){
  return HtmlService
    .createHtmlOutputFromFile('index')
    .setTitle('Auth(test)');
}
// Webアプリ定義
async function doPost(e) {
  console.log('doPost called');
  const asv = await authServer.initialize(globalThis.config);
  const rv = asv.exec(e.postData.contents); // 受け取った本文(文字列)
  if( rv !== null ){ // fatal(無応答)の場合はnullを返す
    return ContentService
      .createTextOutput(JSON.stringify(rv))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
