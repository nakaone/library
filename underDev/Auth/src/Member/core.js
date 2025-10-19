class Member {
/**
   * @param {authServerConfig} [authServerConfig]
   */
  constructor(authServerConfig = {}) {
    dev.start('Member.constructor', arguments);
    this.config = Object.assign({ memberList: 'memberList' }, authServerConfig);
  
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(this.config.memberList);
  
    // シートが存在しない場合は新規作成
    if (!sheet) {
      sheet = ss.insertSheet(this.config.memberList);
      const headers = ['memberId', 'name', 'status', 'log', 'profile', 'device', 'note'];
      sheet.appendRow(headers);
  
      const notes = {
        memberId: 'メンバ識別子（メールアドレスなど）',
        name: '氏名',
        status: 'メンバ状態',
        log: 'MemberLog(JSON文字列)',
        profile: 'MemberProfile(JSON文字列)',
        device: 'MemberDevice[](JSON文字列)',
        note: '備考'
      };
      headers.forEach((h, i) => sheet.getRange(1, i + 1).setNote(notes[h] || ''));
    }
  
    this.sheet = sheet;
    dev.end();
  }
/**
   * memberListシート全体を取得
   * @returns {Member[]}
   */
  getAllMembers() {
    dev.start('Member.getAllMembers');
    const data = this.sheet.getDataRange().getValues();
    const headers = data[0];
    const members = [];
  
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const m = {};
      headers.forEach((h, j) => {
        let v = row[j];
        if (['log', 'profile', 'device'].includes(h)) {
          try { v = JSON.parse(v || '{}'); } catch { v = {}; }
        }
        m[h] = v;
      });
      members.push(m);
    }
    dev.end();
    return members;
  }
/**
   * 指定memberId / deviceId のメンバ情報を取得
   * @param {string} memberId
   * @param {string} [deviceId]
   * @returns {Member}
   */
  getMember(memberId, deviceId) {
    dev.start('Member.getMember', arguments);
    const data = this.sheet.getDataRange().getValues();
    const headers = data[0];
    const idx = headers.indexOf('memberId');
    const row = data.find(r => r[idx] === memberId);
  
    if (!row) throw new Error(`memberId ${memberId} not found.`);
  
    const member = {};
    headers.forEach((h, i) => {
      let v = row[i];
      if (['log', 'profile', 'device'].includes(h)) {
        try { v = JSON.parse(v || '{}'); } catch { v = {}; }
      }
      member[h] = v;
    });
  
    if (deviceId && Array.isArray(member.device)) {
      const targetDevice = member.device.find(d => d.deviceId === deviceId);
      if (!targetDevice) throw new Error(`deviceId ${deviceId} not found.`);
      member.device = [targetDevice];
    }
  
    dev.end();
    return member;
  }
/**
   * メンバ状態判定
   * @param {Member} m
   * @returns {MemberJudgeStatus}
   */
  judgeStatus(m) {
    dev.start('Member.judgeStatus', arguments);
    const log = m.log || {};
    const now = Date.now();
  
    let memberStatus = '未加入';
    if (log.joiningRequest === 0 || (0 < log.approval && 0 < log.joiningExpiration && log.joiningExpiration < now)) {
      memberStatus = '未加入';
    } else if (0 < log.denial && now <= log.unfreezeDenial) {
      memberStatus = '加入禁止';
    } else if (log.approval === 0 && log.denial === 0) {
      memberStatus = '未審査';
    } else if (0 < log.approval && now <= log.joiningExpiration) {
      memberStatus = '加入中';
    }
  
    let deviceStatus = '';
    if (Array.isArray(m.device) && m.device.length > 0) {
      const d = m.device[0];
      const l = log;
      if (0 < l.approval && l.loginRequest === 0) {
        deviceStatus = '未認証';
      } else if (0 < l.approval && 0 < l.loginFailure && l.loginFailure < now && now <= l.unfreezeLogin) {
        deviceStatus = '凍結中';
      } else if (0 < l.approval && now <= l.loginExpiration) {
        deviceStatus = '認証中';
      } else if (0 < l.approval && 0 < l.loginRequest) {
        deviceStatus = '試行中';
      }
    }
  
    const rv = {
      memberId: m.memberId,
      status: deviceStatus || memberStatus,
      memberStatus,
      deviceId: m.device?.[0]?.deviceId,
      deviceStatus
    };
    dev.end();
    return rv;
  }
/**
   * メンバ情報をシートに保存
   * @param {Member} arg
   * @returns {Member|Error}
   */
  setMember(arg) {
    dev.start('Member.setMember', arguments);
    try {
      const judged = this.judgeStatus(arg);
      arg.status = judged.memberStatus;
  
      if (Array.isArray(arg.device)) {
        arg.device.forEach(d => {
          const jd = this.judgeStatus({ ...arg, device: [d] });
          d.status = jd.deviceStatus;
        });
      }
  
      const saveObj = { ...arg };
      ['log', 'profile', 'device'].forEach(k => {
        if (typeof saveObj[k] !== 'string') saveObj[k] = JSON.stringify(saveObj[k] || {});
      });
  
      const data = this.sheet.getDataRange().getValues();
      const headers = data[0];
      const idCol = headers.indexOf('memberId');
      const targetRow = data.findIndex(r => r[idCol] === arg.memberId);
  
      if (targetRow === -1) {
        this.sheet.appendRow(headers.map(h => saveObj[h] ?? ''));
      } else {
        headers.forEach((h, i) => {
          this.sheet.getRange(targetRow + 1, i + 1).setValue(saveObj[h] ?? '');
        });
      }
  
      dev.end();
      return arg;
    } catch (e) {
      dev.error(e);
      return e;
    }
  }
}
