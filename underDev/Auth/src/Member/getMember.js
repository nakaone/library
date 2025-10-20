/**
 * 指定memberId / deviceId のメンバ情報を取得
 * @param {string} memberId
 * @param {string} [deviceId]
 * @returns {Member}
 * 
 * - 要仕様変更：MemberTrialのため、対象外のデバイス情報も返すよう変更
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
