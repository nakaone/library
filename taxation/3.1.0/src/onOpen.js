function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱');
  menu.addItem('ファイル一覧更新', 'menuItem1');
  menu.addItem('YFP関係証憑の結合', 'menuItem2');
  menu.addItem('提出用HTML出力', 'menuItem3');
  menu.addItem('作業手順書', 'menuItem4');
  menu.addToUi();
}

const menuItem1 = () => {};
const menuItem2 = () => concatYFP();
const menuItem3 = () => {
  var html = HtmlService.createTemplateFromFile("download").evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, "作成中");
};
const menuItem4 = () => {
  /*
  const html = HtmlService.createHtmlOutputFromFile('help')
    .setWidth(800)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'kzヘルプ');
  */
};