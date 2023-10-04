<a name="genToken"></a>

## genToken(arg) ⇒ <code>string</code>
genToken: トークンを作成

**Kind**: global function  
**Returns**: <code>string</code> - トークン(token)を自署＋送信先公開鍵で暗号化した文字列  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>object</code> | 引数オブジェクト |
| arg.to | <code>string</code> | 宛先(front/入力された受付番号) |
| arg.fc | <code>string</code> | 機能名 |


## source

```
/* コアスクリプト */
/** genToken: トークンを作成
 * @param {object} arg - 引数オブジェクト
 * @param {string} arg.to - 宛先(front/入力された受付番号)
 * @param {string} arg.fc - 機能名
 * @returns {string} トークン(token)を自署＋送信先公開鍵で暗号化した文字列
 */
 function genToken(arg){
  const v = {whois:'GAS.genToken',arg:arg,rv:null};
  try {
    console.log(v.whois+' start.\n',arg);

    v.step = '1'; // 宛先の公開鍵を特定
    v.publicKey = isNaN(arg.to)
    ? config[arg.to].publicKey  // front/gatewayの場合
    : config.publicKey[arg.to]; // 受付番号の場合
    
    v.step = '2'; // 戻り値用のトークン作成
    v.encrypt = cryptico.encrypt(JSON.stringify({
      fm:config.myself.name,to:arg.to,fc:arg.fc,ts:Date.now()
    }),v.publicKey,config.myself.RSAkey);
    if( v.encrypt.status !== 'success' )
      throw new Error(v.whois+': Encrypt error\n'+JSON.stringify(v.encrypt));

    v.step = '3'; // 終了処理
    v.rv = v.encrypt.cipher;
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}
```
