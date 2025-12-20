import { authClientConfig } from "./authClientConfig.mjs";
import { authRequest } from "./authRequest.mjs";

export class authClient {

  static _IndexedDB = null; // データベース接続オブジェクトを格納する静的変数

  /** constructor
   * @constructor
   * @param {authClientConfig} config - authClient設定情報
   */
  constructor(config) {
    const v = {whois:`authClient.constructor`, arg:{config}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1);  // config必須項目のチェック
      if( !config.hasOwnProperty('api') )
        throw new Error(`Required arguments not specified`);

      // -------------------------------------------------------------
      // 設定情報(this.cf)の作成
      // -------------------------------------------------------------
      dev.step(2.1);  // authClient特有の設定項目について既定値を定義
      v.authClientConfig = {
        api: config.api,
        timeout: 300000,
        storeName: 'config',
        dbVersion: 1,
        maxDepth: 10,
      };

      dev.step(2.2); // authClient/Server共通設定値に特有項目を追加
      this.cf = new authConfig(config);
      Object.keys(v.authClientConfig).forEach(x => {
        this.cf[x] = config[x] || v.authClientConfig[x];
      });

      dev.step(2.3);  // this.apiをIDからURLに書き換え
      this.cf.api = `https://script.google.com/macros/s/${this.cf.api}/exec`;

      // -------------------------------------------------------------
      dev.step(3);  // その他メンバの値設定
      // -------------------------------------------------------------
      this.idb = {};  // IndexedDBと同期、authClient内で共有

      dev.end(this); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /** _exportIfCryptoKey: CryptoKey型のRSA鍵をIndexedDBに保存可能な文字列に変換
   * @param {string} key - 鍵名。"CPkeySign"等
   * @param {CryptoKey} value - 鍵の内容
   * @returns {string}
   */
  async _exportIfCryptoKey(key, value){
    if( /^(C[SP]key(Sign|Enc))$/.test(key) && value instanceof CryptoKey ){
      return await crypto.subtle.exportKey("jwk", value);
    }
    return value;
  }

  /** _importIfCryptoKey: IndexedDBに保存されたRSA鍵をCryptoKey型に変換
   * @param {string} key - 鍵名。"CPkeySign"等
   * @param {string} value - IndexedDBに保存された鍵の内容
   * @returns {CryptoKey}
   */
  async _importIfCryptoKey(key, value){
    if(!value) return value;

    switch(key){
      case 'CSkeySign':
        return crypto.subtle.importKey(
          "jwk", value, { name:"RSA-PSS", hash:"SHA-256" }, false, ["sign"]
        );
      case 'CPkeySign':
        return crypto.subtle.importKey(
          "jwk", value, { name:"RSA-PSS", hash:"SHA-256" }, false, ["verify"]
        );
      case 'CSkeyEnc':
        return crypto.subtle.importKey(
          "jwk", value, { name:"RSA-OAEP", hash:"SHA-256" }, false, ["decrypt"]
        );
      case 'CPkeyEnc':
        return crypto.subtle.importKey(
          "jwk", value, { name:"RSA-OAEP", hash:"SHA-256" }, false, ["encrypt"]
        );
      default:
        return value;
    }
  }

  /** _withStore: IndexedDB操作共通ラッパ
   * @param {'readonly'|'readwrite'} mode
   * @param {(store: IDBObjectStore)=>Promise<any>} fn
   */
  async _withStore(mode, fn){
    const db = authClient._IndexedDB;
    if (!db) throw new Error("IndexedDB not initialized");

    const tx = db.transaction([this.cf.storeName], mode);
    const store = tx.objectStore(this.cf.storeName);

    const rv = await fn(store);

    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });

