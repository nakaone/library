function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱');
  menu.addItem('スプレッドシートの属性情報出力','saveSpread');
  menu.addItem('表示中のシートの属性情報出力','getActiveSheet');
  //menu.addSeparator();
  menu.addSubMenu(
    ui.createMenu("選択範囲をHTML化")
    .addItem('行列記号を付ける','range2html1')
    .addItem('行列記号を付けない','range2html2')
  );
  menu.addSubMenu(
    ui.createMenu("GAS Utilities")
    .addItem('全てのトリガーを削除','deleteAllTriggers')
  );
  menu.addToUi();
}

//// メニュー(onOpen)から呼ばれる関数群 ///////////////////////////////////////////////

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
function range2html1(){ // 選択範囲をHTML化 > 行列記号を付ける
  const sp = new SpreadProperties();
  showSidebar({result:sp.range2html({guide:true})});
}
function range2html2(){ // 選択範囲をHTML化 > 行列記号を付けない
  const sp = new SpreadProperties();
  showSidebar({result:sp.range2html({guide:false})});
}
function deleteAllTriggers() {  // 全てのトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    ScriptApp.deleteTrigger(trigger);
  }
  Logger.log('全てのトリガーが削除されました。');
}

//// ライブラリ ///////////////////////////////////////////////

//::$lib/convertNotation/1.0.0/core.js::
//::$lib/mergeDeeply/1.1.0/core.js::
//::$lib/showSidebar/1.0.0/core.js::
//::$lib/SpreadProperties/1.1.0/core.js::
//::$lib/stringify/1.1.1/core.js::
//::$lib/toLocale/1.1.0/core.js::
//::$lib/whichType/1.0.1/core.js::