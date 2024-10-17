/** setup: DocumentPropertiesに設定情報を保存
 * - 【プロジェクト毎にソースを修正】して使用のこと。
 * - Qiita [crypticoでPure JavaScriptによる公開鍵暗号を用いるメモ](https://qiita.com/miyanaga/items/8692d0742a49fb37a6da)
 */
function setup(){
  const v = {whois:'setup',step:0,rv:null,conf:{}};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 鍵ペアの作成
    v.password = createPassword();
    if( v.password instanceof Error ) throw v.password;
    v.bits = 1024;
    v.key = cryptico.generateRSAKey(v.password,v.bits);

    v.config = {
      keyGenerate: Date.now(),
      keyLength: v.bits,
      SPkey: cryptico.publicKeyString(v.key),
      SSkey: JSON.stringify(v.key.toJSON()),  // 文字列化された秘密鍵
      encryptedQuery: {
        userSheetName: 'user',
        logSheetName: 'log',
        validityPeriod: 86400000,
        graceTime: 600000,
      },
      tables: {
        user: {
          range: 'user',
          IDcol: 'userId',
        },
        log: {
          range: 'log',
        },
      }
    };

    v.step = 2; // DocumentPropertiesへの保存
    PropertiesService.getDocumentProperties().setProperty('config',JSON.stringify(v.config));

    v.step = 3; // 保存内容の確認、終了処理
    console.log(`${v.whois} normal end.\n${PropertiesService.getDocumentProperties().getProperty('config')}`);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
  }
}