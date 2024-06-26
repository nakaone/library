/** 文字列がe-mail等として正しい形式か判断
 * 
 * @param {string} str - 検査対象となる文字列
 * @param {string} type='email' - 'email' or 'URL' or 'tel'
 * @returns {boolean}
 */
function checkFormat(str,type='email'){
  switch(type){
    case 'email':
      //return str.match(new RegExp("[\w\-\._]+@[\w\-\._]+\.[A-Za-z]+")) ? true : false;
      // https://www.javadrive.jp/regex-basic/sample/index13.html#google_vignette
      return str.match(/^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/) ? true : false;
    case 'URL':
      return str.match(new RegExp("https?://[\w!?/+\-_~;.,*&@#$%()'[\]]+")) ? true : false;
    default: return false;
  }
}
