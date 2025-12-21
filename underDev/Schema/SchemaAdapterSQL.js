/** SchemaAdapterSQL: Schema を SQL(AlaSQL/SQLite等) に適用する Adapter
 * @class
 * @classdesc Schema を SQL(AlaSQL/SQLite等) に適用する Adapter
 * 
 * 【Schema から移管された項目】
 * - schema.tableMap
 *   - 実テーブル名管理
 *   - tableMap.def : 論理tableDefとの対応
 *   - tableMap.data : 初期INSERT用データ
 *
 * - schema.custom
 *   - SQLエンジン用ユーザー定義関数
 *
 * - columnDef.alias
 *   - CSV/IMPORT時のカラム名吸収
 *
 * - columnDef.seq
 *   - CREATE TABLE / INSERT の列順保証
 *
 * - created
 *   - export / snapshot 用メタ情報
 *
 * 【責務】
 * - 論理型 → SQL物理型変換
 * - CREATE / INSERT / SELECT 文生成
 * 
 * - schemaDef を SQL構文に変換
 * - 論理型 -> SQL物理型の解決
 * - CREATE TABLE / INSERT / SELECT 文生成
 * - primaryKey / unique 制約の反映
 *
 * 【非責務】
 * - SQL実行エンジン管理
 * - Schemaの変更管理
 * - 表示フォーマット
 * 
    Schema は 意味・制約
    Adapter は 配置・変換・I/O
    DB クラス（ClientDB / ServerDB）は 実行
 * 
  createTableSQL(tableDef)
  insertSQL(tableDef, row)
  selectSQL(tableDef, condition)
  mapLogicalType(columnDef)
 */
class SchemaAdapterSQL {
  /** constructor
   * @constructor
   * - tableMapの作成
   * @param {Schema} schema 
   */
  constructor(schema){
    // ここは空欄でOK
  }

  /** import: インポートデータをシートに登録
   * @param {tableDef} arg - インポートするデータ
   * @returns {tableDef} インポートしたデータ
   */
  import(){}
}