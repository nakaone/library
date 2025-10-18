/**
 * @typedef {Object} MemberTrialLog - MemberTrial.logに記載される、パスコード入力単位の試行記録
 * @prop {string} entered - 入力されたパスコード
 * @prop {number} result - -1:恒久的エラー, 0:要リトライ, 1:パスコード一致
 * @prop {string} message - エラーメッセージ
 * @prop {number} timestamp - 判定処理日時
 */