
/**
 * SchemaAdapterSheet: Schema を Google Spreadsheet に適用する Adapter
 *
 * 【責務】
 * - schemaDef を Spreadsheet 構造に変換
 * - シート作成・列定義・ヘッダ生成
 * - 行オブジェクト <-> シート行 の変換
 * - primaryKey / unique の論理検証
 *
 * 【非責務】
 * - Schemaの意味定義
 * - SQL解釈
 * - ビジネスロジック
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
