/** schemaDef: DB構造定義オブジェクト (論理Schema・引数用)
 * @class
 * @classdesc DB構造定義オブジェクト
 * 
 * 【責務】
 * - DBの論理構造を定義する
 * - Adapter / DB 実装に依存しない
 *
 * @property {string} name - Schemaの論理名
 * @property {string} [version='0.0.0'] - Schemaのバージョン識別子(例:'1.2.0')
 * @property {string} [dbName=''] - 物理DB名（Adapter が参照する場合のみ使用）
 * @property {string} [desc=''] - Schema全体に関する概要説明
 * @property {string} [note=''] - Schema全体に関する備考
 * @property {Object.<string, tableDef>} tableDef - 論理テーブル名をキーとするテーブル定義
 * @property {string} original - schemaDefインスタンス生成時のスナップショット(JSON)
 * 
 * @example
 * ```
 * {
 *   name: 'camp2025',
 *   tableDef: {
 *     master: {
 *       colDef:[
 *         {name:'タイムスタンプ',type:'string'},
 *         {name:'メールアドレス',type:'string'},
 *         // (中略)
 *       ],
 *     },
 *   },
 * },
 * ```
 * 
 * @history
 * 2.0.0 2025-12-21 構造簡潔化＋Adapterと役割分担
 * 1.2.0 2025-09-21 AlaSQLの予約語とSpreadDb.schemaの重複排除
 *   - SpreadDb.schema.tables -> tableMap
 *   - SpreadDb.schema.tables.cols -> colMap(∵予約語columnsと紛らわしい)
 * 1.1.0 2025-09-15 構造の見直し、メンバ名の修正
 * 1.0.0 2025-09-15 初版
 */
/** tableDef: 論理テーブル構造定義 (引数用)
 * @typedef {Object} tableDef
 * @property {string} [name] - 論理的な識別名（tableDef のキー）
 *   - クラス・API・ログで使用。例: 'Member', 'AuthAuditLog'
 *   - constructorに渡す定義オブジェクトでは省略(メンバ名を引用)
 * @property {string} [desc=''] - テーブルに関する概要説明
 * @property {string} [note=''] - テーブルに関する備考
 * @property {string[]} [primaryKey=[]] - 主キー項目名
 * @property {string[]} [unique=[]] - 主キー以外の一意制約
 * @property {columnDef[]} colDef - 項目定義（順序を考慮するため配列）
 */
/** columnDef: 項目定義 (引数用)
 * @typedef {Object} columnDef
 * @property {string} name - 項目名（英数字・システム用）
 * @property {string} [label] - 表示用ラベル（省略時は name)
 * @property {string} [desc=''] - 項目に関する概要説明
 * @property {string} [note=''] - 項目に関する備考・意味説明
 * @property {string} [type='string'] - 論理データ型
 *   - 'string' | 'number' | 'boolean' | 'object' | 'array' | 'datetime'
 * @property {boolean} [nullable=true] - null を許可するか
 * @property {any} [default=null] - 既定値
 *   - 関数の場合は toString() 化された文字列
 */
