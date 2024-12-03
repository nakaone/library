/** 「選択範囲をHTML化」のダイアログを開く */
function showHtmlTableSidebar() {
  //const htmlOutput = HtmlService.createHtmlOutputFromFile('htmlTable');
  // createHtmlOutputFromFileを使用する場合は以下
  const htmlOutput = HtmlService.createTemplateFromFile('htmlTable').evaluate();
  htmlOutput.setTitle('選択範囲をHTML化');
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
  // ライブラリの関数でも呼び元シートのデータを取得可能
  //console.log("libtest val=%s",JSON.stringify(SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveRange().getValues()))
}