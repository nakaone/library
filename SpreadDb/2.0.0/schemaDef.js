/** SpreadDb/LocalDb/createTable共通(2025/08/25)
 * @typedef {Object} schemaDef - DB構造定義オブジェクト
 * @param {string} name - データベース名(IndexedDB上ではストア名)
 * @param {string} [note] - 備考
 * @param {tableDef[]} tables - DB内のテーブル定義
 * @param {Object.<string,string>} [custom] - AlaSQLのカスタム関数。{関数名:toString()で文字列化した関数}
 * @param {string} [created] - 作成日時。export時に付記
 * 
 * @typedef {Object} tableDef - テーブル構造定義オブジェクト
 * @param {string} name - テーブル構造定義名。原則シート名も一致(label定義時はlabel=テーブル名=シート名)
 * @param {string} [note] - 備考
 * @param {string|string[]} [label] - テーブル・シート名。省略時はnameを流用。
 *   配列の場合、同一構造で複数テーブルを作成。
 *   例：「kz標準」としてテーブル構造定義し、同一構造のテーブル「過年度仕訳」と「仕訳日記帳」を作成
 *   ⇒ name:'kz標準',label:['過年度仕訳','仕訳日記帳']
 * @param {number} top=1 - シート・CSVイメージ上のヘッダ行番号
 * @param {number} left=1 - シート・CSVイメージ上の開始列番号
 *   top,leftは外部提供CSVをインポートするような場合を想定
 * @param {string|string[]} [primaryKey] - 主キーとなる項目名。複合キーの場合配列で指定
 * @param {columnDef[]} cols - 項目定義
 * @param {Object[]} [data] - テーブルの行オブジェクトの配列。import/export時のみ設定
 * @param {Object} [exportDef={select:['*'],where:''}] - export時の設定。exportDef=nullの場合、出力対象外とする
 * @param {string[]} [exportDef.select=['*']] - 出力項目を絞り込む場合の項目名リスト。空配列なら全項目出力
 * @param {string} [exportDef.where=""] - 出力行を絞り込む場合の条件(SQLのwhere句)
 * 
 * @typedef {Object} columnDef - 項目定義オブジェクト
 * @param {string} name - 項目名
 * @param {string} [note] - 備考
 * @param {string} [label] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @param {string} type - データ型。string/number/boolean
 * @param {string[]} [alias] - 複数タイプのCSVを統一フォーマットで読み込むとき、項目名の揺れを列挙
 * @param {any} [default] - 既定値。関数の場合、引数を行オブジェクトとするtoString()で作成された文字列
 * @param {string} [printf] - 表示時点で行う文字列の整形用関数
 *   引数を行オブジェクトとするtoString()で作成された文字列
 */

/**
 * @typedef {Object} schemaObj - schemaDefに以下項目を追加・変更したオブジェクト
 * @param {string[]} list - 実テーブル名の配列
 * @param {Object.<string,tableObj>} map - {tableDef.list:tableObj}
 * 
 * @typedef {Object} tableObj
 * @param {string} name - tableDef.labelを展開した実テーブル名。構造定義のみの場合は削除。
 *   例：「kz標準」としてテーブル構造定義し、同一構造のテーブル「過年度仕訳」と「仕訳日記帳」を作成
 *   ⇒ {name:'kz標準'}は削除、{name:'過年度仕訳'},{name:'仕訳日記帳'}は作成
 * @param {string[]} names - columnDef.nameの配列
 * @param {number[]} colnum - CSVからのインポート時、cols順に並べた対象列番号
 * @param {string[]} header - columnDef.labelの配列
 * @param {Object.<string,tableObj>} map - {columnDef.name:columnObj}
 * 
 * @typedef {Object} columnObj
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
    schema: {
      name: '',
      note: '',
      tables: [],
      custom: {},
      list: [], // Def->Objで追加
      map: {},  // Def->Objで追加
    },
    table: {
      name: '',
      note: '',
      label: '',
      top: 1,
      left: 1,
      primaryKey: [],
      cols: [],
      data: [],
      exportDef: {select:['*'],where:''},
      names: [],
      colnum: [],
      header: [],
      map: {},
    },
    col: {
      name: '',
      note: '',
      label: '',
      type: 'string',
      alias: [],
      default: null,
      printf: null,
    },
  }};
  dev.start(v.whois, [...arguments]);
  try {

    dev.step(1);  // schemaObjの生成
    v.schema = Object.assign({},v.default.schema,arg);

    for( v.t=0 ; v.t<v.schema.tables.length ; v.t++ ){
      dev.step(1.1);  // 既定値の設定
      v.table = Object.assign({},v.default.table,v.schema.tables[v.t]);

      dev.step(1.2);  // labelの設定
      // name:存在 and label:不存在 -> label=nameとしてnameテーブルを作成
      // name:存在 and label:存在 -> nameテーブルは作成しない、labelテーブルのみ作成
      v.table.label = !v.table.label
      ? [v.table.name] // label不在ならnameを引用、存在で非配列なら配列化
      : (Array.isArray(v.table.label) ? v.table.label : [v.table.label]);

      dev.step(1.3);  // マップ登録。但し同一構造複数テーブル対応のため、label(実テーブル)毎にメンバ作成
      v.table.label.forEach(label => {
        v.schema.map[label] = v.table;
        v.schema.list.push(label);
      });

      for( v.c=0 ; v.c<v.table.cols.length ; v.c++ ){
        dev.step(2.1);  // 既定値の設定
        v.col = Object.assign({},v.default.col,v.table.cols[v.c]);

        dev.step(2.2);  // labelの設定
        v.table.names.push(v.col.name);
        if( !v.col.label ) v.col.label = v.col.name;
        v.table.header.push(v.label);

        dev.step(2.3);  // マップ登録
        v.table.map[v.col.name] = v.table.map[v.col.label] = v.col;

        dev.step(2.4);  // 作成したオブジェクトを登録
        v.table.cols[v.c] = v.col;
      }

      dev.step(1.4);  // 作成したオブジェクトを登録
      v.schema.tables[v.t] = v.table;
    }

    dev.step(3.1);
    // ここまでは全項目JSON化可能な値のみ。以降parse/stringifyで展開後、関数化
    v.rv = JSON.parse(JSON.stringify(v.schema));

    dev.step(3.2);  // customを関数化
    for( v.fn in v.rv.custom ){
      v.rv.custom[v.fn] = new Function('return '+v.rv.custom[v.fn])();
    }

    dev.step(3.3);  // default,printfを関数化
    for( v.table in v.rv.map ){
      for( v.col in v.rv.map[v.table].map ){
        ['default','printf'].forEach(x => {
          if( v.col[x] ) v.col[x] = new Function('return '+v.col[x])();
        });
      }
    }

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}