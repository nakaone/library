import { authRequest } from "./authRequest.mjs";
/**
 * @class
 * @classdesc 暗号化・署名検証
 * @prop {number} keyGeneratedDateTime - 鍵ペア生成日時(UNIX時刻)
 * @prop {string} SPkey - サーバ側公開鍵
 */
export class cryptoClient {

  /** constructor
   * @constructor
   * @param {authIndexedDB} idb - IndexedDBの内容を保持するauthClientのメンバ変数
   *   CPkeySign, CSkeySign, CPkeyEnc, CSkeyEncはこの下にCryptoKey形式で存在
   * @param {number} RSAbits - RSA鍵長
   */
  constructor(idb,RSAbits) {
    const v = {whois:`cryptoClient.constructor`, arg:{ac}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // メンバ変数をセット
      this.idb = idb;
      this.RSAbits = RSAbits;

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /** typedef authRequest
   * @typedef {Object} authRequest
   * @prop {string} memberId=this.idb.memberId - メンバの識別子
   * @prop {string} deviceId=this.idb.deviceId - デバイスの識別子UUIDv4
   * @prop {string} memberName=this.idb.memberName - メンバの氏名管理者が加入認否判断のため使用
   * @prop {string} CPkey=this.idb.CPkey - クライアント側署名
   * @prop {number} requestTime=Date.now() - 要求日時UNIX時刻
   * @prop {string} func - サーバ側関数名
   * @prop {any[]} arg=[] - サーバ側関数に渡す引数の配列
   * @prop {string} nonce=UUIDv4 - 要求の識別子UUIDv4
   */
  /** typedef encryptedRequest
   * @typedef {Object} encryptedRequest
   * @prop {string} cipher - AES-256-GCMで暗号化されたauthRequest
   * @prop {string} signature - authRequestに対するRSA-PSS署名
   * @prop {string} encryptedKey - RSA-OAEPで暗号化されたAES共通鍵
   * @prop {string} iv - AES-GCM 初期化ベクトル
   * @prop {string} tag - AES-GCM 認証タグ
   * @prop {Object} meta - メタ情報
   * @prop {number} meta.rsabits - 暗号化に使用したRSA鍵長
   * @prop {string} meta.sym - 使用した共通鍵方式"AES-256-GCM"
   */
  /** encrypt: 処理要求を暗号化＋署名
   * @param {authRequest} request - 処理要求
   * @param {boolean} [isSignOnly=false] - trueの場合、暗号化は行わず署名のみ行う
   * @returns 
   */
  async encrypt(request,isSignOnly=false) {
    const v = {whois:`${this.constructor.name}.encrypt`, arg:{request,isSignOnly}, rv:null};
    dev.start(v);
    try {

      dev.step(1);  // payload を UTF-8 化
      const payloadBytes =
        new TextEncoder().encode(JSON.stringify(request));

      dev.step(2);  // 署名（共通）
      const signature = await crypto.subtle.sign(
        { name: "RSA-PSS", saltLength: 32 },
        this.idb.CSkeySign,
        payloadBytes
      );

      if (isSignOnly) {
        dev.step(3);
        // ========== 署名のみ ==========
        v.rv = {
          payload: btoa(
            String.fromCharCode(...payloadBytes)
          ),
          signature: btoa(
            String.fromCharCode(...new Uint8Array(signature))
          ),
          meta: {
            signOnly: true,
            rsabits: this.RSAbits
          }
        };

      } else {
        // ========== 通常（暗号化＋署名） ==========

        dev.step(4.1);  // AES共通鍵生成
        const aesKey = await crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt"]
        );

        dev.step(4.2);  // IV生成
        const iv = crypto.getRandomValues(new Uint8Array(12));

        dev.step(4.3);  // payload暗号化
        const cipher = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          aesKey,
          payloadBytes
        );

        dev.step(4.4);  // AES鍵をRSA-OAEPで暗号化
        const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);
        const encryptedKey = await crypto.subtle.encrypt(
          { name: "RSA-OAEP" },
          this.idb.SPkey,
          rawAesKey
        );

        dev.step(4.5);  // 戻り値の作成
        v.rv = {
          cipher: btoa(
            String.fromCharCode(...new Uint8Array(cipher))
          ),
          encryptedKey: btoa(
            String.fromCharCode(...new Uint8Array(encryptedKey))
          ),
          iv: btoa(
            String.fromCharCode(...iv)
          ),
          signature: btoa(
            String.fromCharCode(...new Uint8Array(signature))
          ),
          meta: {
            signOnly: false,
            rsabits: this.RSAbits,
            sym: "AES-256-GCM"
          }
        };
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** typedef encryptedResponse
   * @typedef {Object} encryptedResponse
   * @prop {string} cipher - 暗号化した文字列
   * @prop {string} signature - authResponseに対するRSA-PSS署名
   * @prop {string} encryptedKey - RSA-OAEPで暗号化されたAES共通鍵
   * @prop {string} iv - AES-GCM 初期化ベクトル
   * @prop {string} tag - AES-GCM 認証タグ
   * @prop {Object} meta - メタ情報
   * @prop {number} meta.rsabits - 暗号化に使用したRSA鍵長
   */
  /** typedef authResponse
   * @typedef {Object} authResponse
   * @prop {string} memberId - メンバの識別子
   * @prop {string} deviceId - デバイスの識別子。UUIDv4
   * @prop {string} memberName - メンバの氏名
   * @prop {CryptoKey} CPkeySign=this.idb.CPkeySign - クライアント側署名用公開鍵
   * @prop {number} requestTime - 要求日時UNIX時刻
   * @prop {string} func - サーバ側関数名
   * @prop {any[]} arg - サーバ側関数に渡す引数の配列
   * @prop {string} nonce - 要求の識別子UUIDv4
   * @prop {string} SPkey=SPkey - サーバ側公開鍵
   * @prop {any} response=null - サーバ側関数の戻り値
   * @prop {number} receptTime=Date.now() - サーバ側の処理要求受付日時
   * @prop {number} responseTime=0 - サーバ側処理終了日時
   *   エラーの場合は発生日時
   * @prop {string} status="success" - サーバ側処理結果
   *   正常終了時は"success"(文字列)、警告終了の場合はエラーメッセージ、
   *   致命的エラーの場合はErrorオブジェクト
   * @prop {string} message="" - メッセージ(statusの補足)
   * @prop {string} decrypt="success" - クライアント側での復号処理結果
   *   "success":正常、それ以外はエラーメッセージ
   */
  /** decrypt: 暗号化された処理結果を復号・署名検証
   * @param {encryptedResponse} response - 暗号化されたサーバ側処理結果
   * @returns {authResponse}
   */
  async decrypt(response) {
    const v = {whois:`${this.constructor.name}.decrypt`, arg:{response}, rv:null};
    dev.start(v);
    try {

      // 1. Base64復元
      const cipher = Uint8Array.from(atob(response.cipher), c => c.charCodeAt(0));
      const encryptedKey = Uint8Array.from(atob(response.encryptedKey), c => c.charCodeAt(0));
      const iv = Uint8Array.from(atob(response.iv), c => c.charCodeAt(0));
      const signature = Uint8Array.from(atob(response.signature), c => c.charCodeAt(0));

      // 2. AES鍵復号
      const rawKey = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        this.idb.CSkeyEnc,
        encryptedKey
      );

      const aesKey = await crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      // 3. payload復号
      const plain = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        aesKey,
        cipher
      );

      const decoded = JSON.parse(new TextDecoder().decode(plain));

      // 4. 署名検証
      const ok = await crypto.subtle.verify(
        { name: "RSA-PSS", saltLength: 32 },
        this.idb.SPkey,
        signature,
        plain
      );

      if (!ok) throw new Error("Signature verification failed");

      v.rv = decoded;
      v.rv.decrypt = "success";

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
        modulusLength: this.RSAbits,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      }, true, ["sign", "verify"]);

      dev.step(2);  // 暗号化用
      const encKeys = await crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: this.RSAbits,
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