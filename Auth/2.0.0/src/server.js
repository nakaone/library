class authServer {
  //::$src/server.constructor.js::

  //::$src/server.initalize.js::

  //:x:$src/server.registMail.js::
  //:x:$src/server.login1S.js::
  //:x:$src/server.login2S.js::
  //:x:$src/server.listAuth.js::
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


  //:x:$src/server.changeAuth.js::
  //:x:$src/server.operation.js::
}