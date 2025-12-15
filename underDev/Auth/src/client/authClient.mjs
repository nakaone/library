import { authClientConfig } from "./authClientConfig.mjs";
import { authRequest } from "./authRequest.mjs";
/**
 * @class
 * @classdesc クライアント側中核クラス
 * - 初期化の際に非同期処理が必要なため、インスタンス作成は
 *   `new authClient()`ではなく`authClient.initialize()`で行う
 * @prop {authClientConfig} cf - authClient設定情報
 * @prop {Object} idb - IndexedDBと同期、authClient内で共有
 * @prop {cryptoClient} crypto - 暗号化・署名検証
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

  /** typedef authIndexedDB(=this.idb): IndexedDBに保存する内容
   * @typedef {Object} authIndexedDB
   * @prop {string} memberId='dummyMemberID' - メンバ識別子(メールアドレス。初期値は固定文字列)
   * @prop {string} memberName='dummyMemberName' - メンバの氏名(初期値は固定文字列)
   * @prop {string}　deviceId='dummyDeviceID' - サーバ側で生成(UUIDv4。初期値は固定文字列)
   * @prop {CryptoKey} CSkeySign - 署名用秘密鍵
   * @prop {CryptoKey} CPkeySign - 署名用公開鍵
   * @prop {CryptoKey} CSkeyEnc - 暗号化用秘密鍵
   * @prop {CryptoKey} CPkeyEnc - 暗号化用公開鍵
   * @prop {string} keyGeneratedDateTime: Date.now(),
   * @prop {string} SPkey=null - サーバ側公開鍵
   */
  /** constructor
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

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /** typedef authRequest
   * @typedef {Object} authRequest
   * @prop {string} memberId=this.idb.memberId - メンバの識別子
   * @prop {string} deviceId=this.idb.deviceId - デバイスの識別子UUIDv4
   * @prop {string} memberName=this.idb.memberName - メンバの氏名管理者が加入認否判断のため使用
   * @prop {CryptoKey} CPkeySign=this.idb.CPkeySign - クライアント側署名用公開鍵
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
      CPkeySign: this.idb.CPkeySign,
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

      dev.step(1.1); // funcが関数名として有効かチェック
      // なお「::〜::」は内発処理として有効とする
      if( !/^(::[a-zA-Z_$][a-zA-Z0-9_$]*::|[a-zA-Z_$][a-zA-Z0-9_$]*)$/.test(func) ){
        throw new Error('Invalid function');
      }

      dev.step(1.2);  // 引数は関数を排除するため、一度JSON化してからオブジェクト化
      arg = JSON.parse(JSON.stringify(arg));

      if( !this.idb.SPkey ){  // SPkey未取得

        dev.step(2.1);  // 内発処理「初期情報要求」用のauthRequestを作成
        v.authRequest = this.authRequest('::initial::');

        dev.step(2.2);  // サーバ側に処理依頼
        v.authResponse = this.fetch(v.authRequest);
        if( v.authResponse instanceof Error ) throw v.authResponse;

        dev.step(2.3); // SPkey / deviceId 保存
        v.r = await this.setIndexedDB({
          SPkey: v.authResponse.SPkey,
          deviceId: v.authResponse.deviceId
        });
        if( v.r instanceof Error ) throw v.r;

        dev.step(2.4);  // 元々の処理要求を再帰呼出
        v.rv = this.exec(func,arg);
        if( v.rv instanceof Error ) throw v.rv;

      } else {  // SPkey取得済

        dev.step(3.1);  // authRequestを作成
        v.authRequest = this.authRequest(func,arg);

        dev.step(3.2);  // サーバ側に処理依頼
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
   * @returns {Object<string,any>} this.idbに格納したIndexedDBの内容({キー:値}形式)
   */
  async getIndexedDB() {
    const v = {whois:`${this.constructor.name}.getIndexedDB`, arg:{}, rv:null};
    dev.start(v);
    try {

      dev.step(1);  // IndexedDBを取得
      v.db = authClient._IndexedDB;
      if (!v.db) throw new Error("IndexedDB not initialized");

      dev.step(2);  // 'readwrite' トランザクション
      const transaction = v.db.transaction([this.cf.storeName], 'readwrite');
      const store = transaction.objectStore(this.cf.storeName);

      dev.step(3);  // 全てのキーを取得
      v.rv = await new Promise((resolve, reject) => {
        const putRequest = store.getAll();
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = (event) => {
          reject(new Error(`GET操作失敗: ${event.target.error.message}`));
        };
      });

      dev.step(4);  // CryptoKey復元
      v.rv.CSkeySign = await crypto.subtle.importKey(
        "jwk",
        v.rv.CSkeySign,
        { name: "RSA-PSS", hash: "SHA-256" },
        false,
        ["sign"]
      );
      v.rv.CPkeySign = await crypto.subtle.importKey(
        "jwk",
        v.rv.CPkeySign,
        { name: "RSA-PSS", hash: "SHA-256" },
        false,
        ["verify"]
      );
      v.rv.CSkeyEnc = await crypto.subtle.importKey(
        "jwk",
        v.rv.CSkeyEnc,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["decrypt"]
      );
      v.rv.CPkeyEnc = await crypto.subtle.importKey(
        "jwk",
        stored.CPkeyEnc,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
      );

      dev.step(5);  // this.idbに登録
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

      dev.step(3);  // 暗号化・署名検証用インスタンス作成
      this.crypto = new cryptoClient(this.idb,this.cf.RSAbits);

      dev.step(4);  // IndexedDBの内容を取得
      v.idb = await v.rv.getIndexedDB();
      if( v.idb instanceof Error ) throw v.idb;

      dev.step(5);  // IndexedDBが空の場合、既定値(初期値)をIndexedDBに保存
      if( Object.keys(v.idb).length === 0 ){

        dev.step(5.1);  // 鍵ペア生成
        v.keys = this.crypto.generateKeys();
        if( v.keys instanceof Error ) throw v.keys;

        dev.step(5.2);  // CryptoKey以外のauthIndexedDBメンバと合わせて初期値作成
        v.idb = Object.assign(v.keys,{ // IndexedDBの初期値。内容はauthIndexedDB参照
          memberId: 'dummyMemberID',
          memberName: 'dummyMemberName',
          deviceId: 'dummyDeviceID',
          SPkey: null,
        });

        dev.step(5.3);  // IndexedDBに格納
        v.r = await v.rv.setIndexedDB(v.idb);
        if( v.r instanceof Error ) throw v.r;

      }

      dev.step(6);  // IndexedDBの内容をメンバ変数に格納
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

      dev.step(1);  // IndexedDBを取得
      v.db = authClient._IndexedDB;
      if (!v.db) throw new Error("IndexedDB not initialized");

      dev.step(2);  // 'readwrite' トランザクション
      const transaction = v.db.transaction([this.cf.storeName], 'readwrite');
      const store = transaction.objectStore(this.cf.storeName);

      // 複数の put リクエストを順番に実行
      for ( [v.key, v.value] of Object.entries(arg)) {

        dev.step(3.1);  // CryptoKeyはIndexedDBに保存可能になるよう出力
        if( /^(C[SP]key(Sign|Enc))$/.test(v.key) ){
          v.value = await crypto.subtle.exportKey("jwk", v.value);
        }

        dev.step(3.2);  // this.idbに登録
        this.idb[v.key] = v.value;

        dev.step(3.3);  // putリクエストを実行
        // リクエストの成功/失敗を待つ必要は必ずしもないが、
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