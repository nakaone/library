/**
 * @typedef {Object} MemberTrial - ログイン試行単位の試行情報(Member.trial)
 * @prop {string} passcode - 設定されているパスコード
 * @prop {number} created - パスコード生成日時(≒パスコード通知メール発信日時)
 * @prop {MemberTrialLog[]} [log] - 試行履歴。常に最新が先頭(unshift()使用)
 */