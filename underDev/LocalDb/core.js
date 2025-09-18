/**　LocalDb: ブラウザ上でAlaSQLとIndexedDBを組み合わせたローカルDB管理クラス。
 * - データ処理はAlaSQLで同期的に実行
 * - 永続化はIndexedDBで非同期的に行う
 * - import/exportによるスキーマ・データの外部入出力をサポート
 *
 * @param {schemaDefEx} [schema=null] 初期スキーマ定義。省略時は空スキーマ。
 * @returns {Promise<Object>} 初期化済みのLocalDbインスタンス（公開APIオブジェクト）。
 * 
 * @example
 * const cf = Object.assign({}, kzConfig, { schema: Schema(kzConfig.schema) });
 * const db = await LocalDb(cf.schema); // ← await が必要です
 * 
 * 注意:
 *  - IndexedDBは非同期のため LocalDb は Promise を返します。呼出側で await してください。
 *  - AlaSQL はグローバル変数 `alasql` が存在することを前提とします。
 */
async function LocalDb(schema = null) {
  const pv = {
    whois: 'LocalDb',
    rv: {}, // LocalDbの戻り値
    schema: schema || { tables: [] },
    idb: null, // IndexedDB
    rdb: new alasql.Database(), // AlaSQL
    now: Date.now(),
    dbName: 'LocalDb',
    storeName: (schema && schema.dbName) || 'RDB',
  };

  // =============================================================
  // IndexedDB初期化
  // =============================================================
  async function initIndexedDB() {
    const v = { whois: `${pv.whois}.initIndexedDB`, rv: null };
    dev.start(v.whois, [...arguments]);
    try {
      pv.idb = await new Promise((resolve, reject) => {
        const request = indexedDB.open(pv.dbName, 1);
        request.onerror = (e) => reject(e);
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(pv.storeName)) {
            db.createObjectStore(pv.storeName);
          }
        };
        request.onsuccess = (e) => resolve(e.target.result);
      });
      dev.end();
      return pv.idb;
    } catch (e) {
      dev.error(e);
      return e;
    }
  }

  // =============================================================
  // IndexedDB読み込み
  // =============================================================
  async function loadTableFromIDB(tableName) {
    const v = { whois: `${pv.whois}.loadTableFromIDB`, rv: null };
    dev.start(v.whois, [...arguments]);
    try {
      const result = await new Promise((resolve, reject) => {
        const tx = pv.idb.transaction(pv.storeName, 'readonly');
        const store = tx.objectStore(pv.storeName);
        const req = store.get(tableName);
        req.onsuccess = (e) => resolve(e.target.result || []);
        req.onerror = (e) => reject(e);
      });
      dev.end();
      return result;
    } catch (e) {
      dev.error(e);
      return [];
    }
  }

  // =============================================================
  // IndexedDB保存
  // =============================================================
  async function saveTableToIDB(tableName, data) {
    const v = { whois: `${pv.whois}.saveTableToIDB`, rv: null };
    dev.start(v.whois, [...arguments]);
    try {
      await new Promise((resolve, reject) => {
        const tx = pv.idb.transaction(pv.storeName, 'readwrite');
        const store = tx.objectStore(pv.storeName);
        const req = store.put(data, tableName);
        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e);
      });
      dev.end();
      return true;
    } catch (e) {
      dev.error(e);
      return false;
    }
  }

  // =============================================================
  // SQL実行 (同期)
  // =============================================================
  function execSQL(sql, params = []) {
    const v = { whois: `${pv.whois}.execSQL`, rv: null };
    dev.start(v.whois, [...arguments]);
    try {
      v.rv = pv.rdb.exec(sql, params);
      dev.end();
      return v.rv;
    } catch (e) {
      dev.error(e);
      return null;
    }
  }

  // =============================================================
  // テーブルロード
  // =============================================================
  async function loadTable(tableName) {
    const v = { whois: `${pv.whois}.loadTable`, rv: null };
    dev.start(v.whois, [...arguments]);
    try {
      const data = await loadTableFromIDB(tableName);
      pv.rdb.tables[tableName] = data;
      v.rv = { [tableName]: true };
      dev.end();
      return v.rv;
    } catch (e) {
      dev.error(e);
      return { [tableName]: false };
    }
  }

  // =============================================================
  // テーブル保存
  // =============================================================
  async function saveTable(tableName) {
    const v = { whois: `${pv.whois}.saveTable`, rv: null };
    dev.start(v.whois, [...arguments]);
    try {
      const data = pv.rdb.tables[tableName] || [];
      const result = await saveTableToIDB(tableName, data);
      v.rv = { [tableName]: result };
      dev.end();
      return v.rv;
    } catch (e) {
      dev.error(e);
      return { [tableName]: false };
    }
  }

  // =============================================================
  // import (JSON)
  // =============================================================
  async function importJSON(file) {
    const v = { whois: `${pv.whois}.importJSON`, rv: null };
    dev.start(v.whois, [...arguments]);
    try {
      const content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file, 'UTF-8');
      });
      const json = JSON.parse(content);
      for (const table in json) {
        pv.rdb.tables[table] = json[table];
        await saveTable(table);
      }
      v.rv = true;
      dev.end();
      return v.rv;
    } catch (e) {
      dev.error(e);
      return false;
    }
  }

  // =============================================================
  // export (JSONダウンロード)
  // =============================================================
  function exportJSON(filename = 'LocalDb.json') {
    const v = { whois: `${pv.whois}.exportJSON`, rv: null };
    dev.start(v.whois, [...arguments]);
    try {
      const data = {};
      for (const table in pv.rdb.tables) data[table] = pv.rdb.tables[table];
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      v.rv = true;
      dev.end();
      return v.rv;
    } catch (e) {
      dev.error(e);
      return false;
    }
  }

  // =============================================================
  // 初期化処理
  // =============================================================
  /** init: LocalDb全体の初期化処理 */
  async function init() {
    const v = { whois: `${pv.whois}.init`, rv: null };
    dev.start(v.whois);
    try {
      await initIndexedDB();
      for (const tbl of pv.schema.tables) {
        pv.rdb.tables[tbl.tableName] = await loadTableFromIDB(tbl.tableName);
      }
      v.rv = pv.rv;
      dev.end();
      return v.rv;
    } catch (e) {
      dev.error(e);
      return e;
    }
  }

  // =============================================================
  // メイン処理
  // =============================================================
  dev.start(pv.whois);
  try {

    dev.step(1);  // IndexedDB作成＋テーブルにロード
    dev.dump(schema);

    dev.step(2);
    pv.r = await init();
    if( pv.r instanceof Error ) throw pv.r;
    dev.dump(Object.keys(pv.rdb.tables)); // 登録されたテーブルの確認


    /*
    pv.r = execSQL('select * from `勘定科目`;');
    if( pv.r instanceof Error ) throw pv.r;
    dev.dump(pv.r);
    */

    dev.step(99);
    pv.rv = {
      execSQL,
      loadTable,
      saveTable,
      importJSON,
      exportJSON,
      //init,
      //rdb: pv.rdb,
    };

    return pv.rv;
  } catch (e) {
    dev.error(e);
    return e;
  }
}