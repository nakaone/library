/** SpreadDb/LocalDb/createTable共通(2025/09/02)
 * - 以下、項目説明先頭の「■」はinstantiateSchemaDef内で追加、「□」は変更(上書き)される項目
 * - SpreadDbで使用する場合、colsには定義されない隠し項目として以下項目を追加
 *   RowNumber {number} シート上の行番号。原則としてヘッダ行は1、データ行は2以降
 * 
 * ===========================================================
 * @typedef {Object} schemaDef - DB構造定義オブジェクト
 * @param {string} [dbName] - データベース名(IndexedDB上ではストア名)
 * @param {string} [note] - 備考
 * @param {tableDef[]} tables - DB内のテーブル定義
 * @param {Object.<string,string>} [custom] - AlaSQLのカスタム関数。{関数名:toString()で文字列化した関数}
 * 
 * -- 以下、instantiateSchemaDef内で追加・変更される項目 ----------
 * @param {string[]} tableList - ■実テーブル名の配列。kz標準等、定義はあるが実装されないものは除外
 * @param {Object.<string,tableObj>} tableMap - ■テーブル名をメンバ名、テーブル構造定義オブジェクトを値とするマップ
 * @param {string} original - ■インスタンス化前の引数(schemaDef)。関数定義の授受のため、JSON化可能な文字列に限定
 * @param {string} [created=null] - ■作成日時。export時に付記
 * @param {Object.<string,Object[]>} [data={}] - ■テーブルのデータ
 *   メンバ名は実テーブル名、データは行オブジェクトの配列。
 *   「過年度伝票」のように、テーブル定義名(kz標準)と実テーブル名が異なる場合、
 *   または単一テーブル定義から複数の実テーブルを作成する場合、
 *   tableDefの下ではなくschemaDefの下に格納する方が適切なため、ここに設定する。
 * 
 * ===========================================================
 * @typedef {Object} tableDef - テーブル構造定義オブジェクト
 * @param {string} tableName - テーブル構造定義名。原則シート名も一致(label定義時はlabel=テーブル名=シート名)
 * @param {string} [note] - 備考
 * @param {string|string[]} [label] - テーブル・シート名。省略時はtableNameを流用。
 *   配列の場合、同一構造で複数テーブルを作成。
 *   例：「kz標準」としてテーブル構造定義し、同一構造のテーブル「過年度伝票」と「仕訳日記帳」を作成
 *   ⇒ tableName:'kz標準',label:['過年度伝票','仕訳日記帳']
 * @param {number} top=1 - シート・CSVイメージ上のヘッダ行番号
 * @param {number} left=1 - シート・CSVイメージ上の開始列番号
 *   top,leftは外部提供CSVをインポートするような場合を想定
 * @param {string|string[]} [primaryKey] - 主キーとなる項目名。複合キーの場合配列で指定
 * @param {columnDef[]} cols - 項目定義
 * @param {Object[]} [initial] - シート・テーブル未作成時、初期データとして登録する行オブジェクトの配列
 * @param {Object} [export={select:['*'],where:''}] - export時の設定。export=nullの場合、出力対象外とする
 * @param {string[]} [export.select=['*']] - 出力項目を絞り込む場合の項目名リスト。空配列なら全項目出力
 * @param {string} [export.where=""] - 出力行を絞り込む場合の条件(SQLのwhere句)
 * 
 * -- 以下、instantiateSchemaDef内で追加・変更される項目 ----------
 * @param {string} tableName - □tableDef.labelを展開した実テーブル名。構造定義のみの場合は削除。
 *   例：「kz標準」としてテーブル構造定義し、同一構造のテーブル「過年度伝票」と「仕訳日記帳」を作成
 *   ⇒ {tableName:'kz標準'}は削除、{tableName:'過年度伝票'},{tableName:'仕訳日記帳'}は作成
 * @param {string[]} colNames - ■columnDef.nameの配列
 * @param {string[]} header - ■columnDef.labelの配列
 * @param {Object.<string,columnObj>} colMap - ■{columnDef.name:columnObj}
 * 
 * ===========================================================
 * @typedef {Object} columnDef - 項目定義オブジェクト
 * @param {string} colName - 項目名
 * @param {string} [note] - 備考
 * @param {string} [label] - テーブル・シート表示時の項目名。省略時はcolNameを流用
 * @param {string} type='string' - データ型。string/number/boolean
 * @param {string[]} [alias] - 複数タイプのCSVを統一フォーマットで読み込むとき、項目名の揺れを列挙
 * @param {any} [default] - 既定値。関数の場合、引数を行オブジェクトとするtoString()で作成された文字列
 * @param {string} [printf] - 表示時点で行う文字列の整形用関数
 *   引数を行オブジェクトとするtoString()で作成された文字列
 * 
 * -- 以下、instantiateSchemaDef内で追加・変更される項目 ----------
 * @param {number} seq - 左端を0とする列番号
 */

