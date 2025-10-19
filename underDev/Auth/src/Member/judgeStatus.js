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
