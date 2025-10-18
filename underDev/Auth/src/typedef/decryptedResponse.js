/**
 * @typedef {Object} decryptedResponse - cryptoClientで復号された処理結果オブジェクト
 * @prop {number} timestamp - cryptoClient処理日時。UNIX時刻
 * @prop {string} result - cryptoClient処理結果。fatal/warning/normal
 * @prop {string} [message] - cryptoClientからのエラーメッセージ。normal時は`undefined`
 * @prop {authRequest} request - 処理要求オブジェクト(authResponse.request)
 * @prop {any} [response] - 要求されたサーバ側関数の戻り値(authResponse.response)。fatal/warning時は`undefined`
 * @prop {Object} sv
 * @prop {number} sv.timestamp - サーバ側処理日時。UNIX時刻
 * @prop {string} sv.result - サーバ側処理結果。fatal/warning/normal
 * @prop {string} [sv.message] - サーバ側からのエラーメッセージ。normal時は`undefined`
 */