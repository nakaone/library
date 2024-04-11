class authServer {
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

/** GAS側の初期化処理
 * システム導入・再初期化時のみ実行。実行後はソースファイルごとシートから削除すること。
 * @param {Object} arg
 * @param {string} [arg.passphrase] - RSAキーのパスフレーズ
 * @returns {void}
 */
initialize(arg){
  const v = {whois:this.constructor.name+'.initialize',rv:null,step:0,default:{
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

    v.step = 1; // 事前準備
    v.name = arg.name || v.default.name;
    v.conf = Object.assign({},(
    PropertiesService.getDocumentProperties().getProperty(v.name)
    || {}), v.default, arg);

    // ------------------------------------------
    v.step = 2; // シートアクセス権の取得
    // ------------------------------------------

    // ------------------------------------------
    v.step = 3; // server側鍵ペア生成
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
    console.log(`${v.whois} normal end.\n${PropertiesService.getDocumentProperties().getProperty(v.conf.name)}`);
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
