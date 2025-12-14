export class authResponse {

  /**
   * @param {encryptedRequest} request - 本来は暗号化されているが、現時点ではauthRequestとする 
   * @param {Object} SPkey - authServer公開鍵
   * @returns 
   */
  constructor(request,SPkey) {
    const v = {whois:`authResponse.constructor`, arg:{request}, rv:null};
    dev.start(v);
    try {

      dev.step(1);  // 処理要求から渡された内容を転記
      ['memberId','deviceId','memberName','CPkey','requestTime','func','arg'].forEach(x => {
        if( !request.hasOwnProperty(x) ) throw new Error(`${x} is missing`);
        this[x] = request[x];
      });

      dev.step(2);  // サーバ側で設定する項目
      this.SPkey = SPkey;
      this.response = null;
      this.receptTime = Date.now();
      this.responseTime = 0;
      this.status = 'success';
      this.message = '';

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }
}