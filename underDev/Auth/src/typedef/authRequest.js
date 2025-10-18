/**
 * @typedef {Object} authRequest - authClientからauthServerに送られる処理要求オブジェクト
 * @prop {string} memberId - メンバの識別子(=メールアドレス)
 * @prop {string} deviceId - デバイスの識別子
 * @prop {string} requestId - 要求の識別子。UUID
 * @prop {number} timestamp - 要求日時。UNIX時刻
 * @prop {string} func - サーバ側関数名
 * @prop {any[]} arguments - サーバ側関数に渡す引数の配列
 * @prop {string} signature - クライアント側署名
 */