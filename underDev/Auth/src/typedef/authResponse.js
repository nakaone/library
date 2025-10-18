/**
 * @typedef {Object} authResponse - authServerからauthClientに返される処理結果オブジェクト
 * @prop {number} timestamp - サーバ側処理日時。UNIX時刻
 * @prop {string} result - サーバ側処理結果。fatal/warning/normal
 * @prop {string} [message] - サーバ側からのエラーメッセージ。normal時は`undefined`
 * @prop {authRequest} request - 処理要求オブジェクト
 * @prop {any} [response] - 要求されたサーバ側関数の戻り値。fatal/warning時は`undefined`
 */