function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱')
  .addItem("選択範囲をHTML化","range2Table");
  // サブメニュー使用時はaddSubMenuを使用
  menu.addToUi();
}

function range2Table(){
  const htmlOutput = HtmlService.createTemplateFromFile('range2Table').evaluate();
  htmlOutput.setTitle('選択範囲をHTML化');
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}