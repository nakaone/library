/** cryptoServer: サーバ側の暗号化・署名検証
 * @class
 * @classdesc サーバ側の暗号化・署名検証
 * @prop {authServerConfig} cf - authServer設定情報
 * @prop {ScriptProperties} prop - PropertiesService.getScriptProperties()
 * @prop {authScriptProperties} keys - ScriptPropertiesに保存された鍵ペア情報
 * @prop {string[]} keyList - ScriptPropertiesに保存された項目名の一覧
 */
export class cryptoServer {
  /** constructor
   * @param {authServerConfig} cf - authServer設定値
   */
  constructor(cf) {
    const v = {whois:`cryptoServer.constructor`, arg:{cf}, rv:null};
    const dev = new devTools(v);
    try {
      dev.step(1); // authServer設定情報をメンバに格納
      this.cf = cf;
      dev.step(2); // ScriptPropertiesの内容を読み込み
      this.keys = {};
      this.keyList = [ // ScriptProperties保存項目の内、通常使用する項目のリスト
        'keyGeneratedDateTime',
        'SSkeySign',
        'SPkeySign',
        'SSkeyEnc',
        'SPkeyEnc',
        'requestLog',
      ];
      this.prop = PropertiesService.getScriptProperties();
      this.keyList.forEach(key => {
        this.keys[key] = this.prop.getProperty(key) || null;
      });

      dev.end();  // 終了処理
    } catch (e) { return dev.error(e); }
  }

