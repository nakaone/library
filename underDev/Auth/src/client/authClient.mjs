import { authClientConfig } from "./authClientConfig.mjs";
import { authRequest } from "./authRequest.mjs";
/**
 * @class
 * @classdesc クライアント側中核クラス
 * - 初期化の際に非同期処理が必要なため、インスタンス作成は
 *   `new authClient()`ではなく`authClient.initialize()`で行う
 * @prop {authClientConfig} cf - authClient設定情報
 * @prop {Object} idb - IndexedDBと同期、authClient内で共有
 * @prop {cryptoClient} - 暗号化・署名検証
 * 
 * @example インスタンス作成のサンプル
 * ```js
 * async function onLoad(){
 *   const v = {whois:`onLoad`, rv:null};
 *   dev.start(v);
 *   try {
 * 
 *     dev.step(1);  // authClientインスタンス作成
 *     const auth = await authClient.initialize({
 *       adminMail: 'ena.kaon@gmail.com',
 *       adminName: 'あどみ',
 *       api: 'abcdefghijklmnopqrstuvwxyz',
 *     });
 * 
 *     dev.step(2);  // authインスタンスをグローバル変数と戻り値(テスト用)にセット
 *     globalThis.auth = auth;
 *     v.rv = auth;
 * 
 *     dev.end(); // 終了処理
 *     return v.rv;
 * 
 *   } catch (e) { return dev.error(e); }
 * }
 */
export class authClient {

  static _IndexedDB = null; // データベース接続オブジェクトを格納する静的変数

  /**
   * @constructor
   * @param {authClientConfig} config - authClient設定情報
   */
  constructor(config) {
    const v = {whois:`authClient.constructor`, arg:{config}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // メンバに値設定
      this.cf = new authClientConfig(config);  // authClient設定情報
      this.idb = {};  // IndexedDBと同期、authClient内で共有
      this.crypto = new cryptoClient(this.cf);  // 暗号化・署名検証

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /**
   * @typedef {Object} authRequest
   * @prop {string} memberId=this.idb.memberId - メンバの識別子
   * @prop {string} deviceId=this.idb.deviceId - デバイスの識別子UUIDv4
   * @prop {string} memberName=this.idb.memberName - メンバの氏名管理者が加入認否判断のため使用
   * @prop {string} CPkey=this.idb.CPkey - クライアント側署名
   * @prop {number} requestTime=Date.now() - 要求日時UNIX時刻
   * @prop {string} func - サーバ側関数名
   * @prop {any[]} arg=[] - サーバ側関数に渡す引数の配列
   * @prop {string} nonce=UUIDv4 - 要求の識別子UUIDv4
   */
  /** authRequest: authRequest型のオブジェクトを作成
   * @param {string} func - サーバ側関数名
   * @param {any[]} arg - サーバ側関数に渡す引数
   * @returns {authRequest}
   */
  authRequest(func,arg=[]){
    return {
      memberId: this.idb.memberId,
      deviceId: this.idb.deviceId,
      memberName: this.idb.memberName,
      CPkey: this.idb.CPkey,
      requestTime: Date.now(),
      func: func,
      arg: arg,
      nonce: crypto.randomUUID(),
    }
  }

  /** exec: ローカル関数の処理要求を処理
   * @param {string} func - サーバ側関数名
   * @param {any[]} arg=[] - サーバ側関数に渡す引数
   * @returns {any|Error} 処理結果
   */
  async exec(func,arg=[]) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{func,arg}, rv:null};
    dev.start(v);
    try {

      if( !this.idb.SPkey ){  // SPkey未取得

        dev.step(1.1);  // 内発処理「初期情報要求」用のauthRequestを作成
        v.authRequest = this.authRequest('::initial::');

        dev.step(1.2);  // サーバ側に処理依頼
        v.authResponse = this.fetch(v.authRequest);
        if( v.authResponse instanceof Error ) throw v.authResponse;

        dev.step(1.3); // SPkey / deviceId 保存
        v.r = await this.setIndexedDB({
          SPkey: v.authResponse.SPkey,
          deviceId: v.authResponse.deviceId
        });
        if( v.r instanceof Error ) throw v.r;

        dev.step(1.4);  // 元々の処理要求を再帰呼出
        v.rv = this.exec(func,arg);
        if( v.rv instanceof Error ) throw v.rv;

      } else {  // SPkey取得済

        dev.step(2.1);  // authRequestを作成
        v.authRequest = this.authRequest(func,arg);

        dev.step(2.2);  // サーバ側に処理依頼
        v.authResponse = this.fetch(v.authRequest);
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

  /** fetch: サーバ側APIの呼び出し
   * @param {authRequest} request - 処理要求
   * @returns {authResponse|Error} 処理結果
   */
  async fetch(request) {  // モック。実運用では fetch / UrlFetchApp 等に差し替え
    const v = {whois:`${this.constructor.name}.getIndexedDB`, arg:{request}, rv:null};
    dev.start(v);
    try {

      dev.step(1);  // authRequestを暗号化
      v.encryptedRequest = this.crypto.encrypt(request);
      if( v.encryptedRequest instanceof Error ) throw v.encryptedRequest;

      // サーバ側に処理依頼
      dev.step(2.1);  // タイムアウト処理を適用するPromise
      v.timeoutPromise = new Promise((_, reject) => {
        const ms = this.cf.timeout; // タイムアウト時間（ミリ秒）
        const id = setTimeout(() => {
          // 時間内に解決しなければエラーを発生
          reject(new Error(`Fetch timed out after ${ms}ms.`));
        }, ms);
        // 元のPromiseが解決/拒否されたらタイマーを解除するためのCleanup関数
        v.cleanupTimer = () => clearTimeout(id);
      });

      dev.step(2.2);  // fetch処理を行うPromise
      v.fetchPromise = globalThis.fetch(this.cf.api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(v.encryptedRequest)
      }).then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json(); 
      });

      dev.step(2.3);  // 競合させて、先に結果が出た方（正常なレスポンスかタイムアウトエラー）を採用
      try {
        v.response = await Promise.race([v.fetchPromise, v.timeoutPromise]);
      } finally {
        v.cleanupTimer(); // タイムアウトタイマーを解除
      }
      if( v.response instanceof Error ) throw v.response;

      dev.step(3);  // 処理結果を復号
      v.rv = this.crypto.decrypt(v.response);
      if( v.rv instanceof Error ) throw v.rv;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** getIndexedDB: IndexedDBの全てのキー・値をオブジェクト形式で取得
   * @param {void}
   * @returns {Object<string,any>} IndexedDBの内容。{キー:値}形式
   */
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

  /** initialize: authClientインスタンス作成
   * - インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
   * - staticではない一般のメンバへの値セットができないため別途constructorを呼び出す
   * @static
   * @param {authClientConfig} config - authClient設定情報
   * @returns {authClient|Error}
   */
  static async initialize(config) {
    const v = {whois:`authClient.initialize`, arg:{config}, rv:null};
    dev.start(v);
    try {

      dev.step(1);  // インスタンス生成
      // オプション既定値を先にメンバ変数に格納するため、constructorを先行
      v.rv = new authClient(config);

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

  /** setIndexedDB: IndexedDBの更新(upsert)
   * @param {Object<string, string>} arg 
   * @returns {null|Error}
   */
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