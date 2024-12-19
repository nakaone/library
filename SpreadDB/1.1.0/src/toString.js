/** 関数・オブジェクトを文字列化 */
function toString(arg){
  if( typeof arg === 'function' ) return arg.toString();
  if( typeof arg === 'object' ) return JSON.stringify(arg);
  return arg;
}