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

/** deleteAllTriggers: 全てのトリガーを削除 */
function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    ScriptApp.deleteTrigger(trigger);
  }
  Logger.log('全てのトリガーが削除されました。');
}
/** アクティブなセル範囲の情報を取得する
 * @param {void}
 * @returns {Object|Error} 戻り値の内容はv.rvを参照のこと
 */
function getCellInfo(){
  const v = {whois:'getCellInfo',rv:{},step:0};
  console.log(v.whois+' start.');
  try {

    // アクティブなセル範囲を取得
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getActiveSheet();
    v.active = v.sheet.getActiveRange();
    v.rv = {
      spreadId: v.spread.getId(),  // スプレッド(ファイル)のID
      spreadName: v.spread.getName(), // スプレッドの名前
      sheetId: v.sheet.getSheetId(),  // シートのID
      sheetName: v.sheet.getSheetName(),  // シート名
      firstRow: v.active.getRow(),  // 最上行。自然数
      lastRow: v.active.getLastRow(), // 最下行
      firstColumn: v.active.getColumn(),  // 左端列。自然数
      lastColumn: v.active.getLastColumn(), // 右端列
      value: v.active.getValues(), // セルの値
      type: [], // データ型
      format: v.active.getNumberFormats(),
      formula: v.active.getFormulas(),  // 数式
      R1C1: v.active.getFormulasR1C1(), // R1C1形式の数式
      note: v.active.getNotes(), // メモ
      background: v.active.getBackgrounds(),  // 背景色
      fontColor: v.active.getFontColors(),  // 文字色
      fontWeight: v.active.getFontWeights(),  // 太さ　[bold/normal]
      horizontalAlign: v.active.getHorizontalAlignments(),  // 水平位置
      verticalAlign: v.active.getVerticalAlignments(), // 垂直位置
      width: [],  // 列の幅
      height: [], // 行の高さ
      border: [], // 罫線。未対応
    };

    // データ型
    for( v.r=0 ; v.r<v.rv.value.length ; v.r++ ){
      v.l = [];
      for( v.c=0 ; v.c<v.rv.value[v.r].length ; v.c++ ){
        //v.l.push(typeof v.rv.value[v.r][v.c]);
        v.l.push(common.whichType(v.rv.value[v.r][v.c]));
      }
      v.rv.type.push(v.l);
    }
    
    // 列・行の幅
    for( v.c=v.rv.firstColumn ; v.c<=v.rv.lastColumn ; v.c++ ){
      v.rv.width.push(v.sheet.getColumnWidth(v.c));
    }
    for( v.r = v.rv.firstRow ; v.r<=v.rv.lastRow ; v.r++ ){
      v.rv.height.push(v.sheet.getRowHeight(v.r));
    }

    console.log(v.whois+' normal end.\n',v.rv);
    return JSON.stringify(v.rv);

  } catch(e) {
    console.error(e);
    return e;
  }
}
/** 「選択範囲をHTML化」のダイアログを開く */
function showHtmlTableSidebar() {
  //const htmlOutput = HtmlService.createHtmlOutputFromFile('htmlTable');
  // createHtmlOutputFromFileを使用する場合は以下
  const htmlOutput = HtmlService.createTemplateFromFile('htmlTable').evaluate();
  htmlOutput.setTitle('選択範囲をHTML化');
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
  // ライブラリの関数でも呼び元シートのデータを取得可能
  //console.log("libtest val=%s",JSON.stringify(SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveRange().getValues()))
}
/** 変数の型を判定
 * 
 * - 引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
 *
 * @param {any} arg - 判定対象の変数
 * @param {string} [is] - 想定される型(型名の大文字小文字は意識不要)
 * @returns {string|boolean} - 型の名前。is指定有りなら判定対象が想定型かの真偽値
 *
 * @example
 * ```
 * let a = 10;
 * whichType(a);  // 'Number'
 * whichType(a,'string'); // false
 * ```
 *
 * <b>確認済戻り値一覧</b>
 *
 * オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。
 *
 * | 型名 | 戻り値 | 備考 |
 * | :-- | :-- | :-- |
 * | 文字列 | String |  |
 * | 数値 | Number |  |
 * | NaN | NaN |  |
 * | 長整数 | BigInt |  |
 * | 論理値 | Boolean |  |
 * | シンボル | Symbol |  |
 * | undefined | Undefined | 先頭大文字 |
 * | Null | Null |  |
 * | オブジェクト | Object |  |
 * | 配列 | Array |  |
 * | 関数 | Function |  |
 * | アロー関数 | Arrow |  |
 * | エラー | Error | RangeError等も'Error' |
 * | Date型 | Date |  |
 * | Promise型 | Promise |  |
 *
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
 *
 */
function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}

