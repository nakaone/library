/** サーバ側固有の設定情報 */
const config = {
  name: 'authServer', // プロパティサービスに保存する際のラベル
  RSA:{
    bits: 2048,  // ビット長
    passphrase: 'HkI/yP~TeU&Qcd<6IjL6-X96MhH7LJag',
    publicKey: null, // 公開鍵
    privateKey: null, // 秘密鍵
  },
};
/** GAS側の初期化処理
 * システム導入・再初期化時のみ実行。実行後はソースファイルごとシートから削除すること。
 * @param {void}
 * @returns {void}
 */
function initialize(){
  const v = {whois:'initialize',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    // ------------------------------------------
    v.step = 1; // シートアクセス権の取得
    // ------------------------------------------

    // ------------------------------------------
    v.step = 2; // server側鍵ペア生成
    // ------------------------------------------
    config.RSA.privateKey = // 秘密鍵の生成
    cryptico.generateRSAKey(config.RSA.passphrase, config.RSA.bits);
    config.RSA.publicKey =  // 公開鍵の生成
    cryptico.publicKeyString(config.RSA.privateKey);

    // ------------------------------------------
    v.step = 3; // config情報の作成と保存
    // ------------------------------------------

    v.step = 9; // 終了処理
    // プロパティサービスへの保存
    PropertiesService.getDocumentProperties().setProperty(config.name,config);
    // 保存結果を表示して終了
    console.log(`${v.whois} normal end.\n${PropertiesService.getDocumentProperties().getProperty(config.name)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nconfig=${stringify(config)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
