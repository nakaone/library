/**
 * @class
 * @classdesc クライアント・サーバ共通設定情報
 * @prop {string} systemName=Auth - システム名
 * @prop {string} adminMail=必須 - 管理者のメールアドレス
 * @prop {string} adminName=必須 - 管理者氏名
 * @prop {number} allowableTimeDifference=120000 - クライアント・サーバ間通信時の許容時差。既定値は2分
 * @prop {string} RSAbits=2048 - 鍵ペアの鍵長
 * @prop {Object} underDev=任意 - テスト時の設定
 * @prop {boolean} underDev.isTest=FALSE - 開発モードならtrue
 * @prop {string} =UUIDv4 - 要求の識別子UUIDv4
 */
export class authConfig {

  /**
   * @constructor
   * @param {authConfig} config - 設定情報(既定値からの変更部分)
   */
  constructor(arg) {
    const v = {whois:`authConfig.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // メンバの値設定
      this.systemName = arg.systemName || 'Auth'; // {string} システム名
      if( arg.hasOwnProperty('adminMail') ){
        this.adminMail = arg.adminMail;	// {string} 管理者のメールアドレス
      } else {
        throw new Error('"adminMail" is not specified.');
      }
      if( arg.hasOwnProperty('adminName') ){
        this.adminName = arg.adminName;	// {string} 管理者氏名
      } else {
        throw new Error('"adminName" is not specified.');
      }
      this.allowableTimeDifference = arg.allowableTimeDifference || 120000;
      // {number}	クライアント・サーバ間通信時の許容時差	既定値は2分
      this.RSAbits = arg.RSAbits || 2048;	// {number} 鍵ペアの鍵長
      this.underDev = {};	// {Object} テスト時の設定
      this.underDev.isTest = // {boolean} 開発モードならtrue
      ( arg.hasOwnProperty('underDev')
      && arg.underDev.hasOwnProperty('isTest') )
      ? arg.underDev.isTest : false;

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }
}