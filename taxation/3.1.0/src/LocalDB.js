/** localDB: IndexedDBを保存先とするブラウザ内RDB
 * @param {schemaDef} [schema={}] - DB構造定義オブジェクト
 */
function localDB(arg) {
  const pv = { whois: 'localDB', rv: null,
    idb: null,          // IndexedDB
    dbName: 'localDB',  // IndexedDBの名称
    storeName: 'JSON',  // IndexedDBのストア名
    rdb: new alasql.Database(), // alasql
  };

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
    
    dev.end(); // 終了処理
    return {
      'exec': execSQL,
      //'load': loadRDB,
      //'save': saveRDB,
      //'import': importJSON,
      //'export': exportJSON,
      'hasTable': hasTable,
    };

  } catch (e) { dev.error(e); return e; }
}