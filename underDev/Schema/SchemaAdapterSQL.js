/**
 * SchemaAdapterSQL: Schema を SQL(AlaSQL/SQLite等) に適用する Adapter
 *
 * 【責務】
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
