/** schemaDef: DB構造定義オブジェクト (論理Schema・引数用)
 * @class
 * @classdesc DB構造定義オブジェクト
 * 
 * 【責務】
 * - DBの論理構造を定義する
 * - Adapter / DB 実装に依存しない
 *
 * @property {string} [name] - Schemaの論理名
 * ※schemaName->name(∵tableDef/columnDefに合わせる)
 * @property {string} [version] - Schemaのバージョン識別子(例:'1.2.0')
 * ※schemaVersion->version(他にversionが無いので簡略化)
 * @property {string} [dbName] - 物理DB名（IndexedDB上ではストア名）
 * ※dbName、要ります？Adapter寄りでは？
 * @property {string} [note] - Schema全体に関する備考
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
 * @property {string} [note] - テーブルに関する備考
 * @property {string|string[]} [primaryKey] - 主キー項目名
 *   - 複合キーは配列で指定
 * @property {string|string[]} [unique] - 主キー以外の一意制約
 * @property {columnDef[]} colDef - 項目定義（順序を考慮するため配列）
 */
/** columnDef: 項目定義 (引数用)
 * @typedef {Object} columnDef
 * @property {string} name - 項目名（英数字・システム用）
 * @property {string} [label] - 表示用ラベル（省略時は columnName）
 * @property {string} [note] - 備考・意味説明
 * @property {string} [type='string'] - 論理データ型
 *   - JavaScriptのデータ型(ex.'string','number','boolean','object','Date',etc)
 * @property {boolean} [nullable=true] - null を許可するか
 * @property {any} [default=null] - 既定値
 *   - 関数の場合は toString() 化された文字列
 */
