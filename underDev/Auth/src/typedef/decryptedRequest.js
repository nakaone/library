/**
 * @typedef {Object} decryptedRequest - cryptoServerで復号された処理要求オブジェクト
 * @prop {string} result - 処理結果。"fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "success"
 * @prop {string} [message] - エラーメッセージ。result="normal"の場合`undefined`
 * @prop {authRequest} request - ユーザから渡された処理要求
 * @prop {string} timestamp - 復号処理実施日時。メール・ログでの閲覧が容易になるよう、文字列で保存
 */