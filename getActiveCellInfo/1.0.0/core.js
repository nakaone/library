/** アクティブなセル範囲の情報を取得する
 * @param {void}
 * @returns {Object|Error} 戻り値の内容はv.rawを参照のこと
 */
function getActiveCellInfo(){
  const v = {whois:'getCellInfo',rv:{},step:0};
  console.log(v.whois+' start.');
  try {
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getActiveSheet();
    v.active = v.sheet.getActiveRange();
    v.rv = {
      spreadId: v.spread.getId(),
      spreadName: v.spread.getName(),
      sheetId: v.sheet.getSheetId(),
      sheetName: v.sheet.getSheetName(),
      firstRow: v.active.getRow(),
      lastRow: v.active.getLastRow(),
      firstColumn: v.active.getColumn(),
      lastColumn: v.active.getLastColumn(),
      value: v.active.getValues(),
      type: [],
      format: v.active.getNumberFormats(),
      formula: v.active.getFormulas(),
      R1C1: v.active.getFormulasR1C1(),
      note: v.active.getNotes(),
      background: v.active.getBackgrounds(),
      fontColor: v.active.getFontColors(),
      fontWeight: v.active.getFontWeights(),
      horizontalAlign: v.active.getHorizontalAlignments(),
      verticalAlign: v.active.getVerticalAlignments(),
      width: [],
      height: [],
      border: [],
    };
    for( v.r=0 ; v.r<v.rv.value.length ; v.r++ ){
      v.l = [];
      for( v.c=0 ; v.c<v.rv.value[v.r].length ; v.c++ ){
        v.l.push(whichType(v.rv.value[v.r][v.c]));
      }
      v.rv.type.push(v.l);
    }
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