function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱')
  .addItem("選択範囲をHTML化",menu01);
  // サブメニュー使用時はaddSubMenuを使用
  menu.addToUi();
}

/** メニュー選択時に実行する関数群 */
function menu01(){
  showSidebar('選択範囲をHTML化','range2Table');
}

/** サイドバー(ダイアログ)を開く */
function showSidebar(dialogTitle,dialogName) {
  const htmlOutput = HtmlService.createTemplateFromFile(dialogName).evaluate();
  htmlOutput.setTitle(dialogTitle);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}