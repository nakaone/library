export class authRequest {

  constructor(func,arg=[],idb) {
    const v = {whois:`authRequest.constructor`, arg:{func,arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      this.memberId = idb.memberId;
      this.deviceId = idb.deviceId;
      this.memberName = idb.memberName;
      this.CPkey = idb.CPkey;
      this.requestTime = Date.now();
      this.func = func;
      this.arg = arg;
      this.nonce = crypto.randomUUID();

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }
}