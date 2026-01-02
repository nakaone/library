import { commonConfig } from "../common/config.mjs";
//::$tmp/commonConfig.js::

/** authClientConfig: クライアント側特有の設定項目
 * @typedef {Object} authClientConfig
 * @extends {authConfig}
 * @prop {string} api - サーバ側WebアプリURLのID
 *   https://script.google.com/macros/s/(この部分)/exec
 * @prop {number} timeout=300000 - サーバからの応答待機時間
 *   これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分
 * @prop {string} storeName="config" - IndexedDBのストア名
 * @prop {number} dbVersion=1 - IndexedDBのバージョン
 * @prop {number} maxDepth=10 - exec再帰呼出時の最大階層
 * @prop {schemaDef} typeDef - データ型定義
 */
export const config = Object.assign(commonConfig,{
  api: 'AKfycbw-n_isgCLvAEntGEX5Lpn4AUNaqpp3r1W0nVIGXFjNlEdsRB_ue4b9NRmNH_Em5IxT',
  typeDef: {
    name: 'auth',
    version: '1.0.0',
    tableDef: {
      /** authIndexedDB: IndexedDBに保存する内容(=this.idb)
       * @typedef {Object} authIndexedDB - IndexedDBに保存する内容(=this.idb)
       * @prop {string} memberId='dummyMemberID' - メンバ識別子(メールアドレス。初期値は固定文字列)
       * @prop {string} memberName='dummyMemberName' - メンバの氏名(初期値は固定文字列)
       * @prop {string}　deviceId='dummyDeviceID' - サーバ側で生成(UUIDv4。初期値は固定文字列)
       * @prop {CryptoKey} CSkeySign - 署名用秘密鍵
       * @prop {CryptoKey} CPkeySign - 署名用公開鍵
       * @prop {CryptoKey} CSkeyEnc - 暗号化用秘密鍵
       * @prop {CryptoKey} CPkeyEnc - 暗号化用公開鍵
       * @prop {string} keyGeneratedDateTime - 鍵ペア生成日時(UNIX時刻)
       * @prop {string} SPkeySign=null - サーバ側署名用公開鍵
       * @prop {string} SPkeyEnc=null - サーバ側暗号化用公開鍵
       */
    },
  },
});