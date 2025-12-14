import { authClientConfig } from "./authClientConfig.mjs";
import { authRequest } from "./authRequest.mjs";
export class authClient {

  static _IndexedDB = null; // データベース接続オブジェクトを格納する静的変数

  constructor(arg) {
    const v = {whois:`authClient.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // メンバに値設定
      this.cf = new authClientConfig(arg);
      this.idb = {};
      this.crypto = new cryptoClient(this.cf);

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  async exec(request) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{request}, rv:null};
    dev.start(v);
    try {

      if( !this.idb.SPkey ){  // SPkey未取得

        dev.step(1.1);  // 内発処理「初期情報要求」用のauthRequestを作成
        v.authRequest = new authRequest('::initial::');

        dev.step(1.2);  // authRequestを暗号化
        v.encryptedRequest = this.crypto.encrypt(v.authRequest);
        if( v.encryptedRequest instanceof Error ) throw v.encryptedRequest;

        dev.step(1.3);  // サーバ側に処理依頼
        v.response = await this.fetch(v.encryptedRequest);
        if( v.response instanceof Error ) throw v.response;

        dev.step(1.4);  // 処理結果を復号
        v.authResponse = this.crypto.decrypt(v.response);
        if( v.authResponse instanceof Error ) throw v.authResponse;

        dev.step(1.5); // SPkey / deviceId 保存
        await this.setIndexedDB({
          SPkey: v.authResponse.SPkey,
          deviceId: v.authResponse.deviceId
        });

        dev.step(1.6);  // 元々の処理要求を再帰呼出
        v.rv = this.exec(request);

      } else {  // SPkey取得済

        dev.step(2.1);  // authRequestを暗号化
        v.encryptedRequest = this.crypto.encrypt(request);
        if( v.encryptedRequest instanceof Error ) throw v.encryptedRequest;

        dev.step(2.2);  // サーバ側に処理依頼
        v.response = await this.fetch(v.encryptedRequest);
        if( v.response instanceof Error ) throw v.response;

        dev.step(2.3);  // 処理結果を復号
        v.authResponse = this.crypto.decrypt(v.response);
        if( v.authResponse instanceof Error ) throw v.authResponse;

        switch( v.authResponse.status ){
          case 'success': dev.step(3.1);  // サーバ側処理正常終了
            v.rv = v.authResponse.response;
            break;
          case 'CPkey expired': dev.step(3.2);  // CPkey期限切れ
            this.crypto.generateKeys();
            v.rv = await this.exec('::updateCPkey::');
            if( v.rv instanceof Error ) throw v.rv;
            break;
          case 'login required':  dev.step(3.3);  // 要ログイン(未認証)
            break;
          case 'retry required':  dev.step(3.4);  // パスコード不一致
            break;
          case 'freezing':  dev.step(3.5);  // アカウント凍結中
            break;
          default:  dev.step(3.6);  // その他エラー
            throw v.authResponse.status;
        }
      }

      dev.end();
      return this.idb;

    } catch (e) { return dev.error(e); }
  }

  async fetch(payload) {  // モック。実運用では fetch / UrlFetchApp 等に差し替え
    const v = {whois:`${this.constructor.name}.getIndexedDB`, arg:{}, rv:null};
    dev.start(v);
    try {
      
      //return this.cf.transport(payload);

      v.rv = {};

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** getIndexedDB: IndexedDBの全てのキー・値をオブジェクト形式で取得 */
  async getIndexedDB() {
    const v = {whois:`${this.constructor.name}.getIndexedDB`, arg:{}, rv:null};
    dev.start(v);
    try {

      v.db = authClient._IndexedDB;
      if (!v.db) throw new Error("IndexedDB not initialized");

      // 'readwrite' トランザクション
      const transaction = v.db.transaction([this.cf.storeName], 'readwrite');
      const store = transaction.objectStore(this.cf.storeName);

      // 全てのキーを取得
      v.rv = await new Promise((resolve, reject) => {
        const putRequest = store.getAll();
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = (event) => {
          reject(new Error(`GET操作失敗: ${event.target.error.message}`));
        };
      });

      // this.idbに登録
      for ( [v.key, v.value] of Object.entries(v.rv)) {
        this.idb[v.key] = v.value;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** initialize: IndexedDBの初期化
   * - その他インスタンス生成時に必要な非同期処理があれば、ここで処理する
   * - staticではない一般のメンバへの値セットができないため別途constructorを呼び出す
   */
  static async initialize(arg) {
    const v = {whois:`authClient.initialize`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1);  // インスタンス生成
      // オプション既定値を先にメンバ変数に格納するため、constructorを先行
      v.rv = new authClient(arg);

      dev.step(2);  // DB接続：非同期処理なのでconstructorではなくinitializeで実行
      authClient._IndexedDB = await new Promise((resolve, reject) => {
        if (authClient._IndexedDB) {
          return resolve(authClient._IndexedDB);
        }

        const openRequest = indexedDB.open(v.rv.cf.systemName, v.rv.cf.dbVersion);

        openRequest.onerror = (event) =>
          reject(new Error("IndexedDB接続エラー: " + event.target.error.message));

        openRequest.onsuccess = (event) => {
          authClient._IndexedDB = event.target.result;
          resolve(authClient._IndexedDB);
        };

        openRequest.onupgradeneeded = (event) => {
          const db_upgrade = event.target.result;
          if (!db_upgrade.objectStoreNames.contains(v.rv.cf.storeName)) {
            db_upgrade.createObjectStore(v.rv.cf.storeName);
          }
        };
      });

      dev.step(3);  // IndexedDBの内容を取得
      v.idb = await v.rv.getIndexedDB();

      dev.step(4);  // IndexedDBが空の場合、既定値(初期値)をIndexedDBに保存
      if( Object.keys(v.idb).length === 0 ){

        v.idb = { // IndexedDBの初期値。内容はauthIndexedDB参照
          memberId: 'dummyMemberID',  // 仮IDはサーバ側で生成
          memberName: 'dummyMemberName',
          deviceId: 'dummyDeviceID',
          CPkey: this.crypto.CPkeyEnc,
          keyGeneratedDateTime: Date.now(),
          SPkey: null,
        };
        await v.rv.setIndexedDB(v.idb);

      }

      dev.step(5);  // IndexedDBの内容をメンバ変数に格納
      Object.keys(v.idb).forEach(x => this[x] = v.idb[x]);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  async setIndexedDB(arg) {
    const v = {whois:`${this.constructor.name}.setIndexedDB`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      v.db = authClient._IndexedDB;
      if (!v.db) throw new Error("IndexedDB not initialized");

      // 'readwrite' トランザクション
      const transaction = v.db.transaction([this.cf.storeName], 'readwrite');
      const store = transaction.objectStore(this.cf.storeName);

      // 複数の put リクエストを順番に実行
      for ( [v.key, v.value] of Object.entries(arg)) {
        // this.idbに登録
        this.idb[v.key] = v.value;

        // putリクエストを実行。リクエストの成功/失敗を待つ必要は必ずしもないが、
        // エラーハンドリングのためにPromiseでラップするのが一般的。
        await new Promise((resolve, reject) => {
          const putRequest = store.put(v.value, v.key);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = (event) => {
            // 個別のリクエストエラーはトランザクション全体のエラーとなる
            reject(new Error(`PUT操作失敗 (Key: ${v.key}): ${event.target.error.message}`));
          };
        });
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}