/** instantiateSchemaDef: schemaDefに基づき既定値設定・関数化を実施
 * @param {schemaDef} arg - DB構造定義オブジェクト
 * @returns {Object}
 * 
 * @example
 * ```
 * const kzConfig = {
 *   schema: {...}, // schemaDefに基づくDB構造定義オブジェクト
 *   ...
 * };
 * const cf = Object.assign({},kzConfig,{schema:instantiateSchemaDef(kzConfig.schema)});
 * ```
 */
function instantiateSchemaDef(arg={}){
  const v = { whois: 'instantiateSchemaDef', rv: null, default:{
    schema: JSON.stringify({
      dbName: '',
      note: '',
      tables: [],
      custom: {},
      tableList: [], // 実テーブル名の配列(インスタンス化時の追加項目)
      tableMap: {},  // テーブル名->tableDefへのマップ(インスタンス化時の追加項目)
      original: JSON.stringify(arg),  // インスタンス化前の引数(インスタンス化時の追加項目)
      created: null,
      data: {},
    }),
    table: JSON.stringify({
      tableName: '',
      note: '',
      label: '',
      top: 1,
      left: 1,
      primaryKey: [],
      cols: [],
      initial: [],
      export: {select:['*'],where:''},
      colNames: [],
      header: [],
      colMap: {},
    }),
    col: JSON.stringify({
      colName: '',
      seq: 0,
      note: '',
      label: '',
      type: 'string',
      alias: [],
      default: null,
      printf: null,
    }),
  }};
  dev.start(v.whois);
  try {

    dev.step(1);  // schemaObjの生成
    v.rv = Object.assign(JSON.parse(v.default.schema),arg);

    for( v.t=0 ; v.t<v.rv.tables.length ; v.t++ ){
      dev.step(1.1);  // 既定値の設定
      v.table = Object.assign(JSON.parse(v.default.table),v.rv.tables[v.t]);

      dev.step(1.2);  // labelの設定
      // name:存在 and label:不存在 -> label=nameとしてnameテーブルを作成
      // name:存在 and label:存在 -> nameテーブルは作成しない、labelテーブルのみ作成
      v.table.label = !v.table.label
      ? [v.table.tableName] // label不在ならtableNameを引用、存在で非配列なら配列化
      : (Array.isArray(v.table.label) ? v.table.label : [v.table.label]);

      dev.step(1.3);  // テーブルマップに登録
      // 但し同一構造複数テーブル対応のため、label(実テーブル)毎にメンバ作成
      v.table.label.forEach(label => {
        // テーブル毎にtableNameを変更する必要があるため、コピーをセット
        v.rv.tableMap[label] = Object.assign({},v.table,{tableName:label});
        v.rv.tableList.push(label);
      });

      for( v.c=0 ; v.c<v.table.cols.length ; v.c++ ){
        dev.step(2.1);  // 既定値の設定
        v.col = Object.assign(JSON.parse(v.default.col),v.table.cols[v.c],{seq:v.c});

        dev.step(2.2);  // labelの設定
        v.table.colNames.push(v.col.colName);
        if( !v.col.label ) v.col.label = v.col.colName;
        v.table.header.push(v.col.label);

        dev.step(2.3);  // 項目マップに登録。項目名、ラベル、別名、出現順(数字)
        Array.from(new Set([v.col.colName, v.col.label, ...v.col.alias, v.c]))
        .forEach(x => v.table.colMap[x]=v.col);

        dev.step(2.4);  // 作成した項目オブジェクトを登録
        v.table.cols[v.c] = v.col;
      }

      dev.step(1.4);  // 作成したテーブルオブジェクトを登録
      v.rv.tables[v.t] = v.table;
    }

    dev.step(3.1);
    // ここまでは全項目JSON化可能な値のみ。以降parse/stringifyで展開後、関数化
    v.rv = JSON.parse(JSON.stringify(v.rv));

    dev.step(3.2);  // customを関数化
    for( v.fn in v.rv.custom ){
      v.rv.custom[v.fn] = new Function('return '+v.rv.custom[v.fn])();
    }

    dev.step(3.3);  // default,printfを関数化
    for( v.table in v.rv.tableMap ){
      for( v.col in v.rv.tableMap[v.table].colMap ){
        ['default','printf'].forEach(x => {
          if( v.col[x] ) v.col[x] = new Function('return '+v.col[x])();
        });
      }
    }

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}