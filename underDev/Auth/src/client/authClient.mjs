import { authClientConfig } from "./authClientConfig.mjs";
export class authClient {

  static _IndexedDB = null; // データベース接続オブジェクトを格納する静的変数

  constructor(arg) {
    const v = {whois:`authClient.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // メンバに値設定
      this.cf = new authClientConfig(arg);
      this.idb = {};
      
      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  async exec(request) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{request}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // SPkey 存在確認
      if (!this.idb.SPkey) {

        dev.step(2); // CPkey 生成（未生成時）
        if (!this.idb.CPkey) {
          await this.crypto.generateKeys();
          await this.setIndexedDB({
            CPkey: this.crypto.CPkeyEnc,
            keyGeneratedDateTime: Date.now()
          });
        }

        dev.step(3); // authRequest 作成
        const authRequest = {
          memberId: this.idb.memberId,
          deviceId: this.idb.deviceId,
          CPkey: this.idb.CPkey,
          requestTime: Date.now(),
          func: "::init::",
          arguments: [],
          nonce: crypto.randomUUID()
        };

        dev.step(4); // 暗号化
        const encryptedRequest = await this.crypto.encrypt(authRequest);

        dev.step(5); // サーバ通信（fetch は外部注入前提）
        const encryptedResponse = await this.cf.transport(encryptedRequest);

        dev.step(6); // 復号
        const authResponse = await this.crypto.decrypt(encryptedResponse);

        dev.step(7); // SPkey / deviceId 保存
        await this.setIndexedDB({
          SPkey: authResponse.SPkey,
          deviceId: authResponse.deviceId
        });
      }

      dev.end();
      return this.idb;

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

      dev.step(3);  // オプション設定値をIndexedDBに保存
      await v.rv.setIndexedDB({ // 内容はauthIndexedDB
        memberId: 'dummyID',  // 仮IDはサーバ側で生成
        memberName: 'dummyName',
        deviceId: crypto.randomUUID(),
        keyGeneratedDateTime: Date.now(),
        SPkey: 'dummySPkey',
      });

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