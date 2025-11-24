# authクライアント側仕様書

## 実装イメージ

```html
<input type="text" id="testval" value="設定値" />
<button onclick="getValue()">実行</button>
<div id="testResult"></div>

<script type="text/javascript">
  // ライブラリ関数定義
  function devTools(){...}; // (中略)

  // authClient関係クラス定義
  class authClient{...}
  class authConfig{...}
  class authClientConfig{...} // (中略)

  // グローバル変数定義
  const dev = devTools();
  let auth;  // authClient。HTML要素のイベント対応のためグローバル領域で宣言

  // 処理要求を発行するローカル関数
  function getValue(){
    try {
      const request = document.getElementById('testval').value;

      // サーバ側関数'trans01'にrequestを渡して処理要求
      const response = auth.exec('trans01',request);
      if( response instance of Error ) throw resopnse;

      document.getElementById('testResult').innerText = response;

    } catch(e) { dev.error(e); return e; }
  }

  // onLoad処理は"async"で宣言
  window.addEventListener('DOMContentLoaded', async () => {
    const v = { whois: 'DOMContentLoaded', rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      // IndexedDBからの読み込み等、非同期処理を実行
      auth = await authClient.initialize({
        // プロジェクト毎の独自パラメータ
      });

      dev.end(); // 終了処理
      return v.rv;
    } catch (e) { dev.error(e); return e; }
  });
</script>
```

<details><summary>プロトタイプ</summary>

```js
<!DOCTYPE html>
<html xml:lang="ja" lang="ja">
<head>
  <title>authClient</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <style type="text/css"></style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/alasql/4.6.4/alasql.min.js" integrity="sha512-/IeaoBeXScPD3EiZkaYKzjnqRnKJI73FM/18T8P+v2n11hKNCKQmko/n2ccvlDyH3AziR0oPEGShwsZEwO/Jjg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="../../../../devTools/1.0.1/core.js"></script>
</head>
<body>



</body>
<script type="text/javascript">
  class authClient {
    static _IndexedDB = null; // データベース接続オブジェクトを格納する静的変数

    /**
     * IndexedDBの接続を非同期で確立するヘルパー関数
     * @param {Object} cf - 設定オブジェクト
     * @returns {Promise<IDBDatabase>} データベース接続オブジェクト
     */
    static _connectDB(cf) {
      return new Promise((resolve, reject) => {
        // 既に接続があればそれを返す
        if (authClient._IndexedDB) {
          return resolve(authClient._IndexedDB);
        }

        const openRequest = indexedDB.open(cf.dbName, cf.dbVersion);

        openRequest.onerror = (event) => {
          reject(new Error("IndexedDB接続エラー: " + event.target.error.message));
        };

        openRequest.onsuccess = (event) => {
          authClient._IndexedDB = event.target.result;
          resolve(authClient._IndexedDB);
        };

        openRequest.onupgradeneeded = (event) => {
          const db_upgrade = event.target.result;
          if (!db_upgrade.objectStoreNames.contains(cf.storeName)) {
            db_upgrade.createObjectStore(cf.storeName);
            console.log(`✅ オブジェクトストア '${cf.storeName}' を作成しました。`);
          }
        };
      });
    }

    static async initialize(opt = {}) {
      try {
        // オプションに既定値を設定、メンバに登録
        const cf = Object.assign({
          dbName: 'auth',
          storeName: 'config',
          dbVersion: 1,
        }, opt);
        this.cf = cf; // authClientクラスの静的プロパティとして設定を保持

        // 初期化時に必要な一連の非同期処理を実行（DB接続）
        await authClient._connectDB(this.cf);

        // インスタンスを生成し、返す
        return new authClient();
      } catch (e) {
        console.error(e);
        return e;
      }
    }

    /**
     * ⚡ IndexedDBからデータを非同期で取得
     * @param {string} key - 取得したいデータのキー
     * @returns {Promise<any>} 取得した値
     */
    async getIndexedDB(key) {
      const db = authClient._IndexedDB;
      const cf = authClient.cf;

      if (!db) throw new Error("IndexedDBが初期化されていません。");

      return new Promise((resolve, reject) => {
        // 'readonly' トランザクション
        const transaction = db.transaction([cf.storeName], 'readonly');
        const store = transaction.objectStore(cf.storeName);
        const getRequest = store.get(key);

        getRequest.onerror = (event) => {
          reject(new Error("IndexedDB取得エラー: " + event.target.error.message));
        };

        getRequest.onsuccess = (event) => {
          resolve(event.target.result);
        };
      });
    }

    /**
     * ⚡ IndexedDBの内容を非同期で更新
     * @param {string} key - IndexedDBにセットするキー
     * @param {any} value - IndexedDBにセットする値
     * @returns {Promise<any>} 設定した値（Promiseでラップ）
     */
    async setIndexedDB(key, value) {
      const db = authClient._IndexedDB;
      const cf = authClient.cf;

      if (!db) throw new Error("IndexedDBが初期化されていません。");

      return new Promise((resolve, reject) => {
        // 'readwrite' トランザクション
        const transaction = db.transaction([cf.storeName], 'readwrite');
        const store = transaction.objectStore(cf.storeName);
        
        // キーと値をセット (putを使うと更新も可能)
        const putRequest = store.put(value, key);

        putRequest.onerror = (event) => {
          reject(new Error("IndexedDB保存エラー: " + event.target.error.message));
        };

        putRequest.onsuccess = () => {
          resolve(value);
        };
      });
    }

    /**
     * 同期処理。現時点ではダミー処理としてメンバの値をJSONで返す
     * @returns {string} 設定値のJSON文字列
     */
    exec() {
      return JSON.stringify(authClient.cf);
    }
  }

  let auth;
  const t = async () => {
    // 1. 初期化とDB接続
    auth = await authClient.initialize({ storeName: 'idbTest' });
    console.log("初期設定値:", auth.exec()); // -> {"dbName":"auth","storeName":"idbTest","dbVersion":1}

    // 2. データのセット (非同期)
    const key1 = 'authClient';
    const val1 = { token: 'abc-123', expires: Date.now() + 3600000 };
    await auth.setIndexedDB(key1, val1);
    console.log(`\n✅ キー '${key1}' に値を保存しました。`);

    // 3. データの取得 (非同期)
    const retrievedData = await auth.getIndexedDB(key1);
    console.log(`\n🎉 IndexedDBからキー '${key1}' で取得したデータ:`);
    console.log(retrievedData);

    // 4. 存在しないキーの取得
    const missingData = await auth.getIndexedDB('nonexistent');
    console.log("\n存在しないキーの取得結果 (undefined):", missingData);
  };


  const dev = devTools();
  window.addEventListener('DOMContentLoaded', () => {
    const v = { whois: 'DOMContentLoaded', rv: null };
    dev.start(v.whois);
    try {

      t();

      dev.end(); // 終了処理
      return v.rv;
    } catch (e) { dev.error(e); return e; }
  });
</script>
</html>
```

</details>

## クラス一覧

<!--::$tmp/cl.list.md::-->
