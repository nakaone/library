function onOpen() {
  db = SpreadDB(cf);
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱');
  menu.addItem('ファイル一覧更新', 'menuItem1');
  // 「YFPのPDFファイル結合」はrefreshFiles内で行うのでメニュー化しない
  menu.addItem('提出用HTML出力', 'menuItem2');
  menu.addItem('作業手順書', 'menuItem3');
  menu.addToUi();
}

const menuItem1 = () => refreshFiles();
const menuItem2 = () => {
  var html = HtmlService.createTemplateFromFile("download").evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, "作成中");
};
const menuItem3 = () => {
  /*
  const html = HtmlService.createHtmlOutputFromFile('help')
    .setWidth(800)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'kzヘルプ');
  */
};