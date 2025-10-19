/**
 * @typedef {Object} Member - メンバ一覧(アカウント管理表)上のメンバ単位の管理情報
 * @prop {string} memberId - メンバの識別子(=メールアドレス)
 * @prop {string} name - メンバの氏名
 * @prop {string} log - メンバの履歴情報(MemberLog)を保持するJSON文字列
 * @prop {string} profile - メンバの属性情報(MemberProfile)を保持するJSON文字列
 * @prop {string} device - マルチデバイス対応のためのデバイス情報(MemberDevice[])を保持するJSON文字列
 * @prop {string} [note] - 当該メンバに対する備考
 */
