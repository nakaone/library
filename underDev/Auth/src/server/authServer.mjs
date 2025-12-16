/**
 * @class
 * @classdesc
 * @prop {authServerConfig} cf - authServer設定項目
 */
export class authServer {

  /** typedef funcDef: サーバ側関数設定オブジェクト
   * @typedef {Object.<string,Function|Arror>} funcDef - サーバ側関数設定 
	 * @prop {number} func.authority=0 - サーバ側関数の所要権限
	 *   サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限
	 *   ex. authServerConfig.func.authority === 0
	 * @prop {Function} func.do - 実行するサーバ側関数
   * 
   * @example サーバ側関数マップ(func)の設定例
	 * 
	 * - サーバ側関数(例)
	 *   - commonFunc() : 誰でも実行可能なサーバ側処理(掲示板情報の提供など)。必要な権限は'0'(=0b00)
	 *   - staffFunc() : 係員のみ実行可能なサーバ関数(受付処理など)。必要な権限は'2'(=0b10)
	 * - 設定
	 *   ```js
	 *   func = {
	 *     "commonFunc": {
	 *         "authority": 0,
	 *         "do": m => commonFunc(...m) // 引数mにはauthRequest.argを渡す
	 *     },
	 *     "staffFunc": {
	 *         "authority": 2,
	 *         "do": m => staffFunc(...m)
	 *     },
	 *   }
	 *   ```
	 * - 備考
	 *   - 上の例ではauthRequest.funcとサーバ側実関数名は一致させているが、
	 *     隠蔽等を目的で異なる形にしても問題ない。<br>
	 *     例：`cmFunc:{authority:0,do:m=>commonFunc(...m)}`
   */
  /** typedef authServerConfig
   * @typedef {Object} authServerConfig
	 * @prop {string} memberList="memberList" - memberListシート名
	 * @prop {number} defaultAuthority=1 - 新規加入メンバの権限の既定値
	 * @prop {number} memberLifeTime=31536000000 - 加入有効期間
	 *   メンバ加入承認後の有効期間。既定値は1年
	 * @prop {number} prohibitedToJoin=259200000 - 加入禁止期間
	 *   管理者による加入否認後、再加入申請が自動的に却下される期間。既定値は3日
	 * @prop {number} loginLifeTime=86400000 - 認証有効時間
	 *   ログイン成功後の有効期間、CPkeyの有効期間。既定値は1日
	 * @prop {number} loginFreeze=600000 - 認証凍結時間
	 *   認証失敗後、再認証要求が禁止される期間。既定値は10分
	 * @prop {number} requestIdRetention=300000 - 重複リクエスト拒否となる時間。既定値は5分
	 * @prop {string} errorLog="errorLog" - エラーログのシート名
	 * @prop {number} storageDaysOfErrorLog=604800000 - エラーログの保存日数
	 *   単位はミリ秒。既定値は7日分
	 * @prop {string} auditLog="auditLog" - 監査ログのシート名
	 * @prop {number} storageDaysOfAuditLog=604800000 - 監査ログの保存日数
	 *   単位はミリ秒。既定値は7日分
	 * 
	 * @prop {funcDef} func={} - サーバ側関数設定
   * 
	 * ログイン試行関係の設定値
	 * @prop {number} passcodeLength=6 - パスコードの桁数
	 * @prop {number} maxTrial=3 - パスコード入力の最大試行回数
	 * @prop {number} passcodeLifeTime=600000 - パスコードの有効期間。既定値は10分
	 * @prop {number} maxTrialLog=5 - ログイン試行履歴(MemberTrial)の最大保持数。既定値は5世代
	 * 
   * 開発関係の設定値
	 * @prop {boolean} udSendPasscode=false - 開発中識別フラグパスコード通知メール送信を抑止するならtrue
	 * @prop {boolean} udSendInvitation=false - 開発中の加入承認通知メール送信
	 *   開発中に加入承認通知メール送信を抑止するならtrue
   */
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