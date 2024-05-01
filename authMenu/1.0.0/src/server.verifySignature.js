/** クライアント側の署名を検証、引数を復号してオブジェクト化する
 * @param {number} userId - ユーザID
 * @param {string} arg - クライアント側での暗号化＋署名結果(文字列)
 * @returns {Object|Error} 復号化したオブジェクト
 * 
 * **参考：パスフレーズ・秘密鍵・公開鍵の一括保存はできない**
 * 
 * `{passPhrase:〜,privateKey:〜,publicKey:〜}`のように一括して保存しようとすると、以下のエラーが発生。
 * 
 * ```
 * You have exceeded the property storage quota.
 * Please remove some properties and try again.
 * ```
 * 
 * 原因は[プロパティ値のサイズ](https://developers.google.com/apps-script/guides/services/quotas?hl=ja)が超過したため。
 * ⇒ max 9KB/値なので、パスフレーズ・公開鍵・秘密鍵は別々のプロパティとして保存が必要
 */
w.func.verifySignature = function(userId=null,arg=null){
  const v = {whois:w.whois+'.verifySignature',rv:{result:0,message:'',obj:null},step:0};
  console.log(`${v.whois} start.`);
  try {

    // ---------------------------------------------
    v.step = 1; // 事前準備
    // ---------------------------------------------
    v.step = 1.1; // 引数チェック。userId, argは共に必須
    if( userId === null ) throw new Error(`${v.whois} Error: no userId.`);
    if( arg === null ) throw new Error(`${v.whois} Error: no arg.`);

    v.step = 1.2; // サーバ側鍵ペアの取得・生成　※親関数のwhoisを使用
    v.RSA = PropertiesService.getDocumentProperties().getProperty(w.whois).RSA;


    // ---------------------------------------------
    v.step = 2; // クライアント側情報の取得
    // ---------------------------------------------
    v.step = 2.1; // シートから全ユーザ情報の取得
    v.master = new SingleTable(w.prop.masterSheet);
    if( v.master instanceof Error ) throw v.master;

    v.step = 2.2; // 対象ユーザ情報の取得
    v.user = v.master.select({where: x => x[w.prop.primatyKeyColumn] === userId});
    if( v.user instanceof Error ) throw v.user;

    v.step = 2.3 // userIdがシートに存在しない
    if( v.user.length === 0 ){
      v.rv.result = 1;
      console.log(`${v.whois}: no userId on sheet ${w.prop.masterSheet} (step ${v.step}).`);
      return v.rv;
    }
    
    // ---------------------------------------------
    v.step = 3; // 引数の復元
    // 【以下の処理におけるv.rvオブジェクトのメンバ】
    // - result {number}
    //   - 0: 正常終了
    //   - 1: userIdがシートに存在しない
    //   - 2: 不適切な暗号化(decrypt.status != 'success')
    //   - 3: 不適切な署名(decrypt.publicKeyString != sheet.CPkey)<br>
    //     ※ decrypt.signatureは常に"forged"で"verified"にならないため、CPkeyを比較
    //   - 4: CPkey有効期限切れ
    // - message='' {string} エラーだった場合のメッセージ
    // - obj=null {object} 復号したオブジェクト
    // ---------------------------------------------
    v.decrypt = cryptico.decrypt(arg,v.RSA.SPkey);
    //console.log(`v.decrypt=${stringify(v.decrypt)}`);
    if( v.decrypt.status !== 'success' ){
      v.step = 3.1; // 復号不可
      v.rv.result = 2;
      v.rv.message = `${v.whois}: decrypt error (step ${v.step}).`
      + `\nstatus="${v.decrypt.status}"`
      + `\nplaintext="${v.decrypt.plaintext}"`
      + `\nsignature="${v.decrypt.signature}"`
      + `\npublicKeyString="${v.decrypt.publicKeyString}"`
      + `\npublicKeyID="${v.decrypt.publicKeyID}"`
      + `\nverify="${v.decrypt.verify}"`
      + `\nvalidityPeriod="${v.decrypt.validityPeriod}"`;
    } else if( v.decrypt.publicKeyString !== v.user.CPkey ){
      v.step = 3.2; // 不適切な署名(CPkey不一致)
      v.rv.result = 3;
      v.rv.message = `${v.whois}: CPkey unmatch (step ${v.step}).`
      + `\nv.decrypt.publicKeyString=${v.decrypt.publicKeyString}`
      + `\nv.user.CPkey=${v.user.CPkey}`;
    } else if( (new Date(v.user.updated).getTime() + w.prop.userLoginLifeTime) < Date.now() ){
      v.step = 3.3; // CPkey有効期限切れ
      v.rv.result = 4;
      v.rv.message = `${v.whois}: CPkey expired (step ${v.step}).`
      + `\nupdated: ${v.user.updated})`
      + `\nuserLoginLifeTime: ${w.prop.userLoginLifeTime/3600000} hours`
      + `\nDate.now(): ${toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn')}`;
    } else {
      v.step = 3.4; // 正常終了
      v.rv.obj = JSON.parse(v.decrypt.plaintext);
    }
    if( v.rv.result > 0 ) throw new Error(v.rv.message);

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv.obj;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    return e;
  }
}
w.r = w.func.verifySignature(userId,arg);
if( w.r instanceof Error ) throw w.r;
