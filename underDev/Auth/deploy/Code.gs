// 20251220-141556
// ライブラリ関数定義
/** devTools: 開発支援関係メソッド集
 * @class
 * @classdesc 開発支援関係メソッド集
 * @prop {string} id=UUIDv4 - 関数・メソッドの識別子
 * @prop {string} whois='' - 関数名またはクラス名.メソッド名
 * @prop {Object.<string, any>} arg={} - 起動時引数。{変数名：値}形式
 * @prop {Object} v={} - 関数・メソッド内汎用変数
 * @prop {string} stepNo=1 - 関数・メソッド内の現在位置
 * @prop {string[]} log=[] - {string[]} 実行順に並べたdev.stepNo
 * @prop {number} startTime=Date.now() - 開始時刻
 * @prop {number} endTime - 終了時刻
 * @prop {number} elaps - 所要時間(ミリ秒)
 *
 * - 変更履歴
 *   - rev.3.0.0 : 2025/12/19
 *     - 非同期(平行)処理だとグローバル変数dev内でスタックが混乱、step()で別処理のwhoisを表示
 *       ⇒ グローバル変数内スタックでの呼出・被呼出管理を断念、「関数・メソッド内で完結」に方針転換
 *     - 呼出元との関係(スタック)は断念、標準Errorのstack表示を利用
 *     - クロージャ関数 ⇒ クラス化(∵多重呼出による使用メモリ量増大を抑制)
 *   - rev.2.1.1 : 2025/12/18
 *     - error():ブラウザの開発モードでエラー時message以外が出力されないバグを修正
 *     - end():引数があればダンプ出力を追加
 *   - rev.2.1.0 : 2025/12/12
 *     - ES module対応のため、build.sh作成
 *     - 原本をcore.jsからcore.mjsに変更
 *   - rev.2.0.0 : 2025/12/08
 *     - errorメソッドの戻り値を独自エラーオブジェクトに変更
 *     - functionInfoクラスを導入、詳細情報を追加
 *     - オプションを簡素化、出力モードに統合
 *     - 機能を簡素化
 *       - メソッドから削除：changeOption, check
 *       - dump を step に統合
 *     - stringify -> formatObject
 *   - rev.1.0.1 : 2025/07/17
 *     start/endでメッセージ表示を抑止するため、引数"rt(run time option)"を追加
 *   - rev.1.0.0 : 2025/01/26
 *     SpreadDb.1.2.0 test.jsとして作成していたのを分離
 *
 * @example
 * function xxx(o){
 *   const v = {whois:'xxx',arg:{o},rv:null};
 *   const dev = new devTools(v); // 従来のdev.startを代替
 *   try {
 *     dev.step(1);
 *     ...
 *     dev.end(); // 省略可
 *   } catch(e) {
 *     return dev.error(e);
 *   }
 * }
 *
 */
class devTools {

  /** constructor
   * @constructor
   * @param {Object} v={} - 関数・メソッド内汎用変数
   * @param {Object} opt={}
   * @param {string} opt.mode='dev' - 出力モード
   * @param {boolean} opt.footer=false - 実行結果(startTime,endTime,elaps)を出力するならtrue
	 * - 出力モード
	 *   | mode     | エラー | 開始・終了 | dump/step | 用途・備考          |
   *   | :--      | :--:  | :--:     | :--:      | :--               |
	 *   | "none"   | ❌    | ❌        | ❌        | 出力無し(pipe処理等) |
	 *   | "error"  | ⭕    | ❌        | ❌        | エラーのみ出力       |
	 *   | "normal" | ⭕    | ⭕        | ❌        | 本番用              |
	 *   | "dev"    | ⭕    | ⭕        | ⭕        | 開発用              |
   */
  constructor(v={},opt={}){

    // 状態管理変数の初期値設定
		//this.id = self.crypto.randomUUID();
		this.whois = v.whois ?? '';
		this.arg = v.arg ?? {};
    this.v = v ?? {};
		this.stepNo = 1;
		this.log = [];
		this.startTime = new Date();
		this.endTime = 0;
		this.elaps = 0;

    // オプションの既定値設定
    this.opt = {
      mode: opt.mode ?? 'dev',
      footer: opt.footer ?? false,
    };

    // 開始ログ出力
    if( this.opt.mode === 'normal' || this.opt.mode === 'dev' ){
      console.log(`${this.toLocale(this.startTime,'hh:mm:ss.nnn')} ${this.whois} start`);
    }
  }

  /** devToolsError: devTools専用拡張エラークラス */
  static devToolsError(dtObj,...e){
    const rv = new Error(...e);

    // 独自追加項目を個別に設定
    ['whois','arg','stepNo','log','startTime','endTime','elaps','v']
    .forEach(x => rv[x] = dtObj[x] ?? null);

    rv.name = 'devToolsError';
    return rv;
  }

  /** step: 関数内の進捗状況管理＋変数のダンプ
   * @param {number|string} label - dev.start〜end内での位置を特定するマーカー
   * @param {any} [val=null] - ダンプ表示する変数
   * @param {boolean} [cond=true] - 特定条件下でのみダンプ表示したい場合の条件
   * @example 123行目でClassNameが"cryptoClient"の場合のみv.hogeを表示
   *   dev.step(99.123,v.hoge,this.ClassName==='cryptoClient');
   *   ※ 99はデバック、0.123は行番号の意で設定
   */
  step(label, val=null, cond=true){
    this.stepNo = String(label);
    this.log.push(this.stepNo);
    // valが指定されていたらステップ名＋JSON表示
    if( this.opt.mode === 'dev' && val && cond ){
      console.log(`== ${this.whois} step.${label} ${this.formatObject(val)}`);
    }
  }

