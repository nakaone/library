/** schemaDef: DB構造定義オブジェクト (論理Schema・引数用)
 * 【相談】①既定値設定のためクラスとして作成することを想定
 * @class
 * @classdesc DB構造定義オブジェクト
 * 
 * 【責務】
 * - DBの論理構造を定義する
 * - Adapter / DB 実装に依存しない
 *
 * @property {string} [schemaName] - Schemaの論理名（dbNameとは別概念）
 * @property {string} [schemaVersion] - Schemaのバージョン識別子（例: '1.2.0'）
 * @property {string} [dbName] - 物理DB名（IndexedDB上ではストア名）
 * @property {string} [note] - Schema全体に関する備考
 * 【相談】②tableDef, customはAdapterに移管すべきでは？
 * @property {Object.<string, tableDef>} tableDef - 論理テーブル名をキーとするテーブル定義
 * @property {Object.<string, Object>} tableMap - 実テーブル名をキーとする物理配置定義
 *   - Adapter / DB 実装が参照
 * @property {string} [tableMap.def] - 使用する論理テーブル定義名
 *   - 実テーブル名と論理定義名が一致する場合は省略可
 * @property {string|Object[]} [tableMap.data] - 初期データ
 *   - string: CSV/TSV形式（先頭行は label/header）
 *   - Object[]: 行オブジェクト配列
 * @property {Object.<string, string>} [custom]
 *   - Adapter が利用する拡張関数群
 *   - { 関数名: Function.toString() }
 *   - ※ Schema論理定義というより「実行環境拡張」である点に注意
 */
/** schemaDefEx: Schema展開後のDB構造定義オブジェクト
 * 【相談】③originalはschemaDefに、created/expandはAdapterに移動してschemaDefExは廃止すべき？
 * @property {string} original - インスタンス化前の schemaDef を JSON 文字列化したもの
 *   - （関数は文字列化されるためプリミティブのみ）
 *
 * @property {string} [created]
 *   - Schema生成日時（export / snapshot 用）
 *
 * @property {Function} expand
 *   - expandSchema メソッド（公開API）
 *   - 差分 schemaDef を受け取り schemaDefEx を再生成する
 */
/** tableDef: 論理テーブル構造定義 (引数用)
 * @typedef {Object} tableDef
 * @property {string} [note] - テーブルに関する備考
 * 【相談】④横文字が苦手で「エンティティ」というのがピンと来ない。説明文だけでも「項目名」「識別子」等に言い換えられないか？
 * 　　　　⑤entityは識別子という意味ではnameと同じ役割(識別子)？　ならnameで統一したほうが分かりやすい。
 * @property {string} [entity] - ドメイン上のエンティティ名（例: 'Member', 'AuthAuditLog'）
 *   - クラス設計とSchemaを対応付けるための識別子
 * @property {string|string[]} [primaryKey] - 主キー項目名
 *   - 複合キーは配列で指定
 * @property {string|string[]} [unique] - 主キー以外の一意制約
 * @property {columnDef[]} colDef - 項目定義（順序を考慮するため配列）
 * 【相談】⑥top,left,startingRowNumberはAdapterに移動？
 * @property {number} [top=1] - シート・CSV 上のヘッダ行番号
 * @property {number} [left=1] - シート・CSV 上の開始列番号
 * @property {number} [startingRowNumber=2] - RowNumber 列を追加する場合の開始行
 *   - 負数の場合は追加しない
 */
/** tableDefEx: 展開後テーブル定義
 *
 * @typedef {Object} tableDefEx
 * 【相談】⑦name -> tableName, logicalName -> name
 * 　　　　⑧「テーブル」という用語、自分としてはピンと来るが適切か？　ex.IndexedDB -> store
 * 　　　　⑨実テーブル名(tableName),header,colDefはAdapter寄りでは？
 * 　　　　⑩tableDefに吸収した方が良いか
 * @property {string} tableName - 実テーブル名
 * @property {string} name - 論理テーブル名（tableDef のキー）
 * @property {string[]} header - columnDef.label の配列
 * @property {Object.<string, columnObj>} colDef - { columnDef.name : columnObj }
 */
/** columnDef: 項目定義 (引数用)
 * @typedef {Object} columnDef
 * @property {string} name - 項目名（英数字・システム用）
 * @property {string} [label] - 表示用ラベル（省略時は columnName）
 * @property {string} [note] - 備考・意味説明
 * 【相談】⑪noteとdescriptionの差異が曖昧な気がする。例えばシートのメモに記載すべきなのはどっち？
 * @property {string} [description] - API公開時に使用する説明文（note とは用途を分離）
 * 【相談】⑫論理データ型はJavaScriptのデータ型に準拠で良いか？
 * @property {string} [type='string'] - 論理データ型（string / number / boolean / datetime 等）
 * @property {boolean} [nullable=true] - null を許可するか
 * @property {any} [default=null] - 既定値
 *   - 関数の場合は toString() 化された文字列
 * 【相談】⑬以下はAdapter寄りでは？
 * @property {string[]} [alias] - CSV/TSV 読み込み時の別名
 * @property {string} [printf] - 表示整形用関数（toString() 化された関数）
 */
/** columnDefEx: 展開後項目定義
 *
 * @typedef {Object} columnDefEx
 * 
 * 【相談】⑭以下はAdapter寄りでは？
 * @property {number} seq
 *   - 左端を 0 とする列番号
 * 【相談】⑮physicalTypeに入る値のサンプルを。
 * @property {string} physicalType
 *   - Adapter により解決された物理型（SQL / Sheet 用）
 */
