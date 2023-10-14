/* コアスクリプト */
/**
 * @typedef {Object} jsonRange
 * @prop {string} spreadId - スプレッド(ファイル)のID
 * @prop {string} spreadName - スプレッドの名前
 * @prop {number} sheetId - シートのID
 * @prop {string} sheetName - シート名
 * @prop {number} firstRow - 最上行。自然数
 * @prop {number} lastRow - 最下行
 * @prop {number} firstColumn - 左端列。自然数
 * @prop {number} lastColumn - 右端列
 * @prop {string[][]} value - セルの値
 * @prop {string[][]} type - データ型
 * @prop {string[][]} format - 表示形式
 * @prop {string[][]} formula - 数式
 * @prop {string[][]} R1C1 - R1C1形式の数式
 * @prop {string[][]} note - メモ
 * @prop {string[][]} background - 背景色
 * @prop {string[][]} fontColor - 文字色
 * @prop {string[][]} fontWeight - 太さ　[bold/normal]
 * @prop {string[][]} horizontalAlign - 水平位置
 * @prop {string[][]} verticalAlign - 垂直位置
 * @prop {number[]} width - 列の幅
 * @prop {number[]} height - 行の高さ
 * @prop {void} border - 罫線。未対応
 */


/**
 * Googleスプレッド上で、選択範囲のセル情報をJSON化してmsgBoxに表示
 *
 * 出力結果は[gSpreadTabulize](gSpreadTabulize.html)でHTML化し、HTML,MD等に貼り付け
 *
 * @param {void}
 * @returns {jsonRange}
 */
 function jsonRange(){
  const v = {rv:{}};
  console.log('jsonRange start.');
  // アクティブなセル範囲
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
  }

  // データ型
  for( v.r=0 ; v.r<v.rv.value.length ; v.r++ ){
    v.l = [];
    for( v.c=0 ; v.c<v.rv.value[v.r].length ; v.c++ ){
      v.l.push(whichType(v.rv.value[v.r][v.c]));
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

  // 改行は<br>に置換
  v.rv = JSON.stringify(v.rv).replaceAll('\\n','<br>');

  console.log(v.rv);
  console.log('jsonRange end.');
  Browser.msgBox(v.rv);
}
