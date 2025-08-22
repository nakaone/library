/** localDB: IndexedDBを保存先とするブラウザ内RDB
 * @param {Object} arg
 * @param {schemaDef} arg.schema={} - DB構造定義オブジェクト
 * @returns {Object} 使用可能なメソッドのオブジェクト
 */
function LocalDb(arg={}) {
  const pv = { whois: 'LocalDb', rv: null,
    schema: arg.schema || {tables:[]},
    idb: null,          // IndexedDB
    rdb: new alasql.Database(), // alasql
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
        'hasTable': hasTable,
      };
    });

    /*
    dev.end(); // 終了処理
    return {
      //'load': loadIDB,  IndexedDBからRDBへデータをロードする
      //'save': saveRDB,  RDBからIndexedDBへデータを保存する
      //'import': importJSON,
      //'export': exportJSON,
    };
    */


  } catch (e) { dev.error(e); return e; }
}