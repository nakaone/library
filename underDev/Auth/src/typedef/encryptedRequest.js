/**
 * @typedef {Object} encryptedRequest - authClientからauthServerに渡す暗号化された処理要求オブジェクト,ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列,memberId,deviceIdは平文
 * @prop {string} memberId - メンバの識別子(=メールアドレス)
 * @prop {string} deviceId - デバイスの識別子
 * @prop {string} ciphertext - 暗号化した文字列
 */