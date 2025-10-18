/**
 * @typedef {Object} authScriptProperties - キー名は`authConfig.system.name`、データは以下のオブジェクトをJSON化した文字列。
 * @prop {number} keyGeneratedDateTime - UNIX時刻
 * @prop {string} SPkey - PEM形式の公開鍵文字列
 * @prop {string} SSkey - PEM形式の秘密鍵文字列（暗号化済み）
 * @prop {authRequestLog[]} requestLog - 重複チェック用のリクエスト履歴
 * @prop {undefined} requ
 */