import { authConfig } from "../common/authConfig.mjs";
import { mergeDeeply } from "../../../../mergeDeeply/2.0.0/core.mjs"

/** authClientConfig: クライアント側特有の設定項目
 * @typedef {Object} authClientConfig
 * @extends {authConfig}
 * @prop {string} api - サーバ側WebアプリURLのID
 *   https://script.google.com/macros/s/(この部分)/exec
 * @prop {number} timeout=300000 - サーバからの応答待機時間
 *   これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分
 * @prop {string} storeName="config" - IndexedDBのストア名
 * @prop {number} dbVersion=1 - IndexedDBのバージョン
 */
export class authClientConfig extends authConfig {
  /**
   * @constructor
   * @param {authConfig} arg - 設定情報(既定値からの変更部分)
   */
  constructor(arg){
    const v = {whois:`authConfig.constructor`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    // -------------------------------------------------------------
    // authClient/Server共用設定値・データ型(Schema)定義
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
      dev.step(1);  // スーパークラス(Schema)の生成
      super(mergeDeeply(v.schema,arg));

      dev.step(2);  // 必須項目の設定
      v.required.forEach(x => {
        if( typeof arg[x] === 'undefined' )
          throw new Error(`"${x}" is not specified.`);
        this[x] = arg[x];
      });

      dev.step(3);  // 任意項目の設定
      Object.keys(v.option).forEach(x => {
        this[x] = arg[x] ?? v.option[x];
      });
      // this.apiをIDからURLに書き換え
      this.api = `https://script.google.com/macros/s/${this.api}/exec`;

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }
}