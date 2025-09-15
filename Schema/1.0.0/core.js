/** schemaDef: Schemaの引数となるDB構造定義オブジェクト
 * @typedef {Object} schemaDef - DB構造定義オブジェクト(引数用)
 * @param {string} [dbName] - データベース名(IndexedDB上ではストア名)
 * @param {string} [note] - 備考
 * @param {tableDef[]} tables - DB内のテーブル定義
 * @param {Object.<string,string>} [custom] - AlaSQLのカスタム関数。{関数名:toString()で文字列化した関数}
 */
/** schemaDefEx: Schemaの戻り値となる、拡張済DB構造定義オブジェクト
 * @typedef {Object} schemaDefEx - DB構造定義オブジェクト。引数用のschemaDefに以下の項目を追加・変更したもの
 * @param {string[]} tableList - 実テーブル名の配列。kz標準等、定義はあるが実装されないものは除外
 * @param {Object.<string,tableDefEx>} tableMap - テーブル名をメンバ名、テーブル構造定義オブジェクトを値とするマップ
 * @param {string} original - インスタンス化前の引数(schemaDef)。関数定義の授受のため、JSON化可能な文字列に限定
 * @param {string} [created=null] - 作成日時。export時に付記
 * @param {Object.<string,Object[]>} [data={}] - テーブルのデータ
 *   メンバ名は実テーブル名、データは行オブジェクトの配列。
 *   「過年度伝票」のように、テーブル定義名(kz標準)と実テーブル名が異なる場合、
 *   または単一テーブル定義から複数の実テーブルを作成する場合、
 *   tableDefの下ではなくschemaDefの下に格納する方が適切なため、ここに設定する。
 * @param {Function} expand - expandSchemaメソッド(公開API)。schemaDefExを再作成
 */
// =====================================================================
/** tableDef: Schemaの引数となるテーブル構造定義オブジェクト
 * @typedef {Object} tableDef - テーブル構造定義オブジェクト(引数用)
 * @param {string} tableName - テーブル構造定義名。原則シート名も一致(label定義時はlabel=テーブル名=シート名)
 * @param {string} [note] - テーブルに関する備考
 * @param {string|string[]} [label] - テーブル・シート名。省略時はtableNameを流用。
 *   配列の場合、同一構造で複数テーブルを作成。
 *   例：「kz標準」としてテーブル構造定義し、同一構造のテーブル「過年度伝票」と「仕訳日記帳」を作成
 *   ⇒ tableName:'kz標準',label:['過年度伝票','仕訳日記帳']
 * @param {number} top=1 - シート・CSVイメージ上のヘッダ行番号
 * @param {number} left=1 - シート・CSVイメージ上の開始列番号
 *   top,leftは外部提供CSVをインポートするような場合を想定
 * @param {string|string[]} [primaryKey] - 主キーとなる項目名。複合キーの場合配列で指定
 * @param {columnDef[]} cols - 項目定義
 * @param {Object} [export={select:['*'],where:''}] - export時の設定。export=nullの場合、出力対象外とする
 * @param {string[]} [export.select=['*']] - 出力項目を絞り込む場合の項目名リスト。空配列なら全項目出力
 * @param {string} [export.where=""] - 出力行を絞り込む場合の条件(SQLのwhere句)
 * @param {number} [startingRowNumber=2] - dataの当該テーブルが存在し、かつ行番号が不在の場合は
 *   RowNumberを追加する。この開始行番号。<0ならRowNumberは追加しない。
 *   RowNumber {number} シート上の行番号。原則としてヘッダ行は1、データ行は2以降
 */
