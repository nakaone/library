/* コアスクリプト */
/** createPassword: パスワード文字列の生成
 * @desc シングル/ダブルクォーテーションはJavaScript上文字列として扱う際にエスケープが必要になるので除外
 * @param {number} [len=16] - パスワードの文字長
 * @param {boolean} [opt.lower=true] - 小文字を使用するならtrue 
 * @param {boolean} [opt.upper=true] - 大文字を使用するならtrue 
 * @param {boolean} [opt.symbol=true] - 記号を使用するならtrue 
 * @param {boolean} [opt.numeric=true] - 数字を使用するならtrue 
 * @returns {string} 生成されたパスワード文字列
 */
 function createPassword(len=16,opt={lower:true,upper:true,symbol:true,numeric:true}){
  const v = {
    whois: 'createPassword',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    symbol: '!#$%&()=~|@[];:+-*<>?_>.,', // クォーテーションは除外
    numeric: '0123456789',
    base: '',
    rv: '',
  }
  try {
    Object.keys(opt).forEach(x => {
      if( opt[x] ) v.base += v[x];
    });
    for( v.i=0 ; v.i<len ; v.i++ ){
      v.rv += v.base.charAt(Math.floor(Math.random() * v.base.length));
    }
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}
