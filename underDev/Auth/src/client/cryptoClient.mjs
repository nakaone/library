export class cryptoClient {

  constructor(config) {
    const v = {whois:`cryptoClient.constructor`, arg:{config}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // メンバ変数をセット
      this.cf = config;

      // 【依頼】ここでIndexedDB(this.idb)を参照し、CS/CP/SPkeyが登録済ならメンバ変数に格納するようにしてください
      this.CSkeySign = null;
      this.CPkeySign = null;
      this.CSkeyEnc  = null;
      this.CPkeyEnc  = null;
      this.SPkey     = null;

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  encrypt(arg) {  // b0005.test用スタブ
    const v = {whois:`${this.constructor.name}.encrypt`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1);
      v.rv = {
        envelope: { cipher: "dummy" },
        signature: "dummy",
        meta: { rsabits: this.cf.RSAbits }
      };

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

  async generateKeys(arg) {
    const v = {whois:`${this.constructor.name}.generateKeys`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1);  // 署名用
      const signKeys = await crypto.subtle.generateKey({
        name: "RSA-PSS",
        modulusLength: this.cf.RSAbits,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      }, false, ["sign", "verify"]);

      dev.step(2);  // 暗号化用
      const encKeys = await crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: this.cf.RSAbits,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      }, false, ["encrypt", "decrypt"]);

      this.CSkeySign = signKeys.privateKey;
      this.CPkeySign = signKeys.publicKey;
      this.CSkeyEnc  = encKeys.privateKey;
      this.CPkeyEnc  = encKeys.publicKey;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}