function delivery(arg){
  const v = {whois:'認証局.delivery',
  rv:{isErr:false,message:'',stack:'',result:[]}};
  try {
    console.log(v.whois+' start.',arg);

    v.notices = SpreadsheetApp.getActive().getSheetByName('notice').getDataRange().getValues();
    for( v.i=1 ; v.i<v.notices.length ; v.i++ ){
      // タイムスタンプが空白なら対象外
      if( String(v.notices[v.i][0]).length === 0 ) continue;
      // 日本標準時ではなくUTCになるので、タイムスタンプのみ変換
      v.o = {timestamp:new Date(v.notices[v.i][0]).getTime()};
      for( v.j=1 ; v.j<v.notices[0].length ; v.j++ ){
        v.o[v.notices[0][v.j]] = v.notices[v.i][v.j];
      }
      v.rv.result.push(v.o);
    }

    v.step = '3';
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end.(at step.'+v.step+')\n'
    + e.message + '\n' + e.stack);
    console.error(JSON.stringify(v));
    v.rv.isErr = true;
    v.rv.message = e.message;
    v.rv.stack = e.stack;
    return v.rv;
  }
}

function post(arg){
  const v = {whois:'認証局.post',
  rv:{isErr:false,message:'',stack:'',result:[]}};
  try {
    console.log(v.whois+' start.',arg);

    v.step = '1';
    SpreadsheetApp.getActive().getSheetByName('notice').appendRow([
      arg.dt.timestamp,  // timestamp
      arg.dt.from,       // from
      arg.dt.to,         // to
      arg.dt.message     // message
    ]);

    v.step = '2';
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end.(at step.'+v.step+')\n'
    + e.message + '\n' + e.stack);
    console.error(JSON.stringify(v));
    v.rv.isErr = true;
    v.rv.message = e.message;
    v.rv.stack = e.stack;
    return v.rv;
  }
}