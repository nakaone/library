export class cryptoServer {

  /** constructor
   * @constructor
   * @param {authServerConfig} cf - authServer設定値
   */
  constructor(cf) {
    const v = {whois:`cryptoServer.constructor`, arg:{cf}, rv:null};
    dev.start(v);
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
    dev.start(v);
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
    dev.start(v);
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
    dev.start(v);
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
    dev.start(v);
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