import { authConfig } from "./authConfig.mjs";
/**
 * @class
 * @classdesc クライアント側設定情報
 * @prop {string} api - サーバ側WebアプリURLのID。https://script.google.com/macros/s/(この部分)/exec
 * @prop {number} timeout=300000 - サーバからの応答待機時間。これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分
 * @prop {string} storeName="config" - IndexedDBのストア名
 * @prop {number} dbVersion=1 - IndexedDBのバージョン
 */
export class authClientConfig extends authConfig {

  /**
   * @constructor
   * @param {authClientConfig} config - authClient設定情報(既定値からの変更部分)
   */
  constructor(arg) {
    const v = {whois:`authClientConfig.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {
      super(arg);

      dev.step(1); // メンバの値設定
      if( arg.hasOwnProperty('api') ){
        this.api = arg.api;	// {string} サーバ側WebアプリURLのID
      } else {
        throw new Error('"api" is not specified.');
      }
      this.timeout = arg.timeout || 300000; // {number} サーバからの応答待機時間
      this.storeName = arg.storeName || 'config'; // {string} IndexedDBのストア名
      this.dbVersion = arg.dbVersion || 1;  // {number} IndexedDBのバージョン

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }
}