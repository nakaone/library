function doGet(e){
  const v = {a:[]};
  v.template = HtmlService.createTemplateFromFile('index');
  v.template.pId = e.parameter.pId || 0;

  v.data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(e.parameter.sn || 'master').getDataRange().getValues();
  for( v.r=1 ; v.r<v.data.length ; v.r++ ){
    v.o = {};
    for( v.c=0 ; v.c<v.data[v.r].length ; v.c++ ){
      v.o[v.data[0][v.c]] = v.data[v.r][v.c];
    }
    v.a.push(v.o);
  }
  v.template.data = JSON.stringify(v.a);
  
  v.htmlOutput = v.template.evaluate();
  v.htmlOutput.setTitle('typeDefs r.1.2.0');
  return v.htmlOutput;
}

/** refFunc: 参照している関数/メソッドのnIdから関数名/メソッド名を引用 */
function refFunc(nId,list){
  const v = {whois:'refFunc',map:{},rv:[],step:0};
  try {
    v.step = 1; // nId->関数/メソッド名のマップを作成
    list.forEach(x => v.map[x[0]] = x[1]);

    v.step = 2; // 戻り値の設定
    for( v.i=0 ; v.i<nId.length ; v.i++ ){
      v.nId = nId[v.i][0];
      v.list = typeof v.nId === 'number' ? [v.nId]
      : (v.nId.length === 0 ? [] : v.nId.split(','));
      v.str = '';
      if( v.list.length > 0 ){
        v.list.forEach(x => v.str += `${x}:${v.map[x]}\n`);
        v.str = v.str.slice(0,v.str.length-1);
      }
      v.rv[v.i] = [v.str];
    }
    return v.rv
  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`
    + `\nnId=${JSON.stringify(nId)}\nlist=${JSON.stringify(list)}`;
    return e.message;
  }
}
