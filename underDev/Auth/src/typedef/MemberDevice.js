/**
 * @typedef {Object} MemberDevice - メンバが使用する通信機器の情報(マルチデバイス対応)
 * @prop {string} deviceId - デバイスの識別子。UUID
 * @prop {string} CPkey - メンバの公開鍵
 * @prop {string} CPkeyUpdated - 最新のCPkeyが登録された日時
 * @prop {string} trial - ログイン試行関連情報オブジェクト(MemberTrial[])のJSON文字列
 */