    return rv;
  }

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
   * @param {number} depth=0 - 再帰呼出時の階層
   * @returns {any|Error} 処理結果
   */
  async exec(func,arg=[],depth=0) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{func,arg}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1.1);  // 再帰呼出時の階層チェック
      if( depth > this.cf.maxDepth )
        throw new Error('maximum recursion depth exceeded');

      dev.step(1.1); // funcが関数名として有効かチェック
      // なお「::〜::」は内発処理として有効とする
      if( !/^(::[a-zA-Z_$][a-zA-Z0-9_$]*::|[a-zA-Z_$][a-zA-Z0-9_$]*)$/.test(func) ){
        throw new Error('Invalid function');
      }

      dev.step(1.2);  // サーバ側に渡す引数を無毒化
      arg = this.cf.sanitizeArg(arg);

      if( !this.idb.SPkeySign ){  // SPkey未取得

        dev.step(2.1);  // 内発処理「初期情報要求」用のauthRequestを作成
        v.authRequest = this.authRequest('::initial::');

        dev.step(2.2);  // サーバ側に処理依頼
        v.authResponse = await this.fetch(v.authRequest);
        if( v.authResponse instanceof Error ) throw v.authResponse;

        dev.step(2.3,v.authResponse); // SPkeySign / deviceId 保存
        v.r = await this.setIndexedDB({
          SPkeySign: v.authResponse.SPkeySign,
          deviceId: v.authResponse.deviceId
        });
        if( v.r instanceof Error ) throw v.r;

        dev.step(2.4);  // 元々の処理要求を再帰呼出
        v.rv = await this.exec(func,arg,depth+1);
        if( v.rv instanceof Error ) throw v.rv;

      } else {  // SPkey取得済

        dev.step(3.1);  // authRequestを作成
        v.authRequest = this.authRequest(func,arg);

        dev.step(3.2);  // サーバ側に処理依頼
        v.authResponse = await this.fetch(v.authRequest);
        if( v.authResponse instanceof Error ) throw v.authResponse;

        switch( v.authResponse.status ){
          case 'success': dev.step(3.1);  // サーバ側処理正常終了
            v.rv = v.authResponse.response;
            break;
          case 'CPkey expired': dev.step(3.2);  // CPkey期限切れ
            await this.crypto.generateKeys();
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
  async fetch(request) {
    const v = {whois:`${this.constructor.name}.fetch`, arg:{request}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1);  // authRequestを暗号化
      v.encryptedRequest = await this.crypto.encrypt(request);
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
    const dev = new devTools(v);
    try {

      dev.step(1);  // IndexedDBに保存された項目を全て配列で取得
      v.raw = await this._withStore('readonly', store =>
        new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result);
          req.onerror = e => reject(e.target.error);
        })
      );

      dev.step(2);  // [{key, value}]形式の値配列を{key:value}形式に再構成
      v.rv = {};
      if( Array.isArray(v.raw) && v.raw.length > 0 ){

        dev.step(2.1);  // レコードキーを全て取得
        v.keys = await this._withStore('readonly', store =>
          new Promise((resolve, reject) => {
            const req = store.getAllKeys();
            req.onsuccess = () => resolve(req.result);
            req.onerror = e => reject(e.target.error);
          })
        );

        dev.step(2.2);  // {key:value}形式に再構成
        v.keys.forEach((k, i) => v.rv[k] = v.raw[i]);

        dev.step(2.3);  // CryptoKey復元（存在するものだけ）
        for(const [k,vv] of Object.entries(v.rv)){
          v.rv[k] = await this._importIfCryptoKey(k, vv);
          this.idb[k] = v.rv[k];
        }
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
    const dev = new devTools(v);
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
      if( v.idb instanceof Error ) throw v.idb;

      dev.step(4);  // 暗号化・署名検証用インスタンス作成
      v.rv.crypto = new cryptoClient(v.rv.idb,v.rv.cf.RSAbits);

      dev.step(5);  // IndexedDBが空の場合、既定値(初期値)をIndexedDBに保存
      if( Object.keys(v.idb).length === 0 ){

        dev.step(5.1);  // 鍵ペア生成
        v.keys = await v.rv.crypto.generateKeys();
        if( v.keys instanceof Error ) throw v.keys;

        dev.step(5.2);  // CryptoKey以外のauthIndexedDBメンバと合わせて初期値作成
        v.idb = Object.assign(v.keys,{ // IndexedDBの初期値。内容はauthIndexedDB参照
          memberId: 'dummyMemberID',
          memberName: 'dummyMemberName',
          deviceId: 'dummyDeviceID',
          SPkeySign: null,
        });

        dev.step(5.3);  // IndexedDBに格納
        v.r = await v.rv.setIndexedDB(v.idb);
        if( v.r instanceof Error ) throw v.r;

      }

      dev.step(6);  // IndexedDBの内容をメンバ変数に格納
      Object.keys(v.idb).forEach(x => v.rv[x] = v.idb[x]);

      dev.end({IndexedDB:v.rv.idb}); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** setIndexedDB: IndexedDBの更新(upsert)
   * @param {Object<string, string>} arg 
   * @returns {null|Error}
   */
  async setIndexedDB(arg){
    const v = {whois:`${this.constructor.name}.setIndexedDB`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      await this._withStore('readwrite', async store => {
        for(const [k,val] of Object.entries(arg)){

          const stored = await this._exportIfCryptoKey(k, val);

          this.idb[k] = val;

          await new Promise((resolve, reject) => {
            const req = store.put(stored, k);
            req.onsuccess = () => resolve();
            req.onerror = e => reject(e.target.error);
          });
        }
      });

      dev.end();
      return null;

    } catch(e){ return dev.error(e); }
  }
}