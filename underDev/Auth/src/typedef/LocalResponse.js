/**
 * @typedef {Object} LocalResponse - authClientからクライアント側関数に返される処理結果オブジェクト
 * @prop {string} result - 処理結果。fatal/warning/normal
 * @prop {string} [message] - エラーメッセージ。normal時は`undefined`。
 * @prop {any} [response] - 要求された関数の戻り値。fatal/warning時は`undefined`。`JSON.parse(authResponse.response)`
 */