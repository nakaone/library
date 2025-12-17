export class authServer {

  /**
   * @constructor
   * @param {authConfig} config - authClient/Server共通設定値オブジェクト
   */
  constructor(config={}) {
    const v = {whois:`authServer.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // config必須項目のチェック
      // -------------------------------------------------------------
      if( !config.hasOwnProperty('func') )
        throw new Error(`Required arguments not specified`);

      // -------------------------------------------------------------
      dev.step(2);  // 設定情報(this.cf)の作成
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

      // -------------------------------------------------------------
      dev.step(3);  // 暗号化・復号モジュール生成(this.crypto)
      // -------------------------------------------------------------
      this.crypto = cryptoServer.initialize(this.cf);
      if( this.crypto instanceof Error ) throw this.crypto;

      // -------------------------------------------------------------
      dev.step(4);  // 監査ログ・エラーログシートの準備(this.audit, this.error)
      // -------------------------------------------------------------
      this.audit = this.authAuditLog();
      this.error = this.authErrorLog();

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /** authAuditLog: サーバ側監査ログ（クロージャ版）
   * @param {authServerConfig} config
   * @returns {{ log: Function }}
   */
  authAuditLog(config) {

    // ============================
    // private (closure variables)
    // ============================

    const startedAt = Date.now();               // 処理開始時刻
    const sheetName = config.auditLog;
    const retentionMs = config.storageDaysOfAuditLog;

    const state = {
      timestamp: new Date(startedAt).toISOString(),
      duration: null,
      memberId: null,
      deviceId: null,
      func: null,
      result: "normal",
      note: ""
    };

    // ============================
    // シート準備
    // ============================

    const ss = SpreadsheetApp.getActive();
    let sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        "timestamp",
        "duration",
        "memberId",
        "deviceId",
        "func",
        "result",
        "note"
      ]);
    }

    // ============================
    // ローテーション（保存期限超過行の削除）
    // ============================

    function rotateIfNeeded() {
      if (!retentionMs) return;

      const now = Date.now();
      const lastRow = sheet.getLastRow();
      if (lastRow <= 1) return; // ヘッダのみ

      const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

      // 後ろから削除（行番号ズレ防止）
      for (let i = values.length - 1; i >= 0; i--) {
        const ts = values[i][0];
        if (!ts) continue;

        const time = new Date(ts).getTime();
        if (isNaN(time)) continue;

        if (now - time > retentionMs) {
          sheet.deleteRow(i + 2);
        }
      }
    }

    // ============================
    // public methods
    // ============================

    /** log: 監査ログ出力
     * @param {authRequest|string} request
     * @param {authResponse} response
     * @returns {Object} authAuditLog record
     */
    function log(request, response) {

      // ---------- ローテーション ----------
      rotateIfNeeded();
      
      // ---------- duration ----------
      const finishedAt = Date.now();
      state.duration = finishedAt - startedAt;

      // ---------- request 解析 ----------
      if (typeof request === "string") {
        // 内発処理
        state.func = request;
      } else if (request) {
        state.memberId = request.memberId ?? state.memberId;
        state.deviceId = request.deviceId ?? null;
        state.func = request.func ?? state.func;
      }

      // ---------- response 解析 ----------
      if (response) {
        if (response.status instanceof Error) {
          state.result = "fatal";
          state.note = response.status.message || "fatal error";
        } else if (typeof response.status === "string" && response.status !== "success") {
          state.result = "warning";
          state.note = response.status;
        } else {
          state.result = "normal";
          state.note = response.message || "";
        }
      }

      // ---------- 必須項目チェック ----------
      if (!state.memberId) state.memberId = "unknown";
      if (!state.func) state.func = "unknown";
      if (!state.note) state.note = "";

      // ---------- シート出力 ----------
      sheet.appendRow([
        state.timestamp,
        state.duration,
        state.memberId,
        state.deviceId,
        state.func,
        state.result,
        state.note
      ]);

      // ---------- 戻り値 ----------
      return {
        timestamp: state.timestamp,
        duration: state.duration,
        memberId: state.memberId,
        deviceId: state.deviceId,
        func: state.func,
        result: state.result,
        note: state.note
      };
    }

    // ============================
    // public API
    // ============================

    return {
      log
    };
  }

  /** authErrorLog: authServer のエラーログ（クロージャ実装）
  */
  authErrorLog(config = {}, arg = {}) {

    const ss = SpreadsheetApp.getActive();
    const sheetName = config.errorLog;
    const retentionMs = config.storageDaysOfErrorLog;

    const state = {
      timestamp: new Date().toISOString(),
      memberId: undefined,
      deviceId: undefined,
      result: 'fatal',
      message: undefined,
      stack: undefined,
    };

    // ----------------------------
    // arg → state マッピング
    // ----------------------------
    Object.keys(state).forEach(k => {
      if (k in arg) state[k] = arg[k];
    });

    // ----------------------------
    // シート取得 or 作成
    // ----------------------------
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        'timestamp',
        'memberId',
        'deviceId',
        'result',
        'message',
        'stack',
      ]);
    }

    // ============================
    // ローテーション（保存期限超過行の削除）
    // ============================
    function rotateIfNeeded() {
      if (!retentionMs) return;

      const now = Date.now();
      const lastRow = sheet.getLastRow();
      if (lastRow <= 1) return;

      const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

      for (let i = values.length - 1; i >= 0; i--) {
        const ts = values[i][0];
        if (!ts) continue;

        const time = new Date(ts).getTime();
        if (isNaN(time)) continue;

        if (now - time > retentionMs) {
          sheet.deleteRow(i + 2);
        }
      }
    }

    // ============================
    // public: log
    // ============================
    function log(e, response) {

      rotateIfNeeded();

      state.timestamp = new Date().toISOString();
      state.memberId = response?.request?.memberId;
      state.deviceId = response?.request?.deviceId;
      state.result = response?.result ?? 'fatal';
      state.message = response?.message;
      state.stack = e?.stack;

      sheet.appendRow([
        state.timestamp,
        state.memberId,
        state.deviceId,
        state.result,
        state.message,
        state.stack, // ※シートのみ出力可（通知等は禁止）
      ]);

      return { ...state };
    }

    // ============================
    // 公開API
    // ============================
    return {
      log,
    };
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

  /**
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  exec(arg) {
    const v = {whois:`${this.constructor.name}.prototype`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // 処理要求を復号
      // 該当のメンバ情報を取得
      // if
        // 内発処理の要求
        // 一般的処理要求(非内発処理)
      

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------

      dev.end(); // 終了処理
      return v.rv;

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