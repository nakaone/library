/** SpreadDb/LocalDb/createTable共通(2025/08/24)
 * @typedef {Object} schemaDef - DB構造定義オブジェクト
 * @param {string} dbName - データベース名(IndexedDB上ではストア名)
 * @param {tableDef[]} tables - DB内の個々のテーブルの定義
 * @param {Object.<string,Function>} [custom] - AlaSQLのカスタム関数
 * @param {string} created - 作成日時。export時に付記
 * 
 * @typedef {Object} tableDef - テーブル構造定義オブジェクト
 * @param {string} name - テーブル名。シート名も一致させる
 * @param {string|string[]} [primaryKey] - 主キーとなる項目名。複合キーの場合配列で指定
 * @param {columnDef[]} cols - 項目定義
 * @param {Function} [initial] - 初期設定用関数(テーブルに初期データ登録＋シート作成)
 * @param {Object[]} data - テーブルの行オブジェクトの配列。import/export時のみ設定
 * @param {Object} [exportDef={}] - export時の設定。exportDef=nullの場合、出力対象外とする
 * @param {string[]} exportDef.select=[] - 出力項目を絞り込む場合の項目名リスト。空配列なら全項目出力
 * @param {string} exportDef.where="" - 出力行を絞り込む場合の条件(SQLのwhere句)
 * 
 * @typedef {Object} columnDef - 項目定義オブジェクト
 * @param {string} name - 項目名
 * @param {string} [label] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @param {string} type - データ型。string/number/boolean
 * @param {any} [default] - 既定値。関数の場合、引数は行オブジェクト
 * @param {Function} [printf] - 表示時点で行う文字列の整形用関数。引数は行オブジェクト
 * @param {string} [note] - 備考
 */