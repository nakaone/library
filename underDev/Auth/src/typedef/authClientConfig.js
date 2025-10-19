//::$src/typedef/authConfig.js::

/**
 * @typedef {Object} authClientConfig - authConfigを継承した、authClientでのみ使用する設定値
 * @prop {string} api - サーバ側WebアプリURLのID(`https://script.google.com/macros/s/(この部分)/exec`)
 * @prop {number} [timeout=300000] - サーバからの応答待機時間。これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分
 * @prop {number} [CPkeyGraceTime=600000] - CPkey期限切れまでの猶予時間。CPkey有効期間がこれを切ったら更新処理実行。既定値は10分
 */
class authClientConfig extends authConfig {
  constructor(arg){
    super(arg);
    this.api = arg.api;
    this.timeout = arg.timeout || 300000;
    this.CPkeyGraceTime = arg.CPkeyGraceTime || 600000;
  }
}
