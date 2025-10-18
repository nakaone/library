/**
 * @typedef {Object} authRequestLog - 重複チェック用のリクエスト履歴。ScriptPropertiesに保存
 * @prop {number} [timestamp=1760757925412] - リクエストを受けたサーバ側日時
 * @prop {string} requestId - クライアント側で採番されたリクエスト識別子。UUID
 */