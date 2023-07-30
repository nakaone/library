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
function analyzeArg(){
  console.log('===== analyzeArg start.');
  const v = {rv:{opt:{},val:[]}};
  try {
    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }
    console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== analyzeArg end.');
    return v.rv;
  } catch(e){
    console.error('===== analyzeArg abnormal end.\n',e);
    if( typeof window !== 'undefined' ) alert(e.stack);
    v.rv.stack = e.stack; return v.rv;
  }
}
/* コンソール実行用 */
const fs = require('fs'); // ファイル操作
function onConsole(){
  console.log('cryptoAES.onConsole start.');
  const v = {rv:null};
  try {

    // 事前処理：引数チェック、既定値の設定
    v.argv = analyzeArg();
    console.log(v.argv)
    if(v.argv.hasOwnProperty('stack')) throw v.argv;

    v.readFile = fs.readFileSync(v.argv.opt.i,'utf-8').trim();
    v.rv = cryptoAES(v.readFile);
    v.writeFile = fs.writeFileSync(v.argv.opt.o,v.rv,'utf-8');  

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('cryptoAES.onConsole end.');
  } catch(e){
    console.error('cryptoAES.onConsole abnormal end.',e);
  }
}
onConsole();
