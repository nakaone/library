export class authConfig {

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