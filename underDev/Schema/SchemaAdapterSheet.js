/**
 * SchemaAdapterSheet: Schema を Google Spreadsheet に適用する Adapter
 *
 * 【Schema から移管された項目】
 * - schema.tableMap
 *   - 実シート名管理
 *   - tableMap.def : 論理tableDefとの対応
 *   - tableMap.data : 初期データ(CSV/TSV/Object[])
 *
 * - tableDef.top / left
 *   - シート上のヘッダ行・開始列
 *
 * - tableDef.startingRowNumber
 *   - RowNumber 自動付与制御
 *
 * - columnDef.alias
 *   - CSV/TSV 多フォーマット吸収
 *
 * - columnDef.seq
 *   - 列順管理（物理）
 *
 * - created
 *   - export / dump 用メタ情報
 * 
 * 【責務】
 * - schemaDef を Spreadsheet 構造に変換
 * - シート作成・列定義・ヘッダ生成
 * - 行オブジェクト <-> シート行 の変換
 * - primaryKey / unique の論理検証
 *
 * - Schema(論理) → Sheet(物理) の変換
 * - 初期データ投入
 * - 行 <-> RowObject 変換
 * 
 * 【非責務】
 * - Schemaの意味定義
 * - SQL解釈
 * - ビジネスロジック
 * 
 * @property {Object.<string, Object>} tableMap - 実テーブル名をメンバ名とする実テーブルの定義
 * @property {string} [tableMap.def] - 使用するテーブル定義名。実テーブル名と定義名が一致する場合は省略可。
 * @property {string|Object[]} [tableMap.data] - テーブルに格納される初期データ
 *   - string: CSV/TSV形式。先頭行は項目名(labelの配列=header)。
 *   - Object[]: 行オブジェクトの配列
 * @property {Object.<string, string>} [custom] - AlaSQLのカスタム関数。{関数名: toString()で文字列化した関数}
 * @property {string} [created] - 作成日時。export時に使用
 * 
    Schema は 意味・制約
    Adapter は 配置・変換・I/O
    DB クラス（ClientDB / ServerDB）は 実行
 * 
    applySchema(schemaDef)
    ensureTable(tableDef)
    rowToSheet(row, tableDef)
    sheetToRow(range, tableDef)
    validateConstraints(rows, tableDef)
 */
class SchemaAdapterSheet {
   /** constructor
    * @constructor
    * - tableMapの作成
    * @param {Schema} schema 
    */
   constructor(schema){

   }

   /** import: インポートデータをシートに登録
    * @param {tableDef} arg - インポートするデータ
    * @returns {tableDef} インポートしたデータ
    */
   import(){}
}