  /** encrypt: 処理結果を暗号化＋署名
   * @param {authResponse} response - 処理結果
   * @param {string} CPkeySign - クライアント側署名用公開鍵
   * @returns {encryptedResponse}
   */
  async encrypt(response, CPkeySign) {
    const v = {whois:`${this.constructor.name}.encrypt`, arg:{response,CPkeySign}, rv:null};
    const dev = new devTools(v);
    try {

      const payloadStr = JSON.stringify(response);

      dev.step(1); // RSA-PSS署名 (サーバ秘密鍵を使用)
      const sig = new KJUR.crypto.Signature({
        "alg": "SHA256withRSAandPSS",
        "sSaltLength": 32
      });
      sig.init(this.keys.SSkeySign);
      sig.updateString(payloadStr);
      const signature = sig.sign(); // Hex形式

      dev.step(2); // AES共通鍵生成と暗号化 (CryptoJSを使用)
      const aesKey = Array.from(
        Array(32),
        () => Math.floor(Math.random() * 16).toString(16)
      ).join(''); // 256bit相当
      const iv = CryptoJS.lib.WordArray.random(128/8);
      const encryptedPayload = CryptoJS.AES.encrypt(
        payloadStr,
        aesKey,
        { iv: iv }
      );

      dev.step(3); // AES鍵をRSA-OAEPで暗号化 (クライアント公開鍵を使用)
      const pubKeyObj = KEYUTIL.getKey(CPkeySign);
      const encryptedKey = KJUR.crypto.Cipher.encrypt(aesKey, pubKeyObj, "RSAOAEP");

      dev.step(4); // 戻り値作成
      v.rv = {
        cipher: encryptedPayload.toString(),
        encryptedKey: encryptedKey,
        iv: iv.toString(),
        signature: signature,
        meta: {
          rsabits: this.cf.RSAbits,
          sym: "AES-256-CBC" // CryptoJS標準に合わせCBCを使用
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
    const dev = new devTools(v);
    try {

      dev.step(1); // RSA-OAEPでAES鍵を復号 (サーバ秘密鍵を使用)
      const prvKeyObj = KEYUTIL.getKey(this.keys.SSkeyEnc);
      const aesKey = KJUR.crypto.Cipher.decrypt(request.encryptedKey, prvKeyObj, "RSAOAEP");

      dev.step(2); // AES-CBCでペイロードを復号
      const decrypted = CryptoJS.AES.decrypt(request.cipher, aesKey, { iv: CryptoJS.enc.Hex.parse(request.iv) });
      const plainStr = decrypted.toString(CryptoJS.enc.Utf8);

      dev.step(3); // RSA-PSS署名検証 (クライアント公開鍵を使用)
      const sig = new KJUR.crypto.Signature({"alg": "SHA256withRSAandPSS", "sSaltLength": 32});
      sig.init(CPkeySign);
      sig.updateString(plainStr);
      const isValid = sig.verify(request.signature);

      if (!isValid) throw new Error("Signature verification failed");
      v.rv = JSON.parse(plainStr);

      /*
      if (request.meta.signOnly === true) {
        // ===== signOnly 判定 =====
        dev.step(1.1); // payload復元
        const payloadBytes = Uint8Array.from(atob(request.payload), c => c.charCodeAt(0));

        dev.step(1.2); // signature復元
        const signature = Uint8Array.from(atob(request.signature), c => c.charCodeAt(0));

        dev.step(1.3); // 署名検証
        const ok = await globalThis.crypto.subtle.verify(
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
        const SSkeyEnc = await globalThis.crypto.subtle.importKey(
          "pkcs8",
          this.pemToArrayBuffer(this.keys.SSkeyEnc),
          { name: "RSA-OAEP", hash: "SHA-256" },
          false,
          ["decrypt"]
        );

        dev.step(2.3); // AES鍵復号
        const rawKey = await globalThis.crypto.subtle.decrypt({ name: "RSA-OAEP" }, SSkeyEnc, encryptedKey);
        const aesKey = await globalThis.crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, ["decrypt"]);

        dev.step(2.4); // payload復号
        const plain = await globalThis.crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, cipher);

        dev.step(2.5); // クライアント署名用公開鍵 import
        const CPkey = await globalThis.crypto.subtle.importKey(
          "spki",
          this.pemToArrayBuffer(CPkeySign),
          { name: "RSA-PSS", hash: "SHA-256" },
          false,
          ["verify"]
        );

        dev.step(2.6); // 署名検証
        const ok = await globalThis.crypto.subtle.verify({ name: "RSA-PSS", saltLength: 32 }, CPkey, signature, plain);

        if (!ok) throw new Error("Signature verification failed");

        dev.step(2.7); // JSON復元
        v.rv = JSON.parse(new TextDecoder().decode(plain));
      }
      */
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
    const dev = new devTools(v);
    try {

      dev.step(1); // jsrsasign (KEYUTIL) を使用した鍵生成
      const keypair = KEYUTIL.generateKeypair("RSA", this.cf.RSAbits);

      v.rv = {
        SSkeySign: KEYUTIL.getPEM(keypair.prvKeyObj, "PKCS8PRV"),
        SPkeySign: KEYUTIL.getPEM(keypair.pubKeyObj),
        SSkeyEnc: KEYUTIL.getPEM(keypair.prvKeyObj, "PKCS8PRV"),
        SPkeyEnc: KEYUTIL.getPEM(keypair.pubKeyObj),
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
    const v = {whois:`cryptoServer.initialize`, arg:{config}, rv:null};
    const dev = new devTools(v);
    try {
      dev.step(1);  // インスタンス生成
      // オプション既定値を先にメンバ変数に格納するため、constructorを先行
      v.rv = new cryptoServer(config);

      dev.step(2); // SPkeySign未生成なら鍵ペアを生成
      if( v.rv.keys.SPkeySign === null ){
        dev.step(2.1);  // 鍵ペアを生成
        v.keys = await v.rv.generateKeys();
        if( v.keys instanceof Error ) throw v.keys;

        dev.step(2.2);  // requestLogは初期値(空配列)とする
        v.keys.requestLog = JSON.stringify([]);

        dev.step(2.3);  // ScriptPropertiesに保存
        v.rv.keyList.forEach(key => {
          v.rv.prop.setProperty(key, v.keys[key]);
        });

        dev.step(2.4);  // 保存結果の確認
        v.savedResult = {
          keyGeneratedDateTime: prop.getProperty('keyGeneratedDateTime'),
          SPkeySign: prop.getProperty('SPkeySign') 
            ? prop.getProperty('SPkeySign').substring(0, 50) + "..." 
            : "FAILED"
        };
        if (!v.savedResult.SPkeySign || v.savedResult.SPkeySign === "FAILED") {
          throw new Error("鍵ペアの保存に失敗しました。");
        } else {
          dev.step(2.5,v.savedResult);
        }
      }

      dev.end(); // 終了処理
      return v.rv;
    } catch (e) { return dev.error(e); }
  }
}