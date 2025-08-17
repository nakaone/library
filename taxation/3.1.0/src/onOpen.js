function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱');
  menu.addItem('ファイル一覧(files)更新', 'menuItem1');
  // 「YFPのPDFファイル結合」はrefreshFiles内で行うのでメニュー化しない
  menu.addItem('エクスポート', 'menuItem2');
  menu.addItem('提出用HTML出力', 'menuItem3');
  menu.addItem('作業手順書', 'menuItem4');
  menu.addToUi();
}

const menuItem1 = () => refreshFiles();
const menuItem2 = () => db.export();
const menuItem3 = () => createReport();
const menuItem4 = () => {
  const html = HtmlService.createHtmlOutputFromFile('help')
    .setWidth(800)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, '作業手順書');
};