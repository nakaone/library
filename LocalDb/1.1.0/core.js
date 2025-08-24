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
/** LocalDb: ブラウザローカルのRDB、データはIndexedDBに保存
 * @param {schemaDef} arg
 * @returns {Object.<string,Function>} クロージャ関数
 */
function LocalDb(arg) {
  const pv = {
    whois: 'LocalDb',
    rv: null,
    schema: arg || { tables: [] },
    idb: null, // IndexedDB
    rdb: new alasql.Database(), // AlaSQL
    now: Date.now(),
    dbName: 'LocalDb', // IndexedDBの名称
    storeName: arg.dbName || 'RDB', // IndexedDBのストア名
  };

  // IndexedDBの初期化
  const initIDB = () => {
    console.log(`${pv.whois}.initIDB start.`);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(pv.dbName, 1);
      request.onupgradeneeded = (event) => {
        pv.idb = event.target.result;
        // ストア未登録なら追加登録
        if (!pv.idb.objectStoreNames.contains(pv.storeName)) {
          pv.idb.createObjectStore(pv.storeName);
        }
      };
      request.onsuccess = (event) => {
        pv.idb = event.target.result;
        resolve();
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };

  // SQLを実行する関数
  const execSQL = (sql,opt=null) => {
    console.log(`${pv.whois}.execSQL start.\nsql="${sql}"`
      + `\nopt=${ opt === null ? 'null'
        : JSON.stringify({num:opt.length,sample:opt[0]})}`);
    return opt === null ? alasql(sql) : alasql(sql,opt);
  };

  // IndexedDBからデータをロードする関数
  const loadIDB = async () => {
    console.log(`${pv.whois}.loadIDB start.`);
    const transaction = pv.idb.transaction(pv.storeName, 'readonly');
    const store = transaction.objectStore(pv.storeName);
    
    // テーブル名とデータを格納する配列
    const tables = [];

    // ストア内の全てのキーを取得
    const keys = await new Promise((resolve) => {
      const request = store.getAllKeys(); // 全てのキーを取得
      request.onsuccess = () => resolve(request.result);
    });

    // 各キーに対してデータを取得
    for (const key of keys) {
      const tableData = await new Promise((resolve) => {
        const request = store.get(key); // 各キーに対するデータを取得
        request.onsuccess = () => resolve({ name: key, data: request.result });
      });
      tables.push(tableData); // テーブル名とデータを配列に追加
    }

    // 取得したテーブル情報を使ってAlaSQLにテーブルを作成
    tables.forEach((table) => {
      console.log('l.53', JSON.stringify({name:table.name,num:table.data.length,sample:table.data[0]},null,2)); // テーブル名とデータを表示
      execSQL(`drop table if exists \`${table.name}\`;`);
      execSQL(`create table \`${table.name}\`;`);
      execSQL(`insert into \`${table.name}\` select * from ?;`, [table.data]);
    });
  };

  // AlaSQLのテーブルからIndexedDBにデータを保存する関数
  const saveRDB = async () => {
    console.log(`${pv.whois}.saveRDB start.`);
    const transaction = pv.idb.transaction(pv.storeName, 'readwrite');
    const store = transaction.objectStore(pv.storeName);

    for (const table of pv.schema.tables) {
      const data = execSQL(`select * from \`${table.name}\`;`);
      await new Promise((resolve) => {
        store.put(data,table.name);
        resolve();
      });
    }
  };

  // JSONファイルをインポートする関数
  const importJSON = async () => {
    console.log(`${pv.whois}.importJSON start.`);
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const jsonData = JSON.parse(e.target.result);
        for (const table of jsonData.tables) {
          execSQL(`drop table if exists \`${table.name}\`;`);
          execSQL(`create table \`${table.name}\`;`);
          execSQL(`insert into \`${table.name}\` select * from ?;`, [table.data]);
        }
        await saveRDB();
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  // 全テーブルのデータをJSON化してダウンロードする関数
  const exportJSON = () => {
    console.log(`${pv.whois}.exportJSON start.`);
    const data = JSON.parse(JSON.stringify(pv.schema));
    data.tables.forEach(table => {
      table.data = execSQL(`select * from \`${table.name}\`;`);
    });
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 初期化処理
  initIDB().then(loadIDB);

  return {
    exec: execSQL,
    load: loadIDB,
    save: saveRDB,
    import: importJSON,
    export: exportJSON,
  };
}