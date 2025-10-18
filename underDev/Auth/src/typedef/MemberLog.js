/**
 * @typedef {Object} MemberLog - メンバの各種要求・状態変化の時刻
 * @prop {number} joiningRequest=0 - 加入要求日時。加入要求をサーバ側で受信した日時
 * @prop {number} approval=0 - 加入承認日時。管理者がmemberList上で加入承認処理を行った日時。値設定は加入否認日時と択一
 * @prop {number} denial=0 - 加入否認日時。管理者がmemberList上で加入否認処理を行った日時。値設定は加入承認日時と択一
 * @prop {number} loginRequest=0 - 認証要求日時。未認証メンバからの処理要求をサーバ側で受信した日時
 * @prop {number} loginSuccess=0 - 認証成功日時。未認証メンバの認証要求が成功した最新日時
 * @prop {number} loginExpiration=0 - 認証有効期限。認証成功日時＋認証有効時間
 * @prop {number} loginFailure=0 - 認証失敗日時。未認証メンバの認証要求失敗が確定した最新日時
 * @prop {number} unfreezeLogin=0 - 認証無効期限。認証失敗日時＋認証凍結時間
 * @prop {number} joiningExpiration=0 - 加入有効期限。加入承認日時＋加入有効期間
 * @prop {number} unfreezeDenial=0 - 加入禁止期限。加入否認日時＋加入禁止期間
 */