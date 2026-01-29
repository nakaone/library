/** test: JSDoc.jsonテスト
 * グローバル領域での概要説明
 * @example
 *   `node ./test.js`
 * 
 * @history
 * - rev.1.0 2026/01/27
 */

/**
 * @typedef {Object} globalDef
 * @property {typeDef[]|columnDef[]} main=[] - グローバル領域にあるJSDoc
 * @property {Object} class - クラス定義にかかるJSDoc
 * @property {columnDef[]} class.method - 
 */

/** func01: 関数テスト
 * 関数テスト説明文
 * @param {number} arg - 引数
 * @returns {object} 戻り値
 */
function func01(arg){
  /** arrow01: アローテスト
   * @param {string} arg - 引数
   * @returns {string} 戻り値
   */
  const arrow01 = arg => {
    /**
     * @typedef {Object} arrowDef - JSDocの関数・メソッド単位のオブジェクト
     * @property {string} name - 関数・メソッド名
     * @property {arrowDef[]|typeDef[]|columnDef[]} list - 関数・メソッド内のJSDoc
     */
    /** @type {number} */
    const rv = arg+'a';
    return rv;
  }
  /**
   * @typedef {Object} funcDef - JSDocの関数・メソッド単位のオブジェクト
   * @property {string} name - 関数・メソッド名
   * @property {funcDef[]|typeDef[]|columnDef[]} list - 関数・メソッド内のJSDoc
   */
  /** @type {boolean} */
  const rv = {num:arg+1, str:arrow01(arg)};
  return rv;
}

/**
 * @class
 * @classdesc テスト用クラス
 * @extends Error
 * @prop {Object} opt - 起動時オプション
 */
class class01 extends Error {
  /**
   * @typedef {Object} typeDef - JSDocのデータ型定義単位のオブジェクト
   * @property {string} name - データ型の定義名
   * @property {columnDef[]} list - 項目(メンバ)のリスト
   */

  /**
   * @constructor
   * @param {bigint} arg - typeはテスト用
   */
  constructor(arg){
    /** 親クラスの引数
     * @type {string}
     */
    // NG: @typeは変数名を含む説明不可
    //   ex. @type {string} message - エラーメッセージ
    // なお上記「親クラスの引数」はJSDoc.json上は出力されない
    super(arg);
    this.opt = arg;
  }

  /** method01: メソッドテスト
   * @param {number} arg - method01の引数
   * @returns {string} method01戻り値
   */
  method01(arg){
    return func01(arg);
  }
}