export const utils = {

  /** isObject: 引数がオブジェクトであるか判定
   * @param {any} arg - 判定対象
   * @returns {boolean} オブジェクトならtrue
   * @history
   * - rev.1.0.0 : 2026/03/07 - 初版
   */
  isObject: arg => {
    return typeof arg !== 'undefined'
      && arg !== null
      && typeof arg === 'object'
      && !Array.isArray(arg)
      && arg.constructor === Object;
  },

  /** isJSON: JSON文字列か判定
   * @param {string} str - 判定対象文字列
   * @returns {boolean}
   * @history
   * - rev.1.0.0 : 2026/03/07 - 初版
   */
  isJSON:str=>{try{JSON.parse(str)}catch(e){return false} return true},

  /** parseJSON: JSON文字列をオブジェクト化
   * @param {string} arg 
   * @returns {Object|Error}
   * @history
   * - rev.1.0.0 : 2026/03/07 - 初版
   */
  parseJSON:arg=>{try{return JSON.parse(arg)}catch{return new Error(`Failed to objectify: "${arg}"`)}},

};