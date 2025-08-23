function LocalDb(arg) {
  const pv = {
    whois: 'LocalDb',
    rv: null,
    schema: arg.schema || { tables: [] },
    idb: null, // IndexedDB
    rdb: new alasql.Database(), // AlaSQL
    now: Date.now(),
    opt: {
      dbName: arg.dbName || 'LocalDb', // IndexedDBの名称
      storeName: arg.storeName || 'RDB', // IndexedDBのストア名
    },
  };

  // IndexedDBの初期化
  function initIDB() {
    console.log(pv.whois+'.initIDB start.');
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(pv.opt.dbName);

      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        db.createObjectStore(pv.opt.storeName);
      };

      request.onsuccess = function (event) {
        pv.idb = event.target.result;
        loadIDB().then(resolve).catch(reject);
      };

      request.onerror = function (event) {
        reject('IndexedDB error: ' + event.target.errorCode);
      };
    });
  }

  // IndexedDBの内容をAlaSQLにロード
  function loadIDB() {
    console.log(pv.whois+'.loadIDB start.');
    return new Promise((resolve, reject) => {
      const transaction = pv.idb.transaction(pv.opt.storeName, 'readonly');
      const store = transaction.objectStore(pv.opt.storeName);
      const request = store.getAll();

      request.onsuccess = function (event) {
        const data = event.target.result;
        data.forEach(item => {
          pv.rdb.exec(
            `drop table if exists \`${item.key}\`;`
            + `create table \`${item.key}\`;`
            + `insert into \`${item.key}\` select * from ?;`
            //`CREATE TABLE IF NOT EXISTS ${item.key} AS SELECT * FROM ?`
            , [item.value]
          );
        });
        resolve();
      };

      request.onerror = function (event) {
        reject('Load IDB error: ' + event.target.errorCode);
      };
    });
  }

  // AlaSQLのSQLを実行
  function execSQL(sql) {
    return pv.rdb.exec(sql);
  }

  // AlaSQLのテーブルからIndexedDBへデータを保存
  function saveRDB() {
    console.log(pv.whois+'.saveRDB start.');
    return new Promise((resolve, reject) => {
      const transaction = pv.idb.transaction(pv.opt.storeName, 'readwrite');
      const store = transaction.objectStore(pv.opt.storeName);

      pv.rdb.tables.forEach(table => {
        console.log('l.75',table);
        const data = pv.rdb.exec(`SELECT * FROM ${table.name}`);
        store.put({ key: table.name, value: data });
      });

      transaction.oncomplete = function () {
        resolve();
      };

      transaction.onerror = function (event) {
        reject('Save RDB error: ' + event.target.errorCode);
      };
    });
  }

  // JSONファイルをインポート
  function importJSON() {
    console.log(pv.whois+'.importJSON start.');
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
          const jsonData = JSON.parse(e.target.result);
          jsonData.tables.forEach(table => {
            pv.rdb.exec(
              `drop table if exists \`${table.name}\`;`
              + `create table \`${table.name}\`;`
              + `insert into \`${table.name}\` select * from ?;`
              //`CREATE TABLE IF NOT EXISTS ${table.name} AS SELECT * FROM ?`
              , [table.data]
            );
          });
          saveRDB().then(() => resolve(jsonData)).catch(reject);
        };
        reader.onerror = function (e) {
          reject('Import JSON error: ' + e.target.errorCode);
        };
        reader.readAsText(file);
      };
      input.click();
    });
  }

  // 全テーブルをJSON化してダウンロード
  function exportJSON() {
    console.log(pv.whois+'.exportJSON start.');
    const exportData = {
      tables: pv.rdb.tables.map(table => {
        return {
          name: table.name,
          data: pv.rdb.exec(`SELECT * FROM ${table.name}`)
        };
      })
    };
    const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 初期化処理を実行
  initIDB();

  // メンバ関数を戻り値として返す
  console.log('LocalDb end.');
  return {
    exec: execSQL,
    load: loadIDB,
    save: saveRDB,
    import: importJSON,
    export: exportJSON,
  };
}