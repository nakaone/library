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
