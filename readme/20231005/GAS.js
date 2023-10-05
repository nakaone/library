// ena.kaon@gmail.com > マイドライブ > projects > library.sheet
// アクティブスプレッドシートの全シートの全データ領域を取得、Object.<string,any>[]で返す
function doGet(e){
  const v = {rv:{}};
  SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(x => {
    v.name = x.getSheetName();
    v.rv[v.name] = [];
    v.values = x.getDataRange().getValues();
    for( v.i=1 ; v.i<v.values.length ; v.i++ ){
      v.o = {};
      for( v.j=0 ; v.j<v.values[v.i].length ; v.j++ ){
        v.o[v.values[0][v.j]] = v.values[v.i][v.j];
      }
      v.rv[v.name].push(v.o);
    }
  });
  console.log(v.rv);
  const type = ContentService.MimeType.JSON;
  return ContentService.createTextOutput(JSON.stringify(v.rv)).setMimeType(type);
}