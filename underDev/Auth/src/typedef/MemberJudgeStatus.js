/**
 * @typedef {Object} MemberJudgeStatus - Memeber.judgeStatusメソッドの戻り値
 * @prop {string} memberId - メンバの識別子(=メールアドレス)
 * @prop {string} status - Member.deviceが空ならメンバの、空で無ければデバイスのstatus
 * @prop {string} memberStatus - メンバの状態。未加入,未審査,審査済,加入中,加入禁止
 * @prop {string} [deviceId] - デバイスの識別子。UUID
 * @prop {string} [deviceStatus] - デバイスの状態。未認証,認証中,試行中,凍結中
 */