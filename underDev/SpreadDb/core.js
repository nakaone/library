// 以下、typedefはSchema 1.1.0より引用。

/** schemaDef: DB構造定義オブジェクト (引数用)
 * @typedef {Object} schemaDef
 * @property {string} [dbName] - データベース名(IndexedDB上ではストア名)
 * @property {string} [note] - 備考
 * @property {Object.<string, tableDef>} tableDef - テーブル構造定義名をメンバ名とするテーブル構造定義
 * @property {Object.<string, Object>} tableMap - 実テーブル名をメンバ名とする実テーブルの定義
 * @property {string} [tableMap.def] - 使用するテーブル定義名。実テーブル名と定義名が一致する場合は省略可。
 * @property {string|Object[]} [tableMap.data] - テーブルに格納される初期データ
 *   - string: CSV/TSV形式。先頭行は項目名(labelの配列=header)。
 *   - Object[]: 行オブジェクトの配列
 * @property {Object.<string, string>} [custom] - AlaSQLのカスタム関数。{関数名: toString()で文字列化した関数}
 */

/** schemaDefEx: Schemaの戻り値となる拡張済DB構造定義オブジェクト
 * 引数用のschemaDefに以下を追加・変更したもの
 * @typedef {Object} schemaDefEx
 * @property {string} original - インスタンス化前の引数(schemaDef)をJSON文字列化したもの  
 *   (一部文字列を関数化しているため、保存時はプリミティブ変数のみ)
 * @property {string} [created] - 作成日時。export時に使用
 * @property {Function} expand - expandSchemaメソッド(公開API)。schemaDefExを再作成
 */

// =====================================================================

/** tableDef: テーブル構造定義オブジェクト (引数用)
 * @typedef {Object} tableDef
 * @property {string} [note] - テーブルに関する備考
 * @property {string|string[]} [primaryKey] - 主キーとなる項目名。複合キーの場合は配列で指定
 * @property {columnDef[]} colDef - 項目定義(順序を考慮するためオブジェクトでは無く配列で定義)
 * @property {number} [top=1] - シート・CSVイメージ上のヘッダ行番号
 * @property {number} [left=1] - シート・CSVイメージ上の開始列番号
 * @property {number} [startingRowNumber=2] - シート上の行番号"RowNumber"を追加する場合の開始行番号。<0なら追加しない。
 */

/** tableDefEx: Schemaの戻り値となる拡張済テーブル構造定義オブジェクト
 * 引数用のtableDefに以下の項目を追加・変更したもの
 * @typedef {Object} tableDefEx
 * @property {string} name - 実テーブル名
 * @property {string[]} header - columnDef.labelの配列
 * @property {Object.<string, columnObj>} colDef - {columnDef.name: columnObj}
 */

// =====================================================================

/** columnDef: 項目定義オブジェクト (引数用)
 * @typedef {Object} columnDef
 * @property {string} name - 項目名。原則英数字で構成(システム用)
 * @property {string} [note] - 備考
 * @property {string} [label] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @property {string} [type='string'] - データ型。string / number / boolean
 * @property {string[]} [alias] - 複数タイプのCSVを統一フォーマットで読み込む際の別名リスト
 * @property {any} [default=null] - 既定値。関数の場合は引数を行オブジェクトとするtoString()化された文字列
 * @property {string} [printf=null] - 表示整形用関数。引数を行オブジェクトとするtoString()化された文字列
 */

/** columnDefEx: Schemaの戻り値となる拡張済項目定義オブジェクト
 * 引数用のcolumnDefに以下の項目を追加・変更したもの
 * @typedef {Object} columnDefEx
 * @property {number} seq - 左端を0とする列番号
 */

// =====================================================================

/** SpreadDb: シートをテーブルとして扱うGAS内部のRDB
 * - ヘッダ行は1行目に固定、左端から隙間無く項目を並べる(空白セル不可)
 * - シート上には存在しないが、テーブル上はRowNumber(シート上の行番号)を持たせる。データ部先頭は'2'
 * @param {schemaDef} schema={table[]} - Schemaでインスタンス化後のDB構造定義オブジェクト。
 * @param {Object} opt - オプション
 * @returns {Object} 使用可能なメソッドのオブジェクト
 */