  /** end: 正常終了時処理
   * @param {any} [arg] - 終了時ダンプする変数
   * @returns {void}
   */
  end(arg){
    // 終了時に確定する項目に値設定
    this.finisher();

    // ログ出力
    if( this.opt.mode === 'normal' || this.opt.mode === 'dev' ){
      let msg = `${this.toLocale(this.endTime,'hh:mm:ss.nnn')} ${this.whois} normal end`;
      // 引数があればダンプ出力
      if( typeof arg !== 'undefined' ) msg += '\n' + this.formatObject(arg)
      // 大本の呼出元ではstart/end/elaps表示
      if( this.opt.footer ){
        msg += '\n' + `\tstart: ${this.toLocale(this.startTime)
        }\n\tend  : ${this.toLocale(this.endTime)
        }\n\telaps: ${this.elaps}`;
      }
      console.log(msg);
    }
  }

  error(e){
    // 終了時に確定する項目に値設定
    this.finisher();
    // エラーログ出力時はISO8601拡張形式
    this.startTime = this.toLocale(this.startTime);
    this.endTime = this.toLocale(this.endTime);

    if( e.name === 'devToolsError' ){
      // 引数がdevToolsError型
      // ⇒ 自関数・メソッドでは無く、呼出先から返されたError
      // ⇒ メッセージを出力せず、そのまま返す
      return e;
    } else {
      // 引数がdevToolsError型ではない
      // ⇒ 自関数・メソッドで発生またはthrowされたError
      // ⇒ メッセージを出力し、devToolsErrorにして情報を付加
      e = devTools.devToolsError(this,e);
      console.error(e.message+'\n'+this.formatObject(e));
      return e;
    }
  }

  /** finisher: end/error共通の終了時処理 */
  finisher(){
    // 終了時に確定する項目に値設定
    if( Array.isArray(this.log) ) this.log = this.log.join(', ');
    this.endTime = new Date();
    this.elaps = `${this.endTime - this.startTime} msec`;
  }

  /** toLocale: ログ出力用時刻文字列整形
   * @param {Date} date - 整形対象Dateオブジェクト
   * @param {string} template - テンプレート
   */
  toLocale(date,template='yyyy-MM-ddThh:mm:ss.nnnZ'){
    const v = {rv:template,dObj:date};
    if( typeof date === 'string' ) return date;

    v.local = { // 地方時ベース
      y: v.dObj.getFullYear(),
      M: v.dObj.getMonth()+1,
      d: v.dObj.getDate(),
      h: v.dObj.getHours(),
      m: v.dObj.getMinutes(),
      s: v.dObj.getSeconds(),
      n: v.dObj.getMilliseconds(),
      Z: Math.abs(v.dObj.getTimezoneOffset())
    }

    // タイムゾーン文字列の作成
    v.local.Z = v.local.Z === 0 ? 'Z'
    : ((v.dObj.getTimezoneOffset() < 0 ? '+' : '-')
    + ('0' + Math.floor(v.local.Z / 60)).slice(-2)
    + ':' + ('0' + (v.local.Z % 60)).slice(-2));

    // 日付文字列作成
    for( v.x in v.local ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.local[v.x]).slice(-v.m[0].length)
          : String(v.local[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }
    return v.rv;
  }

  /** formatObject: オブジェクトの各メンバーを「メンバ名: 値 // データ型」の形式で再帰的に整形する
   * @param {any} obj - 整形対象のオブジェクトまたは配列
   * @param {number} indentLevel - 現在のインデントレベル
   * @returns {string} 整形された文字列
   */
  formatObject(obj, indentLevel = 0) {
    const indent = '  '.repeat(indentLevel); // インデント文字列

    if (obj === null) {
      return `${indent}null // null`;
    }

    const type = typeof obj;

    // プリミティブ型 (number, string, boolean, null, undefined)
    if (type !== 'object' && type !== 'function') {
      // 文字列は二重引用符で囲む
      const value = type === 'string' ? `"${obj}"` : obj;
      return `${indent}${value}, // ${type}`;
    }

    // 関数 (function)
    if (type === 'function') {
      // 関数は文字列化してデータ型を表示しない
      // toLocalISOString の例から、関数の値は引用符なしで表示します
      return `${indent}${obj.toString()},`;
    }

    // オブジェクト型 (Array, Object)

    // Array の場合
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return `${indent}[ /* Array, length 0 */ ], // object`;
      }

      const elements = obj.map(item =>
        // Arrayの要素は名前がないため、インデントと値のみを返す
        this.formatObject(item, indentLevel + 1)
      ).join('\n');

      // Arrayの要素はカンマではなく改行で区切ります
      return `${indent}[\n${elements}\n${indent}], // Array`;
    }

    // 標準の Object の場合
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      return `${indent}{ /* Object, empty */ }, // object`;
    }

    const members = keys.map(key => {
      const value = obj[key];
      const memberType = typeof value;
      const nextIndent = '  '.repeat(indentLevel + 1);

      // オブジェクト/配列/関数は再帰呼び出し
      if (memberType === 'object' && value !== null || memberType === 'function') {
        // 複合型の場合は、キーと値の開始のみを記載
        const formattedValue = this.formatObject(value, indentLevel + 1);
        return `${nextIndent}${key}:${formattedValue}`;
      }

      // プリミティブ型は一行で表示
      const formattedValue = memberType === 'string' ? `"${value}"` : value;
      return `${nextIndent}${key}:${formattedValue}, // ${memberType}`;
    }).join('\n');

    return `${indent}{\n${members}\n${indent}}`;
  }
}

