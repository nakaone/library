/** localDB: IndexedDBを保存先とするブラウザ内RDB
 * - IndexedDBの使用を前提とするが、AlaSQLのみでも動作する
 *   ⇒ 引数としてのschemaは必須としない
 * @param {Object} arg
 * @param {schemaDef} arg.schema={} - DB構造定義オブジェクト
 * @returns {Object} 使用可能なメソッドのオブジェクト
 */
function LocalDb(arg={}) {
  const pv = { whois: 'LocalDb', rv: null,
    schema: arg.schema || {tables:[]},
    idb: null,          // IndexedDB
    rdb: new alasql.Database(), // alasql
    now: Date.now(),
    opt: {
      dbName: arg.dbName || 'LocalDb',  // IndexedDBの名称
      storeName: 'RDB',   // IndexedDBのストア名
    },
  };

  async function constructor(arg) {
    const v = { whois: `${pv.whois}.constructor`, rv: null};
    dev.start(v.whois, [...arguments]);
    return new Promise(async(resolve, reject) => {
      dev.step(1);  // オプションに既定値設定
      pv.opt = Object.assign(pv.opt,arg);
      dev.dump(pv.opt);

      dev.step(2);
      pv.idb = await openIndexedDB();

      for( v.tableName in pv.schema.tables.map(x => x.name)){
        dev.step(3);  // rdbからテーブル名をキーとして検索
        v.existingData = await getIndexedDB(v.tableName);

        if (v.existingData) {
          dev.step(4.1);  // 存在すればdataをJSON.parseしてpv.rdbに格納
          pv.rdb.tables[v.tableName] = JSON.parse(v.existingData.data);
        } else {
          dev.step(4.2);  // 存在しなければ新規登録
          await setIndexedDB(v.tableName, '[]');
          pv.rdb.exec(`create table \`${v.tableName}\``);
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    });
  }

  async function openIndexedDB() {
    console.log(pv.whois+'.openIndexedDB start.');
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(pv.opt.dbName, 1);

      request.onupgradeneeded = (event) => {
        pv.idb = event.target.result;
        pv.idb.createObjectStore(pv.opt.storeName, { keyPath: 'name' });
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async function getIndexedDB(tableName) {
    console.log(pv.whois+`.getIndexedDB start. tableName=${tableName}`);
    return new Promise((resolve) => {
      const transaction = pv.idb.transaction([pv.opt.storeName]);
      const store = transaction.objectStore(pv.opt.storeName);
      const request = store.get(tableName);

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }

  async function setIndexedDB(name, rows) {
    console.log(pv.whois+`.setIndexedDB start.\nname=${name}\nrows sample=${JSON.stringify(rows.slice(0,2),null,2)}(${rows.length} rows)`);
    return new Promise((resolve) => {
      const transaction = pv.idb.transaction(pv.opt.storeName, 'readwrite');
      const store = transaction.objectStore(pv.opt.storeName);
      const request = store.put({ name: name, rows: rows });

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  /** execSQL: alasqlでSQLを実行
   * @param {string} sql
   * @param {Array[]} arg - alasqlの第二引数
   * @returns {Object[]}
   */
  function execSQL(sql,arg=null) {
    return arg === null ? pv.rdb.exec(sql) : pv.rdb.exec(sql,arg);
  }

  /** loadIDB: IndexedDBからRDBへデータをロードする
   * @param {string|string[]} arg=[] - ロード対象テーブル名
   * @returns {void}
   */
  /*
  function loadIDB(arg) {
    const v = { whois: `${pv.whois}.loadIDB`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 対象テーブルリストを作成
      v.tables = Array.isArray(arg) ? arg : ( typeof arg === 'string' ? [arg] : []);
      if( v.tables.length === 0 ) throw new Error('テーブル指定が不適切です');

      dev.step(2);  // 対象テーブルを順次ロード
      for( v.i=0 ; v.i<v.tables.length ; v.i++ ){

        dev.step(2.1);  // 項目定義をv.colsに格納
        if( pv.tableDef.hasOwnProperty(v.tables[v.i]) ){
          v.cols = pv.tableDef[v.tables[v.i]].cols;
        } else {
          throw new Error(`テーブル「${v.tables[v.i]}」は定義されてません`);
        }
        dev.dump(v.cols);

        dev.step(2.2);  // シートを取得。メイン処理で作成済なので不存在は考慮不要
        v.sheet = pv.spread.getSheetByName(v.tables[v.i]);
        v.raw = v.sheet.getDataRange().getDisplayValues();
        v.rObj = [];  // 対象シートの行オブジェクト配列

        dev.step(2.3);  // シートが存在する場合、内容をv.rObjに読み込み
        for (v.r = 1; v.r < v.raw.length; v.r++) {  // ヘッダ行(0行目)は飛ばす
          v.o = {}; // メンバ名はlabelではなくnameを使用
          for (v.c = 0, v.validCellNum = 0; v.c < v.cols.length; v.c++) {
            if( v.raw[v.r][v.c] ){
              // セルの値が有効
              v.o[v.cols[v.c].name] = v.raw[v.r][v.c];
              v.validCellNum++;
            } else {
              // セルが空欄または無効な値の場合、欄のデータ型に沿って値を設定
              switch( pv.tableDef[v.tables[v.i]].cols[v.c].type ){
                case 'number' : v.o[v.cols[v.c].name] = 0; break;
                case 'boolean' : v.o[v.cols[v.c].name] = false; break;
                default: v.o[v.cols[v.c].name] = '';
              }
            }
          }
          // 有効な値を持つセルが存在すれば有効行と看做す
          if( v.validCellNum > 0 ) v.rObj.push(v.o);
        }

        dev.step(2.4);  // テーブルに追加
        v.sql = `delete from \`${v.tables[v.i]}\`;` // 全件削除
        + `insert into \`${v.tables[v.i]}\` select * from ?`;
        v.r = execSQL(v.sql,[v.rObj]);
        if( v.r instanceof Error ) throw v.r;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
  */

  /** saveRDB: AlaSQLのテーブルからIndexedDBへデータを保存する
   * @param {string|string[]} arg=[] - 保存対象テーブル名
   * @returns {void}
   */
  /*
  function saveRDB(arg=[]) {
    const v = { whois: `${pv.whois}.saveRDB`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 対象テーブルリストを作成
      v.tables = Array.isArray(arg) ? arg : ( typeof arg === 'string' ? [arg] : []);
      if( v.tables.length === 0 ) throw new Error('テーブル指定が不適切です');

      dev.step(2);  // 対象テーブルを順次格納
      for( v.i=0 ; v.i<v.tables.length ; v.i++ ){

        dev.step(2.1);  // 項目定義をv.colsに格納
        if( pv.tableDef.hasOwnProperty(v.tables[v.i]) ){
          v.cols = pv.tableDef[v.tables[v.i]].cols;
        } else {
          throw new Error(`テーブル「${v.tables[v.i]}」は定義されてません`);
        }
        dev.dump(v.cols);

        dev.step(2.2);  // シートを取得。メイン処理で作成済なので不存在は考慮不要
        v.sheet = pv.spread.getSheetByName(v.tables[v.i]);

        dev.step(2.3);  // 現状クリア：行固定解除、ヘッダを残し全データ行・列削除
        v.sheet.setFrozenRows(0);
        v.maxRows = v.sheet.getMaxRows();
        v.maxCols = v.sheet.getMaxColumns();
        if( v.maxRows > 1)
          v.sheet.deleteRows(2,v.maxRows-1);
        if( v.maxCols > v.cols.length )
          v.sheet.deleteColumns(v.cols.length+1, v.maxCols-v.cols.length);

        dev.step(2.4);  // 対象テーブル全件取得
        v.r = execSQL(`select * from \`${v.tables[v.i]}\`;`);
        if( v.r instanceof Error ) throw v.r;
        if( v.r.length === 0 ) continue;  // レコード数0なら保存対象外

        dev.step(2.5);  // 行オブジェクト -> 二次元配列への変換
        v.arr = [];
        v.r.forEach(o => {
          for( v.i=0,v.l=[] ; v.i<v.cols.length ; v.i++ ){
            v.l[v.i] = o[v.cols[v.i].name] || '';
          }
          v.arr.push(v.l);
        });

        // シートに出力
        v.sheet.getRange(2,1,v.arr.length,v.cols.length).setValues(v.arr);

        // シートの整形：1行目のみ固定化
        v.sheet.setFrozenRows(1);
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
  */

  /** importJSON: JSONからRDB/IDBへデータを格納する
   * - schema.dbNameは無視される(constructorでの設定値を優先、上書きしない)
   * @param {schemaDef} schema - ロード対象のデータ構造定義オブジェクト
   * @param {Object} opt={}
   * @param {string|string[]} [include=[]] - 対象テーブル名。指定無しならschema.tablesに含まれる全件を格納
   * @param {string|string[]} [exclude=[]] - 除外テーブル名。指定無しなら除外無し
   * @returns {void}
   */
  function importJSON(schema=pv.schema,opt={}) {
    const v = { whois: `${pv.whois}.importJSON`, rv: null,
      ijName: 'LocalDbImportJSON'+pv.now, // 本メソッドで使用する一意な名前
    };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // ファイルが指定されたときに呼び出される関数の定義
      window[v.ijName] = event => {
        console.log(v.ijName,event.target);
      };

      dev.step(2);  // 汎用画面にインポート用画面を作成
      v.r = createElement({attr:{id:v.ijName},children:[
        {tag:'h1',text:'インポート'},
        {tag:'input',attr:{type:'file'},event:{change:e=>window[v.ijName](e)}},
        {tag:'textarea',attr:{cols:60,rows:15}},
      ]},document.querySelector('body'));

      /*
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
          pv.rdb.tables[v.tableName] = JSON.parse(v.existingData.rows);
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

  /** exportJSON: 全テーブルの構造及びデータをJSON化、ダウンロード。
   * 但しFunction型は文字列型に変換される。
   * @param {string} fileName - ダウンロードファイル名。必須。
   * @returns {void}
   * - 出力されるJSONの構造はschemaDef参照
   */
  /*
  function exportJSON() {
    const v = { whois: `${pv.whois}.exportJSON`, rv: null};
    dev.start(v.whois);
    try {

      dev.step(1);  // ダウンロードする内容の作成
      dev.step(1.1);  // pv.schemaをv.contentにディープコピー
      v.deepCopy = (value) => {
        if (typeof value === 'function') {
          return value.toString();  // 関数型は文字列化
        } else if (Array.isArray(value)) {
          return value.map(item => v.deepCopy(item));
        } else if (value !== null && typeof value === 'object') {
          const copy = {};
          for (let key in value) {
            if (value.hasOwnProperty(key)) {
              copy[key] = v.deepCopy(value[key]);
            }
          }
          return copy;
        } else {
          // プリミティブ型（number, string, boolean, null, undefined）はそのまま返す
          return value;
        }
      };
      v.content = v.deepCopy(pv.schema);
      // 作成日時を付記
      v.content.created = toLocale();

      dev.step(1.2);  // 各テーブルのデータをセット
      for( v.i=0 ; v.i<v.content.tables.length ; v.i++ ){
        v.table = v.content.tables[v.i]
        v.table.data = execSQL(`select * from \`${v.table.name}\`;`);
        if( v.table.data instanceof Error ) throw v.table.data;
      }

      dev.step(1.3);  // 文字列化
      const jsonStr = JSON.stringify(v.content);
      dev.dump(jsonStr);

      dev.step(2);  // HTMLをコード内で定義
      const html = HtmlService.createHtmlOutput(`
        <html>
          <head><base target="_top"></head>
          <body>
            <p>JSONファイルのダウンロードを開始しています...</p>
            <script>
              const data = ${jsonStr};

              // JSONとしてファイルを生成して自動ダウンロード
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'data.json';
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
  */

  /** hasTable: RDB(alasql)内にテーブルを持っているか確認
   * @param {string} tableName
   * @returns {boolean}
   */
  function hasTable(tableName) {
    return tableName in pv.rdb.tables;
  }

  dev.start(pv.whois, [...arguments]);
  try {

    dev.step(3);  // AlaSQLカスタム関数の用意
    if( pv.schema.hasOwnProperty('custom') ){
      Object.keys(pv.schema.custom).forEach(x => alasql.fn[x] = pv.schema.custom[x]);
    }

    constructor(arg).then(r => {
      dev.end(); // 終了処理
      return {
        'exec': execSQL,
        //'load': loadIDB,
        //'save': saveRDB,
        'import': importJSON,
        //'export': exportJSON,
        'hasTable': hasTable,
      };
    });

  } catch (e) { dev.error(e); return e; }
}