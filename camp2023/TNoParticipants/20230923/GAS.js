function getTNoParticipants(arg) {
  const v = {whois:'認証局.getTNoParticipants',
    rv:{isErr:false,message:'',stack:'',result:null}};
  try {
    console.log(v.whois+' start.',arg);

    v.step = '1.1'; // getNamedRangeData問合せ用にデータを暗号化
    v.dt = JSON.stringify({
      fc : 'getNamedRangeData',
      arg: {  // getNamedRangeData()に渡す引数
        entryNo    : arg.dt.entryNo,
        rangeName  : 'TNoPerticipans',
      }
    });
    console.log(v.whois+'.'+v.step+': v.dt='+v.dt);

    v.step = '1.2'; // 暗号化。受付番号＋公開鍵なのでencodeURIは省略
    v.dt = cryptico.encrypt(v.dt,arg.master,arg.RSAkey);
    if( v.dt.status !== 'success' )
      throw new Error("getTNoParticipants encrypt failed.\n"+JSON.stringify(v.dt));

    v.step = '2.1'; // getNamedRangeDataに問い合わせ
    v.res = UrlFetchApp.fetch(arg.masterAPI,{
      'method': 'post',
      'contentType': 'application/json',
      'muteHttpExceptions': true, // https://teratail.com/questions/64619
      'payload' : JSON.stringify({
        fm: 'gateway',
        to: 'master',
        md: 3,  // 署名付き暗号化
        ts: Date.now(),
        dt: v.dt.cipher,
      }),
    }).getContentText();
    console.log(v.whois+'.'+v.step+': res='+v.res);
    v.step = '2.2';
    v.rv = JSON.parse(v.res);

    /*
    if( !v.rv.isErr ){
      v.step = '3'; // getNamedRangeData正常終了なら認証局の公開鍵を返信
      v.rv.result = arg.publicKey;
    }
    */

    v.step = '4';
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

function getNamedRangeData(arg){
  const v = {whois:'管理局.getNamedRangeData',
    rv:{isErr:false,message:'',stack:'',result:null}};
  try {
    console.log(v.whois+' start.',arg);

    v.step = '1'; // クライアント情報を抽出
    v.master = szSheet('master');
    v.client = v.master.lookup(arg.dt.entryNo,'entryNo');

    if( (v.client.authority & 2) === 0 ){
      v.step = '2.1'; // 権限無し
      throw new Error('権限がありません');
    } else {
      v.step = '2.2';
      v.rv.result = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(arg.dt.rangeName).getValues();
    }

    v.step = '5';
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