// authServer関係クラス定義
class authServer {

  /**
   * @constructor
   * @param {authConfig} config - authClient/Server共通設定値オブジェクト
   */
  constructor(config={}) {
    const v = {whois:`authServer.constructor`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // config必須項目のチェック
      // -------------------------------------------------------------
      if( !config.hasOwnProperty('func') )
        throw new Error(`Required arguments not specified`);

      // -------------------------------------------------------------
      dev.step(2);  // 設定情報(this.cf)の作成
      // -------------------------------------------------------------
      dev.step(2.1);  // authServer特有の設定項目について既定値を定義
      v.authServerConfig = {
        memberList: 'memberList',
        defaultAuthority: 1,
        memberLifeTime: 31536000000,
        prohibitedToJoin: 259200000,
        loginLifeTime: 86400000,
        loginFreeze: 600000,
        requestIdRetention: 300000,
        errorLog: "errorLog",
        storageDaysOfErrorLog: 604800000,
        auditLog: "auditLog",
        storageDaysOfAuditLog: 604800000,
        func: config.func,
        passcodeLength: 6,
        maxTrial: 3,
        passcodeLifeTime: 600000,
        maxTrialLog: 5,
        udSendPasscode: false,
        udSendInvitation: false,
      };

      dev.step(2.2); // authClient/Server共通設定値に特有項目を追加
      this.cf = new authConfig(config);
      Object.keys(v.authServerConfig).forEach(x => {
        this.cf[x] = config[x] || v.authServerConfig[x];
      })
      dev.step(2.3);  // authServerConfig 必須チェック
      if (!this.cf || !this.cf.memberList)
        throw new Error('invalid authServerConfig: memberList missing');

      // -------------------------------------------------------------
      dev.step(3);  // 暗号化・復号モジュール生成(this.crypto)
      // -------------------------------------------------------------
      this.crypto = cryptoServer.initialize(this.cf);
      if( this.crypto instanceof Error ) throw this.crypto;

      // -------------------------------------------------------------
      dev.step(4);  // memberListシートの準備(this.member)
      // -------------------------------------------------------------
      this.member = new Member();

      // -------------------------------------------------------------
      dev.step(5);  // 監査ログ・エラーログシートの準備(this.audit, this.error)
      // -------------------------------------------------------------
      //this.audit = this.authAuditLog();
      //this.error = this.authErrorLog();

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /** authLogger: 監査ログ／エラーログを自動振り分けで出力
   * - 監査ログ：authAuditLog型
   * - エラーログ：authErrorLog型
   * @param {authResponse} response
   * @returns {authResponse}
   */
  authLogger(response) {
    const v = { whois: `${this.constructor.name}.authLogger`, arg: { response }, rv: null };
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // ログ種別判定（normal / warning / fatal）
      // -------------------------------------------------------------
      let level = 'normal';
      if (response.status instanceof Error) {
        level = 'fatal';
      } else if (typeof response.status === 'string' && response.status !== 'success') {
        level = 'warning';
      }

      // -------------------------------------------------------------
      dev.step(2); // 出力先シート名決定
      // -------------------------------------------------------------
      const sheetName =
        level === 'fatal'
          ? this.cf.errorLog
          : this.cf.auditLog;

      const retentionMs =
        level === 'fatal'
          ? this.cf.storageDaysOfErrorLog
          : this.cf.storageDaysOfAuditLog;

      const ss = SpreadsheetApp.getActive();
      let sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        sheet.appendRow(
          level === 'fatal'
            ? ['timestamp', 'memberId', 'deviceId', 'result', 'message', 'stack']
            : ['timestamp', 'duration', 'memberId', 'deviceId', 'func', 'result', 'note']
        );
      }

      // -------------------------------------------------------------
      dev.step(3); // ローテーション（保存期限超過行の削除）
      // -------------------------------------------------------------
      if (retentionMs) {
        const now = Date.now();
        const lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
          for (let i = values.length - 1; i >= 0; i--) {
            const t = new Date(values[i][0]).getTime();
            if (!isNaN(t) && now - t > retentionMs) {
              sheet.deleteRow(i + 2);
            }
          }
        }
      }

      // -------------------------------------------------------------
      dev.step(4); // duration / timestamp 算出
      // -------------------------------------------------------------
      response.responseTime = Date.now();
      const duration = response.responseTime - response.receptTime;
      const timestamp = new Date(response.receptTime).toISOString();

      // -------------------------------------------------------------
      dev.step(5); // ログ出力
      // -------------------------------------------------------------
      if (level === 'fatal') {
        sheet.appendRow([
          timestamp,
          response.memberId,
          response.deviceId,
          'fatal',
          response.message,
          response.status?.stack,
        ]);

        // 管理者通知フック（必要なら）
        // MailApp.sendEmail(this.cf.adminMail, 'auth fatal error', response.message);

      } else {
        sheet.appendRow([
          timestamp,
          duration,
          response.memberId,
          response.deviceId,
          response.func,
          level,
          response.message || '',
        ]);
      }

      dev.end();
      return response;

    } catch (e) {
      return dev.error(e);
    }
  }

  /** authResponse: authResponse型のオブジェクトを作成
   * @param {authRequest} request - 処理要求オブジェクト
   * @returns {authResponse}
   */
  authResponse(request){
    return {
      memberId: request.memberId,
      deviceId: request.deviceId,
      memberName: request.memberName,
      CPkeySign: request.CPkeySign,
      requestTime: request.requestTime,
      func: request.func,
      arg: request.arg,
      nonce: request.nonce,

      SPkeySign: this.keys.SPkeySign,
      response: null,
      receptTime: Date.now(),
      responseTime: 0,
      status: 'success',
      message: '',
      // メンバ"decrypt"はクライアント側で付加
    }
  }

  /** exec: 処理要求に対するサーバ側中核処理
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  exec(arg) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1.1);  // request存在・最低限チェック
      if( !arg ) throw new Error('invalid request: empty body');
      dev.step(1.2);  // 処理要求を復号
      v.request = this.crypto.decrypt(arg);
      if( v.request instanceof Error ) throw v.request;
      dev.step(1.3);  // // request.func チェック
      if (!v.request || !v.request.func)
        throw new Error('invalid request: func missing');

      if( v.request.func === '::initial::' ){
        dev.step(2);  // 初回HTMLロード時(SPkey取得要求)の場合
        // ⇒ Member.setMember: 指定メンバ情報をmemberListシートに保存。戻り値はauthResponse型
        v.response = this.member.setMember(v.request);
        if( v.response instanceof Error ) throw v.response;
      } else {
        if( /^::[A-Za-z0-9_]+::$/.test(v.request.func) ){
          dev.step(3);  // 内発処理の要求
          // ⇒ 要求の種類毎に分岐。戻り値はauthResponse型に統一
        } else {
          dev.step(4);  // 一般的処理要求(非内発処理)

          // 該当のメンバ情報を取得
          // メンバ・デバイスの状態・権限確認
          // if 状態・権限OK
            // サーバ側関数を実行、結果をauthResponseに組み込み
          // else 状態・権限NG
            // 状態・権限によりv.responseに値設定
        }
      }

      dev.step(5);  // 処理結果を監査／エラーログに出力
      this.authLogger(v.response);

      dev.step(6);  // encryptedResponseの作成
      v.rv = this.crypto.encrypt(v.response);

      dev.step(6);  // encryptedResponseの作成
      v.rv = this.crypto.encrypt(v.response);
      if( v.rv instanceof Error ) throw v.rv;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** setupEnvironment: 初回実行時に必要なOAuth権限を一括取得
   * - 管理者が Spread メニューから手動実行する
   * @param {void}
   * @returns {null}
   */
  static setupEnvironment() {
    const v = {whois:`${this.constructor.name}.setupEnvironment`, arg: {}, rv: null };
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // Spreadsheet 権限
      // -------------------------------------------------------------
      const ss = SpreadsheetApp.getActive();
      const sheet = ss.getActiveSheet();
      sheet.getActiveCell().getValue();

      // -------------------------------------------------------------
      dev.step(2); // PropertiesService 権限
      // -------------------------------------------------------------
      const prop = PropertiesService.getScriptProperties();
      prop.getProperty('dummy');
      prop.setProperty('dummy', Date.now());

      // -------------------------------------------------------------
      dev.step(3); // Utilities / UUID
      // -------------------------------------------------------------
      Utilities.getUuid();

      // -------------------------------------------------------------
      dev.step(4); // Mail 権限（空メール or テスト通知）
      // -------------------------------------------------------------
      if (this.cf.adminMail) {
        MailApp.sendEmail({
          to: this.cf.adminMail,
          subject: '[authServer] OAuth test',
          body: 'OAuth authorization test: ' + new Date().toISOString(),
          noReply: true
        });
      }

      // -------------------------------------------------------------
      dev.step(5); // LockService（将来用）
      // -------------------------------------------------------------
      LockService.getScriptLock().tryLock(1);

      dev.end();
      return null;

    } catch (e) { return dev.error(e); }
  }

  /**
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  prototype(arg) {
    const v = {whois:`${this.constructor.name}.prototype`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}
class cryptoServer {

  /** constructor
   * @constructor
   * @param {authServerConfig} cf - authServer設定値
   */
  constructor(cf) {
    const v = {whois:`cryptoServer.constructor`, arg:{cf}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1); // authServer設定情報をメンバに格納
      this.cf = cf;

      dev.step(2); // ScriptPropertiesの内容を読み込み
      this.keys = {};
      this.keyList = [  // ScriptProperties保存項目の内、通常使用する項目のリスト
        'keyGeneratedDateTime',
        'SSkeySign',
        'SPkeySign',
        'SSkeyEnc',
        'SPkeyEnc',
        'requestLog',
      ];
      this.prop = PropertiesService.getScriptProperties();
      this.keyList.forEach(key => {
        this.keys[key] = v.prop.getProperty(key) || null;
      })

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /**
   * PEM文字列 → ArrayBuffer
   * @param {string} pem - PEM形式鍵
   * @returns {ArrayBuffer}
   */
  pemToArrayBuffer(pem) {
    const base64 = pem
      .replace(/-----BEGIN [^-]+-----/, "")
      .replace(/-----END [^-]+-----/, "")
      .replace(/\s+/g, "");

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
  }

  /**
   * ArrayBuffer → PEM文字列
   * @param {ArrayBuffer} buffer
   * @param {"PUBLIC KEY"|"PRIVATE KEY"} type
   * @returns {string}
   */
  arrayBufferToPem(buffer, type) {
    const bytes = new Uint8Array(buffer);
    let binary = "";

    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    const base64 = btoa(binary);
    const lines = base64.match(/.{1,64}/g).join("\n");

    return `-----BEGIN ${type}-----\n${lines}\n-----END ${type}-----`;
  }

  /** encrypt: 処理結果を暗号化＋署名
   * @param {authResponse} response - 処理結果
   * @param {string} CPkeySign - クライアント側署名用公開鍵
   * @returns {encryptedResponse}
   */
  async encrypt(response, CPkeySign) {
    const v = {whois:`${this.constructor.name}.encrypt`, arg:{response,CPkeySign}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1); // payload UTF-8化
      const payloadBytes =
        new TextEncoder().encode(JSON.stringify(response));

      dev.step(2); // サーバ署名用秘密鍵 import
      const SSkeySign = await crypto.subtle.importKey(
        "pkcs8",
        this.pemToArrayBuffer(this.keys.SSkeySign),
        { name: "RSA-PSS", hash: "SHA-256" },
        false,
        ["sign"]
      );

      dev.step(3); // 署名
      const signature = await crypto.subtle.sign(
        { name: "RSA-PSS", saltLength: 32 },
        SSkeySign,
        payloadBytes
      );

      dev.step(4); // AES鍵生成
      const aesKey = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
      );

      dev.step(5); // IV生成
      const iv = crypto.getRandomValues(new Uint8Array(12));

      dev.step(6); // payload暗号化
      const cipher = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        payloadBytes
      );

      dev.step(7); // クライアント暗号化用公開鍵 import
      const CPkeyEnc = await crypto.subtle.importKey(
        "spki",
        this.pemToArrayBuffer(CPkeySign),
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
      );

      dev.step(8); // AES鍵をRSA-OAEPで暗号化
      const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);
      const encryptedKey = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        CPkeyEnc,
        rawAesKey
      );

      dev.step(9); // 戻り値作成
      v.rv = {
        cipher: btoa(String.fromCharCode(...new Uint8Array(cipher))),
        encryptedKey: btoa(String.fromCharCode(...new Uint8Array(encryptedKey))),
        iv: btoa(String.fromCharCode(...iv)),
        signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
        meta: {
          rsabits: this.cf.RSAbits,
          sym: "AES-256-GCM"
        }
      };

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** decrypt: 暗号化された処理要求を復号・署名検証
   * @param {encryptedRequest} request - 暗号化されたサーバ側処理結果
   * @param {string} CPkeySign - クライアント側署名用公開鍵
   * @returns {authRequest}
   */
  async decrypt(request, CPkeySign) {
    const v = {whois:`${this.constructor.name}.decrypt`, arg:{request,CPkeySign}, rv:null};
    const dev = new devTools(v);
    try {

      if (request.meta.signOnly === true) {

        // ===== signOnly 判定 =====
        dev.step(1.1); // payload復元
        const payloadBytes = Uint8Array.from(
          atob(request.payload),
          c => c.charCodeAt(0)
        );

        dev.step(1.2); // signature復元
        const signature = Uint8Array.from(
          atob(request.signature),
          c => c.charCodeAt(0)
        );

        dev.step(1.3); // 署名検証
        const ok = await crypto.subtle.verify(
          { name: "RSA-PSS", saltLength: 32 },
          CPkeySign,
          signature,
          payloadBytes
        );

        if (!ok) throw new Error("Signature verification failed (signOnly)");

        dev.step(1.4); // JSON復元
        v.rv = JSON.parse(new TextDecoder().decode(payloadBytes));

      } else {
        // ===== 通常（暗号化＋署名） =====

        dev.step(2.1); // Base64復元
        const cipher = Uint8Array.from(atob(request.cipher), c => c.charCodeAt(0));
        const encryptedKey = Uint8Array.from(atob(request.encryptedKey), c => c.charCodeAt(0));
        const iv = Uint8Array.from(atob(request.iv), c => c.charCodeAt(0));
        const signature = Uint8Array.from(atob(request.signature), c => c.charCodeAt(0));

        dev.step(2.2); // サーバ秘密鍵（復号用）import
        const SSkeyEnc = await crypto.subtle.importKey(
          "pkcs8",
          this.pemToArrayBuffer(this.keys.SSkeyEnc),
          { name: "RSA-OAEP", hash: "SHA-256" },
          false,
          ["decrypt"]
        );

        dev.step(2.3); // AES鍵復号
        const rawKey = await crypto.subtle.decrypt(
          { name: "RSA-OAEP" },
          SSkeyEnc,
          encryptedKey
        );

        const aesKey = await crypto.subtle.importKey(
          "raw",
          rawKey,
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        );

        dev.step(2.4); // payload復号
        const plain = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv },
          aesKey,
          cipher
        );

        dev.step(2.5); // クライアント署名用公開鍵 import
        const CPkey = await crypto.subtle.importKey(
          "spki",
          this.pemToArrayBuffer(CPkeySign),
          { name: "RSA-PSS", hash: "SHA-256" },
          false,
          ["verify"]
        );

        dev.step(2.6); // 署名検証
        const ok = await crypto.subtle.verify(
          { name: "RSA-PSS", saltLength: 32 },
          CPkey,
          signature,
          plain
        );

        if (!ok) throw new Error("Signature verification failed");

        dev.step(2.7); // JSON復元
        v.rv = JSON.parse(new TextDecoder().decode(plain));

      }

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** generateKeys: PEM形式のRSA鍵ペアを生成
   * - 生成のみ、ScriptPropertiesやメンバ変数への格納は行わない
   * @param {void}
   * @returns {Object} 生成された鍵ペア
   */
  async generateKeys() {
    const v = {whois:`${this.constructor.name}.generateKeys`, arg:{}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1); // 署名用
      const signKeys = await crypto.subtle.generateKey({
        name: "RSA-PSS",
        modulusLength: this.cf.RSAbits,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      }, true, ["sign", "verify"]);

      dev.step(2); // 暗号化用
      const encKeys = await crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: this.cf.RSAbits,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      }, true, ["encrypt", "decrypt"]);

      dev.step(3); // PEM変換
      v.rv = {
        SSkeySign: this.arrayBufferToPem(
          await crypto.subtle.exportKey("pkcs8", signKeys.privateKey),
          "PRIVATE KEY"
        ),
        SPkeySign: this.arrayBufferToPem(
          await crypto.subtle.exportKey("spki", signKeys.publicKey),
          "PUBLIC KEY"
        ),
        SSkeyEnc: this.arrayBufferToPem(
          await crypto.subtle.exportKey("pkcs8", encKeys.privateKey),
          "PRIVATE KEY"
        ),
        SPkeyEnc: this.arrayBufferToPem(
          await crypto.subtle.exportKey("spki", encKeys.publicKey),
          "PUBLIC KEY"
        ),
        keyGeneratedDateTime: Date.now()
      };

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** initialize: cryptoServerインスタンス作成
   * - インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
   * - staticではない一般のメンバへの値セットができないため別途constructorを呼び出す
   * @static
   * @param {authServerConfig} cf - authServer設定値
   * @returns {cryptoServer|Error}
   */
  static async initialize(config) {
    const v = {whois:`authClient.initialize`, arg:{config}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1);  // インスタンス生成
      // オプション既定値を先にメンバ変数に格納するため、constructorを先行
      v.rv = new cryptoServer(config);

      dev.step(2);  // SPkeySign未生成なら鍵ペアを生成
      if( v.rv.keys.SPkeySign === null ){

        dev.step(2.1);  // 鍵ペアを生成
        v.keys = await v.rv.generateKeys();
        if( v.keys instanceof Error ) throw v.keys;

        dev.step(2.2);  // requestLogは初期値(空配列)とする
        v.keys.requestLog = JSON.stringify([]);

        dev.step(2.3);  // ScriptPropertiesに保存
        v.rv.keyList.forEach(key => {
          v.rv.prop.setProperty(key,v.keys[key]);
        });

      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}
class Member {

  /** constructor: 該当メンバのMemberインスタンス作成
   * - 新規メンバ(SPkey要求時)は新規作成
   * @constructor
   * @param {authServerConfig} config - authServerの設定値
   * @param {authRequest} request - 処理要求
   */
  constructor(config,request) {
    const v = {whois:`Member.constructor`, arg:{request}, rv:null};
    const dev = new devTools(v);
    try {

      this.cf = config; // authServer設定値をメンバとして格納

      // -------------------------------------------------------------
      dev.step(1);  // memberListシートの準備
      // -------------------------------------------------------------

      dev.step(1.1);  // シートの取得
      v.spread = SpreadsheetApp.getActive();
      v.sheet = v.spread.getSheetByName(this.cf.memberList);

      // memberListシートが存在しなければシートを新規作成
      if( !v.sheet ){

        dev.step(1.2);  // シートを追加
        v.sheet = v.spread.insertSheet(this.cf.memberList);

        dev.step(1.3);  // シート上の項目定義
        v.colsDef = [
          {name:'memberId',type:'string',desc:'メンバの識別子',note:'メールアドレス',default:'UUIDv4'},
          {name:'name',type:'string',desc:'メンバの氏名',note:'',default:'"dummy"'},
          {name:'status',type:'string',desc:'メンバの状態',note:'未加入,未審査,審査済,加入中,加入禁止',default:'"未加入"'},
          {name:'log',type:'MemberLog',desc:'メンバの履歴情報',note:'シート上はJSON文字列',default:'new MemberLog()'},
          {name:'profile',type:'MemberProfile',desc:'メンバの属性情報',note:'シート上はJSON文字列',default:'new MemberProfile()'},
          {name:'device',type:'[MemberDevice](MemberDevice.md#memberdevice_members)[]',desc:'デバイス情報',note:'マルチデバイス対応のため配列。シート上はJSON文字列',default:'空配列'},
          {name:'note',type:'string',desc:'当該メンバに対する備考',note:'',default:'空文字列'},
        ];

        dev.step(1.4);  // 項目名のセット
        v.label = v.colsDef.map(x => x.name);
        v.sheet.appendRow(v.label);

        dev.step(1.5);  // メモのセット
        v.notes = v.colsDef.map(x => x.desc + (x.note ? `\n${x.note}` : ''));
        v.notes.forEach((h,i)=>{
          v.sheet.getRange(1,i+1).setNote(h);
        })
      }

      // -------------------------------------------------------------
      dev.step(2);  // 対象メンバ・デバイスの特定
      // -------------------------------------------------------------

      dev.step(2.1); // memberId で検索
      v.values = v.sheet.getDataRange().getValues();
      v.labels = v.values.shift();

      v.idx = v.labels.indexOf('memberId');
      v.row = v.values.find(r => r[v.idx] === request.memberId);

      if (v.row) {  // シート上にmemberId有り

        // ---------------------------------------------------------
        dev.step(2.2); // 既存メンバ
        // ---------------------------------------------------------
        v.obj = {};
        v.labels.forEach((k, i) => v.obj[k] = v.row[i]);

        this.memberId = v.obj.memberId;
        this.name     = v.obj.name;
        this.status   = v.obj.status;
        this.log      = JSON.parse(v.obj.log || '{}');
        this.profile  = JSON.parse(v.obj.profile || '{}');
        this.device   = JSON.parse(v.obj.device || '{}');
        this.note     = v.obj.note || '';

        // ---------------------------------------------------------
        dev.step(2.3); // デバイス確認
        // ---------------------------------------------------------
        if (!this.device.hasOwnProperty(request.deviceId)) {

          dev.step(2.4); // 未登録デバイス
          v.device = this.MemberDevice();
          this.device[v.device.deviceId] = v.device;
        }

      } else {  // シート上にmemberId無し

        // ---------------------------------------------------------
        dev.step(2.5); // 未登録メンバ
        // ---------------------------------------------------------
        if (request.func === '::initial::') {
          // HTML初回ロード時(SPkey要求)

          dev.step(2.6); // 仮登録
          this.memberId = 'dummyMemberID';
          this.name     = 'dummyMemberName';
          this.status   = 'TR';
          this.log      = this.MemberLog();
          this.profile  = this.MemberProfile();
          this.device   = {};

          v.device = this.MemberDevice();
          this.device[v.device.deviceId] = v.device;

          this.note = '';

        } else {

          // -----------------------------------------------------
          dev.step(2.7); // 不正要求
          // -----------------------------------------------------
          throw new Error('unregistered member access');
        }
      }

      v.rv = this;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** addTrial: 新しい試行を登録し、メンバにパスコード通知メールを発信
   * @param {authRequest} request - 処理要求
   * @returns {authResponse|Error}
   */
  addTrial(arg) {
    const v = {whois:`${this.constructor.name}.addTrial`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      const req = arg;
      const member = this.getMember(req.memberId);
      if (member instanceof Error) {
        v.rv = member;
        return v.rv;
      }

      const devIdx = member.device.findIndex(d=>d.deviceId===req.deviceId);
      if (devIdx === -1 || member.device[devIdx].status !== '未認証') {
        v.rv = dev.error('invalid status');
        return v.rv;
      }

      const trial = new MemberTrial(this.cf.passcodeLength);
      member.device[devIdx].trial.unshift(trial);
      member.log.loginRequest = Date.now();

      if (member.device[devIdx].trial.length > this.cf.maxTrialLog) {
        member.device[devIdx].trial.pop();
      }

      this.setMember(member);

      if (!this.cf.udSendPasscode) {
        sendmail(member.memberId, '認証コード通知', `パスコード: ${trial.passcode}`);
      }

      v.rv = member;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** checkPasscode: 認証時のパスコードチェック
   * 入力されたパスコードをチェック、Member内部の各種メンバの値を更新
   * @param {authRequest} request - 処理要求
   * @returns {authResponse|Error}
   */
  checkPasscode(arg) {
    const v = {whois:`${this.constructor.name}.checkPasscode`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      const req = arg;
      if (req.func !== '::passcode::' || !req.arg?.[0]) {
        v.rv = dev.error('invalid request');
        return v.rv;
      }

      const member = this.getMember(req.memberId);
      if (member instanceof Error) {
        v.rv = member;
        return v.rv;
      }

      const devObj = member.device.find(d=>d.deviceId===req.deviceId);
      if (!devObj || devObj.status !== '試行中') {
        v.rv = dev.error('invalid status');
        return v.rv;
      }

      const trial = devObj.trial[0];
      const entered = req.arg[0];
      const ok = trial.passcode === entered;

      trial.log.unshift(new MemberTrialLog(entered, ok));

      if (ok) {
        devObj.status = '認証中';
        member.log.loginSuccess = Date.now();
        member.log.loginExpiration = Date.now() + this.cf.loginLifeTime;
      } else if (trial.log.length >= this.cf.maxTrial) {
        devObj.status = '凍結中';
        member.log.loginFailure = Date.now();
        member.log.unfreezeLogin = Date.now() + this.cf.loginFreeze;
      }

      this.setMember(member);
      v.rv = member;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** getMember: 指定メンバの情報をmemberListシートから取得
   * @param {string} memberId - ユーザ識別子(メールアドレス)
   * @returns {Member|Error}  いまここ：元は"authResponse"だったが、"Member"の方がベター？
   */
  getMember(arg) {
    const v = {whois:`${this.constructor.name}.getMember`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      const memberId = arg;
      const sheet = SpreadsheetApp.getActive().getSheetByName(this.cf.memberList);
      const rows = sheet.getDataRange().getValues();

      const idx = rows.findIndex((r,i)=>i>0 && r[0]===memberId);
      if (idx < 0) {
        v.rv = dev.error('not exists');
        return v.rv;
      }

      const r = rows[idx];
      const m = new Member(this.cf);
      [m.memberId,m.name,m.status] = r;
      m.log = JSON.parse(r[3]);
      m.profile = JSON.parse(r[4]);
      m.device = JSON.parse(r[5]);
      m.note = r[6];

      v.rv = m;


      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** judgeMember: 加入審査画面から審査結果入力＋結果通知
   * 加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知
   * memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static judgeMember(arg) {
    const v = {whois:`${this.constructor.name}.judgeMember`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      const memberId = arg;
      const m = new Member(this.cf).getMember(memberId);
      if (m instanceof Error) {
        v.rv = m;
        return v.rv;
      }
      if (m.status !== '未審査') {
        v.rv = 'not unexamined';
        return v.rv;
      }

      const ui = SpreadsheetApp.getUi();
      const res = ui.alert(
        `加入審査: ${m.memberId}`,
        '承認しますか？',
        ui.ButtonSet.YES_NO_CANCEL
      );

      if (res === ui.Button.CANCEL) {
        v.rv = 'examin canceled';
        return v.rv;
      }

      const now = Date.now();
      if (res === ui.Button.YES) {
        m.status = '加入中';
        m.log.approval = now;
        m.log.joiningExpiration = now + this.cf.memberLifeTime;
      } else {
        m.status = '加入禁止';
        m.log.denial = now;
        m.log.unfreezeDenial = now + this.cf.prohibitedToJoin;
      }

      new Member(this.cf).setMember(m);
      v.rv = m;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** judgeStatus: 指定メンバ・デバイスの状態を状態決定表により判定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  judgeStatus(arg) {
    const v = {whois:`${this.constructor.name}.judgeStatus`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /**
   * MemberDevice: デバイス情報の初期オブジェクト生成
   * @returns {MemberDevice}
   */
  MemberDevice() {
    const v = { whois: 'Member.MemberDevice', arg: {}, rv: null };
    const dev = new devTools(v);
    try {

      v.rv = {
        deviceId: Utilities.getUuid(),
        status: 'UC',             // uncertified
        CPkeySign: '',
        CPkeyEnc: '',
        CPkeyUpdated: Date.now(),
        trial: [],
      };

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /**
   * MemberLog: メンバ履歴情報初期化
   * @returns {MemberLog}
   */
  MemberLog() {
    const v = { whois: 'Member.MemberLog', arg: {}, rv: null };
    const dev = new devTools(v);
    try {

      const now = Date.now();
      v.rv = {
        joiningRequest: now,
        approval: 0,
        denial: 0,
        loginRequest: 0,
        loginSuccess: 0,
        loginExpiration: 0,
        loginFailure: 0,
        unfreezeLogin: 0,
        joiningExpiration: 0,
        unfreezeDenial: 0,
      };

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /**
   * MemberProfile: メンバ属性情報初期化
   * @returns {MemberProfile}
   */
  MemberProfile() {
    const v = { whois: 'Member.MemberProfile', arg: {}, rv: null };
    const dev = new devTools(v);
    try {

      v.rv = {
        authority: 0,
      };

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** reissuePasscode: パスコードを再発行する
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  reissuePasscode(arg) {
    const v = {whois:`${this.constructor.name}.reissuePasscode`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** removeMember: 登録中メンバをアカウント削除、または加入禁止にする
   * - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static removeMember(arg) {
    const v = {whois:`${this.constructor.name}.removeMember`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** restoreMember: 加入禁止(論理削除)されているメンバを復活させる
   * - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static restoreMember(arg) {
    const v = {whois:`${this.constructor.name}.restoreMember`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** setMember: 指定メンバ情報をmemberListシートに保存
   * - 登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  setMember(arg) {
    const v = {whois:`${this.constructor.name}.setMember`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      const m = arg;
      const sheet = SpreadsheetApp.getActive().getSheetByName(this.cf.memberList);
      const rows = sheet.getDataRange().getValues();
      const idx = rows.findIndex((r,i)=>i>0 && r[0]===m.memberId);

      const row = [
        m.memberId,
        m.name,
        m.status,
        JSON.stringify(m.log),
        JSON.stringify(m.profile),
        JSON.stringify(m.device),
        m.note
      ];

      if (idx < 0) sheet.appendRow(row);
      else sheet.getRange(idx+1,1,1,row.length).setValues([row]);

      v.rv = null;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** unfreeze: 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除
   * - 引数でmemberIdが指定されなかった場合、凍結中デバイス一覧の要求と看做す
   * - deviceIdの指定が無い場合、memberIdが使用する凍結中デバイス全てを対象とする
   * - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static unfreeze(arg) {
    const v = {whois:`${this.constructor.name}.unfreeze`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** updateCPkey: 対象メンバ・デバイスの公開鍵を更新
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  updateCPkey(arg) {
    const v = {whois:`${this.constructor.name}.updateCPkey`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}

// グローバル変数定義
const asv = authServer({
  adminMail: 'ena.kaon@gmail.com',
  adminName: 'あどみ',
  func: {
    svTest: m => {serverFunc(...m)},
  }
});

// テスト用サーバ側関数
function serverFunc(arg){
  const v = {whois:`serverFunc`, arg:{arg}, rv:null};
  dev.start(v);
  try {
    console.log(`${v.whois}: arg=${JSON.stringify(arg,null,2)}`);
    return true;
  } catch (e) { return dev.error(e); }
}

// Webアプリ定義
function doPost(e) {
  const rv = asv.exec(e.postData.contents); // 受け取った本文(文字列)
  if( rv !== null ){ // fatal(無応答)の場合はnullを返す
    return ContentService
      .createTextOutput(rv);
  }
}

// スプレッドシートメニュー定義
const ui = SpreadsheetApp.getUi();
ui.createMenu('追加したメニュー')
  .addItem('加入認否入力', 'menu10')
  .addSeparator()
  .addSubMenu(ui.createMenu("システム関係")
    .addItem('実行環境の初期化', 'menu21')
    .addItem("【緊急】鍵ペアの更新", "menu22")
  )
  .addToUi();
const menu10 = () => asv.listNotYetDecided();
const menu21 = () => asv.setupEnvironment();
const menu22 = () => asv.resetSPkey();
