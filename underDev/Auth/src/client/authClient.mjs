import { mergeDeeply } from "../../../../mergeDeeply/2.0.0/core.mjs";
import { authConfig } from "../common/authConfig.mjs";

/** authClient: クライアント側中核クラス
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

  /** constructor
   * @constructor
   * @param {Object} config - authClient/Server共通設定情報
   */
  constructor(config) {
    const v = {whois:`authClient.constructor`, arg:{config}, rv:null};
    const dev = new devTools(v);
    // -------------------------------------------------------------
    // authClient専用設定値・データ型(Schema)定義
    //   ※authClient/Server共用はauthConfigクラスで定義
    // -------------------------------------------------------------
    // Schemaクラスの指定項目＋authClient専用データ型定義
    v.schema = {
      types: {
        /** authIndexedDB: IndexedDBに保存する内容(=this.idb)
         * @typedef {Object} authIndexedDB - IndexedDBに保存する内容(=this.idb)
         * @prop {string} memberId='dummyMemberID' - メンバ識別子(メールアドレス。初期値は固定文字列)
         * @prop {string} memberName='dummyMemberName' - メンバの氏名(初期値は固定文字列)
         * @prop {string}　deviceId='dummyDeviceID' - サーバ側で生成(UUIDv4。初期値は固定文字列)
         * @prop {CryptoKey} CSkeySign - 署名用秘密鍵
         * @prop {CryptoKey} CPkeySign - 署名用公開鍵
         * @prop {CryptoKey} CSkeyEnc - 暗号化用秘密鍵
         * @prop {CryptoKey} CPkeyEnc - 暗号化用公開鍵
         * @prop {string} keyGeneratedDateTime - 鍵ペア生成日時(UNIX時刻)
         * @prop {string} SPkeySign=null - サーバ側署名用公開鍵
         * @prop {string} SPkeyEnc=null - サーバ側暗号化用公開鍵
         */
      }
    };
    // 必須指定項目の一覧
    v.required = ['api'];
    // 任意指定項目と既定値
    v.option = {
      timeout: 300000,
      storeName: 'config',
      dbVersion: 1,
    }

    try {

      /** authClientConfig: 共通設定情報にauthClient特有項目を追加
       * @typedef {Object} authClientConfig - authClient特有の設定項目
       * @extends {authConfig}
       * @prop {string} api - サーバ側WebアプリURLのID
       *   https://script.google.com/macros/s/(この部分)/exec
       * @prop {number} timeout=300000 - サーバからの応答待機時間
       *   これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分
       * @prop {string} storeName="config" - IndexedDBのストア名
       * @prop {number} dbVersion=1 - IndexedDBのバージョン
       */
      dev.step(1.1);  // this.cfにauthClientConfigを設定
      this.cf = new authConfig(mergeDeeply(v.schema,config));

      dev.step(1.2);  // 必須項目の設定
      v.required.forEach(x => {
        if( typeof config[x] === 'undefined' )
          throw new Error(`"${x}" is not specified.`);
        this.cf[x] = config[x];
      });

      dev.step(1.3);  // 任意項目の設定
      Object.keys(v.option).forEach(x => {
        this.cf[x] = config[x] ?? v.option[x];
      });

      dev.step(1.4);  // this.apiをIDからURLに書き換え
      this.cf.api = `https://script.google.com/macros/s/${this.cf.api}/exec`;

      // -------------------------------------------------------------
      dev.step(2);  // その他メンバの値設定
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
   * param {(store: IDBObjectStore)=>Promise<any>} fn
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

  /** exec: ローカル関数の処理要求を処理
   * @param {string} func - サーバ側関数名
   * @param {any[]} arg=[] - サーバ側関数に渡す引数
   * @param {number} depth=0 - 再帰呼出時の階層
   * @returns {any|Error} 処理結果
   */
  async exec(func,arg=[],depth=0) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{func,arg}, rv:null};
    const dev = new devTools(v,{mode:'dev'});
    try {

      // -------------------------------------------------------------
      dev.step(1);  // 事前処理
      // -------------------------------------------------------------
      dev.step(1.1);  // 再帰呼出時の階層チェック
      if( depth > this.cf.maxDepth )
        throw new Error('maximum recursion depth exceeded');

      dev.step(1.2); // funcが関数名として有効かチェック
      // なお「::〜::」は内発処理として有効とする
      if( !/^(::[a-zA-Z_$][a-zA-Z0-9_$]*::|[a-zA-Z_$][a-zA-Z0-9_$]*)$/.test(func) ){
        throw new Error('Invalid function');
      }

      dev.step(1.3);  // サーバ側に渡す引数を無毒化
      arg = this.cf.sanitizeArg(arg);
      if( arg instanceof Error ) throw arg;

      // -------------------------------------------------------------
      dev.step(2);  // authServerに処理要求
      // -------------------------------------------------------------
      dev.step(2.1);  // 初回HTMLロード時処理(SPkey取得)
      if( !this.idb.SPkeySign ){
        v.r = this.exec('::initial::',[],depth+1);
        if( v.r instanceof Error ) throw v.r;
      }

      dev.step(2.2);  // authRequestを作成
      v.authRequest = this.cf.factory('authRequest', {
        idb: this.idb,
        func: func,
        arg: arg
      });
      if( v.authRequest.idb.CPkeySign instanceof CryptoKey ){
        // 1. 公開鍵を spki フォーマットでエクスポート
        v.exported = await crypto.subtle.exportKey("spki", v.authRequest.idb.CPkeySign);
        
        // 2. ArrayBuffer を Base64 文字列に変換
        v.base64Key = btoa(String.fromCharCode(...new Uint8Array(v.exported)));
        
        // 3. サーバーが期待する PEM 形式の文字列として再代入
        v.authRequest.idb.CPkeySign = `-----BEGIN PUBLIC KEY-----\n_\n-----END PUBLIC KEY-----`
        .replace('_',v.base64Key);
      }

      dev.step(2.3);  // サーバ側に処理依頼
      v.authResponse = await this.fetch(v.authRequest);
      if( v.authResponse instanceof Error ) throw v.authResponse;

      // -------------------------------------------------------------
      dev.step(3);  // authResponseに基づき処理分岐
      // -------------------------------------------------------------
      switch( v.authResponse.status ){
        case 'success': dev.step(3.1);  // サーバ側処理正常終了
          // authResponseを復号
          // IndexedDBのSPkey,deviceIdを更新
          // (ローカル関数への)戻り値作成
          v.rv = v.authResponse.response;
          break;
        case 'duplicate CPkey': dev.step(3.2);  // CPkey重複
          // CPkeyを再作成(更新)
          // 更新後のCPkeyで再要求
          break;
        case 'CPkey expired': dev.step(3.3);  // CPkey期限切れ
          await this.crypto.generateKeys();
          v.rv = await this.exec('::updateCPkey::');
          if( v.rv instanceof Error ) throw v.rv;
          break;
        case 'login required':  dev.step(3.4);  // 要ログイン(未認証)
          break;
        case 'retry required':  dev.step(3.5);  // パスコード不一致
          break;
        case 'freezing':  dev.step(3.6);  // アカウント凍結中
          break;
        default:  dev.step(3.7);  // その他エラー
          throw v.authResponse.status;
      }

      dev.end();
      return this.idb;

    } catch (e) { return dev.error(e); }
  }
  /* 2026.01.26 旧版exec
  async exec(func,arg=[],depth=0) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{func,arg}, rv:null};
    const dev = new devTools(v,{mode:'dev'});
    try {

      dev.step(1.1);  // 再帰呼出時の階層チェック
      if( depth > this.cf.maxDepth )
        throw new Error('maximum recursion depth exceeded');

      dev.step(1.2); // funcが関数名として有効かチェック
      // なお「::〜::」は内発処理として有効とする
      if( !/^(::[a-zA-Z_$][a-zA-Z0-9_$]*::|[a-zA-Z_$][a-zA-Z0-9_$]*)$/.test(func) ){
        throw new Error('Invalid function');
      }

      dev.step(1.3);  // サーバ側に渡す引数を無毒化
      arg = this.cf.sanitizeArg(arg);
      if( arg instanceof Error ) throw arg;

      if( !this.idb.SPkeySign ){  // SPkey未取得

        dev.step(2.1,this.idb);  // 内発処理「初期情報要求」用のauthRequestを作成
        v.authRequest = this.cf.factory('authRequest',{idb:this.idb,func:'::initial::'});
        dev.step(99.212,v.authRequest);

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
  */

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

      dev.step(2.2);  // fetch処理
      v.response = await globalThis.fetch(this.cf.api,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: JSON.stringify(v.encryptedRequest),
      });
      if( !v.response.ok ){
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        v.response = v.response.json();
      }
      /*dev.step(2.2);  // fetch処理を行うPromise
      v.fetchPromise = globalThis.fetch(this.cf.api, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(v.encryptedRequest)
      }).then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json(); 
      });*/

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
    const v = {whois:`${this.constructor.name}.getIndexedDB`, arg:{}, rv:{}};
    const dev = new devTools(v);

    try {

      dev.step(1); // データ取得開始
      // _withStore を使用して "Auth" ストアへの読み取り専用アクセスを確保
      await this._withStore('readonly', (store) => {
        return new Promise((resolve, reject) => {
          const request = store.openCursor();

          request.onsuccess = async (event) => {
            const cursor = event.target.result;
            if (cursor) {
              // ストア内のキー名（memberId, CPkeySign 等）をプロパティ名として採用 [2]
              const key = cursor.key;
              // インポート処理を行い、CryptoKey 等を復元した上でオブジェクトへ格納
              v.rv[key] = await this._importIfCryptoKey(key, cursor.value);
              
              cursor.continue(); // 次のレコードへ移動
            } else {
              // 全レコードの走査が完了
              resolve();
            }
          };

          request.onerror = (event) => {
            reject(event.target.error);
          };
        });
      });

      dev.end(v.rv); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** initialize: authClientインスタンス作成
   * - インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
   * - staticではない一般のメンバへの値セットができないため別途constructorを呼び出す
   * @static
   * @param {Object} config - authClient/Server共通＋authClient専用設定情報
   *   ※共通/専用設定情報は事前に結合しておくこと(ex.mergeDeeply)
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

      dev.step(4,v.idb);  // 暗号化・署名検証用インスタンス作成
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
        dev.step(99.433,v.r);

      }

      dev.step(6,v.idb);  // IndexedDBの内容をメンバ変数に格納
      Object.keys(v.idb).forEach(x => v.rv.idb[x] = v.idb[x]);

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