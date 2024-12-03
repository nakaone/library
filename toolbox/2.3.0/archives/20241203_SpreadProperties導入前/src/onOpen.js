function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱');
  // add MenuItem here.
  // ex.`menu.addItem('アイテム1', 'onClickItem1');`
  // サブメニュー使用時はaddSubMenuを使用。以下はソース例
  // menu.addSubMenu(                           // サブメニューをメニューに追加する
  //  ui.createMenu("サブメニュー")             // Uiクラスからメニューを作成する
  //  .addItem("サブアイテム1", "onClickSubItem1") // メニューにアイテムを追加する    
  // );
  menu.addItem('選択範囲をHTML化','showHtmlTableSidebar');
  menu.addSeparator();
  menu.addSubMenu(
    ui.createMenu("GAS Utilities")
    .addItem('全てのトリガーを削除','deleteAllTriggers')
  );
  menu.addToUi();
}

//::$src/deleteAllTriggers.js::
//::$src/getCellInfo.js::
//::$src/showHtmlTableSidebar.js::
//::$lib/whichType/1.0.1/core.js::