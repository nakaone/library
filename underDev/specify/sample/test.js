/** ダミータイトル
 * @name JSDoc.v001.jsonテスト
 * @desc グローバル領域での概要説明
 * - desc 2行目
 * 
 * @example
 *   `node ./test.js`
 *   exampleの2行目
 * 
 * @history
 * - rev.1.1 2026/01/31
 * - rev.1.0 2026/01/27
 */

/** globalDef: テスト用定義①
 * - typedef前の補足説明
 *   - サブ項目
 * @typedef {Object} globalDef
 * - typedef後の補足説明
 * @property {typeDef[]|columnDef[]} [main=[]] - グローバル領域にあるJSDoc
 * @property {Object} class - クラス定義にかかるJSDoc
 * @property {columnDef[]} [class.method] - 任意項目確認用
 * 
 * - 末尾にある補足説明
 */

/**
 * @interface User
 * @property {string} name
 * @property {number} age
 * @property {boolean} isAdmin
 */
/**
 * @function
 * @name User#test
 * @desc オブジェクト内関数の説明
 * @param {string} arg
 * @returns {boolean|Error}
 * @example オブジェクト内関数の使用例
 */
/** @type {User} */
const foo = {
  name: '名前',
  age: 20,
  isAdmin: true,
  test: arg => this.age >= 20,
};

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
 * @class テスト用クラス名
 * @classdesc テスト用クラス
 * @extends BaseClass
 * @prop {Object} opt - 起動時オプション
 */
class class01 extends BaseClass {
  /**
   * @typedef {Object} typeDef - JSDocのデータ型定義単位のオブジェクト
   * @property {string} name - データ型の定義名
   * @property {columnDef[]} list - 項目(メンバ)のリスト
   */

  /** class01のconstructor
   * - constructorの説明
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
   * @returns {{qId:number,name:string}} NG: qId,name指定無しのObjectになる
   */
  method01(arg){
    return func01(arg);
  }
}