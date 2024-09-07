//::$src/config.js::
/** setup: 設定情報(conf)のDocumentPropertiesへの保存、要権限機能の呼び出しと権限付与
 * - Qiita [crypticoでPure JavaScriptによる公開鍵暗号を用いるメモ](https://qiita.com/miyanaga/items/8692d0742a49fb37a6da)
 */
function setup(){
  const v = {whois:'setup',step:0,rv:null,conf:{}};
  console.log(`${v.whois} start.`);
  try {

    v.conf = config();

    (()=>{  v.step = 1; // GAS側鍵ペア生成、DocumentPropertiesへの保存

      v.key = cryptico.generateRSAKey(v.conf.master.password,v.conf.master.bits);
      v.conf.SPkey = cryptico.publicKeyString(v.key);
      v.conf.SSkey = JSON.stringify(v.key.toJSON());  // 文字列化された秘密鍵

      v.prop = PropertiesService.getDocumentProperties()
      v.prop.setProperty(v.conf.sys.storageKey,JSON.stringify(v.conf));
    })();

    v.crypticoTest = () => { // 暗号化テストの定義

      v.step = -1;  // 相手側鍵ペアの生成
      const t = {};
      t.password = '2FSpY-FZ4NWNm!5/';
      t.CSkey = cryptico.generateRSAKey(t.password,v.conf.master.bits);
      t.CPkey = cryptico.publicKeyString(t.CSkey); // 相手側公開鍵

      v.step = -2; // GAS側鍵ペアの復元
      t.SPkey = v.conf.SPkey;
      t.SSkey = RSAKey.parse(v.conf.SSkey);

      v.step = -3; // テストデータ作成
      t.plain = 'これはテスト用文字列です';
      // 日本語文字列は化けて動作不良を起こす場合も有るので、base64化する
      t.obj = {base64:Utilities.base64Encode(t.plain, Utilities.Charset.UTF_8)};
      t.json = JSON.stringify(t.obj);
      console.log(`t.json(${whichType(t.json)})=${t.json}`);

      v.step = -4; // 暗号化
      t.enc01 = cryptico.encrypt(t.json,t.SPkey);  // 署名無し
      t.enc02 = cryptico.encrypt(t.json,t.SPkey,t.CSkey);  // 署名あり
      console.log(`t.enc01=${stringify(t.enc01)}\nt.enc02=${stringify(t.enc02)}`);

      v.step = -5; // 復号
      t.dec01 = cryptico.decrypt(t.enc01.cipher,t.SSkey);
      t.dec02 = cryptico.decrypt(t.enc02.cipher,t.SSkey);
      console.log(`t.dec01=${stringify(t.dec01)}\nt.dec02=${stringify(t.dec02)}`);

      v.step = -6; // 結果の検証
      t.obj01 = JSON.parse(t.dec01.plaintext);
      t.obj01.plain = Utilities.newBlob(Utilities.base64Decode(t.obj01.base64, Utilities.Charset.UTF_8)).getDataAsString();
      console.log(`t.obj01=${stringify(t.obj01)}`);
      t.obj02 = JSON.parse(t.dec02.plaintext);
      t.obj02.plain = Utilities.newBlob(Utilities.base64Decode(t.obj02.base64, Utilities.Charset.UTF_8)).getDataAsString();
      t.obj02.isSame = t.dec02.publicKeyString === t.CPkey; // 署名の一致を検証
      console.log(`t.obj02=${stringify(t.obj02)}`);
    };

    (()=>{  v.step = 9; // テスト実行、終了処理

      // 暗号化・復号の動作確認
      v.crypticoTest();

      console.log(`${v.whois} normal end.\n${v.prop.getProperty(v.conf.sys.storageKey)}`);
    })();

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
  }
}