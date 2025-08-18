/** localDB: IndexedDBを保存先とするRDB */
async function localDB(arg) {
  const pv = { whois: 'localDB', rv: null,
    idb: null,          // IndexedDB
    dbName: 'localDB',  // IndexedDBの名称
    storeName: 'JSON',  // IndexedDBのストア名
    rdb: new alasql.Database(), // alasql
  };

  /** importJSON: JSONファイルをインポート、RDBに保存 */
  function importJSON(event) {
    const v = { whois: `${pv.whois}.importJSON`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {
      
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

      dev.end(); // 終了処理
      return v.rv;

    });
  }

  /** saveRDB: RDBの全テーブルをIndexedDBにセーブ */
  function saveRDB() {
    const v = { whois: `${pv.whois}.saveRDB`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1.1);
      pv.request = indexedDB.open(pv.dbName, 1);

      dev.step(1.2);
      pv.request.onupgradeneeded = (event) => {
        pv.idb = event.target.result;
        pv.objectStore = pv.idb.createObjectStore(pv.storeName, { keyPath: "name" });
      };

      dev.step(1.3);
      pv.request.onsuccess = (event) => {
        pv.idb = event.target.result;
        console.log("saveRDB:IndexedDBが開けました");

        v.transaction = pv.idb.transaction([pv.storeName], "readwrite");
        v.objectStore = v.transaction.objectStore(pv.storeName);

        v.dataArray = [];
        Object.keys(cf.tableDef).forEach(x => v.dataArray.push({
          name:x,
          values: JSON.stringify(execSQL(`select * from \`${x}\`;`)||[])
        }));

        v.dataArray.forEach(data => {
          v.request = v.objectStore.put(data);
          v.request.onsuccess = () => {
            console.log(`saveRDB:${data.name}が保存されました`);
          };
          v.request.onerror = (event) => {
            console.error("saveRDB:データの保存に失敗しました", event);
          };
        });
      };

      dev.step(1.4);
      pv.request.onerror = (event) => {
        console.error("saveRDB:データベースが開けませんでした", event);
      };

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** loadRDB: IndexedDBの全テーブルをRDBにロード */
  function loadRDB(callback) {
    const v = { whois: `${pv.whois}.loadRDB`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      pv.request = indexedDB.open(pv.dbName, 1);

      pv.request.onupgradeneeded = (event) => {
        pv.idb = event.target.result;
        pv.objectStore = pv.idb.createObjectStore(pv.storeName, { keyPath: "name" });
      };

      pv.request.onsuccess = (event) => {
        pv.idb = event.target.result;
        console.log("loadRDB:IndexedDBが開けました");

        v.transaction = pv.idb.transaction([pv.storeName]);
        v.objectStore = v.transaction.objectStore(pv.storeName);
        v.request = v.objectStore.getAll();

        v.request.onsuccess = (event) => {

          // IndexedDB登録済のテーブルを順次RDBに作成
          console.log(`l.201`,event.target.result);
          event.target.result.forEach(o => {
            v.sql = `create table if not exists \`${o.name}\`;`
            + `insert into \`${o.name}\` select * from ?;`;
            execSQL(v.sql,[JSON.parse(o.values)]);
          });

          // 未登録のテーブルがあればRDBに追加後、saveRDBでIndexedDBに反映
          v.list = event.target.result.map(x => x.name);
          v.append = [];
          Object.keys(cf.tableDef).forEach(x => {
            if( !v.list.find(y => y === x) ){
              v.append.push(x);
              execSQL(`create table if not exists \`${x}\`;`);
            }
          });
          if( v.append.length > 0 ) saveRDB();

          console.log("loadRDB:IndexedDBから取得したデータ:", event.target.result);
          callback();
        };

        v.request.onerror = (event) => {
          console.error("loadRDB:データの取得に失敗しました", event);
        };
      };

      pv.request.onerror = (event) => {
        console.error("loadRDB:データベースが開けませんでした", event);
      };

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
    return arg === null ? pv.rdb.exec(sql) : pv.rdb.exec(sql,arg);
  }
  /** hasTable: RDB(alasql)内にテーブルを持っているか確認 */
  function hasTable(tableName) {
    return tableName in pv.rdb.tables;
  }


  dev.start(pv.whois, [...arguments]);
  try {

    await constructor(arg);
    
    dev.end(); // 終了処理
    return {
      fuga: 'hoge'
      //'import': importJSON,
      //'export': exportJSON,
      //'save': saveRDB,
      //'load': loadRDB,
      //'do': execSQL,
      //'hasTable': hasTable,
    };

  } catch (e) { dev.error(e); return e; }
}