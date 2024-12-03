function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱');
  menu.addItem('スプレッドシートの属性情報出力','saveSpread');
  menu.addItem('表示中のシートの属性情報出力','getActiveSheet');
  //menu.addItem('選択範囲をHTML化','showHtmlTableSidebar');
  //menu.addSeparator();
  menu.addSubMenu(
    ui.createMenu("GAS Utilities")
    .addItem('全てのトリガーを削除','deleteAllTriggers')
  );
  menu.addToUi();
}

function saveSpread(){
  const sp = new SpreadProperties();
  return sp.saveSpread('saveSpread') // 自分自身の関数名を引数とする
}
function getActiveSheet(){
  const sp = new SpreadProperties();
  const rv = sp.getSheet();
  const ui = SpreadsheetApp.getUi();
  ui.alert(`Sheet "${rv.Name}"`,JSON.stringify(rv), ui.ButtonSet.OK);
}

//::$src/deleteAllTriggers.js::
//::$lib/SpreadProperties/1.1.0/core.js::
//::$lib/stringify/1.1.1/core.js::
//::$lib/toLocale/1.1.0/core.js::
//::$lib/whichType/1.0.1/core.js::