function SpreadDb(schema={table:[]},opt={}) {
  const pv = { whois: 'SpreadDb', rv: null,
    spread: SpreadsheetApp.getActiveSpreadsheet(),
    schema: Schema(schema),
    opt: Object.assign({},opt), // 現状、オプションは未定義
    rdb: new alasql.Database(),
  };

  /** array2obj: シートイメージの二次元配列を行オブジェクトの配列に変換
   * @param {string|number|boolean[][]} arg=[] - シートイメージの二次元配列。先頭行はヘッダ
   * @param {Object} opt - オプション
   * @param {number|null} opt.RowNumber=null - 行番号(RowNumber)追加ならヘッダ行の行番号、追加無しならnull
   * @param {Object.<string,columnDefEx>|null} opt.colDef=null - シートイメージの項目定義集
   * @returns {Object[]} 行オブジェクトの配列
   */
  function array2obj(arg=[],opt={}) {
    const v = { whois: `${pv.whois}.array2obj`, rv: []};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // オプションの既定値設定
      opt = Object.assign({RowNumber:null,colDef:null},opt);

      for (v.r = 1; v.r < arg.length; v.r++) {  // ヘッダ行(0行目)は飛ばす

        dev.step(2);  // 行オブジェクトの原型作成
        v.o = opt.RowNumber === null ? {} : {RowNumber:opt.RowNumber++};

        for( v.c=0 ; v.c<arg[0].length ; v.c++ ){

          dev.step(3);  // 項目名空欄は除外
          if( !arg[0][v.c] ) continue;

          dev.step(4);  // 項目定義上のデータ型を特定
          v.type = typeof opt.colDef[arg[0][v.c]].type === 'undefined'
          ? 'undefined' : opt.colDef[arg[0][v.c]].type;

          switch( v.type ){
            case 'number':
              dev.step(5.1);  // 数値化。なおNumber('')=0
              v.o[arg[0][v.c]] = Number(arg[v.r][v.c].replace(/,/g,''));
              // 数値項目に数値以外が入っていたらエラー
              if( isNaN(v.o[arg[0][v.c]]) ) throw v.o[arg[0][v.c]];
              break;
            case 'boolean':
              dev.step(5.2);  // 真偽値欄の空欄は未設定と看做して空文字列を設定、
              // 空文字列以外でリストに含まれる文字列はfalse、それ以外はtrueを設定
              v.o[arg[0][v.c]] = (arg[v.r][v.c] === '' ? '' : ( 
                ['0','false','no','ng','偽','誤','□']
                .find(x => x === arg[v.r][v.c].toLowerCase()) ? false : true
              ));
              break;
            default:
              dev.step(5.3);  // string型、またはデータ型不明はそのままセット
              v.o[arg[0][v.c]] = arg[v.r][v.c];
          }

        }

        dev.step(6);  // 行オブジェクトを戻り値に格納
        v.rv.push(v.o);
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** execSQL: alasqlでSQLを実行
   * @param {string} sql
   * @param {Array[]} arg - alasqlの第二引数
   * @returns {Object[]}
   */
  function execSQL(sql,arg=null) {
    console.log(`${pv.whois}.execSQL start.\nsql: ${sql}\narg: `
      + ( arg === null ? 'null' : `placeholder num = ${arg.length}\n`
      + arg.map(x => `record num = ${x.length}, sample=${JSON.stringify(x[0])}`).join('\n')
    ));
    return arg === null ? pv.rdb.exec(sql) : pv.rdb.exec(sql,arg);
  }

  /** exportFile: テーブルの構造及びデータをファイルとしてダウンロード
   * なおschema.tableDefが無い場合も出力自体は可能とする。
   * @param {Object|string} arg={} - 文字列型の場合、ダウンロードファイル名と看做す
   * @param {string} arg.file='data.json' - ダウンロードファイル名
   * @param {string|string[]} arg.table=[] - 出力対象テーブル名。無指定なら全テーブル
   * @param {boolean} arg.format='JSON' - 出力形式
   *   - JSON: schemaDefに基づき、tableDef.dataに行オブジェクト化
   *   - CSV,TSV他は必要に応じて追加実装(テーブル指定が1つの場合のみ対応とする？)
   * @returns {void}
   * - 出力されるJSONの構造はschemaDef参照
   */
  function exportFile(arg={}) {
    const v = { whois: `${pv.whois}.exportFile`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // オプションの既定値設定
      arg = Object.assign({
        file: 'data.json',
        table: [],
        format: 'JSON',
      },(typeof arg === 'string' ? {file:arg} : arg));
      arg.table = Array.isArray(arg.table) ? arg.table : [arg.table];
      arg.format = arg.format.toLowerCase();  // 表記揺れ回避

      dev.step(1);  // ダウンロードする内容の作成
      v.content = JSON.parse(pv.schema.original);
      // 作成日時を付記
      v.content.created = toLocale();
      //v.content.data = {};

      dev.step(1.2);  // 各テーブルのデータをセット
      for( v.i=0 ; v.i<arg.table.length ; v.i++ ){
        v.r = execSQL(`select * from \`${arg.table[v.i]}\` order by RowNumber;`);
        if( v.r instanceof Error ) throw v.r;
        v.content.tableMap[arg.table[v.i]].data = v.r;
      }

      dev.step(1.3);  // 文字列化
      v.json = JSON.stringify(v.content);

      dev.step(2);  // HTMLをコード内で定義
      const html = HtmlService.createHtmlOutput(`
        <html>
          <head><base target="_top"></head>
          <body>
            <p>JSONファイルのダウンロードを開始しています...</p>
            <script>
              const data = ${v.json};

              // JSONとしてファイルを生成して自動ダウンロード
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '${arg.file}';
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);

              // ダイアログを自動的に閉じる（少し待ってから）
              setTimeout(() => {
                google.script.host.close();
              }, 1000);
            </script>
          </body>
        </html>
      `).setWidth(300).setHeight(100);

      dev.step(3);  // ダイアログの表示
      SpreadsheetApp.getUi().showModalDialog(html, 'JSONをダウンロード中');

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** hasTable: RDB(alasql)内にテーブルを持っているか確認
   * @param {string} tableName
   * @returns {boolean}
   */
  function hasTable(tableName) {
    return tableName in pv.rdb.tableMap;
  }

  /** importGDCSV: Google Drive上のCSVからデータ取得、行オブジェクトの配列を返す
   * @param {string} id - Google Drive上のファイルID
   * @param {Object} opt
   * @param {string} opt.table - schemaDefでテーブル定義されている場合、そのテーブル名
   *   これが指定されていた場合、メンバ名はCSV上の項目名ではなく、colNameが使用される。
   *   尚後工程(ex.行/伝票/明細番号の付与)も考えられるため、本メソッドではRDB・シートへの追加は行わない
   * @param {string} opt.encode='utf-8' - エンコード指定。MS932(Shift-JIS)等
   * @param {number} opt.header=1 - ヘッダ行番号(≧1)
   * @param {number} opt.RowNumber=1 - 過年度CSVの一括読込等、CSV毎にRowNumberを指定する場合に使用
   * @param {string|string[]} arg=[] - ロード対象テーブル名
   * @returns {Object} {header,data}
   */
  function importGDCSV(id,opt={}) {
    const v = { whois: `${pv.whois}.importGDCSV`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // 事前準備
      // -------------------------------------------------------------
      dev.step(1.1);  // オプションの既定値設定
      opt = Object.assign({
        table:　null,
        encode:　'utf-8',
        header:　1,
        RowNumber: 1,
      },opt);

      dev.step(1.2);  // テーブル構造定義が指定されていたらtableDefにセット
      v.table = opt.table && pv.schema.tableMap.hasOwnProperty(opt.table)
        ? pv.schema.tableMap[opt.table] : null;

      // -------------------------------------------------------------
      dev.step(2);  // CSVファイルの読み込み
      // -------------------------------------------------------------
      v.text = DriveApp.getFileById(id).getBlob().getDataAsString(opt.encode);
      v.csv = Utilities.parseCsv(v.text); // parseCsvは全て文字列項目(数値他への型変換は一切無し)
      // 先頭の不要行はカット
      if( opt.header>1 ) v.csv.splice(0,opt.header-1);

      // -------------------------------------------------------------
      dev.step(3);  // 行オブジェクト化
      // -------------------------------------------------------------
      dev.step(3.1);  // 空欄等、無効な項目名は外して項目名リスト(header)を作成
      v.rv = {header:v.csv[0].filter(x => x),data:[]};

      dev.step(3.2);  // テーブル構造定義が有る場合ヘッダ行を書き換え。該当項目無しの場合、項目名は空文字列
      if( v.table !== null ){
        v.rv = {header:v.table.header,data:[]};
        for( v.c=0 ; v.c<v.csv[0].length ; v.c++ ){
          v.csv[0][v.c] = v.table.colDef.hasOwnProperty(v.csv[0][v.c])
          ? v.table.colDef[v.csv[0][v.c]].name : '';
        }
      }

      dev.step(3.3);  // 行オブジェクト化、戻り値(v.rv.data)に格納
      v.rv.data = array2obj(v.csv,{
        RowNumber: 1,
        colDef: ( v.table === null ? null : v.table.colDef ),
      });
      if( v.rv.data instanceof Error ) throw v.rv.data;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** importJSON: JSONからテーブル・シートへデータを格納する
   * @param {string|string[]} arg=[] - ロード対象テーブル名
   * @returns {void}
   */
  function importJSON(arg=[]) {
    const v = { whois: `${pv.whois}.importJSON`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      /*
      dev.step(1);  // 汎用画面にインポート用画面を作成
      cf.gpScr.innerHTML = '';
      v.r = createElement([
        {tag:'h1',text:'インポート'},
        {tag:'input',attr:{type:'file'},event:{change:e=>ldb.import(e)}},
        {tag:'textarea',attr:{colDef:60,rows:15}},
      ],cf.gpScr);


    dev.step(1);  // オプションに既定値設定
      pv.opt = Object.assign(pv.opt,arg);
      dev.dump(pv.opt);

      dev.step(2);
      pv.idb = await openIndexedDB();

      for( v.tableName in cf.tableDef.mappingTable){
        dev.step(3);  // rdbからテーブル名をキーとして検索
        v.existingData = await getIndexedDB(v.tableName);
        
        if (v.existingData) {
          dev.step(4.1);  // 存在すればrowsをJSON.parseしてpv.rdbに格納
          pv.rdb.tableMap[v.tableName] = JSON.parse(v.existingData.rows);
        } else {
          dev.step(4.2);  // 存在しなければ新規登録
          await setIndexedDB(v.tableName, '[]');
          pv.rdb.exec(`create table \`${v.tableName}\``);
        }
      }
      */

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** loadSheet: シートからRDBへデータをロードする
   * @param {string|string[]} arg=[] - ロード対象テーブル名
   * @returns {void} 戻り値のメンバ名はcolumnDef.colName(labelではないことに注意)
   */
  function loadSheet(arg) {
    const v = { whois: `${pv.whois}.loadSheet`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 対象テーブルリストを作成
      v.list = Array.isArray(arg) ? arg : ( typeof arg === 'string' ? [arg] : []);
      if( v.list.length === 0 ) throw new Error('テーブル指定が不適切です');

      dev.step(2);  // 対象テーブルを順次ロード
      for( v.i=0 ; v.i<v.list.length ; v.i++ ){

        dev.step(2.1);  // シートを取得。メイン処理で作成済なので不存在は考慮不要
        v.table = pv.schema.list[v.list[v.i]];
        v.sheet = pv.spread.getSheetByName(v.table.name);
        v.raw = v.sheet.getDataRange().getDisplayValues();

        dev.step(2.2);  // ヘッダ行が先頭に来るよう、余分な行を削除
        if( v.table.top > 1 ) v.raw.splice(0,v.table.top-1);

        dev.step(2.3);  // シートが存在する場合、内容をv.rObjに読み込み
        v.rObj = array2obj(v.raw,{RowNumber:1,colDef:v.table.colDef});
        if( v.rObj instanceof Error ) throw v.rObj;

        dev.step(2.4);  // テーブルに追加
        v.sql = `delete from \`${v.list[v.i]}\`;` // 全件削除
        + `insert into \`${v.list[v.i]}\` select * from ?`;
        v.r = execSQL(v.sql,[v.rObj]);
        if( v.r instanceof Error ) throw v.r;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** saveRDB: RDBからシートへデータを保存する
   * @param {string|string[]} arg=[] - 保存対象テーブル名
   * @returns {void}
   */
  function saveRDB(arg=[]) {
    const v = { whois: `${pv.whois}.saveRDB`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 対象テーブルリストを作成
      v.list = Array.isArray(arg) ? arg : ( typeof arg === 'string' ? [arg] : []);
      if( v.list.length === 0 ) throw new Error('テーブル指定が不適切です');

      dev.step(2);  // 対象テーブルを順次格納
      for( v.i=0 ; v.i<v.list.length ; v.i++ ){

        dev.step(2.1);  // 項目定義をv.colDefに格納
        v.table = pv.schema.tableMap[v.list[v.i]];
        v.colnum = v.table.header.length;

        dev.step(2.2);  // シートを取得。メイン処理で作成済なので不存在は考慮不要
        v.sheet = pv.spread.getSheetByName(v.list[v.i]);

        dev.step(2.3);  // 現状クリア：行固定解除、ヘッダを残し全データ行・列削除
        v.sheet.setFrozenRows(0);
        v.maxRows = v.sheet.getMaxRows();
        v.maxCols = v.sheet.getMaxColumns();
        if( v.maxRows > 1)
          v.sheet.deleteRows(2,v.maxRows-1);
        if( v.maxCols > v.colnum )
          v.sheet.deleteColumns(v.colnum+1, v.maxCols-v.colnum);

        dev.step(2.4);  // 対象テーブル全件取得
        v.r = execSQL(`select * from \`${v.list[v.i]}\` order by \`RowNumber\`;`);
        if( v.r instanceof Error ) throw v.r;
        if( v.r.length === 0 ) continue;  // レコード数0なら保存対象外

        dev.step(2.5);  // 行オブジェクト -> 二次元配列への変換
        v.arr = [];
        v.r.forEach(o => {
          for( v.j=0,v.l=[] ; v.j<v.colnum ; v.j++ ){
            v.l[v.j] = o[v.table.colDef[v.j].name] || '';
          }
          v.arr.push(v.l);
        });

        // シートに出力
        v.sheet.getRange(2,1,v.arr.length,v.colnum).setValues(v.arr);

        // シートの整形：1行目のみ固定化
        v.sheet.setFrozenRows(1);
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  // SpreadDbメイン処理
  dev.start(pv.whois, [...arguments]);
  try {

    dev.step(1);  // schema.tableMapを基にテーブル・シートを初期化
    for( pv.table of Object.values(pv.schema.tableMap) ){

      dev.step(1.1);  // RDBのテーブルを初期化
      // create tableの各項目用SQL文を作成
      pv.table.colDef.forEach(col => {
        // 項目名 データ型 主キーなら"not null"
        col.sql = `\`${col.name}\` ${col.type}${
          pv.table.primaryKey.includes(col.name) ? ' not null' : ''}`;
      })

      dev.step(1.2);  // テーブルの再作成
      pv.sql = `drop table if exists \`${pv.table.name}\`;`
      + `create table \`${pv.table.name}\` (${pv.table.colDef.map(x => x.sql).join(',')}${
        pv.table.primaryKey.length === 0 ? '' 
        : `, primary key (${pv.table.primaryKey.map(x => '`'+x+'`').join(',')})`
      });`;
      pv.r = execSQL(pv.sql);
      if( pv.r instanceof Error ) throw pv.r;

      dev.step(1.3);  // 作成結果確認
      const { pk, columns }=pv.rdb.tables['ファイル一覧'];
      dev.dump({ pk, columns });

      dev.step(2);  // シートの作成
      pv.sheet = pv.spread.getSheetByName(pv.table.name);
      if( pv.sheet ){
        dev.step(2.1);  // シート作成済の場合、シートからRDBにロード
        pv.r = loadSheet(pv.table.name);
        if( pv.r instanceof Error ) throw pv.r;
      } else {
        dev.step(2.2);  // シート未作成の場合、シートを作成してヘッダ行を登録
        pv.table = pv.schema.tableMap[pv.table.name];
        pv.sheet = pv.spread.insertSheet(pv.table.name);
        pv.range = pv.sheet.getRange(1, 1, 1, pv.table.header.length);
        pv.range.setValues([pv.table.header]);
        pv.noteArray = [];
        for( pv.i=0 ; pv.i<pv.table.header.length ; pv.i++ ){
          pv.noteArray.push(pv.table.colDef[pv.i].note);
        }
        pv.range.setNotes([pv.noteArray]);
        pv.sheet.autoResizeColumns(1, pv.table.header.length);  // 各列の幅を項目名の幅に調整
        pv.sheet.setFrozenRows(1); // 先頭1行を固定

        if( pv.table.data.length > 0 ){
          dev.step(2.3);  // 初期データが存在する場合、RDBに追加してシートに反映
          pv.sql = `insert into \`${pv.table.name}\` select * from ?;`;
          pv.r = execSQL(pv.sql,[pv.table.data]);
          if( pv.r instanceof Error ) throw pv.r;
          pv.r = saveRDB(pv.table.name);
          if( pv.r instanceof Error ) throw pv.r;
        }
      }
    }

    dev.step(3);  // AlaSQLカスタム関数の用意
    if( pv.schema.hasOwnProperty('custom') ){
      Object.keys(pv.schema.custom).forEach(x => alasql.fn[x] = pv.schema.custom[x]);
    }

    dev.end(); // 終了処理
    return {
      'exec': execSQL,
      'load': loadSheet,
      'save': saveRDB,
      'import': importJSON,
      'importGDCSV': importGDCSV,
      'export': exportFile,
      'hasTable': hasTable,
      'getSchema': ()=>pv.schema,
    };

  } catch (e) { dev.error(e); return e; }
}