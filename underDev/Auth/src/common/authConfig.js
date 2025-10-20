/**
 * @typedef {Object} authConfig - authClient/authServer共通で使用される設定値。,authClientConfig, authServerConfigの親クラス
 * @prop {string} [systemName="auth"] - システム名
 * @prop {string} adminMail - 管理者のメールアドレス
 * @prop {string} adminName - 管理者氏名
 * @prop {string} [allowableTimeDifference=120000] - クライアント・サーバ間通信時の許容時差。既定値は2分
 * @prop {string} [RSAbits=2048] - 鍵ペアの鍵長
 */
class authConfig {
  constructor(arg){
    this.systemName = arg.systemName || 'auth';
    this.adminMail = arg.adminMail;
    this.adminName = arg.adminName;
    this.allowableTimeDifference = arg.allowableTimeDifference || 120000;
    this.RSAbits = arg.RSAbits || 2048;
  }
}