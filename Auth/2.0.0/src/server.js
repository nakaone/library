function authServer(userId=null,func=null,arg=null) {
  const v = {whois:'authServer',rv:null,step:0,func:{}};
  console.log(`${v.whois} start.`);
  try {

//::$src/server.initalize.js::

//:x:$src/server.registMail.js::
//:x:$src/server.login1S.js::
//:x:$src/server.login2S.js::
//:x:$src/server.listAuth.js::
//:x:$src/server.changeAuth.js::
//:x:$src/server.operation.js::

    v.step = 1; // 公開鍵・秘密鍵をv.configに取得
    v.config = v.initialize();
    console.log(`v.config.passPhrase=${v.config.passPhrase}\nv.config.publicKey=${v.config.publicKey}`);

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nuserId=${userId}\nfunc=${func}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}