/** tableDefEx: Schemaの戻り値となる、拡張済テーブル構造定義オブジェクト
 * @typedef {Object} tableDefEx - テーブル構造定義オブジェクト。引数用のtableDefに以下の項目を追加・変更したもの
 * @param {string} tableName - 【変更】tableDef.labelを展開した実テーブル名。構造定義のみの場合は削除。
 *   例：「kz標準」としてテーブル構造定義し、同一構造のテーブル「過年度伝票」と「仕訳日記帳」を作成
 *   ⇒ {tableName:'kz標準'}は削除、{tableName:'過年度伝票'},{tableName:'仕訳日記帳'}は作成
 * @param {string[]} colNames - columnDef.nameの配列
 * @param {string[]} header - columnDef.labelの配列
 * @param {Object.<string,columnObj>} colMap - {columnDef.name:columnObj}
 */
// =====================================================================
/** columnDef: Schemaの引数となる項目定義オブジェクト
 * @typedef {Object} columnDef - 項目定義オブジェクト(引数用)
 * @param {string} colName - 項目名
 * @param {string} [note] - 備考
 * @param {string} [label] - テーブル・シート表示時の項目名。省略時はcolNameを流用
 * @param {string} type='string' - データ型。string/number/boolean
 * @param {string[]} [alias] - 複数タイプのCSVを統一フォーマットで読み込むとき、項目名の揺れを列挙
 * @param {any} [default] - 既定値。関数の場合、引数を行オブジェクトとするtoString()で作成された文字列
 * @param {string} [printf] - 表示時点で行う文字列の整形用関数
 *   引数を行オブジェクトとするtoString()で作成された文字列
 */
/** columnDefEx: Schemaの戻り値となる、拡張済項目定義オブジェクト
 * @typedef {Object} columnDefEx - 項目定義オブジェクト。引数用のcolumnDefに以下の項目を追加・変更したもの
 * @param {number} seq - 左端を0とする列番号
 */
// =====================================================================

/** Schema: シート・RDB・IndexedDB・CSV/TSVで扱うデータベース構造定義のユーティリティ集
 * @param {schemaDef} schema - DB構造定義オブジェクト(引数用)
 * @returns {schemaDefEx} DB構造定義オブジェクト(戻り値用)
 */
