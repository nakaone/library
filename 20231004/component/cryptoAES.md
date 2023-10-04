lastUpdate: 2023年 7月30日 日曜日 13時59分11秒 JST

## Functions

<dl>
<dt><a href="#encryptAES">encryptAES(text, pass)</a> ⇒ <code><a href="#encryptAES">encryptAES</a></code></dt>
<dd><p>共通鍵(AES)による暗号化処理</p>
</dd>
<dt><a href="#decryptAES">decryptAES(encryptedData, pass)</a> ⇒ <code>string</code></dt>
<dd><p>共通鍵(AES)による復号化処理</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#encryptAES">encryptAES</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="encryptAES"></a>

## encryptAES(text, pass) ⇒ [<code>encryptAES</code>](#encryptAES)
共通鍵(AES)による暗号化処理

**Kind**: global function  
**Returns**: [<code>encryptAES</code>](#encryptAES) - - [JavaScript AES暗号・復号](https://chigusa-web.com/blog/js-aes/)  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | 暗号化対象の文字列 |
| pass | <code>string</code> | パスワード |

<a name="decryptAES"></a>

## decryptAES(encryptedData, pass) ⇒ <code>string</code>
共通鍵(AES)による復号化処理

**Kind**: global function  
**Returns**: <code>string</code> - 復号された文字列  

| Param | Type | Description |
| --- | --- | --- |
| encryptedData | [<code>encryptAES</code>](#encryptAES) | 暗号化の際の出力結果 |
| pass | <code>string</code> | パスワード |

<a name="encryptAES"></a>

## encryptAES : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| salt | <code>string</code> | ソルト |
| iv | <code>string</code> | 初期ベクトル |
| encrypted | <code>string</code> | 暗号化された文字列 |


## source

```
/* コアScript */
/**
 * @typedef {Object} encryptAES
 * @prop {string} salt - ソルト
 * @prop {string} iv - 初期ベクトル
 * @prop {string} encrypted - 暗号化された文字列
 */

/** 共通鍵(AES)による暗号化処理
 * @param {string} text - 暗号化対象の文字列
 * @param {string} pass - パスワード
 * @returns {encryptAES}
 * 
 * - [JavaScript AES暗号・復号](https://chigusa-web.com/blog/js-aes/)
 */
function encryptAES(text, pass) {
  // ソルト
  const salt = CryptoJS.lib.WordArray.random(128 / 8);

  // 初期ベクトル
  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  // AESキーの生成(128bit、5万回)
  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: 128 / 32,
    iterations: 50000,
    hasher: CryptoJS.algo.SHA256,
  });

  // AESキーで暗号化
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
  });

  return {
    salt: salt,
    iv: iv,
    encrypted: encrypted,
  };
}

/** 共通鍵(AES)による復号化処理
 * @param {encryptAES} encryptedData - 暗号化の際の出力結果
 * @param {string} pass - パスワード
 * @returns {string} 復号された文字列
 */
function decryptAES(encryptedData, pass) {
  // AESキーの生成(128bit、5万回)
  const key = CryptoJS.PBKDF2(pass, encryptedData.salt, {
    keySize: 128 / 32,
    iterations: 50000,
    hasher: CryptoJS.algo.SHA256,
  });

  // AESキーで復号
  const decrypted = CryptoJS.AES.decrypt(encryptedData.encrypted, key, {
    iv: encryptedData.iv,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
```
