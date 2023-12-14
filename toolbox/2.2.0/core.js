function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱')
  // add MenuItem here.
  // サブメニュー使用時はaddSubMenuを使用
  menu.addToUi();
}