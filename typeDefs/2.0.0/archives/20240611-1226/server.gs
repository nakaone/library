function doGet(e){
  const v = {rv:[]};
  console.log(`doGet start`);
  // html変数に値をセット
  v.template = HtmlService.createTemplateFromFile('index');
  v.template.pId = e.parameter.pId || 0;
  console.log(`pId=${v.template.pId}`);

  // データをシートから取得
  v.data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(e.parameter.sn || 'master').getDataRange().getValues();

  // データをオブジェクト化
  for( v.r=1 ; v.r<v.data.length ; v.r++ ){
    v.o = {};
    for( v.c=0 ; v.c<v.data[v.r].length ; v.c++ ){
      v.o[v.data[0][v.c]] = (arg =>{
        // JSON型の文字列項目はオブジェクト化して保存
        try{ return JSON.parse(arg); }
        catch(e){ return arg; }
      })(v.data[v.r][v.c]);
    }
    v.rv.push(v.o);
  }
  v.template.data = JSON.stringify(v.rv);
  console.log(JSON.stringify(v.template.data));
  
  v.htmlOutput = v.template.evaluate();
  v.htmlOutput.setTitle('typeDefs r.2.0.0');
  console.log(`doGet end`);
  return v.htmlOutput;
}