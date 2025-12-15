import { authRequest } from "./authRequest.mjs";
/**
 * @class
 * @classdesc 暗号化・署名検証
 * @prop {CryptoKey} CSkeySign - 署名用秘密鍵
 * @prop {CryptoKey} CPkeySign - 署名用公開鍵
 * @prop {CryptoKey} CSkeyEnc - 暗号化用秘密鍵
 * @prop {CryptoKey} CPkeyEnc - 暗号化用公開鍵
 * @prop {number} keyGeneratedDateTime - 鍵ペア生成日時(UNIX時刻)
 * @prop {string} SPkey - サーバ側公開鍵
 */
export class cryptoClient {

  /**
   * @constructor
   * @param {authClientConfig} cf - authClientの設定情報
   * @param {authIndexedDB} idb - IndexedDBの内容を保持するauthClientのメンバ変数
   */
  constructor(cf={},idb={}) {
    const v = {whois:`cryptoClient.constructor`, arg:{ac}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // メンバ変数をセット
      this.cf = cf;
      this.idb = idb;

      // 【依頼】ここでIndexedDB(this.idb)を参照し、CS/CP/SPkeyが登録済ならメンバ変数に格納するようにしてください
      this.CSkeySign = null;
      this.CPkeySign = null;
      this.CSkeyEnc  = null;
      this.CPkeyEnc  = null;
      this.SPkey     = null;

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /**
   * 
   * @param {authRequest} request - 処理要求
   * @param {boolean} [isSignOnly=false] - trueの場合、暗号化は行わず署名のみ行う
   * @returns 
   */
  encrypt(arg,isSignOnly=false) {  // b0005.test用スタブ
    const v = {whois:`${this.constructor.name}.encrypt`, arg:{arg,isSignOnly}, rv:null};
    dev.start(v);
    try {

      if( isSignOnly ){
        dev.step(1);  // 初期情報要求用
        v.rv = {
          payload,
          signature: "dummy-signature"
        };
      } else {
        dev.step(2);  // 通常時
        v.rv = {
          envelope: { cipher: "dummy" },
          signature: "dummy",
          meta: { rsabits: this.cf.RSAbits }
        };
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  decrypt(arg) {  // b0005.test用スタブ
    const v = {whois:`${this.constructor.name}.decrypt`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1);
      v.rv = {
      memberId: "dummyID",
        deviceId: response.deviceId,
        SPkey: response.SPkey,
        status: "success",
        decrypt: "normal"
      };

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** generateKeys: RSA鍵ペアを生成
   * - 生成のみ、IndexedDBやメンバ変数への格納は行わない
   * @param {void}
   * @returns {Object} 生成された鍵ペア
   */
  async generateKeys() {
    const v = {whois:`${this.constructor.name}.generateKeys`, arg:{}, rv:null};
    dev.start(v);
    try {

      dev.step(1);  // 署名用
      const signKeys = await crypto.subtle.generateKey({
        name: "RSA-PSS",
        modulusLength: this.cf.RSAbits,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      }, true, ["sign", "verify"]);

      dev.step(2);  // 暗号化用
      const encKeys = await crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: this.cf.RSAbits,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      }, true, ["encrypt", "decrypt"]);

      dev.step(3);  // 戻り値作成
      v.rv = {
        CSkeySign: signKeys.privateKey,
        CPkeySign: signKeys.publicKey,
        CSkeyEnc: encKeys.privateKey,
        CPkeyEnc: encKeys.publicKey,
        keyGeneratedDateTime: Date.now()
      };

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}