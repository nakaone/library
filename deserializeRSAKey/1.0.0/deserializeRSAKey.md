<a name="deserializeRSAKey"></a>

## deserializeRSAKey(key) ⇒ <code>RSAKey</code>
[store javascript object rsa private key #28](https://github.com/wwwtyro/cryptico/issues/28)

**Kind**: global function  
**Returns**: <code>RSAKey</code> - RSAキー  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | 文字列化されたRSAキー |


## source

```
/* コアスクリプト */
/** deserializeRSAKey: 文字列化されたRSAキーを復元
 * @param {string} key - 文字列化されたRSAキー
 * @returns {RSAKey} RSAキー
 * @desc [store javascript object rsa private key #28]{@link https://github.com/wwwtyro/cryptico/issues/28}
 */
 function deserializeRSAKey(key) {
  let json = JSON.parse(key);
  let rsa = new RSAKey();
  rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);
  return rsa;
}
```
