/************************************************************
 * MemberTrial & MemberTrialLog Classes (実用完全版)
 * ----------------------------------------------------------
 * version : 1.0.0
 * author  : ChatGPT (based on formal spec)
 * platform: Google Apps Script
 ************************************************************/
const dev = devTools();

/**
 * @typedef {Object} MemberTrial
 * @property {string} trialId - 試行の一意識別子(UUIDなど)
 * @property {string} memberId - メンバID
 * @property {string} [deviceId] - 試行を行ったデバイスID
 * @property {string} type - 試行種別（login, register, resetなど）
 * @property {number} timestamp - 試行開始時刻
 * @property {string} status - 試行結果（success, failure, pendingなど）
 * @property {string} [message] - 補足情報（エラー理由等）
 */

/**
 * @typedef {Object} MemberTrialLog
 * @property {string} logId - ログ識別子
 * @property {string} trialId - 紐付く試行ID
 * @property {string} memberId - 対象メンバ
 * @property {string} [deviceId] - デバイスID
 * @property {string} action - 実行されたアクション名
 * @property {number} timestamp - 実行時刻
 * @property {string} [detail] - 詳細メッセージ
 */

/**
 * MemberTrial：メンバ試行の記録・管理クラス
 */
class MemberTrial {
  /**
   * @param {Object} [config]
   * @param {string} [config.trialSheet="memberTrial"]
   */
  constructor(config = {}) {
    dev.start('MemberTrial.constructor', arguments);
    this.config = Object.assign({ trialSheet: 'memberTrial' }, config);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(this.config.trialSheet);

    if (!sheet) {
      sheet = ss.insertSheet(this.config.trialSheet);
      const headers = ['trialId', 'memberId', 'deviceId', 'type', 'timestamp', 'status', 'message'];
      sheet.appendRow(headers);

      const notes = {
        trialId: '試行の一意識別子(UUID等)',
        memberId: '対象メンバID',
        deviceId: '対象デバイスID（省略可）',
        type: '試行種別（login/register/reset等）',
        timestamp: '試行時刻(Epochミリ秒)',
        status: '試行結果(success/failure/pending)',
        message: '補足メッセージ'
      };
      headers.forEach((h, i) => sheet.getRange(1, i + 1).setNote(notes[h] || ''));
    }

    this.sheet = sheet;
    dev.end();
  }

  /**
   * 試行を追加
   * @param {MemberTrial} trial
   * @returns {MemberTrial}
   */
  addTrial(trial) {
    dev.start('MemberTrial.addTrial', arguments);
    const id = trial.trialId || Utilities.getUuid();
    const record = {
      trialId: id,
      memberId: trial.memberId,
      deviceId: trial.deviceId || '',
      type: trial.type || 'unknown',
      timestamp: trial.timestamp || Date.now(),
      status: trial.status || 'pending',
      message: trial.message || ''
    };

    const headers = this.sheet.getRange(1, 1, 1, this.sheet.getLastColumn()).getValues()[0];
    this.sheet.appendRow(headers.map(h => record[h] ?? ''));
    dev.end();
    return record;
  }

  /**
   * メンバID・デバイスIDで試行履歴を検索
   * @param {string} memberId
   * @param {string} [deviceId]
   * @param {number} [limit=20]
   * @returns {MemberTrial[]}
   */
  getTrials(memberId, deviceId, limit = 20) {
    dev.start('MemberTrial.getTrials', arguments);
    const data = this.sheet.getDataRange().getValues();
    const headers = data[0];
    const trials = [];

    for (let i = data.length - 1; i > 0 && trials.length < limit; i--) {
      const row = data[i];
      const t = {};
      headers.forEach((h, j) => (t[h] = row[j]));
      if (t.memberId === memberId && (!deviceId || t.deviceId === deviceId)) {
        trials.push(t);
      }
    }
    dev.end();
    return trials;
  }

