/** authConfig: クライアント・サーバ共通設定情報
 * @class
 * @classdesc クライアント・サーバ共通設定情報
 * @prop {string} systemName="Auth" - システム名
 * @prop {string} adminMail - 管理者のメールアドレス
 * @prop {string} adminName - 管理者氏名
 * @prop {number} allowableTimeDifference=120000 - クライアント・サーバ間通信時の許容時差既定値は2分
 * @prop {string} RSAbits=2048 - 鍵ペアの鍵長
 * @prop {Object} underDev - テスト時の設定
 * @prop {boolean} underDev.isTest=false - 開発モードならtrue
 */
export const commonConfig = {
  adminMail: 'ena.kaon@gmail.com',
  adminName: 'あどみ',
  /** schemaDef: DB構造定義オブジェクト (論理Schema・引数用)
   * @class
   * @classdesc DB構造定義オブジェクト
   * 
   * 【責務】
   * - DBの論理構造を定義する
   * - Adapter / DB 実装に依存しない
   *
   * @property {string} name - Schemaの論理名
   * @property {string} [version='0.0.0'] - Schemaのバージョン識別子(例:'1.2.0')
   * @property {string} [dbName=''] - 物理DB名（Adapter が参照する場合のみ使用）
   * @property {string} [desc=''] - Schema全体に関する概要説明
   * @property {string} [note=''] - Schema全体に関する備考
   * @property {Object.<string, tableDef>} tableDef - 論理テーブル名をキーとするテーブル定義
   * @property {string} original - schemaDefインスタンス生成時のスナップショット(JSON)
   * 
   * @example
   * ```
   * {
   *   name: 'camp2025',
   *   tableDef: {
   *     master: {
   *       colDef:[
   *         {name:'タイムスタンプ',type:'string'},
   *         {name:'メールアドレス',type:'string'},
   *         // (中略)
   *       ],
   *     },
   *   },
   * },
   * ```
   * 
   * @history
   * 2.0.0 2025-12-21 構造簡潔化＋Adapterと役割分担
   * 1.2.0 2025-09-21 AlaSQLの予約語とSpreadDb.schemaの重複排除
   *   - SpreadDb.schema.tables -> tableMap
   *   - SpreadDb.schema.tables.cols -> colMap(∵予約語columnsと紛らわしい)
   * 1.1.0 2025-09-15 構造の見直し、メンバ名の修正
   * 1.0.0 2025-09-15 初版
   */
  /** tableDef: 論理テーブル構造定義 (引数用)
   * @typedef {Object} tableDef
   * @property {string} [name] - 論理的な識別名（tableDef のキー）
   *   - クラス・API・ログで使用。例: 'Member', 'AuthAuditLog'
   *   - constructorに渡す定義オブジェクトでは省略(メンバ名を引用)
   * @property {string} [desc=''] - テーブルに関する概要説明
   * @property {string} [note=''] - テーブルに関する備考
   * @property {string[]} [primaryKey=[]] - 主キー項目名
   * @property {string[]} [unique=[]] - 主キー以外の一意制約
   * @property {columnDef[]} colDef - 項目定義（順序を考慮するため配列）
   */
  /** columnDef: 項目定義 (引数用)
   * @typedef {Object} columnDef
   * @property {string} name - 項目名（英数字・システム用）
   * @property {string} [label] - 表示用ラベル（省略時は name)
   * @property {string} [desc=''] - 項目に関する概要説明
   * @property {string} [note=''] - 項目に関する備考・意味説明
   * @property {string} [type='string'] - 論理データ型
   *   - 'string' | 'number' | 'boolean' | 'object' | 'array' | 'datetime'
   * @property {boolean} [nullable=true] - null を許可するか
   * @property {any} [default=null] - 既定値
   *   - 関数の場合は toString() 化された文字列
   */
  typeDef: {
    name: 'auth',
    version: '1.0.0',
    tableDef: {
      /** authRequest: authClientからauthServerへの処理要求(平文)
       * @typedef {Object} authRequest
       * @prop {string} memberId=this.idb.memberId - メンバの識別子
       * @prop {string} deviceId=this.idb.deviceId - デバイスの識別子UUIDv4
       * @prop {string} memberName=this.idb.memberName - メンバの氏名管理者が加入認否判断のため使用
       * @prop {string} CPkeySign=this.idb.CPkeySign - クライアント側署名用公開鍵
       * @prop {number} requestTime=Date.now() - 要求日時UNIX時刻
       * @prop {string} func - サーバ側関数名
       * @prop {any[]} arg=[] - サーバ側関数に渡す引数の配列
       * @prop {string} nonce=UUIDv4 - 要求の識別子UUIDv4
       */
      authRequest: {desc: 'クライアント→サーバ要求',
        colDef: [
          {name:'memberId',type:'string'},
          {name:'deviceId',type:'string'},
          {name:'memberName',type:'string'},
          {name:'CPkeySign',type:'string'},
          {name:'requestTime',type:'datetime',default:'Date.now()'},
          {name:'func',type:'string'},
          {name:'arg',type:'array',default:'[]'},
          {name:'nonce',type:'string'},
        ],
      },
      /** authResponse: authServerからauthClientへの処理結果(平文)
       * @typedef {Object} authResponse - authServerからauthClientへの処理結果(平文)
       * == authClient設定項目(authRequestからの転記項目)
       * @prop {string} memberId - メンバの識別子
       * @prop {string} deviceId - デバイスの識別子。UUIDv4
       * @prop {string} memberName - メンバの氏名
       * @prop {CryptoKey} CPkeySign=this.idb.CPkeySign - クライアント側署名用公開鍵
       * @prop {number} requestTime - 要求日時UNIX時刻
       * @prop {string} func - サーバ側関数名
       * @prop {any[]} arg - サーバ側関数に渡す引数の配列
       * @prop {string} nonce - 要求の識別子UUIDv4
       * 
       * == authServer内での追加項目
       * @prop {string} SPkeySign=this.keys.SPkeySign - サーバ側署名用公開鍵
       * @prop {string} SPkeyEnc=this.keys.SPkeyEnc - サーバ側暗号化用公開鍵
       * @prop {any} response=null - サーバ側関数の戻り値
       * @prop {number} receptTime=Date.now() - サーバ側の処理要求受付日時
       * @prop {number} responseTime=0 - サーバ側処理終了日時
       *   エラーの場合は発生日時
       * @prop {string} status="success" - サーバ側処理結果
       *   正常終了時は"success"(文字列)、警告終了の場合はエラーメッセージ、
       *   致命的エラーの場合はErrorオブジェクト
       * @prop {string} message="" - メッセージ(statusの補足)
       * 
       * == authClient設定項目(authServerからの返信を受け、authClient内で追加)
       * @prop {string} decrypt="success" - クライアント側での復号処理結果
       *   "success":正常、それ以外はエラーメッセージ
       */
      authResponse: {desc: 'サーバ→クライアント応答',
        colDef: [
          {name:'memberId',type:'string'},
          {name:'deviceId',type:'string'},
          {name:'memberName',type:'string'},
          {name:'CPkeySign',type:'string'},
          {name:'requestTime',type:'datetime'},
          {name:'func',type:'string'},
          {name:'arg',type:'array'},
          {name:'nonce',type:'string'},
          {name:'SPkeySign',type:'string'},
          {name:'SPkeyEnc',type:'string'},
          {name:'response',type:'any',nullable:true },
          {name:'receptTime',type:'datetime',default:'Date.now()'},
          {name:'responseTime',type:'datetime',default:0 },
          {name:'status',type:'string',default:'success'},
          {name:'message',type:'string',default:''},
          {name:'decrypt',type:'string',default:'success'},
        ],
      },
      /** encryptedRequest: 暗号化された処理要求
       * @typedef {Object} encryptedRequest - 暗号化された処理要求
       * @prop {string} payload=null - 平文のauthRequest
       *   cipherと排他。SPkey要求時(meta.keyProvisioning===true)のみ設定
       * @prop {string} cipher=null - AES-256-GCMで暗号化されたauthRequest。payloadと排他
       * @prop {string} iv=null - AES-GCM 初期化ベクトル
       * @prop {string} signature - authRequestに対するRSA-PSS署名
       * @prop {string} encryptedKey=null - RSA-OAEPで暗号化されたAES共通鍵
       * @prop {Object} meta - メタ情報
       * @prop {boolean} meta.signOnly=false - 暗号化せず署名のみで送信する場合true
       * @prop {string} meta.sym=null - 使用した共通鍵方式"AES-256-GCM"
       * @prop {number} meta.rsabits - 暗号化に使用したRSA鍵長
       * @prop {boolean} meta.keyProvisioning=false - 鍵配布・鍵更新目的ならtrue
       *   「通常業務」ではなく、「鍵を配る／更新するための通信」であることの宣言。
       *   通常signOnlyと一致するが、運用時の利用目的が異なるため別項目とする。
       */
      encryptedRequest: {desc: '暗号化された要求',
        colDef: [
          {name:'payload',type:'string',nullable:true },
          {name:'cipher',type:'string',nullable:true },
          {name:'iv',type:'string',nullable:true },
          {name:'signature',type:'string'},
          {name:'encryptedKey',type:'string',nullable:true },
          {name:'meta',type:'object'},
        ],
      },
      /** encryptedResponse: 暗号化された処理結果
       * @typedef {Object} encryptedResponse - 暗号化された処理結果
       * @prop {string} cipher - 暗号化した文字列
       * @prop {string} signature - authResponseに対するRSA-PSS署名
       * @prop {string} encryptedKey - RSA-OAEPで暗号化されたAES共通鍵
       * @prop {string} iv - AES-GCM 初期化ベクトル
       * @prop {string} tag - AES-GCM 認証タグ
       * @prop {Object} meta - メタ情報
       * @prop {number} meta.rsabits - 暗号化に使用したRSA鍵長
       */
      encryptedResponse: {desc: '暗号化された応答',
        colDef: [
          {name:'cipher',type:'string'},
          {name:'signature',type:'string'},
          {name:'encryptedKey',type:'string'},
          {name:'iv',type:'string'},
          {name:'tag',type:'string'},
          {name:'meta',type:'object'},
        ],
      },
    },
  },
};
