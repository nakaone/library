export class authClientConfig extends authConfig {

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