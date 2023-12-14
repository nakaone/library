/** スプレッドシート独自メニューから呼ばれる関数 */
function range2TableMenu(){
  const htmlOutput = HtmlService.createTemplateFromFile('range2Table').evaluate();
  htmlOutput.setTitle('選択範囲をHTML化');
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}