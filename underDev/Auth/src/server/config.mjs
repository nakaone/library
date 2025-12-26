import { commonConfig } from "../common/config.mjs";
//::$tmp/commonConfig.js::

/** authServerConfig: authServer特有の設定項目
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
 */
export const config = Object.assign(commonConfig,{
  func: {   // データ型はauthServerFuncDef参照
    svTest: m => {serverFunc(...m)},
  },
  typeDef: {
    name: 'auth',
    version: '1.0.0',
    tableDef: {
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
        colDef: [
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
        colDef: [
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
        colDef: [
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
        colDef: [
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
        colDef: [
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
        colDef: [
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
        colDef: [
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
        colDef: [
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
        colDef: [
          {name:'entered',type:'string'},
          {name:'result',type:'boolean'},
          {name:'timestamp',type:'datetime',default:'Date.now()'},
        ],
      },
    },
  },
});