  /**
   * 試行結果を更新
   * @param {string} trialId
   * @param {string} newStatus
   * @param {string} [message]
   * @returns {boolean}
   */
  updateStatus(trialId, newStatus, message = '') {
    dev.start('MemberTrial.updateStatus', arguments);
    const data = this.sheet.getDataRange().getValues();
    const headers = data[0];
    const idIdx = headers.indexOf('trialId');
    const statusIdx = headers.indexOf('status');
    const msgIdx = headers.indexOf('message');

    for (let i = 1; i < data.length; i++) {
      if (data[i][idIdx] === trialId) {
        this.sheet.getRange(i + 1, statusIdx + 1).setValue(newStatus);
        this.sheet.getRange(i + 1, msgIdx + 1).setValue(message);
        dev.end();
        return true;
      }
    }

    dev.warn(`Trial ID not found: ${trialId}`);
    dev.end();
    return false;
  }
}

/**
 * MemberTrialLog：試行詳細ログを管理するクラス
 */
class MemberTrialLog {
  /**
   * @param {Object} [config]
   * @param {string} [config.logSheet="memberTrialLog"]
   */
  constructor(config = {}) {
    dev.start('MemberTrialLog.constructor', arguments);
    this.config = Object.assign({ logSheet: 'memberTrialLog' }, config);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(this.config.logSheet);

    if (!sheet) {
      sheet = ss.insertSheet(this.config.logSheet);
      const headers = ['logId', 'trialId', 'memberId', 'deviceId', 'action', 'timestamp', 'detail'];
      sheet.appendRow(headers);

      const notes = {
        logId: 'ログ識別子(UUID等)',
        trialId: '対応する試行ID',
        memberId: '対象メンバID',
        deviceId: '対象デバイスID',
        action: '実行アクション（API呼出・承認・認証等）',
        timestamp: '記録時刻(Epochミリ秒)',
        detail: '詳細メッセージ'
      };
      headers.forEach((h, i) => sheet.getRange(1, i + 1).setNote(notes[h] || ''));
    }

    this.sheet = sheet;
    dev.end();
  }

  /**
   * ログを追加
   * @param {MemberTrialLog} log
   * @returns {MemberTrialLog}
   */
  addLog(log) {
    dev.start('MemberTrialLog.addLog', arguments);
    const record = {
      logId: log.logId || Utilities.getUuid(),
      trialId: log.trialId,
      memberId: log.memberId,
      deviceId: log.deviceId || '',
      action: log.action || 'unknown',
      timestamp: log.timestamp || Date.now(),
      detail: log.detail || ''
    };

    const headers = this.sheet.getRange(1, 1, 1, this.sheet.getLastColumn()).getValues()[0];
    this.sheet.appendRow(headers.map(h => record[h] ?? ''));
    dev.end();
    return record;
  }

  /**
   * 試行IDまたはメンバIDでログを取得
   * @param {Object} filter
   * @param {string} [filter.trialId]
   * @param {string} [filter.memberId]
   * @param {number} [limit=50]
   * @returns {MemberTrialLog[]}
   */
  getLogs(filter = {}, limit = 50) {
    dev.start('MemberTrialLog.getLogs', arguments);
    const data = this.sheet.getDataRange().getValues();
    const headers = data[0];
    const logs = [];

    for (let i = data.length - 1; i > 0 && logs.length < limit; i--) {
      const row = data[i];
      const l = {};
      headers.forEach((h, j) => (l[h] = row[j]));

      if (
        (!filter.trialId || l.trialId === filter.trialId) &&
        (!filter.memberId || l.memberId === filter.memberId)
      ) {
        logs.push(l);
      }
    }

    dev.end();
    return logs;
  }
}

/************************************************************
 * 🔹使用例
 ************************************************************/
function testTrialSystem() {
  const trialMng = new MemberTrial();
  const logMng = new MemberTrialLog();

  // 試行を追加
  const t = trialMng.addTrial({
    memberId: 'test@example.com',
    deviceId: 'device001',
    type: 'login'
  });
  Logger.log('Trial added:', t);

  // 試行を更新
  trialMng.updateStatus(t.trialId, 'success', 'ログイン成功');

  // ログ追加
  logMng.addLog({
    trialId: t.trialId,
    memberId: t.memberId,
    deviceId: t.deviceId,
    action: 'loginAPI',
    detail: 'User authenticated successfully'
  });

  // ログ検索
  const logs = logMng.getLogs({ memberId: 'test@example.com' });
  Logger.log('Logs:', logs);
}
