function doGet(e){
  const v = {a:[]};
  v.template = HtmlService.createTemplateFromFile('index');

  v.data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('master').getDataRange().getValues();
  for( v.r=1 ; v.r<v.data.length ; v.r++ ){
    v.o = {};
    for( v.c=0 ; v.c<v.data[v.r].length ; v.c++ ){
      v.o[v.data[0][v.c]] = v.data[v.r][v.c];
    }
    v.a.push(v.o);
  }
  v.template.data = JSON.stringify(v.a);
  v.htmlOutput = v.template.evaluate();
  v.htmlOutput.setTitle('typeDefs');
  return v.htmlOutput;
}
