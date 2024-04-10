class authServer {
  //:x:$src/authServer.constructor.js::
  /**
   * @constructor
   */
  constructor(arg){
    const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\narg=${stringify(arg)}`;  // 引数
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }




  //:x:$src/authServer.registMail.js::
  //:x:$src/authServer.login1S.js::
  //:x:$src/authServer.login2S.js::
  //:x:$src/authServer.listAuth.js::
  listAuth(arg){
    const v = {whois:this.constructor.name+'.listAuth',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\narg=${stringify(arg)}`;  // 引数
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }


  //:x:$src/authServer.changeAuth.js::
  //:x:$src/authServer.operation.js::
}