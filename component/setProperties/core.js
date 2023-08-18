/** 設定先のオブジェクトにパラメータoptを優先して再帰的に既定値を設定する
 * @param {Object} dest - 設定先のオブジェクト。初回呼出時はthis
 * @param {Object} opt - 起動時にオプションとして渡されたオブジェクト
 * @param {Object} def - 既定値のオブジェクト。初回呼出時はnull(内部定義を使用)
 * @param {number} [depth=0] - 再起呼出時の階層。開始・終了メッセージ制御用なので指定不要
 * @returns {void}
 * 
 * ## 使用方法
 * 
 * 主にclass内constructorで冒頭に使用することを想定。
 * 
 * ```
 * class BurgerMenu {
 *   constructor(opt={auth:confObj,fuga:{a:10}}){
 *     setProperties(this,opt,{
 *       auth: null,
 *       hoge: 'Hello World',
 *       fuga: {
 *         a: null,
 *         b: 20,
 *       },
 *     });
 *     // -> this.auth=confObj, this.hoge='Hello World'
 *     //    this.fuga = {a:10,b:20}
 *   }
 * }
 * ```
 */
const setProperties = (dest,opt,def,depth=0) => {
  const v = {whois:'setProperties',rv:true,def:{}};
  if( depth === 0 ) console.log(v.whois+' start.');

  try {

    for( let key in def ){
      if( whichType(def[key]) !== 'Object' ){
        // オブジェクト以外は設定先に値をコピー
        dest[key] = opt[key] || def[key]; // 配列はマージしない
      } else {
        // オブジェクトの場合、設定先にオブジェクトが無ければ空オブジェクトを作成
        if( !dest.hasOwnProperty(key) ) dest[key] = {};
        // オブジェクトを引数にして再起呼出
        setProperties(dest[key],opt[key]||{},def[key],depth+1);
      }
    }

    if( depth === 0 ) console.log(v.whois+' normal end.');
    return v.rv;
  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}
