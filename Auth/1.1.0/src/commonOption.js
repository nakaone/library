const commonOption = {
  tokenExpiry: 600000,  //(10分) トークンの有効期間(ミリ秒)
  passcodeDigit: 6, //  パスコードの桁数
  passcodeExpiry: 600000, // (10分) パスコードの有効期間(ミリ秒)
  maxTrial: 3, //パスコード入力の最大試行回数
  validityExpiry: 86400000, // (1日) ログイン有効期間(ミリ秒)
  maxDevices: 5,  // 単一アカウントで使用可能なデバイスの最大数
  freezing: 3600000,  // 連続失敗した場合の凍結期間。ミリ秒。既定値1時間
  bits: 2048, // RSA鍵ペアの鍵長
  adminMail: null,  // 管理者のメールアドレス
  adminName: null, //管理者名
}