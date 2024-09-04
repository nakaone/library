/** 文字化けテスト
 * 
 * 日本語文字列を含むオブジェクトを暗号化する際、現在行っている"obj -> json -> b64 -> enc"とすると
 * 暗号文にURLアンセーフな'+','/','='が残る可能性がある。
 * 
 * "obj -> json -> enc -> b64"だとURLセーフになるが、復号時に日本語文字列は正常に復号されるかを検証する。
 * 
 * 【結論】懸念通り、正常に復号されない。よって以下手順で暗号化・送信・復号する
 * 
 * 1. 暗号化手順
 *    1. JSON化     : v.json = JSON.stringify(送信データ)
 *    2. base64化   : v.b64 = encB64(v.json)
 *    3. 暗号化      : v.enc = cryptico.encrypt(v.b64)
 *    4. URLセーフ化 : v.param = encURL(v.enc)
 * 
 * -- v.paramをURLクエリパラメータ文字列として送信 --
 * 
 * 2. 復号手順
 *    1. URLセーフ解除 : v.cipher = decURL(v.param)
 *    2. 復号         : v.dec = cryptico.decrypt(v.cipher)
 *    3. base64解除   : v.json = decB64(v.dec.plaintext)
 *    4. Object化     : v.obj = JSON.parse(v.json)
 * 
 * - Qiita [crypticoでPure JavaScriptによる公開鍵暗号を用いるメモ](https://qiita.com/miyanaga/items/8692d0742a49fb37a6da)
 */
function test01(){
  const v = {whois:'test01',step:0,rv:null,
    b64enc: text => {
      const r = Utilities.base64Encode(text, Utilities.Charset.UTF_8);
      return r.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    },
    b64dec: text => {
      const r = Utilities.newBlob(Utilities.base64Decode(text, Utilities.Charset.UTF_8)).getDataAsString();
      return r.replace(/-/g, "+").replace(/_/g, "/");
    },
    encB64: text => Utilities.base64Encode(text, Utilities.Charset.UTF_8),
    decB64: text => Utilities.newBlob(Utilities.base64Decode(text, Utilities.Charset.UTF_8)).getDataAsString(),
    encURL: text => text.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"),
    decURL: text => text.replace(/-/g, "+").replace(/_/g, "/"),
  };
  console.log(`${v.whois} starv.`);
  try {

    v.step = 1.1; // サーバ側鍵ペアの生成
    v.password = 'n2-hpfZH/gg_SZv)';
    v.bits = 1024;
    v.SSkey = cryptico.generateRSAKey(v.password,v.bits);
    v.SPkey = cryptico.publicKeyString(v.SSkey);

    v.step = 1.2;  // クライアント側鍵ペアの生成
    v.password = '2FSpY-FZ4NWNm!5/';
    v.CSkey = cryptico.generateRSAKey(v.password,v.bits);
    v.CPkey = cryptico.publicKeyString(v.CSkey); // 相手側公開鍵



    v.step = 2; // テストデータ
    v.json = JSON.stringify({
      a: 'これは日本語文字列です',
      b: 'a+b/c=d', // URLアンセーフ文字を含むASCII文字
      c1: 10, c2: null, c3: false,
    });
    vlog(v,'json',43);


    /* NG : step.5のJSON.parseでエラー発生

    v.step = 3; // クライアント -> サーバへのURLクエリ文字列作成
    v.enc = cryptico.encrypt(v.json,v.SPkey,v.CSkey);  // 署名あり
    vlog(v,'enc',47);
    v.b64 = v.b64enc(v.enc.cipher);
    vlog(v,'b64',49);

    v.step = 4; // 変換結果にアンセーフ文字が含まれているか検証
    console.log(
      `b64 include unsafe ? : `
      + (v.b64.indexOf('+') === -1 && v.b64.indexOf('/') === -1 && v.b64.indexOf('=') === -1)
      ? 'not include(safe)' : 'include(unsafe)'
    );

    v.step = 5; // サーバ側で復号してみる
    v.cipher = v.b64dec(v.b64);
    vlog(v,'cipher',56);
    v.dec = cryptico.decrypt(v.cipher,v.SSkey);
    vlog(v,'dec',58);
    v.obj = JSON.parse(v.dec.plaintext);  // Bad control character in string literal in JSON at position 9 (line 1 column 10)
    vlog(v,'obj',60);
    */

    v.step = 3; // クライアント -> サーバへのURLクエリ文字列作成
    v.b64 = v.encB64(v.json);
    vlog(v,'b64',85);
    v.enc = cryptico.encrypt(v.b64,v.SPkey,v.CSkey);  // 署名あり
    vlog(v,'enc',87);
    v.arg = v.encURL(v.enc.cipher);
    vlog(v,'arg',89);

    v.step = 4; // 変換結果にアンセーフ文字が含まれているか検証
    console.log(
      `arg include unsafe ? : `
      + (v.arg.indexOf('+') === -1 && v.arg.indexOf('/') === -1 && v.arg.indexOf('=') === -1)
      ? 'not include(safe)' : 'include(unsafe)'
    );

    v.step = 5; // サーバ側で復号してみる
    v.cipher = v.decURL(v.arg);
    vlog(v,'cipher',100);
    v.dec = cryptico.decrypt(v.cipher,v.SSkey);
    vlog(v,'dec',102);
    v.json = v.decB64(v.dec.plaintext);
    vlog(v,'json',104);
    v.obj = JSON.parse(v.json);  // Bad control character in string literal in JSON at position 9 (line 1 column 10)
    vlog(v,'obj',106);

    v.step = 6; // データ型が保存されているか確認
    Object.keys(v.obj).forEach(x => vlog(v.obj,x,109))

    console.log(`${v.whois} normal end.`);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
  }
}