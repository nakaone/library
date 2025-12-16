export class cryptoServer {

  /** constructor
   * @constructor
   * @param {authServerConfig} cf - authServer設定値
   */
  constructor(cf) {
    const v = {whois:`cryptoServer.constructor`, arg:{cf}, rv:null};
    dev.start(v);
    try {

      this.cf = cf;

      dev.step(1); // ScriptPropertiesの内容を読み込み

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

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
        this.idb.SSkeySign,
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
          this.idb.SPkeySign,
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
        this.idb.SSkeyEnc,
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
        SSkeySign: signKeys.privateKey,
        SPkeySign: signKeys.publicKey,
        SSkeyEnc: encKeys.privateKey,
        SPkeyEnc: encKeys.publicKey,
        keyGeneratedDateTime: Date.now()
      };

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}