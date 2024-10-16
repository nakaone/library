function doGet(e){
  const v = {whois:'doGet',step:0,rv:{}};
  console.log(`${v.whois} start.\ne.parameter=${stringify(e.parameter)}`);
  try {

    console.log(`${v.whois} step ${v.step} end.`);


    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    v.rv = {status:-1,message:e.message};
  } finally {
    return ContentService
    .createTextOutput(JSON.stringify(v.rv,null,2))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

class encryptedQuery {
  
}
class encryptedQueryServer extends encryptedQuery {
  constructor(arg){
    const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
    try {
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}
