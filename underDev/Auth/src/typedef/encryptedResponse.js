/**
 * @typedef {Object} encryptedResponse - authServerからauthClientに返す暗号化された処理結果オブジェクト,ciphertextはauthResponseをJSON化、RSA-OAEP暗号化＋署名付与した文字列
 * @prop {string} ciphertext - 暗号化した文字列
 */