function Schema(schema) {
  const pv = { whois: 'Schema', rv: {}};

  /** expandTable: tableDefExを作成
   * - colsとcolMapメンバは1:1対応、且つcolNames,headerの作成が必要なため
   *   columnの展開は本メソッド内で実行(expandColumnは作成しない)
   * @param {string} realTableName - 実テーブル名
   * @param {tableDef} tableDefinition - schemaDef.tables配列の内、作成対象テーブル構造定義
   * @returns {tableDefEx}
   */
  function expandTable(realTableName,tableDefinition) {
    const v = { whois: `${pv.whois}.expandTable`, rv: {},
      tableProto: {  // tableDefExのプロトタイプ
        tableName: '',
        note: '',
        label: '',
        top: 1,
        left: 1,
        primaryKey: [],
        cols: [],
        initial: [],
        export: {select:['*'],where:''},
        startingRowNumber: 2,
        colNames: [],
        header: [],
        colMap: {},
      },
      columnProto: { // columnDefExのプロトタイプ
        colName: '',
        seq: 0,
        note: '',
        label: '',
        type: 'string',
        alias: [],
        default: null,
        printf: null,
      },
    };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 「引数>pv.rv>既定値」の優先順位で統合
      v.rv = mergeDeeply(tableDefinition,
        mergeDeeply(pv.rv.tableMap[realTableName],v.tableProto));
      if( v.rv instanceof Error ) throw v.rv;

      dev.step(2);  // 当該テーブルのdataがあり、且つRowNumber不在ならRowNumberを追加
      if( pv.rv.data.hasOwnProperty(realTableName)
        && Array.isArray(pv.rv.data[realTableName])
        && pv.rv.data[realTableName].length > 0
        && !pv.rv.data[realTableName][0].hasOwnProperty('RowNumber')
        && v.rv.startingRowNumber > 0 ){
        for( v.i=0 ; v.i<pv.rv.data[realTableName].length ; v.i++ ){
          pv.rv.data[realTableName][v.i]['RowNumber'] = v.rv.startingRowNumber + v.i;
        }
      }

      dev.step(3);  // columnDefExを順次作成
      for( v.i=0 ; v.i<v.rv.cols.length ; v.i++ ){

        dev.step(3.1);  // 「引数>pv.rv>既定値」の優先順位で統合
        v.col = Object.assign({},v.columnProto,v.rv.cols[v.i],{seq:v.i});

        dev.step(3.2);  // default,printfを関数化
        ['default','printf'].forEach(x => {
          if( v.col[x] && typeof v.col[x] !== 'function' )
            v.col[x] = new Function('return '+v.col[x])();
        });

        dev.step(3.3);  // labelの設定、colNames,headerへの登録
        if( !v.col.label ) v.col.label = v.col.colName;
        v.rv.colNames.push(v.col.colName);
        v.rv.header.push(v.col.label);

        dev.step(3.4);  // 項目マップに登録。項目名、ラベル、別名、出現順(数字)
        Array.from(new Set([v.col.colName, v.col.label, ...v.col.alias, v.i]))
        .forEach(x => v.rv.colMap[x]=v.col);

      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** expandSchema: 引数>pv.rv>既定値の優先順位でpv.rv(schemaDefEx)を作成
   * @param {schemaDef|schemaDefEx} schema 
   * @returns {null|Error}
   */
  function expandSchema(schema) {
    const v = { whois: `${pv.whois}.expandSchema`, rv:{
      dbName: '',
      note: '',
      tables: [],
      custom: {},
      tableList: [], // 実テーブル名の配列(インスタンス化時の追加項目)
      tableMap: {},  // テーブル名->tableDefへのマップ(インスタンス化時の追加項目)
      original: JSON.stringify(schema),  // インスタンス化前の引数(インスタンス化時の追加項目)
      created: toLocale(null),
      data: {},
      expand: expandSchema, // 公開APIとしてexpandSchemaを"expand"として追加
    }};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 「引数>pv.rv>既定値」の優先順位で統合
      pv.rv = mergeDeeply(schema,mergeDeeply(pv.rv,v.rv));
      if( pv.rv instanceof Error ) throw pv.rv;

      dev.step(2);  // customを関数化
      // 既に関数化されていた場合(再作成の場合)、何もしない
      for( v.fn in pv.rv.custom ){
        if( typeof pv.rv.custom[v.fn] !== 'function' )
          pv.rv.custom[v.fn] = new Function('return '+pv.rv.custom[v.fn])();
      }

      dev.step(3);  // tableDefExを順次作成
      pv.rv.tables.forEach(table => {
        // name:存在 and label:不存在 -> label=nameとしてnameテーブルを作成
        // name:存在 and label:存在 -> nameテーブルは作成しない、labelテーブルのみ作成
        v.realTables = [...(!table.label  // {string[]} 実テーブル名の配列
        ? [table.tableName] // label不在ならtableNameを引用、存在で非配列なら配列化
        : (Array.isArray(table.label) ? table.label : [table.label]))];
        v.realTables.forEach(x => {
          // テーブルマップへの追加
          pv.rv.tableMap[x] = expandTable(x,table)
          pv.rv.tableMap[x] = expandTable(x,table);
          if( pv.rv.tableMap[x] instanceof Error ) throw pv.rv.tableMap[x];
          // 実テーブル名リストへの追加
          pv.rv.tableList.push(x);
        });
      });

      dev.end(); // 終了処理
      return null;

    } catch (e) { dev.error(e); return e; }
  }
  
  // -------------------------------------------------------------
  // メイン処理
  // -------------------------------------------------------------
  dev.start(pv.whois, [...arguments]);
  try {

    pv.r = expandSchema(schema);
    if( pv.r instanceof Error ) throw pv.r;

    dev.end(); // 終了処理
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}