function authServer(userId=null,func=null,arg=null) {
  const v = {whois:'authServer',rv:null,step:0,func:{}};
  console.log(`${v.whois} start.`);
  try {

/** GAS側の初期化処理
 * システム導入・再初期化時のみ実行。実行後はソースファイルごとシートから削除すること。
 * @param {Object} [arg={}] - 内容はv.default参照
 * @returns {Object} - 内容はv.default参照
 */
v.func.initialize = function(arg={}){
  const v = {whois:'authServer.initialize',rv:null,step:0,default:{
    name: 'authServer', // プロパティサービスに保存する際のラベル
    RSA:{
      bits: 2048,  // ビット長
      passphrase: createPassword(16), // 16桁のパスワードを自動生成
      publicKey: null, // 公開鍵
      privateKey: null, // 秘密鍵
    },
  }};
  console.log(`${v.whois} start.`);
  try {

    // ------------------------------------------
    v.step = 1; // 事前準備
    // ------------------------------------------
    v.name = arg.hasOwnProperty('name') ? arg.name : v.default.name;
    v.conf = Object.assign({},(
    PropertiesService.getDocumentProperties().getProperty(v.name)
    || {}), v.default, arg);
    v.step = 1.2; // 引数による設定値変更指示が無く、且つ鍵ペア生成済ならそのまま使用
    if( Object.keys(arg).length === 0 && v.conf.RSA.publicKey === null ){
      console.log(`${v.whois} normal end.\n${v.conf}`);
      return v.conf;
    }

    // ------------------------------------------
    v.step = 2; // server側鍵ペアの生成
    // ------------------------------------------
    v.conf.RSA.privateKey = // 秘密鍵の生成
    cryptico.generateRSAKey(v.conf.RSA.passphrase, v.conf.RSA.bits);
    v.conf.RSA.publicKey =  // 公開鍵の生成
    cryptico.publicKeyString(v.conf.RSA.privateKey);

    // ------------------------------------------
    v.step = 3; // v.conf情報の作成と保存
    // ------------------------------------------

    v.step = 9; // 終了処理
    // プロパティサービスへの保存
    PropertiesService.getDocumentProperties().setProperty(v.conf.name,v.conf);
    // 保存結果を表示して終了
    v.rv = v.conf;
    console.log(`${v.whois} normal end.\n${v.conf}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nv.conf=${stringify(v.conf)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

//:x:$src/server.registMail.js::
//:x:$src/server.login1S.js::
//:x:$src/server.login2S.js::
//:x:$src/server.listAuth.js::
//:x:$src/server.changeAuth.js::
//:x:$src/server.operation.js::

    v.config = v.func.initialize();
    console.log(`v.config=${v.config}`);

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
