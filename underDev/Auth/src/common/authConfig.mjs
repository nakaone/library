export class authConfig {

  /**
   * @constructor
   * @param {authConfig} config - 設定情報(既定値からの変更部分)
   */
  constructor(arg) {
    const v = {whois:`authConfig.constructor`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1); // メンバの値設定
      this.systemName = arg.systemName || 'Auth'; // {string} システム名
      if( arg.hasOwnProperty('adminMail') ){
        this.adminMail = arg.adminMail;	// {string} 管理者のメールアドレス
      } else {
        throw new Error('"adminMail" is not specified.');
      }
      if( arg.hasOwnProperty('adminName') ){
        this.adminName = arg.adminName;	// {string} 管理者氏名
      } else {
        throw new Error('"adminName" is not specified.');
      }
      this.allowableTimeDifference = arg.allowableTimeDifference || 120000;
      // {number}	クライアント・サーバ間通信時の許容時差	既定値は2分
      this.RSAbits = arg.RSAbits || 2048;	// {number} 鍵ペアの鍵長
      this.underDev = {};	// {Object} テスト時の設定
      this.underDev.isTest = // {boolean} 開発モードならtrue
      ( arg.hasOwnProperty('underDev')
      && arg.underDev.hasOwnProperty('isTest') )
      ? arg.underDev.isTest : false;

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /** sanitizeArg: プリミティブ型のみで構成されるよう無毒化
   * @param {*} value - チェック対象の変数
   * @param {string} path='$' - エラーメッセージ用にオブジェクト内の階層を保持
   * @returns 
   */
  sanitizeArg(value, path = '$') {
    if( value === null ||
      typeof value === 'string' ||
      (typeof value === 'number' && Number.isFinite(value)) ||
      typeof value === 'boolean'
    ) return value;

    if (Array.isArray(value)) {
      return value.map((v, i) => this.sanitizeArg(v, `${path}[${i}]`));
    }

    if (typeof value === 'object') {
      // 明示的に禁止したい型
      if (
        value instanceof CryptoKey ||
        value instanceof Date ||
        value instanceof Error ||
        value instanceof Map ||
        value instanceof Set
      ) {
        throw new Error(`Unsupported argument type at ${path}`);
      }

      const obj = {};
      for (const [k, v] of Object.entries(value)) {
        if (typeof v === 'function') {
          throw new Error(`Function not allowed in arg at ${path}.${k}`);
        }
        obj[k] = this.sanitizeArg(v, `${path}.${k}`);
      }
      return obj;
    }

    throw new Error(`Unsupported value type at ${path}`);
  }
}