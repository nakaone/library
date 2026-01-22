import { mergeDeeply } from "../../../../mergeDeeply/2.0.0/core.mjs";

/** authServer: サーバ側中核クラス
 * @class
 * @classdesc サーバ側中核クラス
 * @prop {authServerConfig} cf - authServer設定項目
 * @prop {cryptoServer} cryptoLib - 暗号化・署名検証
 */
export class authServer {

  /**
   * @constructor
   * @param {authConfig} config - authClient/Server共通設定値オブジェクト
   */
  constructor(config={}) {
    const v = {whois:`authServer.constructor`, arg:{config}, rv:null};
    const dev = new devTools(v);
    // -------------------------------------------------------------
    // authServer専用設定値・データ型(Schema)定義
    //   ※authClient/Server共用はauthConfigクラスで定義
    // -------------------------------------------------------------
    // Schemaクラスの指定項目＋authClient専用データ型定義
    v.schema = {
      types: {
        /** authAuditLog: authServerの監査ログをシートに出力
         * @typedef {Object} authAuditLog - authServerの監査ログをシートに出力
         * @prop {number} timestamp=Date.now() - 要求日時ISO8601拡張形式の文字列
         * @prop {number} duration - 処理時間ミリ秒単位
         * @prop {string} memberId - メンバの識別子メールアドレス
         * @prop {string} [deviceId] - デバイスの識別子
         * @prop {string} func - サーバ側関数名
         * @prop {string} result=success - サーバ側処理結果
         * @prop {string} note - 備考
         */
        authAuditLog: {desc: 'authServerの監査ログ',
          cols: [
            {name:'timestamp',type:'datetime',desc:'要求日時',default:'Date.now()',note:'ISO8601拡張形式'},
            {name:'duration',type:'number',desc:'処理時間(ms)'},
            {name:'memberId',type:'string',desc:'メンバ識別子(メール)'},
            {name:'deviceId',type:'string',desc:'デバイス識別子(UUIDv4)',nullable:true },
            {name:'func',type:'string',desc:'サーバ関数名'},
            {name:'result',type:'string',desc:'処理結果',default:'success'},
            {name:'note',type:'string',desc:'備考',nullable:true },
          ],
        },
        /** authErrorLog: authServerのエラーログをシートに出力
         * @typedef {Object} authErrorLog - authServerのエラーログをシートに出力
         * @prop {string} timestamp=Date.now() - 要求日時ISO8601拡張形式の文字列
         * @prop {string} memberId - メンバの識別子
         * @prop {string} deviceId - デバイスの識別子
         * @prop {string} result=fatal - サーバ側処理結果fatal/warning/normal
         * @prop {string} [message] - サーバ側からのエラーメッセージnormal時はundefined
         * @prop {string} [stack] - エラー発生時のスタックトレース本項目は管理者への通知メール等、シート以外には出力不可
         */
        authErrorLog: {desc: 'authServerのエラーログ',
          cols: [
            {name:'timestamp',type:'datetime',default:'Date.now()'},
            {name:'memberId',type:'string'},
            {name:'deviceId',type:'string'},
            {name:'result',type:'string',default:'fatal',note:'fatal/warning/normal'},
            {name:'message',type:'string',nullable:true },
            {name:'stack',type:'string',nullable:true,note:'管理者通知専用'},
          ],
        },
        /** authRequestLog: 重複チェック用のリクエスト履歴
         * @typedef {Object[]} authRequestLog - 重複チェック用のリクエスト履歴
         * @prop {number} timestamp=Date.now() - リクエストを受けたサーバ側日時
         * @prop {string} nonce - クライアント側で採番されたリクエスト識別子UUIDv4
         */
        authRequestLog: {desc: '重複チェック用リクエスト履歴',
          cols: [
            {name:'timestamp',type:'datetime',default:'Date.now()'},
            {name:'nonce',type:'string'},
          ],
        },
        /** authScriptProperties: サーバ側ScriptPropertiesに保存する情報
         * @typedef {Object} authScriptProperties - サーバ側ScriptPropertiesに保存する内容
         * @prop {number} keyGeneratedDateTime - 鍵ペア生成日時。UNIX時刻
         * @prop {string} SSkeySign - 署名用秘密鍵(PEM形式)
         * @prop {string} SPkeySign - 署名用公開鍵(PEM形式)
         * @prop {string} SSkeyEnc - 暗号化用秘密鍵(PEM形式)
         * @prop {string} SPkeyEnc - 暗号化用公開鍵(PEM形式)
         * @prop {string} oldSSkeySign - バックアップ用署名用秘密鍵(PEM形式)
         * @prop {string} oldSPkeySign - バックアップ用署名用公開鍵(PEM形式)
         * @prop {string} oldSSkeyEnc - バックアップ用暗号化用秘密鍵(PEM形式)
         * @prop {string} oldSPkeyEnc - バックアップ用暗号化用公開鍵(PEM形式)
         * @prop {string} requestLog - 重複チェック用のリクエスト履歴。{authRequestLog[]}のJSON
         */
        /** authServerFuncDef: サーバ側関数設定オブジェクト
         * @typedef {Object.<string,Function|Arror>} authServerFuncDef - サーバ側関数設定 
         * @prop {number} func.authority=0 - サーバ側関数の所要権限
         *   サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限
         *   ex. authServerConfig.func.authority === 0
         * @prop {Function} func.do - 実行するサーバ側関数
         * 
         * @example サーバ側関数マップ(func)の設定例
         * 
         * - サーバ側関数(例)
         *   - commonFunc() : 誰でも実行可能なサーバ側処理(掲示板情報の提供など)。必要な権限は'0'(=0b00)
         *   - staffFunc() : 係員のみ実行可能なサーバ関数(受付処理など)。必要な権限は'2'(=0b10)
         * - 設定
         *   ```js
         *   func = {
         *     "commonFunc": {
         *         "authority": 0,
         *         "do": m => commonFunc(...m) // 引数mにはauthRequest.argを渡す
         *     },
         *     "staffFunc": {
         *         "authority": 2,
         *         "do": m => staffFunc(...m)
         *     },
         *   }
         *   ```
         * - 備考
         *   - 上の例ではauthRequest.funcとサーバ側実関数名は一致させているが、
         *     隠蔽等を目的で異なる形にしても問題ない。<br>
         *     例：`cmFunc:{authority:0,do:m=>commonFunc(...m)}`
         */
        /** Member: メンバ情報をGoogle Spread上で管理
         * @class
         * @classdesc メンバ情報をGoogle Spread上で管理
         * @prop {string} memberId="dummyMemberID" - メンバの識別子(メールアドレス)
         * @prop {string} name="dummyMemberName" - メンバの氏名
         * @prop {string} status="TR" - メンバの状態
         *   仮登録 : TR(temporary registrated)
         *   未審査 : NE(not examined)
         *   加入中 : CJ(currentry joining)
         *   加入禁止 : PJ(prohibited to join)
         * @prop {MemberLog} log=new MemberLog() - メンバの履歴情報。シート上はJSON
         * @prop {MemberProfile} profile=new MemberProfile() - メンバの属性情報。シート上はJSON
         * @prop {Object.<string,MemberDevice>} device - デバイス情報。{deviceId:MemberDevice}形式
         *   マルチデバイス対応のため配列。シート上はJSON
         * @prop {string} note='' - 当該メンバに対する備考
         */
        Member: {desc: 'メンバ情報',
          cols: [
            {name:'memberId',type:'string'},
            {name:'name',type:'string'},
            {name:'status',type:'string',default:'TR'},
            {name:'log',type:'object'},
            {name:'profile',type:'object'},
            {name:'device',type:'object'},
            {name:'note',type:'string',default:''},
          ],
        },
        /** MemberDevice: メンバが使用する通信機器の情報
         * @typedef {Object} MemberDevice - メンバが使用する通信機器の情報
         * @prop {string} deviceId=UUIDv4 - デバイスの識別子
         * @prop {string} status="UC" - デバイスの状態
         *   未認証 : UC(uncertified)
         *   認証中 : LI(log in)
         *   試行中 : TR(tring)
         *   凍結中 : FR(freezed)
         * @prop {string} CPkeySign - デバイスの署名用公開鍵
         * @prop {string} CPkeyEnc - デバイスの暗号化用公開鍵
         * @prop {number} CPkeyUpdated=Date.now() - 最新のCPkeyが登録された日時
         * @prop {MemberTrial[]} trial=[] - ログイン試行関連情報。オブジェクトシート上はJSON文字列
         */
        MemberDevice: {desc: 'メンバ端末',
          cols: [
            {name:'deviceId',type:'string'},
            {name:'status',type:'string',default:'UC'},
            {name:'CPkeySign',type:'string'},
            {name:'CPkeyEnc',type:'string'},
            {name:'CPkeyUpdated',type:'datetime',default:'Date.now()'},
            {name:'trial',type:'array',default:'[]'},
          ],
        },
        /** MemberLog: メンバの各種要求・状態変化の時刻
         * @typedef {Object} MemberLog - メンバの各種要求・状態変化の時刻
         * @prop {number} joiningRequest=Date.now() - 仮登録要求日時仮登録要求をサーバ側で受信した日時
         * @prop {number} approval=0 - 加入承認日時
         *   管理者がmemberList上で加入承認処理を行った日時。値設定は加入否認日時と択一
         * @prop {number} denial=0 - 加入否認日時
         *   管理者がmemberList上で加入否認処理を行った日時。値設定は加入承認日時と択一
         * @prop {number} loginRequest=0 - 認証要求日時
         *   未認証メンバからの処理要求をサーバ側で受信した日時
         * @prop {number} loginSuccess=0 - 認証成功日時
         *   未認証メンバの認証要求が成功した最新日時
         * @prop {number} loginExpiration=0 - 認証有効期限
         *   認証成功日時＋認証有効時間
         * @prop {number} loginFailure=0 - 認証失敗日時
         *   未認証メンバの認証要求失敗が確定した最新日時
         * @prop {number} unfreezeLogin=0 - 認証無効期限
         *   認証失敗日時＋認証凍結時間
         * @prop {number} joiningExpiration=0 - 加入有効期限
         *   加入承認日時＋加入有効期間
         * @prop {number} unfreezeDenial=0 - 加入禁止期限
         *   加入否認日時＋加入禁止期間
         */
        MemberLog: {desc: 'メンバ履歴',
          cols: [
            {name:'joiningRequest',type:'datetime',default:'Date.now()'},
            {name:'approval',type:'datetime',default:0 },
            {name:'denial',type:'datetime',default:0 },
            {name:'loginRequest',type:'datetime',default:0 },
            {name:'loginSuccess',type:'datetime',default:0 },
            {name:'loginExpiration',type:'datetime',default:0 },
            {name:'loginFailure',type:'datetime',default:0 },
            {name:'unfreezeLogin',type:'datetime',default:0 },
            {name:'joiningExpiration',type:'datetime',default:0 },
            {name:'unfreezeDenial',type:'datetime',default:0 },
          ],
        },
        /** MemberProfile: メンバの属性情報
         * @typedef {Object} MemberProfile - メンバの属性情報
         * @prop {number} authority - メンバの持つ権限
         *   authServerConfig.func.authorityとの論理積>0なら当該関数実行権限ありと看做す
         */
        MemberProfile: {desc: 'メンバ属性',
          cols: [
            {name:'authority',type:'number'},
          ],
        },
        /** MemberTrial: ログイン試行情報の管理・判定
         * @typedef {Object} MemberTrial - ログイン試行情報の管理・判定
         * @prop {string} passcode - 設定されているパスコード最初の認証試行で作成
         *   初期値はauthServerConfig.passcodeLengthで指定された桁数の数値
         * @prop {number} created=Date.now() - パスコード生成日時≒パスコード通知メール発信日時
         * @prop {MemberTrialLog[]} log=[] - 試行履歴常に最新が先頭(unshift()使用)
         *   保持上限はauthServerConfig.trial.generationMaxに従い、上限超過時は末尾から削除する。
         */
        MemberTrial: {desc: 'ログイン試行',
          cols: [
            {name:'passcode',type:'string'},
            {name:'created',type:'datetime',default:'Date.now()'},
            {name:'log',type:'array',default:'[]'},
          ],
        },
        /** MemberTrialLog: パスコード入力単位の試行記録
         * @typedef {Object} MemberTrialLog - パスコード入力単位の試行記録
         * @prop {number} entered - 入力されたパスコード
         * @prop {boolean} result - 試行結果正答：true、誤答：false
         * @prop {number} timestamp=Date.now() - 判定処理日時
         */
        MemberTrialLog: {desc: '試行履歴',
          cols: [
            {name:'entered',type:'string'},
            {name:'result',type:'boolean'},
            {name:'timestamp',type:'datetime',default:'Date.now()'},
          ],
        },
      }
    };
    // 必須指定項目の一覧
    v.required = ['func'];
    // 任意指定項目と既定値
    v.option = {
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
    }
    try {

      /** this.cf(authServerConfig): 共通設定情報にauthServer特有項目を追加
       * @typedef {Object} authServerConfig - authServer特有の設定項目
       * @extends {authConfig}
       * @prop {string} memberList="memberList" - memberListシート名
       * @prop {number} defaultAuthority=1 - 新規加入メンバの権限の既定値
       * @prop {number} memberLifeTime=31536000000 - 加入有効期間
       *   メンバ加入承認後の有効期間。既定値は1年
       * @prop {number} prohibitedToJoin=259200000 - 加入禁止期間
       *   管理者による加入否認後、再加入申請が自動的に却下される期間。既定値は3日
       * @prop {number} loginLifeTime=86400000 - 認証有効時間
       *   ログイン成功後の有効期間、CPkeyの有効期間。既定値は1日
       * @prop {number} loginFreeze=600000 - 認証凍結時間
       *   認証失敗後、再認証要求が禁止される期間。既定値は10分
       * @prop {number} requestIdRetention=300000 - 重複リクエスト拒否となる時間。既定値は5分
       * @prop {string} errorLog="errorLog" - エラーログのシート名
       * @prop {number} storageDaysOfErrorLog=604800000 - エラーログの保存日数
       *   単位はミリ秒。既定値は7日分
       * @prop {string} auditLog="auditLog" - 監査ログのシート名
       * @prop {number} storageDaysOfAuditLog=604800000 - 監査ログの保存日数
       *   単位はミリ秒。既定値は7日分
       * 
       * @prop {authServerFuncDef} func={} - サーバ側関数設定
       * 
       * ログイン試行関係の設定値
       * @prop {number} passcodeLength=6 - パスコードの桁数
       * @prop {number} maxTrial=3 - パスコード入力の最大試行回数
       * @prop {number} passcodeLifeTime=600000 - パスコードの有効期間。既定値は10分
       * @prop {number} maxTrialLog=5 - ログイン試行履歴(MemberTrial)の最大保持数。既定値は5世代
       * 
       * 開発関係の設定値
       * @prop {boolean} udSendPasscode=false - 開発中識別フラグパスコード通知メール送信を抑止するならtrue
       * @prop {boolean} udSendInvitation=false - 開発中の加入承認通知メール送信
       *   開発中に加入承認通知メール送信を抑止するならtrue
       * @prop {schemaDef} typeDef - データ型定義
       */
      dev.step(1.1);  // this.cfの作成
      this.cf = new authConfig(mergeDeeply(v.schema,config));

      dev.step(1.2);  // 必須項目の設定
      v.required.forEach(x => {
        if( typeof config[x] === 'undefined' )
          throw new Error(`"${x}" is not specified.`);
        this.cf[x] = config[x];
      });

      dev.step(1.3);  // 任意項目の設定
      Object.keys(v.option).forEach(x => {
        this.cf[x] = config[x] ?? v.option[x];
      });

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

  /** initialize: authServerインスタンス作成
   * - インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
   * - staticではない一般のメンバへの値セットができないため別途constructorを呼び出す
   * @static
   * @param {authConfig} config - authClient/Server共通設定値オブジェクト
   * @returns {authServer|Error}
   */
  static async initialize(config) {
    const v = {whois:`authServer.initialize`, arg:{config}, rv:null};
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // インスタンス生成
      // オプション既定値を先にメンバ変数に格納するため、constructorを先行
      // -------------------------------------------------------------
      v.rv = new authServer(config);

      // -------------------------------------------------------------
      dev.step(2);  // 暗号化・復号モジュール生成(v.rv.cryptoLib)
      // -------------------------------------------------------------
      v.rv.cryptoLib = await cryptoServer.initialize(v.rv.cf);
      if( v.rv.cryptoLib instanceof Error ) throw v.rv.cryptoLib;

      // -------------------------------------------------------------
      dev.step(3);  // memberListシートの準備(v.rv.member)
      // -------------------------------------------------------------
      v.rv.member = new Member(v.rv.cf);

      // -------------------------------------------------------------
      dev.step(4);  // 監査ログ・エラーログシートの準備(v.rv.audit, v.rv.error)
      // -------------------------------------------------------------
      //v.rv.audit = v.rv.authAuditLog();
      //v.rv.error = v.rv.authErrorLog();

      dev.end({IndexedDB:v.rv.idb}); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** exec: 処理要求に対するサーバ側中核処理
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  async exec(arg) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1.1,arg);  // request存在・最低限チェック
      if( !arg ) throw new Error('invalid request: empty body');
      dev.step(1.2,JSON.parse(arg));  // 処理要求を復号
      v.request = await this.cryptoLib.decrypt(JSON.parse(arg), this.cf.CPkeySign);
      if( v.request instanceof Error ) throw v.request;
      dev.step(1.3,v.request);  // // request.func チェック
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
      v.rv = await this.cryptoLib.encrypt(v.response, v.response.CPkeySign);
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
}