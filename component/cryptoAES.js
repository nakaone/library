
function encryptAES(text, pass) {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: 128 / 32,
    iterations: 50000,
    hasher: CryptoJS.algo.SHA256,
  });
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
  });
  return {
    salt: salt,
    iv: iv,
    encrypted: encrypted,
  };
}
function decryptAES(encryptedData, pass) {
  const key = CryptoJS.PBKDF2(pass, encryptedData.salt, {
    keySize: 128 / 32,
    iterations: 50000,
    hasher: CryptoJS.algo.SHA256,
  });
  const decrypted = CryptoJS.AES.decrypt(encryptedData.encrypted, key, {
    iv: encryptedData.iv,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}