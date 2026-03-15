import { Schema } from "../lib/Schema.2_2_0.mjs";
import { mergeDeeply } from "../lib/mergeDeeply.2_0_0.mjs"

/** authConfig: クライアント・サーバ共通設定情報
 * @class
 * @classdesc クライアント・サーバ共通設定情報
 * @extends Schema
 * @prop {string} [systemName="auth"] - システム名
 * @prop {string} adminMail - 管理者のメールアドレス
 * @prop {string} adminName - 管理者氏名
 * @prop {number} [allowableTimeDifference=120000] - クライアント・サーバ間通信時の許容時差既定値は2分
 * @prop {string} [RSAbits=2048] - 鍵ペアの鍵長
 * @prop {number} [maxDepth=10] - 再帰呼出時の最大階層
 * @prop {Object} underDev - テスト時の設定
 * @prop {boolean} underDev.isTest=false - 開発モードならtrue
 */
export class authConfig extends Schema {
  /**
   * @constructor
   * @memberof authConfig
   * @param {authConfig} arg - 設定情報(既定値からの変更部分)
   */
  constructor(arg) {
    const v = {whois:`authConfig.constructor`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    // Schemaクラスの指定項目＋authClient/Server共用データ型定義
    v.schema = {
      name: arg.systemName ?? 'auth',
      version: '1.0.0',
      types: {
        /** authRequest: authClientからauthServerへの処理要求(平文)
         * @typedef {Object} authRequest
         * @prop {string} memberId=this.idb.memberId - メンバの識別子
         * @prop {string} deviceId=this.idb.deviceId - デバイスの識別子(UUIDv4)
         * @prop {string} memberName=this.idb.memberName - メンバの氏名。管理者が加入認否判断のため使用
         * @prop {string} CPkeySign=this.idb.CPkeySign - クライアント側署名用公開鍵
         * @prop {number} requestTime=Date.now() - 要求日時UNIX時刻
         * @prop {string} func - サーバ側関数名
         * @prop {any[]} [arguments=[]] - サーバ側関数に渡す引数の配列
         * @prop {string} [nonce=UUIDv4] - 要求の識別子UUIDv4
         */
        authRequest: {desc: 'クライアント→サーバ要求',
          cols: [
            {name:'memberId',type:'string',desc:'メンバの識別子',default:x=>{return x.idb.memberId}},
            {name:'deviceId',type:'string',desc:'デバイスの識別子(UUIDv4)',default:x=>x.idb.deviceId},
            {name:'memberName',type:'string',desc:'メンバの氏名',note:'管理者が加入認否判断のため使用',default:x=>x.idb.memberName},
            {name:'CPkeySign',type:'string',desc:'クライアント側署名用公開鍵',default:x=>x.idb.CPkeySign},
            {name:'requestTime',type:'datetime',desc:'要求日時',default:'Date.now()'},
            {name:'func',type:'string',desc:'サーバ側関数名'},
            {name:'arg',type:'array',desc:'サーバ側関数に渡す引数の配列',default:[]},
            {name:'nonce',type:'string',desc:'要求の識別子',default:()=>crypto.randomUUID()},
          ],
        },
        /** authResponse: authServerからauthClientへの処理結果(平文)
         * - memberId〜nonce : authClient設定項目(authRequestからの転記項目) : 
         * - SPkeySign〜message : authServer内での追加項目
         * - decrypt〜 : authClient設定項目(authServerからの返信を受け、authClient内で追加)
         * 
         * @typedef {Object} authResponse - authServerからauthClientへの処理結果(平文)
         * @prop {string} memberId - メンバの識別子
         * @prop {string} deviceId - デバイスの識別子。UUIDv4
         * @prop {string} memberName - メンバの氏名
         * @prop {CryptoKey} CPkeySign=this.idb.CPkeySign - クライアント側署名用公開鍵
         * @prop {number} requestTime - 要求日時UNIX時刻
         * @prop {string} func - サーバ側関数名
         * @prop {any[]} arg - サーバ側関数に渡す引数の配列
         * @prop {string} nonce - 要求の識別子UUIDv4
         * 
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
         * @prop {string} decrypt="success" - クライアント側での復号処理結果
         *   "success":正常、それ以外はエラーメッセージ
         */
        authResponse: {desc: 'サーバ→クライアント応答',
          cols: [
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
            {name:'response',type:'string',nullable:true,default:null},
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
         * @prop {boolean} meta.keyProvisioning=false - 鍵配布・鍵更新目的ならtrue<br>
         *   「通常業務」ではなく、「鍵を配る／更新するための通信」であることの宣言。<br>
         *   通常signOnlyと一致するが、運用時の利用目的が異なるため別項目とする。
         */
        encryptedRequest: {desc: '暗号化された要求',
          cols: [
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
          cols: [
            {name:'cipher',type:'string'},
            {name:'signature',type:'string'},
            {name:'encryptedKey',type:'string'},
            {name:'iv',type:'string'},
            {name:'tag',type:'string'},
            {name:'meta',type:'object'},
          ],
        },
      }
    };
    // 必須指定項目の一覧
    v.required = ['adminMail','adminName'];
    // 任意指定項目と既定値
    v.option = {
      systemName: 'auth',
      allowableTimeDifference: 120000,
      RSAbits: 2048,
      maxDepth: 10,
      underDev: {isTest:false},
    }
    try {
      dev.step(1);  // スーパークラス(Schema)の生成
      super(mergeDeeply(v.schema,arg));

      dev.step(2);  // 必須項目の設定
      v.required.forEach(x => {
        if( typeof arg[x] === 'undefined' )
          throw new Error(`"${x}" is not specified.`);
        this[x] = arg[x];
      });

      dev.step(3);  // 任意項目の設定
      Object.keys(v.option).forEach(x => {
        this[x] = arg[x] ?? v.option[x];
      });
      if( typeof this.underDev.isTest === 'undefined' )
        this.underDev.isTest = v.option.underDev.isTest;

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }
}