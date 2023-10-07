<a name="serializeRSAKey"></a>

## serializeRSAKey(key) ⇒ <code>string</code>
[store javascript object rsa private key #28](https://github.com/wwwtyro/cryptico/issues/28)

**Kind**: global function  
**Returns**: <code>string</code> - 文字列  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>RSAKey</code> | RSAキー |


## source

```
/* コアスクリプト */
/** serializeRSAKey: RSAキーを文字列化
 * @param {RSAKey} key - RSAキー
 * @returns {string} 文字列
 * @desc [store javascript object rsa private key #28]{@link https://github.com/wwwtyro/cryptico/issues/28}
 */
 function serializeRSAKey(key) {
  return JSON.stringify({
    coeff: key.coeff.toString(16),
    d: key.d.toString(16),
    dmp1: key.dmp1.toString(16),
    dmq1: key.dmq1.toString(16),
    e: key.e.toString(16),
    n: key.n.toString(16),
    p: key.p.toString(16),
    q: key.q.toString(16)
  })
}
```
