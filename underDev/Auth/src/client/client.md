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
  <title>ac.01</title>
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
    /** constructor: staticではない、一般のメンバに値を設定
     * 
     */
    constructor(opt){
      const v = { whois: `authClient.constructor`, rv: null };
      dev.start(v.whois, [...arguments]);
      try {

        dev.step(1);  // オプション設定値をメンバに登録
        this.opt = Object.assign({
          dbName: 'auth',
          storeName: 'config',
          dbVersion: 1,
        }, opt);
        this.idb = {};

        dev.end();

      } catch (e) { dev.error(e); return e; }
    }

    /** initialize: IndexedDBの初期化
     * - その他インスタンス生成時に必要な非同期処理があれば、ここで処理する
     * - staticではない一般のメンバへの値セットができないため別途constructorを呼び出す
     */
    static async initialize(opt={}){
      const v = { whois: `authClient.initialize`, rv: null };
      dev.start(v.whois, [...arguments]);
      try {

        dev.step(1);  // インスタンス生成
        // オプション既定値を先にメンバ変数に格納するため、constructorを先行
        v.rv = new authClient(opt);
        dev.dump(v.rv.opt,49);

        dev.step(2);  // DB接続：非同期処理なのでconstructorではなくinitializeで実行
        authClient._IndexedDB = await (()=>{
          return new Promise((resolve, reject) => {
            // 既に接続があればそれを返す
            if (authClient._IndexedDB) {
              return resolve(authClient._IndexedDB);
            }

            const openRequest = indexedDB.open(v.rv.opt.dbName, v.rv.opt.dbVersion);

            openRequest.onerror = (event) => {
              reject(new Error("IndexedDB接続エラー: " + event.target.error.message));
            };

            openRequest.onsuccess = (event) => {
              authClient._IndexedDB = event.target.result;
              resolve(authClient._IndexedDB);
            };

            openRequest.onupgradeneeded = (event) => {
              const db_upgrade = event.target.result;
              if (!db_upgrade.objectStoreNames.contains(v.rv.opt.storeName)) {
                db_upgrade.createObjectStore(v.rv.opt.storeName);
                console.log(`✅ オブジェクトストア '${v.rv.opt.storeName}' を作成しました。`);
              }
            };
          });
        })();

        dev.step(3);  // オプション設定値をIndexedDBに保存
        await v.rv.setIndexedDB(Object.assign({
          fuga:`registared at ${new Date().toLocaleTimeString()}`,
        },v.rv.opt)); // インスタンス変数・メソッドへのアクセスは"v.rv.xxx"で!!

        dev.step(9);  // 終了処理
        dev.end();
        return v.rv;

      } catch (e) { dev.error(e); return e; }
    }

    /**
     * @param {Object.<string,any>} obj - IndexedDBに格納するキーと値
     */
    async setIndexedDB(obj){
      const v = { whois: `authClient.setIndexedDB`, rv: null };
      dev.start(v.whois, [...arguments]);
      try {
        v.db = authClient._IndexedDB;
        if (!v.db) throw new Error("IndexedDBが初期化されていません。");

        // 'readwrite' トランザクション
        const transaction = v.db.transaction([this.opt.storeName], 'readwrite');
        const store = transaction.objectStore(this.opt.storeName);

        // 複数の put リクエストを順番に実行
        for ( [v.key, v.value] of Object.entries(obj)) {
          // this.idbに登録
          this.idb[v.key] = v.value;

          // putリクエストを実行。リクエストの成功/失敗を待つ必要は必ずしもないが、
          // エラーハンドリングのためにPromiseでラップするのが一般的。
          await new Promise((resolve, reject) => {
            const putRequest = store.put(v.value, v.key);

            putRequest.onsuccess = () => {
              resolve();
            };

            putRequest.onerror = (event) => {
              // 個別のリクエストエラーはトランザクション全体のエラーとなる
              reject(new Error(`PUT操作失敗 (Key: ${v.key}): ${event.target.error.message}`));
            };
          });

        }
        dev.end();

      } catch (e) { dev.error(e); return e; }
    }


    exec(){
      const v = { whois: `authClient.exec`, rv: null };
      dev.start(v.whois);
      try {

        dev.end();
        return this.idb;

      } catch (e) { dev.error(e); return e; }
    }
  }
  const dev = devTools();
  let auth;
  window.addEventListener('DOMContentLoaded', async () => {
    const v = { whois: 'DOMContentLoaded', rv: null };
    dev.start(v.whois);
    try {
      dev.step(1);  // authClientインスタンス作成
      auth = await authClient.initialize();
      dev.step(2);
      v.rv = auth.exec();
      dev.dump(v.whois,v.rv,174);
      
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
