/** cryptoClient: クライアント側の暗号化・署名検証
 * @class
 * @classdesc クライアント側の暗号化・署名検証
 * @prop {authIndexedDB} idb - authClient.idb(IndexedDB)のコピー
 * @prop {string} RSAbits - RSA鍵長(=authConfig.RSAbits)
 */
export class cryptoClient {

  /** constructor
   * @constructor
   * @param {authIndexedDB} idb - IndexedDBの内容を保持するauthClientのメンバ変数
   *   CPkeySign, CSkeySign, CPkeyEnc, CSkeyEncはこの下にCryptoKey形式で存在
   * @param {number} RSAbits - RSA鍵長
   */
  constructor(idb,RSAbits) {
    const v = {whois:`cryptoClient.constructor`, arg:{idb,RSAbits}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1); // メンバ変数をセット
      this.idb = idb;
      this.RSAbits = RSAbits;

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /** encrypt: 処理要求を暗号化＋署名
   * @param {authRequest} request - 処理要求
   * @returns {encryptedRequest}
   */
  async encrypt(request) {
    const v = { whois: `${this.constructor.name}.encrypt`, arg: { request }, rv: null };
    const dev = new devTools(v);
    try {

      dev.step(1.1);  // encryptedRequestオブジェクト生成関数を定義
      v.makeEncryptedRequest = o => ({
        payload: o.payload ?? null, // payloadとcipherは排他指定
        cipher: o.cipher ?? null,
        iv: o.iv ?? null,
        signature: o.signature, // 指定必須
        encryptedKey: o.encryptedKey ?? null,
        meta: {
          signOnly: o.signOnly ?? false,
          sym: o.sym ?? null,
          rsabits: this.RSAbits,
          keyProvisioning: o.keyProvisioning ?? false
        }
      });

      dev.step(1.2);  // 署名鍵チェック
      if (!(this.idb.CSkeySign instanceof CryptoKey)) {
        throw new Error('CSkeySign is not initialized (not CryptoKey)');
      }

      dev.step(1.3);  // payload UTF-8 化
      v.payloadBytes = new TextEncoder().encode(JSON.stringify(request));

      dev.step(2.1);  // 署名（共通）
      v.signature = await crypto.subtle.sign(
        { name: "RSA-PSS", saltLength: 32 },
        this.idb.CSkeySign,
        v.payloadBytes
      );
      v.signatureB64 = btoa(
        String.fromCharCode(...new Uint8Array(v.signature))
      );

      dev.step(2.2);  // signOnly 自動判定
      v.canEncrypt = this.idb.SPkeyEnc instanceof CryptoKey;
      v.signOnly = !v.canEncrypt;

      dev.step(2.3);  // 鍵配布目的判定
      v.keyProvisioning = v.signOnly && request.func === '::initial::';

      if (v.signOnly) {
        dev.step(3);  // ===== 署名のみ =====
        v.rv = v.makeEncryptedRequest({
          payload: btoa(String.fromCharCode(...v.payloadBytes)),
          signature: v.signatureB64,
          signOnly: true,
          keyProvisioning: v.keyProvisioning
        });

      } else {
        dev.step(4);  // ===== 暗号化＋署名 =====

        dev.step(4.1); // AES鍵生成
        v.aesKey = await crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt"]
        );

        dev.step(4.2); // IV生成
        v.iv = crypto.getRandomValues(new Uint8Array(12));

        dev.step(4.3); // payload暗号化
        v.cipher = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv: v.iv },
          v.aesKey,
          v.payloadBytes
        );

        dev.step(4.4); // AES鍵をRSA-OAEPで暗号化
        v.rawAesKey = await crypto.subtle.exportKey("raw", v.aesKey);
        const encryptedKey = await crypto.subtle.encrypt(
          { name: "RSA-OAEP" },
          this.idb.SPkeyEnc,
          v.rawAesKey
        );

        dev.step(4.5);  // encryptRequestオブジェクト生成
        v.rv = v.makeEncryptedRequest({
          cipher: btoa(String.fromCharCode(...new Uint8Array(v.cipher))),
          iv: btoa(String.fromCharCode(...v.iv)),
          encryptedKey: btoa(String.fromCharCode(...new Uint8Array(encryptedKey))),
          signature: v.signatureB64,
          sym: "AES-256-GCM",
          signOnly: false,
          keyProvisioning: false
        });
      }

      dev.end();
      return v.rv;

    } catch (e) {
      return dev.error(e);
    }
  }

  /** decrypt: 暗号化された処理結果を復号・署名検証
   * @param {encryptedResponse} response - 暗号化されたサーバ側処理結果
   * @returns {authResponse}
   */
  async decrypt(response) {
    const v = {whois:`${this.constructor.name}.decrypt`, arg:{response}, rv:null};
    const dev = new devTools(v);
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
        this.idb.SPkeySign,
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
    const dev = new devTools(v);
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
        CSkeySign: signKeys.privateKey, // CryptoKeyオブジェクト
        CPkeySign: signKeys.publicKey,  // 同上
        CSkeyEnc: encKeys.privateKey,   // 同上
        CPkeyEnc: encKeys.publicKey,    // 同上
        keyGeneratedDateTime: Date.now()
      };

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}