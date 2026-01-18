/** authServer: サーバ側中核クラス
 * @class
 * @classdesc サーバ側中核クラス
 * @prop {authServerConfig} cf - authServer設定項目
 * @prop {cryptoServer} crypto - 暗号化・署名検証
 */
export class authServer {

  /**
   * @constructor
   * @param {authConfig} config - authClient/Server共通設定値オブジェクト
   */
  constructor(config={}) {
    const v = {whois:`authServer.constructor`, arg:{config}, rv:null};
    const dev = new devTools(v);
    // -------------------------------------------------------------
    // authServer専用設定値・データ型(Schema)定義
    //   ※authClient/Server共用はauthConfigクラスで定義
    // -------------------------------------------------------------
    // Schemaクラスの指定項目＋authClient専用データ型定義
    v.schema = {
      types: {
      }
    };
    // 必須指定項目の一覧
    v.required = ['func'];
    // 任意指定項目と既定値
    v.option = {
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
    }
    try {

      /** this.cf(authServerConfig): 共通設定情報にauthServer特有項目を追加
       * @typedef {Object} authServerConfig - authServer特有の設定項目
       * @extends {authConfig}
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
       * @prop {authServerFuncDef} func={} - サーバ側関数設定
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
       * @prop {schemaDef} typeDef - データ型定義
       */
      dev.step(1.1);  // this.cfの作成
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

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /** authLogger: 監査ログ／エラーログを自動振り分けで出力
   * - 監査ログ：authAuditLog型
   * - エラーログ：authErrorLog型
   * @param {authResponse} response
   * @returns {authResponse}
   */
  authLogger(response) {
    const v = { whois: `${this.constructor.name}.authLogger`, arg: { response }, rv: null };
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // ログ種別判定（normal / warning / fatal）
      // -------------------------------------------------------------
      let level = 'normal';
      if (response.status instanceof Error) {
        level = 'fatal';
      } else if (typeof response.status === 'string' && response.status !== 'success') {
        level = 'warning';
      }

      // -------------------------------------------------------------
      dev.step(2); // 出力先シート名決定
      // -------------------------------------------------------------
      const sheetName =
        level === 'fatal'
          ? this.cf.errorLog
          : this.cf.auditLog;

      const retentionMs =
        level === 'fatal'
          ? this.cf.storageDaysOfErrorLog
          : this.cf.storageDaysOfAuditLog;

      const ss = SpreadsheetApp.getActive();
      let sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        sheet.appendRow(
          level === 'fatal'
            ? ['timestamp', 'memberId', 'deviceId', 'result', 'message', 'stack']
            : ['timestamp', 'duration', 'memberId', 'deviceId', 'func', 'result', 'note']
        );
      }

      // -------------------------------------------------------------
      dev.step(3); // ローテーション（保存期限超過行の削除）
      // -------------------------------------------------------------
      if (retentionMs) {
        const now = Date.now();
        const lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
          for (let i = values.length - 1; i >= 0; i--) {
            const t = new Date(values[i][0]).getTime();
            if (!isNaN(t) && now - t > retentionMs) {
              sheet.deleteRow(i + 2);
            }
          }
        }
      }

      // -------------------------------------------------------------
      dev.step(4); // duration / timestamp 算出
      // -------------------------------------------------------------
      response.responseTime = Date.now();
      const duration = response.responseTime - response.receptTime;
      const timestamp = new Date(response.receptTime).toISOString();

      // -------------------------------------------------------------
      dev.step(5); // ログ出力
      // -------------------------------------------------------------
      if (level === 'fatal') {
        sheet.appendRow([
          timestamp,
          response.memberId,
          response.deviceId,
          'fatal',
          response.message,
          response.status?.stack,
        ]);

        // 管理者通知フック（必要なら）
        // MailApp.sendEmail(this.cf.adminMail, 'auth fatal error', response.message);

      } else {
        sheet.appendRow([
          timestamp,
          duration,
          response.memberId,
          response.deviceId,
          response.func,
          level,
          response.message || '',
        ]);
      }

      dev.end();
      return response;

    } catch (e) {
      return dev.error(e);
    }
  }

  /** authResponse: authResponse型のオブジェクトを作成
   * @param {authRequest} request - 処理要求オブジェクト
   * @returns {authResponse}
   */
  authResponse(request){
    return {
      memberId: request.memberId,
      deviceId: request.deviceId,
      memberName: request.memberName,
      CPkeySign: request.CPkeySign,
      requestTime: request.requestTime,
      func: request.func,
      arg: request.arg,
      nonce: request.nonce,

      SPkeySign: this.keys.SPkeySign,
      response: null,
      receptTime: Date.now(),
      responseTime: 0,
      status: 'success',
      message: '',
      // メンバ"decrypt"はクライアント側で付加
    }
  }

  /** initialize: authServerインスタンス作成
   * - インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
   * - staticではない一般のメンバへの値セットができないため別途constructorを呼び出す
   * @static
   * @param {authConfig} config - authClient/Server共通設定値オブジェクト
   * @returns {authServer|Error}
   */
  static async initialize(config) {
    const v = {whois:`authServer.initialize`, arg:{config}, rv:null};
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // インスタンス生成
      // オプション既定値を先にメンバ変数に格納するため、constructorを先行
      // -------------------------------------------------------------
      v.rv = new authServer(config);

      // -------------------------------------------------------------
      dev.step(2);  // 暗号化・復号モジュール生成(v.rv.crypto)
      // -------------------------------------------------------------
      v.rv.crypto = await cryptoServer.initialize(v.rv.cf);
      if( v.rv.crypto instanceof Error ) throw v.rv.crypto;

      // -------------------------------------------------------------
      dev.step(3);  // memberListシートの準備(v.rv.member)
      // -------------------------------------------------------------
      v.rv.member = new Member(v.rv.cf);

      // -------------------------------------------------------------
      dev.step(4);  // 監査ログ・エラーログシートの準備(v.rv.audit, v.rv.error)
      // -------------------------------------------------------------
      //v.rv.audit = v.rv.authAuditLog();
      //v.rv.error = v.rv.authErrorLog();

      dev.end({IndexedDB:v.rv.idb}); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** exec: 処理要求に対するサーバ側中核処理
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  async exec(arg) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1.1,arg);  // request存在・最低限チェック
      if( !arg ) throw new Error('invalid request: empty body');
      dev.step(1.2,JSON.parse(arg));  // 処理要求を復号
      v.request = await this.crypto.decrypt(JSON.parse(arg), this.cf.CPkeySign);
      if( v.request instanceof Error ) throw v.request;
      dev.step(1.3,v.request);  // // request.func チェック
      if (!v.request || !v.request.func)
        throw new Error('invalid request: func missing');

      if( v.request.func === '::initial::' ){
        dev.step(2);  // 初回HTMLロード時(SPkey取得要求)の場合
        // ⇒ Member.setMember: 指定メンバ情報をmemberListシートに保存。戻り値はauthResponse型
        v.response = this.member.setMember(v.request);
        if( v.response instanceof Error ) throw v.response;
      } else {
        if( /^::[A-Za-z0-9_]+::$/.test(v.request.func) ){
          dev.step(3);  // 内発処理の要求
          // ⇒ 要求の種類毎に分岐。戻り値はauthResponse型に統一
        } else {
          dev.step(4);  // 一般的処理要求(非内発処理)

          // 該当のメンバ情報を取得
          // メンバ・デバイスの状態・権限確認
          // if 状態・権限OK
            // サーバ側関数を実行、結果をauthResponseに組み込み
          // else 状態・権限NG
            // 状態・権限によりv.responseに値設定
        }
      }

      dev.step(5);  // 処理結果を監査／エラーログに出力
      this.authLogger(v.response);

      dev.step(6);  // encryptedResponseの作成
      v.rv = await this.crypto.encrypt(v.response, v.response.CPkeySign);
      if( v.rv instanceof Error ) throw v.rv;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** setupEnvironment: 初回実行時に必要なOAuth権限を一括取得
   * - 管理者が Spread メニューから手動実行する
   * @param {void}
   * @returns {null}
   */
  static setupEnvironment() {
    const v = {whois:`${this.constructor.name}.setupEnvironment`, arg: {}, rv: null };
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // Spreadsheet 権限
      // -------------------------------------------------------------
      const ss = SpreadsheetApp.getActive();
      const sheet = ss.getActiveSheet();
      sheet.getActiveCell().getValue();

      // -------------------------------------------------------------
      dev.step(2); // PropertiesService 権限
      // -------------------------------------------------------------
      const prop = PropertiesService.getScriptProperties();
      prop.getProperty('dummy');
      prop.setProperty('dummy', Date.now());

      // -------------------------------------------------------------
      dev.step(3); // Utilities / UUID
      // -------------------------------------------------------------
      Utilities.getUuid();

      // -------------------------------------------------------------
      dev.step(4); // Mail 権限（空メール or テスト通知）
      // -------------------------------------------------------------
      if (this.cf.adminMail) {
        MailApp.sendEmail({
          to: this.cf.adminMail,
          subject: '[authServer] OAuth test',
          body: 'OAuth authorization test: ' + new Date().toISOString(),
          noReply: true
        });
      }

      // -------------------------------------------------------------
      dev.step(5); // LockService（将来用）
      // -------------------------------------------------------------
      LockService.getScriptLock().tryLock(1);

      dev.end();
      return null;

    } catch (e) { return dev.error(e); }
  }
}