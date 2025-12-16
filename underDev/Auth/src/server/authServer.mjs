export class authServer {

  /**
   * @constructor
   * @param {authConfig} config - authClient/Server共通設定値オブジェクト
   */
  constructor(config={}) {
    const v = {whois:`authServer.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1);  // config必須項目のチェック
      if( !config.hasOwnProperty('func') )
        throw new Error(`Required arguments not specified`);

      // -------------------------------------------------------------
      // 設定情報(this.cf)の作成
      // -------------------------------------------------------------
      dev.step(2.1);  // authServer特有の設定項目について既定値を定義
      v.authServerConfig = {
        memberList: 'memberList',
        defaultAuthority: 1,
        memberLifeTime: 31536000000,
        prohibitedToJoin: 259200000,
        loginLifeTime: 86400000,
        loginFreeze: 600000,
        requestIdRetention: 300000,
        errorLog: "errorLog",
        storageDaysOfErrorLog: 604800000,
        auditLog: "auditLog",
        storageDaysOfAuditLog: 604800000,
        func: config.func,
        passcodeLength: 6,
        maxTrial: 3,
        passcodeLifeTime: 600000,
        maxTrialLog: 5,
        udSendPasscode: false,
        udSendInvitation: false,
      };

      dev.step(2.2); // authClient/Server共通設定値に特有項目を追加
      this.cf = new authConfig(config);
      Object.keys(v.authServerConfig).forEach(x => {
        this.cf[x] = config[x] || v.authServerConfig[x];
      })


      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /**
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  prototype(arg) {
    const v = {whois:`${this.constructor.name}.prototype`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}